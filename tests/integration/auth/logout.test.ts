import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../../../src/app/api/auth/logout/route";

describe("Logout API", () => {
  // Test successful logout
  it("should clear the session cookie on logout", async () => {
    // Create a mock request
    const request = new NextRequest("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: {
        cookie: "user_session=some-session-data",
      },
    });

    // Call the logout API
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.message).toBe("Logged out successfully");
    
    // Check if the cookie is cleared
    const cookies = response.headers.getSetCookie();
    const sessionCookie = cookies.find(cookie => cookie.startsWith("user_session="));
    expect(sessionCookie).toBeDefined();
    
    // The cookie should have an empty value and be expired
    expect(sessionCookie).toContain("user_session=");
    expect(sessionCookie).toContain("Max-Age=0");
  });
}); 