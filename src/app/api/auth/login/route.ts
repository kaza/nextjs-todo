import { NextRequest, NextResponse } from "next/server";
import { AuthUseCase } from "../../../../domain/auth/usecases/AuthUseCase";
import { PrismaUserRepository } from "../../../../infrastructure/repositories/PrismaUserRepository";

/**
 * POST handler for login API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Initialize repository and use case
    const userRepository = new PrismaUserRepository();
    const authUseCase = new AuthUseCase(userRepository);

    // Authenticate user
    const user = await authUseCase.login({ email, password });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create response with user data
    const response = NextResponse.json(
      { 
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );

    // Set a session cookie (in a real app, you'd use a proper session management system)
    response.cookies.set({
      name: "user_session",
      value: JSON.stringify({ id: user.id, email: user.email }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 