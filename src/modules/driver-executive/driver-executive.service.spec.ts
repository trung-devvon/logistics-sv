import { Test, TestingModule } from '@nestjs/testing';
import { DriverExecutiveService } from './driver-executive.service';

describe('DriverExecutiveService', () => {
  let service: DriverExecutiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DriverExecutiveService],
    }).compile();

    service = module.get<DriverExecutiveService>(DriverExecutiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
