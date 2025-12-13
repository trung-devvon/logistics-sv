import { Module } from '@nestjs/common';
import { GeoDistanceService } from './geo-distance.service';
import { GeoDistanceController } from './geo-distance.controller';

@Module({
  controllers: [GeoDistanceController],
  providers: [GeoDistanceService],
})
export class GeoDistanceModule {}
