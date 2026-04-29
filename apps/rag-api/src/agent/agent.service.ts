import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SearchService, SearchResult } from "../search/search.service";
import { AgentChatDto } from "./dto/agent-chat.dto";
import { createOllama } from "../ollama/create-ollama";
import { DocumentsService } from "../documents/documents.service";

interface PlannerOutput {
  use_kb: boolean;
  search_query: string | null;
  direct_reply: string | null;
}

const PLANNER_SYSTEM = `You are a routing agent for a RAG application.
Return ONLY valid JSON (no markdown fences) with exactly these keys:
- "use_kb": boolean - true if a good answer needs facts from the user's uploaded documents (policies, internal notes, PDFs they indexed). false for greetings, thanks, small talk, or generic questions that do not depend on their files.
- "search_query": string or null - if use_kb is true, a short search query in the user's language to retrieve relevant passages; otherwise null.
- "direct_reply": string or null - if use_kb is false, a brief friendly reply in the user's language; otherwise null.

Examples:
{"use_kb":false,"search_query":null,"direct_reply":"Hi! Ask me anything about your uploaded documents."}
{"use_kb":true,"search_query":"refund policy deadlines","direct_reply":null}`;

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private readonly search: SearchService,
    private readonly config: ConfigService,
    private readonly documents: DocumentsService,
  ) {}

  async chat(dto: AgentChatDto): Promise<{
    reply: string;
    used_kb: boolean;
    search_query: string | null;
    sources: { title: string; id: string }[];
    results: SearchResult[];
  }> {
    const { messages, limit = 8 } = dto;
    if (!messages?.length) {
      throw new BadRequestException("messages is required");
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      throw new BadRequestException(
        "At least one user message with content is required",
      );
    }

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const startedAt = Date.now();
    const queryText = lastUser.content.trim();
    const userId = dto.userId?.trim();
    const memoryScope = (
      this.config.get<string>("MEMORY_SCOPE") || "local_per_user"
    ).trim();

    const memoryCommand = this.parseMemoryCommand(lastUser.content);
    if (memoryCommand && memoryScope !== "disabled") {
      const content =
        memoryCommand.type === "remember" ? memoryCommand.content : undefined;
      const term =
        memoryCommand.type === "forget" ? memoryCommand.term : undefined;
      const responseText = await this.runMemoryCommand({
        type: memoryCommand.type,
        content,
        userId,
        term,
        startedAt,
        queryText,
        limit,
        history,
      });

      return {
        reply: responseText,
        used_kb: false,
        search_query: null,
        sources: [],
        results: [],
      };
    }

    const proactiveEnabled =
      (this.config.get<string>("MEMORY_PROACTIVE") || "true")
        .trim()
        .toLowerCase() !== "false";
    const proactivelySaved =
      memoryScope !== "disabled" && proactiveEnabled
        ? await this.maybeSaveProactiveMemories(lastUser.content, userId)
        : [];
    const memoryAck =
      proactivelySaved.length > 0
        ? `\n\n(Guardé en tu memoria local: ${proactivelySaved.join(", ")})`
        : "";

    // If the user just provided a declarative fact/preference and we stored it,
    // don't force a RAG answer (planner/LLM can be unhelpful on "statement" inputs).
    if (proactivelySaved.length > 0) {
      const lower = lastUser.content.toLowerCase();
      const looksLikeQuestionIntent =
        /(\?|¿|como\b|cómo\b|que\b|qué\b|cu[aá]l\b|cuál\b|d[oó]nde\b|dónde\b|cu[aá]ndo\b|cuándo\b|por que\b|por qu[eé]\b|necesito\b|dime\b|explica\b|explicame\b|recomien)/i.test(
          lower,
        );

      if (!looksLikeQuestionIntent) {
        const reply = `Listo.${memoryAck}`;
        await this.search.logRagQuery({
          queryText,
          responseText: reply,
          results: [],
          latencyMs: Date.now() - startedAt,
        });
        return {
          reply,
          used_kb: false,
          search_query: null,
          sources: [],
          results: [],
        };
      }
    }

    const tail = history.slice(-8);
    const plan = await this.runPlanner(JSON.stringify(tail));

    if (!plan.use_kb && plan.direct_reply?.trim()) {
      const reply = plan.direct_reply.trim();
      await this.search.logRagQuery({
        queryText,
        responseText: reply,
        results: [],
        latencyMs: Date.now() - startedAt,
      });
      return {
        reply: reply + memoryAck,
        used_kb: false,
        search_query: null,
        sources: [],
        results: [],
      };
    }

    const searchQuery = plan.search_query?.trim() || queryText;
    const { context, sources, results } = await this.search.rag(
      searchQuery,
      limit,
      userId,
    );

    // If we decided to use KB but retrieval returned nothing, avoid calling the LLM
    // with an effectively empty context (it can return empty/low-quality output).
    if (!results.length) {
      const reply =
        "No encontré esa información en tus documentos ni en tu memoria local. " +
        "Si quieres que la recuerde, usa `/remember <texto>`." +
        memoryAck;
      await this.search.logRagQuery({
        queryText,
        responseText: reply,
        results,
        latencyMs: Date.now() - startedAt,
      });
      return {
        reply,
        used_kb: false,
        search_query: searchQuery,
        sources: [],
        results: [],
      };
    }

    const rawContext = context || "(no matching passages found)";
    const maxCtxChars = 20_000;
    const ctxBlock =
      rawContext.length > maxCtxChars
        ? `${rawContext.slice(0, maxCtxChars)}\n…[context truncated]`
        : rawContext;

    const system = `You are a helpful assistant for the user's document knowledge base.
Use ONLY the CONTEXT below to answer. If the context is empty or does not contain the answer, say clearly that the information was not found in their documents.
Be concise. Match the language of the user's last message.

CONTEXT:
${ctxBlock}`;

    const reply = await this.search.generateChatReply(system, history);
    const finalReply = reply || "(empty response)";
    const finalWithMemoryAck = finalReply + memoryAck;

    await this.search.logRagQuery({
      queryText,
      responseText: finalWithMemoryAck,
      results,
      latencyMs: Date.now() - startedAt,
    });

    return {
      reply: finalWithMemoryAck,
      used_kb: true,
      search_query: searchQuery,
      sources,
      results,
    };
  }

  private async maybeSaveProactiveMemories(
    userText: string,
    userId?: string,
  ): Promise<string[]> {
    const trimmed = userText.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("/")) return [];
    if (/[?¿]/.test(trimmed)) return [];
    if (trimmed.length > 220) return [];

    const lower = trimmed.toLowerCase();
    if (/^(hola|buenas|hey)\b/.test(lower)) return [];
    if (/\b(gracias|thx|muchas gracias)\b/.test(lower)) return [];

    const normalized = trimmed.replace(/\s+/g, " ").trim();
    const candidates: string[] = [];

    // Preference-ish / stable facts (Spanish heuristics).
    const addCandidate = (label: string, value: string) => {
      const v = value.trim().replace(/\s+/g, " ");
      if (!v) return;
      const text = `${label}: ${v}`;
      if (text.length < 3) return;
      candidates.push(text.length > 160 ? `${text.slice(0, 160)}…` : text);
    };

    const mColor = normalized.match(/^(?:mi\s+)?color\s*(?:es|=|:)\s*(.+)$/i);
    if (mColor?.[1]) addCandidate("color", mColor[1]);

    const mName = normalized.match(
      /^(?:mi\s+nombre\s+es|me\s+llamo|se\s+llama)\s+(.+)$/i,
    );
    if (mName?.[1]) addCandidate("nombre", mName[1]);

    const mPref = normalized.match(
      /^(?:prefiero|me\s+gustaria\s+|me\s+gustaría)\s+(.+)$/i,
    );
    if (mPref?.[1]) addCandidate("preferencia", mPref[1]);

    const mLikes = normalized.match(/^me\s+gusta\s+(.+)$/i);
    if (mLikes?.[1]) addCandidate("me gusta", mLikes[1]);

    const mSoy = normalized.match(/^soy\s+(.+)$/i);
    if (mSoy?.[1]) addCandidate("soy", mSoy[1]);

    const mSeLlama = normalized.match(/^se\s+llama\s+(.+)$/i);
    if (mSeLlama?.[1]) addCandidate("nombre", mSeLlama[1]);

    if (candidates.length === 0) return [];

    // Persist up to 2 memories per message.
    const unique = Array.from(new Set(candidates)).slice(0, 2);
    const saved: string[] = [];

    for (const c of unique) {
      const exists = await this.documents.chatMemoryExists(userId, c);
      if (exists) continue;
      const doc = await this.documents.createChatMemory(userId, c);
      if (doc) saved.push(c);
    }

    return saved;
  }

  private parseMemoryCommand(
    text: string,
  ):
    | { type: "help" }
    | { type: "remember"; content: string }
    | { type: "forget"; term?: string }
    | { type: "clear" }
    | null {
    const t = text.trim();
    if (!t) return null;

    const clearExact = t.match(/^\/memory\s+clear(?:\s+|$)$/i);
    if (clearExact) return { type: "clear" };

    // Commands: /remember, /forget, /memory
    const helpExact = t.match(/^\/(?:help|memory)(?:\s+|$)$/i);
    if (helpExact) return { type: "help" };

    const rememberCmd = t.match(/^\/remember\s+([\s\S]+)$/i);
    if (rememberCmd) {
      const content = rememberCmd[1].trim();
      return content ? { type: "remember", content } : null;
    }

    const forgetCmd = t.match(/^\/forget(?:\s+([\s\S]+))?$/i);
    if (forgetCmd) {
      const term = forgetCmd[1]?.trim();
      return term ? { type: "forget", term } : { type: "clear" };
    }

    // Natural-language Spanish shortcuts at the start of the message.
    const rememberNl = t.match(/^(?:recuerda|guarda)\b[\s:]+([\s\S]+)$/i);
    if (rememberNl) {
      const content = rememberNl[1].replace(/^que\s+/i, "").trim();
      return content ? { type: "remember", content } : null;
    }

    return null;
  }

  private async runMemoryCommand(input: {
    type: "help" | "remember" | "forget" | "clear";
    content?: string;
    term?: string;
    userId?: string;
    startedAt: number;
    queryText: string;
    limit: number;
    history: { role: "user" | "assistant"; content: string }[];
  }): Promise<string> {
    const { type, content, term, userId } = input;

    if (type === "help") {
      const reply =
        "Comandos:\n" +
        "- `/remember <texto>`: guarda un dato en tu memoria.\n" +
        "- `/forget <texto>`: borra memorias que coincidan (por fragmento).\n" +
        "- `/forget` o `/memory clear`: limpia tu memoria local.\n";
      await this.search.logRagQuery({
        queryText: input.queryText,
        responseText: reply,
        results: [],
        latencyMs: Date.now() - input.startedAt,
      });
      return reply;
    }

    if (type === "remember") {
      if (!content?.trim()) {
        return "No encontré ningún texto para guardar. Usa `/remember <texto>`.";
      }

      const doc = await this.documents.createChatMemory(userId, content);
      const reply = doc
        ? "Listo. Lo guardé en tu memoria local."
        : "No se guardó nada (texto vacío).";

      await this.search.logRagQuery({
        queryText: input.queryText,
        responseText: reply,
        results: [],
        latencyMs: Date.now() - input.startedAt,
      });

      return reply;
    }

    if (type === "forget") {
      const deleted = await this.documents.deleteChatMemories(userId, term);
      const reply = `Ok. Eliminé memorias locales que coinciden con "${term}". (filas: ${deleted})`;
      await this.search.logRagQuery({
        queryText: input.queryText,
        responseText: reply,
        results: [],
        latencyMs: Date.now() - input.startedAt,
      });
      return reply;
    }

    // clear
    const deleted = await this.documents.deleteChatMemories(userId, undefined);
    const reply = `Ok. Borré tu memoria local. (filas: ${deleted})`;
    await this.search.logRagQuery({
      queryText: input.queryText,
      responseText: reply,
      results: [],
      latencyMs: Date.now() - input.startedAt,
    });
    return reply;
  }

  private async runPlanner(tailJson: string): Promise<PlannerOutput> {
    const host =
      this.config.get<string>("OLLAMA_URL") || "http://localhost:11434";
    const model = this.config.get<string>("OLLAMA_LLM_MODEL") || "tinyllama";
    const apiKey = this.config.get<string>("OLLAMA_API_KEY");
    const plannerTimeout = Math.max(
      30_000,
      Number(this.config.get("OLLAMA_PLANNER_TIMEOUT_MS")) || 60_000,
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), plannerTimeout);
    const ollama = createOllama(host, apiKey, controller.signal);

    try {
      const chat = await ollama.chat({
        model,
        messages: [
          { role: "system", content: PLANNER_SYSTEM },
          {
            role: "user",
            content: `Conversation (last turns, JSON array of {role,content}):\n${tailJson}`,
          },
        ],
        format: "json",
        options: { num_predict: 220 },
      });
      const raw = chat.message?.content?.trim() || "{}";
      let parsed: Partial<PlannerOutput>;
      try {
        parsed = JSON.parse(raw) as Partial<PlannerOutput>;
      } catch {
        this.logger.warn(
          `Planner returned non-JSON, defaulting to KB search. Raw: ${raw.slice(0, 200)}`,
        );
        return { use_kb: true, search_query: null, direct_reply: null };
      }
      const search_query =
        typeof parsed.search_query === "string" ? parsed.search_query : null;
      const direct_reply =
        typeof parsed.direct_reply === "string" ? parsed.direct_reply : null;
      // `Boolean(undefined)` is false and skipped KB for many cloud models that omit use_kb.
      let use_kb: boolean;
      if (typeof parsed.use_kb === "boolean") {
        use_kb = parsed.use_kb;
      } else if (direct_reply?.trim() && !search_query?.trim()) {
        use_kb = false;
      } else {
        use_kb = true;
      }
      if (use_kb && !search_query?.trim()) {
        return { use_kb: true, search_query: null, direct_reply: null };
      }
      if (!use_kb && !direct_reply?.trim()) {
        if (search_query?.trim()) {
          return { use_kb: true, search_query, direct_reply: null };
        }
        return {
          use_kb: false,
          search_query: null,
          direct_reply: "How can I help you?",
        };
      }
      return { use_kb, search_query, direct_reply };
    } catch (err: any) {
      this.logger.error(
        `Planner call failed, defaulting to KB search: ${err?.message || err}`,
      );
      return {
        use_kb: true,
        search_query: null,
        direct_reply: null,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
