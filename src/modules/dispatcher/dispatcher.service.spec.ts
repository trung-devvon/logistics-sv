import { Test, TestingModule } from '@nestjs/testing';
import { DispatcherService } from './dispatcher.service';

describe('DispatcherService', () => {
  let service: DispatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispatcherService],
    }).compile();

    service = module.get<DispatcherService>(DispatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
