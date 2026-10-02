import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services/index.js';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
