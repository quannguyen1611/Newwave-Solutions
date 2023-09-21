import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ScriptModule } from './script.module';
// import { UserService } from '../module/user/user.service';
import { error } from 'console';
import { Repository } from 'typeorm';
import { User } from '../modules/typeorm/entities/user.entity';

class Script {
  private app: INestApplication;
  private readonly logger = new Logger();
  private readonly userRepository: Repository<User>;
  //   private userService: UserService;

  async main() {
    try {
      await this.init();
      await this.process();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async init() {
    this.logger.log('init script [START]!!');

    this.app = await NestFactory.create<NestExpressApplication>(ScriptModule);
    this.logger.log('init script [DONE]!!');
  }

  private async process() {
    this.logger.log('process [START]');
    this.logger.log('process [DONE]');
  }
}

new Script()
  .main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    const logger = new Logger();
    logger.error(error);
    process.exit(err.code || -1);
  });

