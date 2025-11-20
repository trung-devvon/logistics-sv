import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestFastifyApplication } from '@nestjs/platform-fastify';


export function setupSwagger(app: NestFastifyApplication): void {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('nodeEnv');
  const host = configService.get<string>('app.host');
  const port = configService.get<number>('app.port');

  const isProd = nodeEnv === 'production';
  const baseUrl = isProd ? `https://${host}` : `http://localhost:${port}`;

  const config = new DocumentBuilder()
    .setTitle('My Logistics API')
    .setDescription('API documentation for My Logistics application')
    .setVersion('1.0.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter access token',
      in: 'header',
    },
    'access-token', // tên này sẽ dùng cho các endpoint bình thường
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter refresh token đây',
      in: 'header',
    },
    'refresh-token', // tên này khớp với @ApiBearerAuth('refresh-token') ở trên
  )
    .addServer(baseUrl)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.register(require('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: document, // truyền thẳng document vào đây
  });

  app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      syntaxHighlight: { theme: 'monokai' },
    },
    staticCSP: true,
  });

}