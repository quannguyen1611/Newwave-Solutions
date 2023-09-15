import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from '../typeorm/entities/user.entity';
import { Profile } from 'src/modules/typeorm/entities/profile.entity';
import { RoleEntity } from '../typeorm/entities/role.entity';
import { UsersControllerPublic } from './controllers/users/user.controller.public';

@Module({
    imports: [TypeOrmModule.forFeature([User, Profile, RoleEntity])],
    controllers: [UsersController, UsersControllerPublic],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}