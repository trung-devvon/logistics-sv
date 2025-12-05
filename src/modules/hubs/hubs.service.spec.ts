import { Test, TestingModule } from '@nestjs/testing';
import { HubsService } from './hubs.service';

describe('HubsService', () => {
  let service: HubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsService],
    }).compile();

    service = module.get<HubsService>(HubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
