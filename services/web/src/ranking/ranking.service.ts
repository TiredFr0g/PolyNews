import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../database/database.providers';

@Injectable()
export class RankingService {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async getSimilarArticles(articleId: string, limit: number = 5) {
    // Fetches similar articles using pgvector cosine similarity operator <=>
    const query = `
      SELECT *, image_url, 1 - (embedding <=> (SELECT embedding FROM articles WHERE id = $1)) AS similarity
      FROM articles
      WHERE id != $1 AND embedding IS NOT NULL
      ORDER BY embedding <=> (SELECT embedding FROM articles WHERE id = $1)
      LIMIT $2
    `;
    
    try {
      const result = await this.pool.query(query, [articleId, limit]);
      return result.rows;
    } catch (error) {
      if (error.code === '42703') {
        // column does not exist (e.g. embedding)
        throw new NotFoundException('Embeddings not configured properly in database');
      }
      throw error;
    }
  }
}
