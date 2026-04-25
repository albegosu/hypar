import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma CLI (migrate, generate) reads the URL from config, not schema.
 * `generate` does not connect; a placeholder is only used when DATABASE_URL is unset (e.g. fresh CI before DB is strictly required).
 */
const datasourceUrl =
  process.env.DATABASE_URL ??
  'postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: datasourceUrl,
  },
});
