import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.providers';

@Injectable()
export class FeedService {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async getRecentArticles(limit: number = 20, offset: number = 0) {
    // Assuming 'articles' table exists and has a standard created_at column
    // The query can be adjusted if the schema differs slightly
    const query = `
      SELECT *, image_url FROM articles
      ORDER BY id DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await this.pool.query(query, [limit, offset]);
    return result.rows;
  }
}
