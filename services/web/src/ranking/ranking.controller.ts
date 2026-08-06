import { Controller, Get, Param, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string, @Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.rankingService.getSimilarArticles(id, parsedLimit);
  }
}
