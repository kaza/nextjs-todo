# Test Database Configuration

This project supports running tests with either an in-memory SQLite database or a file-based SQLite database. This allows for flexibility in testing and debugging.

## Running Tests

### Standard Test Commands

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

- Run only integration tests:
  ```bash
  npm run test:integration
  ```

### Database-Specific Test Commands

- Run tests with in-memory database:
  ```bash
  npm run test:memory
  ```

- Run tests with file-based database:
  ```bash
  npm run test:file
  ```

## Toggling Between Database Modes

You can manually toggle between database modes using the provided script:

- Switch to in-memory database:
  ```bash
  npx ts-node scripts/toggle-test-db.ts memory
  ```

- Switch to file-based database:
  ```bash
  npx ts-node scripts/toggle-test-db.ts file
  ```

## Database Configuration

- **In-memory database**: Data is stored in memory and is cleared when the tests finish. This is faster and ensures tests are isolated.

- **File-based database**: Data is stored in a `test.db` file. This allows you to inspect the database state after tests run, which can be useful for debugging.

## Implementation Details

- The test database configuration is managed in `.env.test`
- Database setup and teardown is handled in `tests/global-setup.ts`
- Test-specific Prisma client is provided by `tests/utils/test-db-config.ts`
- All tests use the test database configuration through the mocked PrismaClient in `tests/setup.ts`

## Debugging

When using the file-based database mode, you can inspect the database after tests run using SQLite tools:

```bash
# Example using SQLite CLI
sqlite3 test.db

# Then run SQL commands
.tables
SELECT * FROM User;
``` 