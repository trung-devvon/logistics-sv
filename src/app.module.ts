import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './core/config/configuration';
import { validationSchema } from './core/config/validation.schema';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './integrations/mail/mail.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { OrgModule } from './modules/org/org.module';
import { HubsModule } from './modules/hubs/hubs.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ConfigRefModule } from './modules/config-ref/config-ref.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { OrdersModule } from './modules/orders/orders.module';
import { GeoModule } from './modules/geo-distance/geo-distance.module';
import { AssignmentModule } from './modules/assignment/assignment.module';
import { DispatcherModule } from './modules/dispatcher/dispatcher.module';
import { DriverExecutiveModule } from './modules/driver-executive/driver-executive.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema, // Validate env when start app
      validationOptions: {
        allowUnknown: true,
        abortEarly: false, // Show all validation errors
      },
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OrgModule,
    MailModule,
    ApiKeysModule,
    HubsModule,
    DriversModule,
    VehiclesModule,
    ConfigRefModule,
    OrdersModule,
    GeoModule,
    AssignmentModule,
    DispatcherModule,
    DriverExecutiveModule,
    WarehouseModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          // Cấu hình TLS nếu có dùng Redis online (AWS ElastiCache, Upstash)
          tls: configService.get('REDIS_TLS') === 'true' ? {} : undefined,
        },
        prefix: configService.get('QUEUE_PREFIX') || 'app',
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: await import('cache-manager-redis-store'),
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        ttl: 60000, // Cache TTL mặc định 60 giây
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
