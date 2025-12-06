import { Test, TestingModule } from '@nestjs/testing';
import { ConfigRefService } from './config-ref.service';

describe('ConfigRefService', () => {
  let service: ConfigRefService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigRefService],
    }).compile();

    service = module.get<ConfigRefService>(ConfigRefService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
