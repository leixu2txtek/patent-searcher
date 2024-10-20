import {  Entity, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from './base-entity';

@Entity()
export class Account extends BaseEntity {

    @Property({ columnType: 'varchar(50)' })
    name: string;

    @Property({ columnType: 'varchar(50)' })
    password: string;

    @Property({ columnType: 'varchar(11)' })
    @Unique()
    mobile: string;

    @Property({ columnType: 'varchar(100)' })
    email?: string;

    constructor(name: string, mobile: string, password: string) {

        super();
        this.name = name;
        this.mobile = mobile;
        this.password = password;
    }
}