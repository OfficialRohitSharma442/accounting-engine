import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';

import compression from 'compression';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SECURITY

  app.use(helmet());

  // RESPONSE COMPRESSION

  app.use(compression());

  // GLOBAL VALIDATION

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // SWAGGER

  const config = new DocumentBuilder()
    .setTitle('ERP API')
    .setDescription('ERP Backend APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
