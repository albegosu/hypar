import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchService, SearchResult } from '../search/search.service';
import { AgentChatDto } from './dto/agent-chat.dto';
import { createOllama } from '../ollama/create-ollama';

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
      throw new BadRequestException('messages is required');
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser?.content?.trim()) {
      throw new BadRequestException('At least one user message with content is required');
    }

    const history = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const startedAt = Date.now();
    const queryText = lastUser.content.trim();
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
        reply,
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
    );

    const rawContext = context || '(no matching passages found)';
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
    const finalReply = reply || '(empty response)';

    await this.search.logRagQuery({
      queryText,
      responseText: finalReply,
      results,
      latencyMs: Date.now() - startedAt,
    });

    return {
      reply: finalReply,
      used_kb: true,
      search_query: searchQuery,
      sources,
      results,
    };
  }

  private async runPlanner(tailJson: string): Promise<PlannerOutput> {
    const host = this.config.get<string>('OLLAMA_URL') || 'http://localhost:11434';
    const model =
      this.config.get<string>('OLLAMA_LLM_MODEL') || 'tinyllama';
    const apiKey = this.config.get<string>('OLLAMA_API_KEY');
    const plannerTimeout = Math.max(
      30_000,
      Number(this.config.get('OLLAMA_PLANNER_TIMEOUT_MS')) || 60_000,
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), plannerTimeout);
    const ollama = createOllama(host, apiKey, controller.signal);

    try {
      const chat = await ollama.chat({
        model,
        messages: [
          { role: 'system', content: PLANNER_SYSTEM },
          {
            role: 'user',
            content: `Conversation (last turns, JSON array of {role,content}):\n${tailJson}`,
          },
        ],
        format: 'json',
        options: { num_predict: 220 },
      });
      const raw = chat.message?.content?.trim() || '{}';
      let parsed: Partial<PlannerOutput>;
      try {
        parsed = JSON.parse(raw) as Partial<PlannerOutput>;
      } catch {
        this.logger.warn(`Planner returned non-JSON, defaulting to KB search. Raw: ${raw.slice(0, 200)}`);
        return { use_kb: true, search_query: null, direct_reply: null };
      }
      const search_query =
        typeof parsed.search_query === 'string' ? parsed.search_query : null;
      const direct_reply =
        typeof parsed.direct_reply === 'string' ? parsed.direct_reply : null;
      // `Boolean(undefined)` is false and skipped KB for many cloud models that omit use_kb.
      let use_kb: boolean;
      if (typeof parsed.use_kb === 'boolean') {
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
        return { use_kb: false, search_query: null, direct_reply: 'How can I help you?' };
      }
      return { use_kb, search_query, direct_reply };
    } catch (err: any) {
      this.logger.error(`Planner call failed, defaulting to KB search: ${err?.message || err}`);
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
