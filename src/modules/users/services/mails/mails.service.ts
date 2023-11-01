import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../../typeorm/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { 
        name: user.username,
        url,
      },
    });
  }

  async sendPasswordConfirmation(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your pasword has been chnaged',
      template: './passwordConfirm', // `.hbs` extension is appended automatically
      context: { 
        name: user.username,
      },
    });
  }

  async sendForgotPasswordEmail(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset your password',
      template: './forgotPassword', // `.hbs` extension is appended automatically
      context: { 
        name: user.username,
        url,
      },
    });
  }

  async sendNewUserEmail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Your new account',
      template: './newUser', // `.hbs` extension is appended automatically
      context: { 
        name: user.username,
        email: user.email,
        password: user.password
      },
    });
  }
}