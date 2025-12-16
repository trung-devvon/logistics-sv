import { Test, TestingModule } from '@nestjs/testing';
import { GeoController } from './geo-distance.controller';
import { GeoDistanceService } from './geo-distance.service';

describe('GeoDistanceController', () => {
  let controller: GeoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoController],
      providers: [GeoDistanceService],
    }).compile();

    controller = module.get<GeoController>(GeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
