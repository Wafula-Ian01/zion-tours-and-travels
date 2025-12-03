import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Ensure DATABASE_URL is set
const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';

// Extract the file path from the DATABASE_URL (remove 'file:' prefix)
const dbPath = DATABASE_URL.replace(/^file:/, '');

// Create the Prisma adapter with the database file path
const adapter = new PrismaBetterSqlite3({
  url: dbPath,
});

// Create a single PrismaClient instance to be reused across the application
// In Prisma 7, we need to pass the adapter
const prisma = new PrismaClient({
  adapter,
});

export default prisma;

