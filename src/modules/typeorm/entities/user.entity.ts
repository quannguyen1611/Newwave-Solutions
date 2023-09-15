import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Profile } from "./profile.entity";
import { RoleEntity } from "src/modules/typeorm/entities/role.entity";
import { EUserStatus } from "src/modules/users/users.enum";
import { BaseEntity } from "./base.entity";
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
}
