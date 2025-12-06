import { Module } from '@nestjs/common';
import { ConfigRefService } from './config-ref.service';
import { ConfigRefController } from './config-ref.controller';

@Module({
  controllers: [ConfigRefController],
  providers: [ConfigRefService],
})
export class ConfigRefModule {}
