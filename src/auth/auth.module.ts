import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60_000,
        limit: 5,
        blockDuration: 15 * 60_000,
      },
    ]),
  ],

  controllers: [AuthController],

  providers: [AuthService, SupabaseAuthGuard, RolesGuard],

  exports: [SupabaseAuthGuard, RolesGuard],
})
export class AuthModule {}
