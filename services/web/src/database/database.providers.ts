import { Pool } from 'pg';

export const DATABASE_POOL = 'DATABASE_POOL';

export const databaseProviders = [
  {
    provide: DATABASE_POOL,
    useFactory: () => {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      return pool;
    },
  },
];
