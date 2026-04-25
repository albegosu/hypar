import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('queries')
  async listQueries(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const cappedLimit = Math.min(Math.max(limit, 1), 200);
    const cappedOffset = Math.max(offset, 0);
    const [items, total] = await Promise.all([
      this.prisma.query.findMany({
        orderBy: { createdAt: 'desc' },
        take: cappedLimit,
        skip: cappedOffset,
      }),
      this.prisma.query.count(),
    ]);
    return { total, limit: cappedLimit, offset: cappedOffset, items };
  }

  @Get('stats')
  async stats() {
    const [docs, chunks, queries, avgLatency] = await Promise.all([
      this.prisma.document.count(),
      this.prisma.chunk.count(),
      this.prisma.query.count(),
      this.prisma.query.aggregate({ _avg: { latencyMs: true } }),
    ]);
    return {
      documents: docs,
      chunks,
      queries,
      avgLatencyMs: avgLatency._avg.latencyMs ?? null,
    };
  }
}
