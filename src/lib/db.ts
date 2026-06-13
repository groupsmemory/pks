import { neon } from '@neondatabase/serverless';

type NeonSql = ReturnType<typeof neon>;

const globalForDb = globalThis as unknown as {
  sql: NeonSql | undefined;
};

export function getDb(): NeonSql {
  if (globalForDb.sql) return globalForDb.sql;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL tidak dikonfigurasi.');
  }

  globalForDb.sql = neon(databaseUrl);
  return globalForDb.sql;
}
