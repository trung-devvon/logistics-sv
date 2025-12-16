import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

function compareVersion(current: string, minimum: string) {
  const curParts = current.split('.').map((s) => parseInt(s, 10) || 0);
  const minParts = minimum.split('.').map((s) => parseInt(s, 10) || 0);
  const len = Math.max(curParts.length, minParts.length);
  for (let i = 0; i < len; i++) {
    const c = curParts[i] ?? 0;
    const m = minParts[i] ?? 0;
    if (c > m) return true;
    if (c < m) return false;
  }
  return true;
}
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

  // Setup Swagger (async to allow dynamic imports)
  await setupSwagger(app);
  // DEV: Ensure Redis version compatibility (Skip in tests)
  if (nodeEnv !== 'test') {
    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = Number(configService.get<number>('REDIS_PORT') || 6379);
    const redisPassword = configService.get<string>('REDIS_PASSWORD');
    if (redisHost) {
      try {
        const client = new Redis({ host: redisHost, port: redisPort, password: redisPassword });
        const info = await client.info('server');
        await client.quit();
        const m = info.match(/redis_version:([0-9\.]+)/);
        const current = m?.[1] ?? '0.0.0';
        const isCompatible = compareVersion(current, '5.0.0');
        if (!isCompatible) {
          console.error(`Redis version ${current} is unsupported. Need >= 5.0.0`);
          throw new Error(`Redis version needs to be greater or equal than 5.0.0 Current: ${current}`);
        }
        console.log(`Redis version ${current} - ok`);
      } catch (err) {
        console.warn('Unable to check Redis version during startup:', err.message ?? err);
      }
    }
  }

  await app.listen(port, host);
  console.log(`🚀 ${appName} is running on: http://${host}:${port}`);
  console.log(`API DOCS : http://localhost:${port}/api-docs`);
  console.log(`📝 Environment: ${configService.get<string>('nodeEnv')}`);
}
bootstrap();
