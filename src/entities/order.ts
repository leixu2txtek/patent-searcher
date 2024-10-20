import { Entity, ManyToOne, OneToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from './base-entity';
import { Patent } from "./patent";

@Entity()
export class Order extends BaseEntity {

    @OneToOne(() => Patent, { cascade: [] })
    patent!: Patent;
}