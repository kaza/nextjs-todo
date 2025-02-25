import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../../../src/app/api/auth/login/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getTestPrismaClient, isUsingInMemoryDb } from "../../utils/test-db-config";

describe("Login API", () => {
  let prisma: PrismaClient;
  const testUser = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  // Setup test database and create a test user
  beforeAll(async () => {
    // Use our test database configuration
    prisma = getTestPrismaClient();
    
    console.log(`Running tests with ${isUsingInMemoryDb() ? 'in-memory' : 'file-based'} database`);
    
    // Create a test user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.create({
      data: {
        email: testUser.email,
        name: testUser.name,
        password: hashedPassword,
      },
    });
  });

  // Clean up after tests
  afterAll(async () => {
    // Delete the test user
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    
    await prisma.$disconnect();
  });

  // Test successful login
  it("should successfully authenticate a user with valid credentials", async () => {
    // Create a mock request
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    // Call the login API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.message).toBe("Login successful");
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testUser.email);
    expect(data.user.name).toBe(testUser.name);
    
    // Check if the cookie is set
    const cookies = response.headers.getSetCookie();
    expect(cookies.some(cookie => cookie.startsWith("user_session="))).toBe(true);
  });

  // Test login with invalid credentials
  it("should return 401 for invalid credentials", async () => {
    // Create a mock request with wrong password
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: "wrongpassword",
      }),
    });

    // Call the login API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(401);
    expect(data.message).toBe("Invalid email or password");
  });

  // Test login with missing credentials
  it("should return 400 for missing credentials", async () => {
    // Create a mock request with missing password
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
      }),
    });

    // Call the login API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.message).toBe("Email and password are required");
  });
}); 