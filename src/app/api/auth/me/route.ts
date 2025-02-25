import { NextRequest, NextResponse } from "next/server";
import { AuthUseCase } from "../../../../domain/auth/usecases/AuthUseCase";
import { PrismaUserRepository } from "../../../../infrastructure/repositories/PrismaUserRepository";

/**
 * GET handler for retrieving the current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const sessionCookie = request.cookies.get("user_session");

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the session data
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }

    // Get the user email from the session
    const { email } = sessionData;

    if (!email) {
      return NextResponse.json(
        { message: "Invalid session data" },
        { status: 401 }
      );
    }

    // Initialize repository and use case
    const userRepository = new PrismaUserRepository();
    const authUseCase = new AuthUseCase(userRepository);

    // Get the user by email
    const user = await authUseCase.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 