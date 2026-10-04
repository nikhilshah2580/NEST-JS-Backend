import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { supabaseConfig } from './supabase.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      // Shares one configured Supabase client through dependency injection.
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: supabaseConfig,
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
