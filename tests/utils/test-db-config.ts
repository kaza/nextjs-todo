import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Function to get a test-specific PrismaClient instance
export function getTestPrismaClient(): PrismaClient {
  // Create a new PrismaClient with the test database URL
  const dbUrl = process.env.DATABASE_URL;
  
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
}

// Function to clean up test database if needed
export async function cleanupTestDatabase(): Promise<void> {
  // Extract the database file path from the URL
  const dbUrl = process.env.DATABASE_URL || '';
  const dbFilePath = dbUrl.replace('file:', '').trim();
  
  if (dbFilePath && fs.existsSync(dbFilePath)) {
    console.log(`Cleaning up test database file: ${dbFilePath}`);
    fs.unlinkSync(dbFilePath);
  }
} 