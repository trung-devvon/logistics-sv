import { Controller } from '@nestjs/common';
import { GeoDistanceService } from './geo-distance.service';

@Controller('geo-distance')
export class GeoDistanceController {
  constructor(private readonly geoDistanceService: GeoDistanceService) {}
}
