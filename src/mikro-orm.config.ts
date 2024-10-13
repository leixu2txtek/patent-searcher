import { defineConfig } from '@mikro-orm/better-sqlite';

export default defineConfig({
  dbName: 'test.db',
  entities: ['./src/entities'],
  debug: true,
  allowGlobalContext: true,
});
