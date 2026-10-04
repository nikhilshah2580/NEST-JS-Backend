import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the Nest application and load all configured modules.
  const app = await NestFactory.create(AppModule);

  // Add security-focused HTTP response headers.
  app.use(helmet());
  // All HTTP routes are served below /api.
  app.setGlobalPrefix('api');

  // Validate, transform, and reject unknown request properties globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Confirm the database connection without exposing database configuration.
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) console.log('PostgreSQL database connected');

  // Use a valid environment port, with 3000 as the safe local fallback.
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  const finalPort = Number.isSafeInteger(port) && port > 0 ? port : 3000;
  await app.listen(finalPort);
  console.log(`Server running on http://localhost:${finalPort}`);
}

bootstrap();
