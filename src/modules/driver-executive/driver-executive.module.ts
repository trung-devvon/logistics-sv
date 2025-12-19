import { Module } from '@nestjs/common';
import { DriverExecutiveService } from './driver-executive.service';
import { DriverExecutiveController } from './driver-executive.controller';
import { BullModule } from '@nestjs/bullmq';
import {
  QUEUE_DRIVER_EVENTS,
  QUEUE_POD,
  QUEUE_COD,
  QUEUE_NOTIFY,
  QUEUE_WEBHOOK,
} from './queue/driver-executive.queue.token';
import { DriverExecutiveProducer } from './queue/driver-executive.producer';
import { GeoModule } from '../geo-distance/geo-distance.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuditRepository } from '@/common/repository/audit.repository';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { PrismaService } from '@/core/prisma/prisma.service';
import { DriverExecutiveRepository } from './repositories/driver-executive.repository';

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
    BullModule.registerQueue(
      { name: QUEUE_DRIVER_EVENTS },
      { name: QUEUE_POD },
      { name: QUEUE_COD },
      { name: QUEUE_NOTIFY },
      { name: QUEUE_WEBHOOK },
    ),
  ],
  controllers: [DriverExecutiveController],
  providers: [
    DriverExecutiveService,
    DriverExecutiveProducer,
    AuditRepository,
    PermissionsGuard,
    PrismaService,
    DriverExecutiveRepository,
  ],
})
export class DriverExecutiveModule {}
