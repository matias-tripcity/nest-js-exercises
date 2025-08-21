import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DriverModule } from './driver/driver.module';
import { GigModule } from './gig/gig.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3399;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();
  app.use(json({ limit: '1mb' }));

  const appUrl = `http://localhost:${port}/${globalPrefix}`;

  const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API Docs Specification')
    .setVersion('1.0.0')
    .addServer(appUrl)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [DriverModule, GigModule],
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${appUrl}`);
}
bootstrap();
