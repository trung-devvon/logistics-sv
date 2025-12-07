import { Module } from '@nestjs/common';
import { ConfigRefService } from './config-ref.service';
import { ConfigRefController } from './config-ref.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigRefRepository } from './repos/config-ref.repository';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuditRepository } from '@/common/repository/audit.repository';
import { ScopeRepository } from '@/common/repository/scope.repository';

@Module({
  imports: [JwtModule.register({})],
  controllers: [ConfigRefController],
  providers: [
    ConfigRefService,
    ConfigRefRepository,
    ScopeRepository,
    AuditRepository,
    AdvancedScopeGuard,
    PermissionsGuard,
  ],
})
export class ConfigRefModule {}
