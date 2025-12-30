import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { PrismaService } from '@/core/prisma/prisma.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { WarehouseScanRepository } from './repos/warehouse.repository';
import { AuditRepository } from '@/common/repository/audit.repository';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [WarehouseController],
  providers: [
    WarehouseService,
    PrismaService,
    WarehouseScanRepository,
    AuditRepository,
    PermissionsGuard,
  ],
  exports: [WarehouseService, WarehouseScanRepository],
})
export class WarehouseModule {}
