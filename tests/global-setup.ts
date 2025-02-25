import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { getTestPrismaClient, isUsingInMemoryDb } from "./utils/test-db-config";

// This function will be called once before all tests
export async function setup() {
  console.log("Setting up test environment...");
  
  // Log which database mode we're using
  console.log(`Using ${isUsingInMemoryDb() ? 'in-memory' : 'file-based'} test database`);
  
  try {
    // Run Prisma migrations on the test database
    console.log("Running Prisma migrations on test database...");
    
    // Set the DATABASE_URL environment variable for the migration command
    process.env.DATABASE_URL = process.env.DATABASE_URL;
    
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
  
  // If using file-based database, we could clean it up here
  // But we'll leave it for debugging purposes
  // If you want to clean it up, uncomment the following:
  // if (!isUsingInMemoryDb()) {
  //   await cleanupTestDatabase();
  // }
  
  console.log("Test environment teardown completed");
} 