import { defineConfig } from '@mikro-orm/better-sqlite';

export default defineConfig({
  dbName: 'patent.db',
  entities: ['./src/entities'],
  debug: true,
  allowGlobalContext: true,
});
