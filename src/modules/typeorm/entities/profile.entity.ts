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

    @Column()
    age: number;

    @Column()
    dob: string;  
}