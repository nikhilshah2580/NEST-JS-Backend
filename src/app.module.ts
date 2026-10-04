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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),

    CompanyModule,
    SupabaseModule,
    EmployeeModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
