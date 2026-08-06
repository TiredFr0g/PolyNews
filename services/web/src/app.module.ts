import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    DatabaseModule, UsersModule, AuthModule, FeedModule, RankingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
