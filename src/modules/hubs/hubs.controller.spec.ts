import { Test, TestingModule } from '@nestjs/testing';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';

describe('HubsController', () => {
  let controller: HubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubsController],
      providers: [HubsService],
    }).compile();

    controller = module.get<HubsController>(HubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
