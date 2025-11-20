import { Global, Module } from '@nestjs/common';
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
    MailModule,
    ApiKeysModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}