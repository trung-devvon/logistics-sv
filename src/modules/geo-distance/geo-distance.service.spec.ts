import { Test, TestingModule } from '@nestjs/testing';
import { GeoDistanceService } from './geo-distance.service';

describe('GeoDistanceService', () => {
  let service: GeoDistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoDistanceService],
    }).compile();

    service = module.get<GeoDistanceService>(GeoDistanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
