import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { DispatcherController } from './dispatcher.controller';

@Module({
  controllers: [DispatcherController],
  providers: [DispatcherService],
})
export class DispatcherModule {}
