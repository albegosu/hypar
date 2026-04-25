import { Controller, Post, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { ConverseDto } from './dto/converse.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  async search(@Body() dto: SearchDto) {
    return this.searchService.search(dto.query, dto.limit || 5);
  }

  @Post('rag')
  async rag(@Body() dto: SearchDto) {
    return this.searchService.rag(dto.query, dto.limit || 5);
  }

  @Post('inspect')
  async inspect(@Body() dto: SearchDto) {
    return this.searchService.inspect(dto.query, dto.limit || 5);
  }

  @Post('converse')
  async converse(@Body() dto: ConverseDto) {
    return this.searchService.converse(dto);
  }
}
