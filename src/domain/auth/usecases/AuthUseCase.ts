import { User, UserCredentials } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

/**
 * Authentication use case implementing business logic for user authentication
 */
export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Authenticate a user with credentials
   * @param credentials User credentials (email and password)
   * @returns User object if authentication successful, null otherwise
   */
  async login(credentials: UserCredentials): Promise<User | null> {
    return this.userRepository.authenticate(credentials);
  }

  /**
   * Check if a user exists by email
   * @param email User's email
   * @returns User object if found, null otherwise
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
} 