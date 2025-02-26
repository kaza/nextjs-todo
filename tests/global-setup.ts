import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { getTestPrismaClient, cleanupTestDatabase } from "./utils/test-db-config";
import * as fs from 'fs';

// This function will be called once before all tests
export async function setup() {
  console.log("Setting up test environment...");
  
  // Log database URL for debugging
  console.log(`Database URL: ${process.env.DATABASE_URL}`);
  
  try {
    // Clean up existing test database file if it exists
    await cleanupTestDatabase();
    
    // Run Prisma migrations on the test database
    console.log("Running Prisma migrations on test database...");
    
    // Run the migration
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    
    console.log("Test database setup completed successfully");
  } catch (error) {
    console.error("Error setting up test database:", error);
    throw error;
  }
}

// This function will be called once after all tests
export async function teardown() {
  console.log("Tearing down test environment...");
  
  // Optionally clean up the test database file
  // await cleanupTestDatabase();
  
  console.log("Test environment teardown completed");
} 