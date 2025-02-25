import { User, UserCredentials } from "../entities/User";

/**
 * Repository interface for user authentication operations
 */
export interface UserRepository {
  /**
   * Find a user by their email
   * @param email User's email
   * @returns User object if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Authenticate a user with credentials
   * @param credentials User credentials (email and password)
   * @returns User object if authentication successful, null otherwise
   */
  authenticate(credentials: UserCredentials): Promise<User | null>;
} 