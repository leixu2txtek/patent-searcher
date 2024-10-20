import { Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from './base-entity';

@Entity()
export class Role extends BaseEntity {

    @Property({ columnType: 'varchar(50)' })
    name: string;

    constructor(name: string, number: string) {

        super();
        this.name = name;
    }
}