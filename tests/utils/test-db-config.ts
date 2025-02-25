import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Function to determine if we're using in-memory database
export function isUsingInMemoryDb(): boolean {
  return process.env.DATABASE_URL?.includes('::memory:') || false;
}

// Function to get a test-specific PrismaClient instance
export function getTestPrismaClient(): PrismaClient {
  // Create a new PrismaClient with the test database URL
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// Function to clean up test database if it's file-based
export async function cleanupTestDatabase(): Promise<void> {
  if (!isUsingInMemoryDb()) {
    // Extract the database file path from the URL
    const dbUrl = process.env.DATABASE_URL || '';
    const dbFilePath = dbUrl.replace('file:', '').trim();
    
    if (dbFilePath && fs.existsSync(dbFilePath)) {
      console.log(`Cleaning up test database file: ${dbFilePath}`);
      fs.unlinkSync(dbFilePath);
    }
  }
}

// Function to toggle between in-memory and file-based database
export function toggleTestDatabaseMode(useInMemory: boolean): void {
  const envFilePath = '.env.test';
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  
  let newContent: string;
  if (useInMemory) {
    // Switch to in-memory database
    newContent = envContent
      .replace(/^DATABASE_URL="file:\.\/test\.db"$/m, '# DATABASE_URL="file:./test.db"')
      .replace(/^# DATABASE_URL="file::memory:"$/m, 'DATABASE_URL="file::memory:"');
  } else {
    // Switch to file-based database
    newContent = envContent
      .replace(/^# DATABASE_URL="file:\.\/test\.db"$/m, 'DATABASE_URL="file:./test.db"')
      .replace(/^DATABASE_URL="file::memory:"$/m, '# DATABASE_URL="file::memory:"');
  }
  
  fs.writeFileSync(envFilePath, newContent);
  
  // Reload environment variables
  dotenv.config({ path: '.env.test' });
  
  console.log(`Switched to ${useInMemory ? 'in-memory' : 'file-based'} test database`);
} 