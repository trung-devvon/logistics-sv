import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Cấu hình SMTP từ .env
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false, // true cho port 465, false cho các port khác
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.password'),
      },
    });
  }

  /**
   * Gửi Email OTP Reset Password
   */
  async sendUserConfirmation(email: string, name: string, otp: string) {
    // 1. Tìm đường dẫn đến file template
    const templatePath = path.join(
      process.cwd(),
      'src/integrations/mail/templates/reset-password.ejs',
    );

    // 2. Render template với dữ liệu
    const html = await ejs.renderFile(templatePath, {
      name: name || 'Quý khách',
      otp: otp,
    });

    // 3. Gửi email
    await this.transporter.sendMail({
      from: '"Logistics App Support" <no-reply@logistics.com>', // Tên người gửi
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu (OTP)',
      html: html,
    });

    console.log(`📧 Đã gửi OTP ${otp} đến ${email}`);
  }
}
