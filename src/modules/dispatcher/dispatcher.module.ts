import { Module } from '@nestjs/common';
import { DispatcherService } from './dispatcher.service';
import { DispatcherController } from './dispatcher.controller';
import { PrismaService } from '@/core/prisma/prisma.service';
import { DispatcherGateway } from './dispatcher.gateway';
import { DispatcherRepository } from './repositories/dispatcher.repository';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { AuditRepository } from '@/common/repository/audit.repository';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { ScopeRepository } from '@/common/repository/scope.repository';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [DispatcherController],
  providers: [
    AuditRepository,
    AdvancedScopeGuard,
    PermissionsGuard,
    PrismaService,
    ScopeRepository,
    PrismaService,
    DispatcherRepository,
    DispatcherService,
    DispatcherGateway,
  ],
  exports: [DispatcherService,
})
export class DispatcherModule {}
