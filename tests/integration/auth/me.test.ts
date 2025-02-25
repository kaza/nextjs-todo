import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../../../src/app/api/auth/me/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

describe("Me API", () => {
  let prisma: PrismaClient;
  const testUser = {
    email: "test@example.com",
    name: "Test User",
    password: "password123",
  };

  // Setup test database and create a test user
  beforeAll(async () => {
    prisma = new PrismaClient();
    
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

  // Test successful retrieval of user data
  it("should return user data for authenticated user", async () => {
    // Create a mock session cookie
    const sessionData = { email: testUser.email };
    const sessionCookie = JSON.stringify(sessionData);

    // Create a mock request with the session cookie
    const request = new NextRequest("http://localhost:3000/api/auth/me", {
      headers: {
        cookie: `user_session=${sessionCookie}`,
      },
    });

    // Call the me API
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe(testUser.email);
    expect(data.user.name).toBe(testUser.name);
  });

  // Test unauthenticated access
  it("should return 401 for unauthenticated access", async () => {
    // Create a mock request without a session cookie
    const request = new NextRequest("http://localhost:3000/api/auth/me");

    // Call the me API
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(401);
    expect(data.message).toBe("Not authenticated");
  });

  // Test with invalid session data
  it("should return 401 for invalid session data", async () => {
    // Create a mock request with invalid session data
    const request = new NextRequest("http://localhost:3000/api/auth/me", {
      headers: {
        cookie: `user_session=invalid-json`,
      },
    });

    // Call the me API
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(401);
    expect(data.message).toBe("Invalid session");
  });

  // Test with non-existent user
  it("should return 404 for non-existent user", async () => {
    // Create a mock session cookie with a non-existent email
    const sessionData = { email: "nonexistent@example.com" };
    const sessionCookie = JSON.stringify(sessionData);

    // Create a mock request with the session cookie
    const request = new NextRequest("http://localhost:3000/api/auth/me", {
      headers: {
        cookie: `user_session=${sessionCookie}`,
      },
    });

    // Call the me API
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(404);
    expect(data.message).toBe("User not found");
  });
}); 