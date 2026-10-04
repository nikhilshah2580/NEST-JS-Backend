import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  // PostgreSQL connection values are supplied exclusively by environment variables.
  type: 'postgres',

  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  // Require certificate validation when the application runs in production.
  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? { rejectUnauthorized: true }
      : false,
  // Load registered entities but never modify production schema automatically.
  autoLoadEntities: true,
  synchronize: false,
});
