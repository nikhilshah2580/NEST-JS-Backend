import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const supabaseConfig = (
  configService: ConfigService,
): SupabaseClient => {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');

  const supabaseKey = configService.get<string>('SUPABASE_PUBLISHABLE_KEY');

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not defined');
  }

  if (!supabaseKey) {
    throw new Error('SUPABASE_PUBLISHABLE_KEY is not defined');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};
