#!/usr/bin/env ts-node
/**
 * Script to toggle between in-memory and file-based test database
 * 
 * Usage:
 *   npx ts-node scripts/toggle-test-db.ts memory   # Switch to in-memory database
 *   npx ts-node scripts/toggle-test-db.ts file     # Switch to file-based database
 */

import { toggleTestDatabaseMode } from '../tests/utils/test-db-config';

const args = process.argv.slice(2);
const mode = args[0]?.toLowerCase();

if (mode === 'memory') {
  toggleTestDatabaseMode(true);
  console.log('Switched to in-memory test database');
} else if (mode === 'file') {
  toggleTestDatabaseMode(false);
  console.log('Switched to file-based test database');
} else {
  console.error('Invalid mode. Use "memory" or "file"');
  process.exit(1);
} 