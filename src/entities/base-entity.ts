import { PrimaryKey, Property } from '@mikro-orm/better-sqlite';

export abstract class BaseEntity {

  @PrimaryKey({ columnType: 'varchar', length: 36 })
  id!: string;

  @Property({ columnType: 'varchar', length: 36 })
  creatorId?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true, columnType: 'varchar', length: 36 })
  updatorId?: string;
}
