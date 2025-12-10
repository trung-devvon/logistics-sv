import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';

import { MailProcessor } from './mail.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule { }
