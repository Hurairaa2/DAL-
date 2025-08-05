import dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Check for required environment variable
if (!process.env.DATABASE_URL) {
  // Set a fallback DATABASE_URL if not provided
  process.env.DATABASE_URL = 'file:./dev.db';
  console.warn('DATABASE_URL not found in environment, using SQLite fallback.');
}

// Determine if we're using SQLite or PostgreSQL
const isSQLite = process.env.DATABASE_URL.startsWith('file:');

let db: any;
let client: any;

if (isSQLite) {
  // SQLite setup
  const sqlitePath = process.env.DATABASE_URL.replace('file:', '');
  const sqlite = new Database(sqlitePath);
  db = drizzleSQLite(sqlite, { schema });
  client = sqlite;
} else {
  // PostgreSQL setup
  try {
    client = postgres(process.env.DATABASE_URL, {
      max: 10, // Maximum number of connections
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout
    });
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
}

export { db };

// Export the client for manual connection management if needed
export { client };

// Graceful shutdown function
export async function closeDatabase() {
  if (isSQLite) {
    client.close();
  } else {
    await client.end();
  }
} 