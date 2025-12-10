import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private mailQueue: Queue) { }

  /**
   * Send User Confirmation Email via Queue
   */
  async sendUserConfirmation(email: string, name: string, otp: string) {
    await this.mailQueue.add('send-otp', {
      to: email,
      name,
      otp,
    });
  }

  /**
   * Send Registration OTP via Queue
   */
  async sendRegistrationOtp(email: string, otp: string) {
    await this.mailQueue.add('send-otp', {
      to: email,
      name: email, // Temporary name
      otp,
    });
  }
}
