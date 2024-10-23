import { defineConfig } from '@mikro-orm/better-sqlite';

export default defineConfig({
  dbName: './database/patent.db',
  entities: ['./src/entities/*'],
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: true,
});
