import { defineConfig } from "drizzle-kit";

// Default to SQLite if no DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

// Determine dialect based on DATABASE_URL
const isSQLite = databaseUrl.startsWith('file:');
const dialect = isSQLite ? 'sqlite' : 'postgresql';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: dialect as 'sqlite' | 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
