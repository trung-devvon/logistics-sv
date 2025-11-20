import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './core/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),

  );
  
  const configService = app.get(ConfigService);

  // Validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Tự động convert type
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
  });

  // Security headers
  await app.register(helmet);

  // Compression
  await app.register(compress, {
    threshold: 1024,
  });

  // Graceful shutdown  database/redis
  app.enableShutdownHooks();

  // Start server
  const port = configService.get<number>('app.port');
  const host = configService.get<string>('app.host');
  const nodeEnv = configService.get<string>('nodeEnv');
  const appName = configService.get<string>('app.name');

  const baseUrl = nodeEnv === 'production'
    ? `https://${configService.get<string>('app.domain')}`
    : `http://${host}:${port}`;

  setupSwagger(app);

  await app.listen(port, host);
  console.log(`🚀 ${appName} is running on: http://${host}:${port}`);
  console.log(`API DOCS : http://localhost:${port}/api-docs`);
  console.log(`📝 Environment: ${configService.get<string>('nodeEnv')}`);
}
bootstrap();