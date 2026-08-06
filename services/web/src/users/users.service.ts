import { Injectable, Inject, OnModuleInit, ConflictException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { DATABASE_POOL } from '../database/database.providers';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@Inject(DATABASE_POOL) private pool: Pool) {}

  async onModuleInit() {
    await this.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // In case the table already existed without the password_hash column
    await this.pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR;
    `);
  }

  async create(email: string, passwordPlain: string) {
    const hash = await bcrypt.hash(passwordPlain, 10);
    try {
      const result = await this.pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
        [email, hash],
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // unique_violation
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findById(id: string) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
}
