import { Entity, Property, Enum, Unique } from '@mikro-orm/better-sqlite';
import { BaseEntity } from './base-entity';

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

  /**
   * 缴费截止日期
   */
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

  // 未下证
  NOT_ISSUED = 0,

  // 已下证
  ISSUED = 1,
}

export const PatentTypeText: Array<{ name: string, value: PatentType}> = [

  {
    name: '未知类型',
    value: PatentType.UNKNOWN
  },
  {
    name: '发明专利',
    value: PatentType.PATENT
  },
  {
    name: '实用新型',
    value: PatentType.MODEL
  }
];

export const PatentStatusText: Array<{ name: string, value: PatentStatus}> = [

  {
    name: '未知状态',
    value: PatentStatus.UNKNOWN
  },
  {
    name: '未下证',
    value: PatentStatus.NOT_ISSUED
  },
  {
    name: '已下证',
    value: PatentStatus.ISSUED
  }
];