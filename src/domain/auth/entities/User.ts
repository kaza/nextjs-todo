/**
 * User entity representing the domain model for authentication
 */
export interface User {
  id: number;
  email: string;
  name: string;
}

/**
 * User credentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
} 