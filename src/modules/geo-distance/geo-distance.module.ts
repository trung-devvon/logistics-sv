import { Module } from '@nestjs/common';
import { GeoProvider } from './providers/geo.provider';
import { GeoGoogleProvider } from './providers/geo.google.provider';
import { PrismaService } from '@/core/prisma/prisma.service';
import { GeoController } from './geo-distance.controller';
import { GeoService } from './geo-distance.service';
import { GeoRepository } from './repositories/geo.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { AdvancedScopeGuard } from '@/common/guards/advanced-scope.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { AuditRepository } from '@/common/repository/audit.repository';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { ScopeRepository } from '@/common/repository/scope.repository';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: false }),
    JwtModule.register({}),
    PrismaModule,
    HttpModule,
  ],
  controllers: [GeoController],
  providers: [
    GeoRepository,
    GeoService,
    AuditRepository,
    AdvancedScopeGuard,
    PermissionsGuard,
    PrismaService,
    ScopeRepository,
    {
      provide: GeoProvider,
      useFactory: () =>
        new GeoGoogleProvider(
          process.env.GOOGLE_MAPS_API_KEY,
          Number(process.env.GOOGLE_MAPS_TIMEOUT_MS ?? 7000),
        ),
    },
  ],
  exports: [GeoService, GeoRepository],
})
export class GeoModule {}
