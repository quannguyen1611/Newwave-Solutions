import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { User } from '../typeorm/entities/user.entity';
import { Profile } from 'src/modules/typeorm/entities/profile.entity';
import { RoleEntity } from '../typeorm/entities/role.entity';
import { UsersControllerPublic } from './controllers/users/user.controller.public';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../users/mails.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './services/mails/mail.processor';


@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail',
            redis: {
                enableTLSForSentinelMode: false,
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
              },
          }),
        //UsersModule,
        MailModule,
        TypeOrmModule.forFeature([User, Profile, RoleEntity]),
        ConfigModule.forRoot(), 
    ],
    controllers: [UsersController, UsersControllerPublic],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}