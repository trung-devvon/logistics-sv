import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD
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
=======
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
>>>>>>> features/geo-distance
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
