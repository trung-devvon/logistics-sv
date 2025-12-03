import { Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuditRepository } from '@/common/repository/audit.repository';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { ScopeRepository } from '@/common/repository/scope.repository';
import { OrgRepository } from './repos/org.repository';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [JwtModule.register({})],
  controllers: [OrgController],
  providers: [
    OrgService,
    OrgRepository,
    ScopeRepository,
    AuditRepository,
    AdvancedScopeGuard,
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
  exports: [OrgService, OrgRepository],
})
export class OrgModule {}
