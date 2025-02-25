import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    globalSetup: ['./tests/global-setup.ts'],
    environmentOptions: {
      // Pass environment variables to the test environment
      env: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  },
}); 