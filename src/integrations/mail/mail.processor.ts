import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Processor('mail')
export class MailProcessor extends WorkerHost {
    private readonly logger = new Logger(MailProcessor.name);
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        super();
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('mail.host', 'smtp.gmail.com'),
            port: this.configService.get<number>('mail.port', 587),
            secure: false,
            auth: {
                user: this.configService.get<string>('mail.user'),
                pass: this.configService.get<string>('mail.password'),
            },
        });
    }

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Processing job ${job.id} of type ${job.name}`);

        try {
            if (job.name === 'send-otp') {
                const { to, name, otp } = job.data;
                const html = `
          <h1>Hello ${name},</h1>
          <p>Your OTP code is: <b>${otp}</b></p>
          <p>This code will expire in 15 minutes.</p>
        `;

                await this.transporter.sendMail({
                    from: '"Droppa Support" <no-reply@droppa.com>',
                    to,
                    subject: 'Your OTP Code - Droppa',
                    html,
                });

                this.logger.log(`OTP sent to ${to}`);
            }
        } catch (error) {
            this.logger.error(
                `Failed to process job ${job.id}: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }
}
