import { Module } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderRepository } from './repos/orders.repository';
import { OrderController } from './orders.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { RolesGuard } from '@/common/guards/role.guard';
import { AuditRepository } from '@/common/repository/audit.repository';
import { ScopeRepository } from '@/common/repository/scope.repository';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    ScopeRepository,
    AuditRepository,
    AdvancedScopeGuard,
    PermissionsGuard,
    RolesGuard,
  ],
  exports: [OrderService, OrderRepository],
})
export class OrdersModule {}
