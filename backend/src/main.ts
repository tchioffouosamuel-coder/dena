import * as dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // Sécurité HTTP de base (en-têtes)
  app.use(helmet());

  // CORS restreint au(x) domaine(s) du frontend
  const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'];
  app.enableCors({ origin: corsOrigin, credentials: true });

  // Validation automatique des DTO sur toutes les routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // supprime les champs non attendus
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  // Documentation Swagger (utile pour le frontend et les tests)
  const config = new DocumentBuilder()
    .setTitle('DENA API')
    .setDescription('API du restaurant DENA — menu, commandes, médias, statistiques')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`DENA API démarrée sur http://localhost:${port}/api`);
}
bootstrap();
