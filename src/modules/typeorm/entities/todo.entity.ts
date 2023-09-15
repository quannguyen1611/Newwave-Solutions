import { BaseEntity } from "src/modules/typeorm/entities/base.entity";
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
@Entity( { name : 'todos'} )
export class Todo extends BaseEntity{
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    item: string;

    @Column()
    createdAt: Date;
}