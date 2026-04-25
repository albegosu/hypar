import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../documents/embedding.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService, PrismaService, EmbeddingService],
  exports: [SearchService],
})
export class SearchModule {}
