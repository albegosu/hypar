// `ollama` ships as ESM only; jest's default transform can't load it. Mocking
// the module replaces it with a stub so the dependency tree of SearchService
// (EmbeddingService -> create-ollama -> 'ollama') resolves under jest.
jest.mock('ollama', () => ({
  Ollama: jest.fn().mockImplementation(() => ({
    embeddings: jest.fn(),
    chat: jest.fn(),
  })),
}));

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    embeddings: { create: jest.fn() },
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../documents/embedding.service';

describe('SearchService', () => {
  let service: SearchService;

  const mockPrisma = {
    $queryRaw: jest.fn(),
    query: { create: jest.fn().mockResolvedValue({}) },
  };

  const mockEmbedding = {
    generate: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  };

  const mockConfig = { get: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EmbeddingService, useValue: mockEmbedding },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    jest.clearAllMocks();
    mockEmbedding.generate.mockResolvedValue([0.1, 0.2, 0.3]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('returns chunks with similarity score (1 - cosine distance)', async () => {
      // pgvector returns rows ordered by distance ASC (smallest distance first).
      const mockResults = [
        { chunkId: '2', content: 'closer', documentId: 'd2', documentTitle: 'Doc 2', score: '0.05', startChar: 0, endChar: 6 },
        { chunkId: '1', content: 'farther', documentId: 'd1', documentTitle: 'Doc 1', score: '0.1', startChar: 0, endChar: 7 },
      ];
      mockPrisma.$queryRaw.mockResolvedValue(mockResults);

      const results = await service.search('test query');

      expect(results).toHaveLength(2);
      expect(results[0].score).toBeGreaterThan(results[1].score);
      expect(results[0].score).toBeCloseTo(0.95, 5);
      expect(results[1].score).toBeCloseTo(0.9, 5);
      expect(mockEmbedding.generate).toHaveBeenCalledWith('test query');
    });
  });

  describe('logRagQuery', () => {
    it('persists telemetry with sources and latency', async () => {
      await service.logRagQuery({
        queryText: 'hi',
        responseText: 'hello',
        results: [
          { chunkId: 'c1', content: 'x', documentId: 'd1', documentTitle: 'Doc', score: 0.9, startChar: 0, endChar: 1 },
        ],
        latencyMs: 42,
      });
      expect(mockPrisma.query.create).toHaveBeenCalledTimes(1);
      const arg = mockPrisma.query.create.mock.calls[0][0];
      expect(arg.data.queryText).toBe('hi');
      expect(arg.data.responseText).toBe('hello');
      expect(arg.data.latencyMs).toBe(42);
      expect(Array.isArray(arg.data.sources)).toBe(true);
      expect(arg.data.sources[0].chunkId).toBe('c1');
    });

    it('swallows persistence errors without throwing', async () => {
      mockPrisma.query.create.mockRejectedValueOnce(new Error('DB down'));
      await expect(
        service.logRagQuery({ queryText: 'q', responseText: null, results: [], latencyMs: 1 }),
      ).resolves.toBeUndefined();
    });
  });
});
