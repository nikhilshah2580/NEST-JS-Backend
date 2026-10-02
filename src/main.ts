import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const dataSource = app.get(DataSource);

  if (dataSource.isInitialized) {
    console.log('PostgreSQL database connected successfully');
    console.log(`Database: ${dataSource.options.database}`);
  }

  await app.listen(3000);

  console.log('Server running on http://localhost:3000');
}

bootstrap();
