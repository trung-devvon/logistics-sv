import { Test, TestingModule } from '@nestjs/testing';
import { GeoDistanceController } from './geo-distance.controller';
import { GeoDistanceService } from './geo-distance.service';

describe('GeoDistanceController', () => {
  let controller: GeoDistanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoDistanceController],
      providers: [GeoDistanceService],
    }).compile();

    controller = module.get<GeoDistanceController>(GeoDistanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
