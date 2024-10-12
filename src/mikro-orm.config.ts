import { defineConfig } from '@mikro-orm/better-sqlite';
import { Patent, BaseEntity } from './entities';

export default defineConfig({
  dbName: 'test.db',
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [Patent, BaseEntity],
  debug: true,
  allowGlobalContext: true,
});
