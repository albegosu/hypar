import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, ChunkingService, EmbeddingService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
