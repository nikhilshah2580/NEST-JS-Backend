import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) console.log('PostgreSQL database connected');

  const port = Number.parseInt(process.env.PORT ?? '3000', 10);
  const finalPort = Number.isSafeInteger(port) && port > 0 ? port : 3000;
  await app.listen(finalPort);
  console.log(`Server running on http://localhost:${finalPort}`);
}

bootstrap();
