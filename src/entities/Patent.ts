import { Entity, Property, Enum, Unique } from '@mikro-orm/better-sqlite';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Patent extends BaseEntity {

  @Property({ columnType: 'varchar(100)' })
  name: string;

  @Property({ columnType: 'varchar(100)' })
  @Unique()
  number!: string;

  @Property({ columnType: 'int' })
  @Enum(() => PatentType)
  type: PatentType = PatentType.UNKNOWN;

  @Property({ columnType: 'int' })
  @Enum(() => PatentStatus)
  status: PatentStatus = PatentStatus.UNKNOWN;

  @Property({ default: 0, columnType: 'decimal(10, 2)' })
  price!: number;

  @Property()
  deadline?: Date;

  @Property({ default: false, columnType: 'tinyint' })
  reported: boolean = false;

  @Property({ nullable: true, columnType: 'varchar(1000)' })
  domain?: string;

  @Property({ nullable: true })
  remark?: string;

  constructor(name: string) {

    super();
    this.name = name;
  }
}

export enum PatentType {

  // 未知
  UNKNOWN = -1,

  // 发明专利
  PATENT = 1,

  // 实用新型
  MODEL = 2,
}

export enum PatentStatus {

  // 未知
  UNKNOWN = -1,

  // 未发放
  NOT_ISSUED = 0,

  // 已发放
  ISSUED = 1,
}