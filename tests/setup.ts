// This file is used to set up the test environment
// It will be executed before each test file
import { vi, afterEach } from 'vitest';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock fetch API
global.fetch = vi.fn();

// Mock PrismaClient to use test database
vi.mock('@prisma/client', async () => {
  const original = await import('@prisma/client');
  
  // Create a test PrismaClient instance directly
  const mockPrismaClient = vi.fn().mockImplementation(() => {
    return new original.PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  });
  
  return {
    ...original,
    PrismaClient: mockPrismaClient,
  };
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
}); 