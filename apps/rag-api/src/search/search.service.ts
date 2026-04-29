import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { EmbeddingService } from "../documents/embedding.service";
import { ConverseDto } from "./dto/converse.dto";
import { createOllama } from "../ollama/create-ollama";

export interface SearchResult {
  chunkId: string;
  content: string;
  documentId: string;
  documentTitle: string;
  score: number;
  startChar: number;
  endChar: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private prisma: PrismaService,
    private embedding: EmbeddingService,
    private config: ConfigService,
  ) {}

  async search(
    query: string,
    limit: number = 5,
    userId?: string,
  ): Promise<SearchResult[]> {
    const queryEmbedding = await this.embedding.generate(query);
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    const memoryScope = (
      this.config.get<string>("MEMORY_SCOPE") || "local_per_user"
    ).trim();
    const conditions: Prisma.Sql[] = [];

    if (memoryScope === "local_per_user" && userId?.trim()) {
      // Include global docs (userId IS NULL) + this user's memory.
      conditions.push(
        Prisma.sql`(d."userId" = ${userId.trim()} OR d."userId" IS NULL)`,
      );
    }

    if (memoryScope === "disabled") {
      // Hide chat memories if memory is disabled.
      conditions.push(
        Prisma.sql`(d.metadata->>'kind' IS NULL OR d.metadata->>'kind' <> 'chat_memory')`,
      );
    }

    const where = conditions.length
      ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
      : Prisma.sql``;

    const results = await this.prisma.$queryRaw`
      SELECT
        c.id as "chunkId",
        c.content,
        c."documentId",
        d.title as "documentTitle",
        c."startChar",
        c."endChar",
        c.embedding <=> ${embeddingString}::vector as score
      FROM "Chunk" c
      JOIN "Document" d ON c."documentId" = d.id
      ${where}
      ORDER BY score ASC
      LIMIT ${limit}
    `;

    return (results as any[]).map((r) => ({
      chunkId: r.chunkId,
      content: r.content,
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      score: 1 - parseFloat(r.score),
      startChar: r.startChar || 0,
      endChar: r.endChar || 0,
    }));
  }

  async rag(
    query: string,
    limit: number = 5,
    userId?: string,
  ): Promise<{
    query: string;
    results: SearchResult[];
    context: string;
    sources: { title: string; id: string }[];
  }> {
    const results = await this.search(query, limit, userId);
    const context = results
      .map((r, i) => `[${i + 1}] ${r.content}`)
      .join("\n\n");
    const sources = [
      ...new Map(
        results.map((r) => [
          r.documentId,
          { title: r.documentTitle, id: r.documentId },
        ]),
      ).values(),
    ];
    return { query, results, context, sources };
  }

  /**
   * Inspect what the RAG pipeline would feed to the LLM, WITHOUT calling it.
   * Returns the raw query embedding (truncated for transport size), the
   * retrieved chunks with scores, and the assembled system prompt + context.
   * Useful for debugging "why did the model say that?" and for teaching.
   */
  async inspect(
    query: string,
    limit: number = 5,
  ): Promise<{
    query: string;
    embedding: { dimensions: number; preview: number[] };
    results: SearchResult[];
    context: string;
    sources: { title: string; id: string }[];
    systemPrompt: string;
    latencyMs: { embed: number; retrieve: number; total: number };
  }> {
    const t0 = Date.now();
    const queryEmbedding = await this.embedding.generate(query);
    const tEmbed = Date.now();
    const embeddingString = `[${queryEmbedding.join(",")}]`;

    const rows = await this.prisma.$queryRaw`
      SELECT
        c.id as "chunkId",
        c.content,
        c."documentId",
        d.title as "documentTitle",
        c."startChar",
        c."endChar",
        c.embedding <=> ${embeddingString}::vector as score
      FROM "Chunk" c
      JOIN "Document" d ON c."documentId" = d.id
      ORDER BY score ASC
      LIMIT ${limit}
    `;
    const tRetrieve = Date.now();

    const results: SearchResult[] = (rows as any[]).map((r) => ({
      chunkId: r.chunkId,
      content: r.content,
      documentId: r.documentId,
      documentTitle: r.documentTitle,
      score: 1 - parseFloat(r.score),
      startChar: r.startChar || 0,
      endChar: r.endChar || 0,
    }));

    const context = results
      .map((r, i) => `[${i + 1}] ${r.content}`)
      .join("\n\n");
    const sources = [
      ...new Map(
        results.map((r) => [
          r.documentId,
          { title: r.documentTitle, id: r.documentId },
        ]),
      ).values(),
    ];

    const systemPrompt = `You are a helpful assistant for the user's document knowledge base.
Use ONLY the CONTEXT below to answer. If the context is empty or does not contain the answer, say clearly that the information was not found in their documents.
Be concise. Match the language of the user's last message.

CONTEXT:
${context || "(no matching passages found)"}`;

    return {
      query,
      embedding: {
        dimensions: queryEmbedding.length,
        preview: queryEmbedding.slice(0, 12),
      },
      results,
      context,
      sources,
      systemPrompt,
      latencyMs: {
        embed: tEmbed - t0,
        retrieve: tRetrieve - tEmbed,
        total: tRetrieve - t0,
      },
    };
  }

  /**
   * Single LLM completion: system + user/assistant history (used by RAG chat and agent).
   */
  async generateChatReply(
    systemPrompt: string,
    history: { role: "user" | "assistant"; content: string }[],
    timeoutMs?: number,
  ): Promise<string> {
    const host =
      this.config.get<string>("OLLAMA_URL") || "http://localhost:11434";
    const model = this.config.get<string>("OLLAMA_LLM_MODEL") || "tinyllama";
    const apiKey = this.config.get<string>("OLLAMA_API_KEY");
    const ms = Math.max(
      30_000,
      timeoutMs ??
        (Number(this.config.get("OLLAMA_CHAT_TIMEOUT_MS")) || 180_000),
    );

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    const ollama = createOllama(host, apiKey, controller.signal);

    try {
      const baseMessages = [
        { role: "system", content: systemPrompt },
        ...history,
      ];
      const chat = await ollama.chat({
        model,
        messages: baseMessages,
        options: { num_predict: 384 },
      });
      const first = chat.message?.content?.trim();
      if (first) return first;

      // Some providers occasionally return an empty assistant message.
      // Retry once with a stricter instruction before failing over.
      const retry = await ollama.chat({
        model,
        messages: [
          ...baseMessages,
          {
            role: "user",
            content:
              "Respond with at least one concise sentence. If context is insufficient, say so clearly.",
          },
        ],
        options: { num_predict: 256 },
      });
      const second = retry.message?.content?.trim();
      if (second) return second;

      return "No pude generar una respuesta en este intento. Intenta de nuevo.";
    } catch (err: any) {
      this.logger.error(`Ollama chat failed: ${err?.message || err}`);
      if (err?.name === "AbortError") {
        throw new ServiceUnavailableException(
          `The model took longer than ${Math.round(ms / 1000)}s (timeout). Increase OLLAMA_CHAT_TIMEOUT_MS or use a smaller/faster model.`,
        );
      }
      throw new ServiceUnavailableException(
        `Could not reach the language model (${model}). Is Ollama running and is the model pulled?`,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Persist a query for analytics (latency, retrieved sources, response).
   * Failures are logged but never bubble up — telemetry must not break the user flow.
   */
  async logRagQuery(input: {
    queryText: string;
    responseText: string | null;
    results: SearchResult[];
    latencyMs: number;
  }): Promise<void> {
    try {
      const sources: Prisma.InputJsonValue = input.results.map((r) => ({
        chunkId: r.chunkId,
        documentId: r.documentId,
        documentTitle: r.documentTitle,
        score: r.score,
      }));
      await this.prisma.query.create({
        data: {
          queryText: input.queryText,
          responseText: input.responseText,
          sources,
          latencyMs: input.latencyMs,
        },
      });
    } catch (err: any) {
      this.logger.warn(
        `Failed to persist Query telemetry: ${err?.message || err}`,
      );
    }
  }

  async converse(dto: ConverseDto): Promise<{
    reply: string;
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

    const startedAt = Date.now();
    const queryText = lastUser.content.trim();
    const { context, sources, results } = await this.rag(
      queryText,
      limit,
      dto.userId,
    );

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

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const reply = await this.generateChatReply(system, history);
    const finalReply = reply || "(empty response)";

    await this.logRagQuery({
      queryText,
      responseText: finalReply,
      results,
      latencyMs: Date.now() - startedAt,
    });

    return { reply: finalReply, sources, results };
  }
}
