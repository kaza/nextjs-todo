import bcrypt from "bcrypt";
import { User, UserCredentials } from "../../domain/auth/entities/User";
import { UserRepository } from "../../domain/auth/repositories/UserRepository";
import { prisma } from "../database/prisma";

/**
 * Prisma implementation of the UserRepository interface
 */
export class PrismaUserRepository implements UserRepository {
  /**
   * Find a user by their email
   * @param email User's email
   * @returns User object if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  }

  /**
   * Authenticate a user with credentials
   * @param credentials User credentials (email and password)
   * @returns User object if authentication successful, null otherwise
   */
  async authenticate(credentials: UserCredentials): Promise<User | null> {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
} 