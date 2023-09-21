import { BaseEntity } from 'src/modules/typeorm/entities/base.entity';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity ({name: 'user_profiles'})
export class Profile extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstname?: string;

    @Column({ nullable: true })
    lastname?: string;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    dob: string;  

    @Column({ nullable: true })
    createdByUser: string;

    @Column({ nullable: true })
    deletedByUser: string;
}