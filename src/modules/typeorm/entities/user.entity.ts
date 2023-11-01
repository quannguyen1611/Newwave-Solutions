import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Profile } from "./profile.entity";
import { RoleEntity } from "src/modules/typeorm/entities/role.entity";
import { EUserStatus } from "src/modules/users/users.enum";
import { BaseEntity } from "./base.entity";
import { Moment } from "moment";
@Entity( { name : 'users'} )
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @Column()
    email: string;

    @Column({ nullable: false, default: EUserStatus.Active })
    status: EUserStatus;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;

    @ManyToMany(() => RoleEntity)
    @JoinTable()
    roles: RoleEntity[];

    @Column({ nullable: true })
    refreshToken: string;

    @Column('simple-array', { nullable: true }) // Assuming roleIds is an array of role IDs.
    roleIds: number[];

    @Column({nullable: true})//specify user type (ex: admin, super admin, etc)
    type: string;

    @Column({ nullable: true })
    createdByUser: string; 

    @Column({ nullable: true })
    deletedByUser: string;

    @Column({ nullable: true })
    updatedByUser: string;

    @Column({ nullable: true })
    last_password_changed_at: Date;

    @Column('json', { nullable: true })
    passwordHistory: string[]; // Array to store previous password hashes

    @Column({ nullable: true })
    attempts: number;

    @Column({ nullable: true })
    lockUntil: Date;

    @Column({ nullable: true })
    lastAttempt: Date;

    @Column({ nullable: true })
    nextAttempt: Date;

    @Column({ nullable: true })
    numPassword: number;

    @Column({ nullable: true })
    uploadFile: string;
}
