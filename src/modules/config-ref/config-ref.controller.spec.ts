import { Test, TestingModule } from '@nestjs/testing';
import { ConfigRefController } from './config-ref.controller';
import { ConfigRefService } from './config-ref.service';

describe('ConfigRefController', () => {
  let controller: ConfigRefController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigRefController],
      providers: [ConfigRefService],
    }).compile();

    controller = module.get<ConfigRefController>(ConfigRefController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
