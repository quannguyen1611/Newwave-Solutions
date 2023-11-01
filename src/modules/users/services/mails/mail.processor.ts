import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mails.service';

@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly mailService: MailService
    ) {}
  @Process('sendMail')
  async transcode(job: Job<EmailData>) {
    try {
        const { user, token } = job.data;
        await this.mailService.sendUserConfirmation(user, token);
      } catch (error) {
        console.error('Error sending email:', error);
      }
  }

  @Process('sendPasswordMail')
  async sendPasswordEmail(job: Job<EmailData>) {
    try {
        const { user } = job.data;
        await this.mailService.sendPasswordConfirmation(user);
      } catch (error) {
        console.error('Error sending email:', error);
      }
  }

  @Process('sendForgotPassword')
  async sendForgotPassword(job: Job<EmailData>) {
    try {
        const { user, token } = job.data;
        await this.mailService.sendForgotPasswordEmail(user, token);
      } catch (error) {
        console.error('Error sending email:', error);
      }
  }

  @Process('NewUserMail')
  async NewUserMail(job: Job<EmailData>) {
    try {
        const { user } = job.data;
        await this.mailService.sendNewUserEmail(user);
      } catch (error) {
        console.error('Error sending email:', error);
      }
  }
}
