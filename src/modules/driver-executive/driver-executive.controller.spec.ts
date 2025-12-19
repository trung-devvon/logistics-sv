import { Test, TestingModule } from '@nestjs/testing';
import { DriverExecutiveController } from './driver-executive.controller';
import { DriverExecutiveService } from './driver-executive.service';

describe('DriverExecutiveController', () => {
  let controller: DriverExecutiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverExecutiveController],
      providers: [DriverExecutiveService],
    }).compile();

    controller = module.get<DriverExecutiveController>(DriverExecutiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
