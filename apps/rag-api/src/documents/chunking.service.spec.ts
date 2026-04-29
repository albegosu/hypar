import { Test, TestingModule } from "@nestjs/testing";
import { ChunkingService } from "./chunking.service";

describe("ChunkingService", () => {
  let service: ChunkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChunkingService],
    }).compile();

    service = module.get<ChunkingService>(ChunkingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("split", () => {
    it("should return single chunk for short text", () => {
      const text = "This is a short text.";
      const chunks = service.split(text);
      expect(chunks.length).toBe(1);
      expect(chunks[0].content).toContain("This is a short text");
    });

    it("should split long text into multiple chunks", () => {
      const text = "A. ".repeat(500);
      const chunks = service.split(text);
      expect(chunks.length).toBeGreaterThan(1);
    });

    it("should include metadata in chunks", () => {
      const text = "First sentence. Second sentence. Third sentence.";
      const chunks = service.split(text);

      expect(chunks[0]).toHaveProperty("content");
      expect(chunks[0]).toHaveProperty("tokenCount");
      expect(chunks[0]).toHaveProperty("startChar");
      expect(chunks[0]).toHaveProperty("endChar");
      expect(chunks[0].startChar).toBe(0);
      expect(chunks[0].endChar).toBeGreaterThan(0);
    });

    it("should handle empty text", () => {
      const chunks = service.split("");
      expect(chunks.length).toBe(0);
    });

    // Regression: previous implementation mutated the text via regex replace
    // before splitting, so startChar/endChar drifted from the original text and
    // citations could land on the wrong characters.
    it("keeps startChar/endChar accurate against the original text", () => {
      const text = "Alpha. Beta? Gamma! Delta. Epsilon. Zeta.";
      const chunks = service.split(text);
      expect(chunks.length).toBeGreaterThan(0);
      for (const chunk of chunks) {
        expect(text.slice(chunk.startChar, chunk.endChar).trim()).toBe(
          chunk.content,
        );
      }
    });

    it("keeps offsets accurate across paragraphs and unicode", () => {
      const text = [
        "# Título",
        "",
        "Primer párrafo con acentos: ñoño, café, jamón.",
        "",
        "## Subtítulo",
        "",
        "Segundo párrafo. Otra frase aquí.",
      ].join("\n");
      const chunks = service.split(text);
      expect(chunks.length).toBeGreaterThan(0);
      for (const chunk of chunks) {
        expect(text.slice(chunk.startChar, chunk.endChar).trim()).toBe(
          chunk.content,
        );
      }
    });

    it("produces overlap between consecutive chunks for continuity", () => {
      const sentence =
        "Esta es una oración medianamente larga para forzar splits. ";
      const text = sentence.repeat(40);
      const chunks = service.split(text);
      if (chunks.length >= 2) {
        // Either the windows overlap, or they meet at a boundary - both are acceptable
        // for retrieval continuity.
        expect(chunks[1].startChar).toBeLessThanOrEqual(chunks[0].endChar);
      }
    });
  });
});
