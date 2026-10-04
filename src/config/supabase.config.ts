import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const supabaseConfig = (
  configService: ConfigService,
): SupabaseClient => {
  // Read only the public/publishable key; never use the service-role key here.
  const supabaseUrl = configService.get<string>('SUPABASE_URL');

  const supabaseKey = configService.get<string>('SUPABASE_PUBLISHABLE_KEY');

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not defined');
  }

  if (!supabaseKey) {
    throw new Error('SUPABASE_PUBLISHABLE_KEY is not defined');
  }

  // The backend verifies supplied bearer tokens; it does not retain sessions.
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
};
