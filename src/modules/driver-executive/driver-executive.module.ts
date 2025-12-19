import { Module } from '@nestjs/common';
import { DriverExecutiveService } from './driver-executive.service';
import { DriverExecutiveController } from './driver-executive.controller';

@Module({
  controllers: [DriverExecutiveController],
  providers: [DriverExecutiveService],
})
export class DriverExecutiveModule {}
