import { Module } from '@nestjs/common';
import { HubsService } from './hubs.service';
import { HubsController } from './hubs.controller';

@Module({
  controllers: [HubsController],
  providers: [HubsService],
})
export class HubsModule {}
