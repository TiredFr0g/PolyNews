import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.feedService.getRecentArticles(parsedLimit, parsedOffset);
  }
}
