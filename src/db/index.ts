// src/db/index.ts
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '../db/schema';
import { config } from '../config';

const dialect = new PostgresDialect({
  pool: new Pool(
    process.env.DATABASE_URL 
      ? { 
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
      : {
          host: config.db.host,
          port: config.db.port,
          user: config.db.user,
          password: config.db.password,
          database: config.db.database,
        }
  )
});

export const db = new Kysely<Database>({
  dialect,
});