import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/employee.module';
import { SupabaseModule } from './config/supabase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Makes environment variables available throughout the application.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Initializes PostgreSQL using environment-based configuration.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    // Feature modules expose the application's HTTP APIs and services.
    CompanyModule,
    SupabaseModule,
    EmployeeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
