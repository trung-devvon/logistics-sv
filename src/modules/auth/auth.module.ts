import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ApiKeyAuthGuard } from './guards/api-key.guard';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Global()
@Module({
  imports:[
    UsersModule,
    ApiKeysModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, // 
    LocalStrategy, // xác thực user
    JwtStrategy, // xác thực token
    JwtAuthGuard,
    RolesGuard,
    JwtRefreshGuard,
    JwtRefreshStrategy,
    ApiKeyStrategy,
    ApiKeyAuthGuard
  ],
  exports: [
    AuthService,
    JwtAuthGuard, 
    RolesGuard, 
    JwtRefreshGuard,
    ApiKeyAuthGuard
  ],
})
export class AuthModule {}
