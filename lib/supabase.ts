import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables with fallback to undefined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Validation helper to ensure we have the required configuration.
 * During build time, we provide fallback values to prevent compilation failure,
 * while ensuring runtime safety through clear console warnings.
 */
const validateConfig = () => {
  const missing = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`[Supabase] Warning: Missing environment variables: ${missing.join(', ')}`);
  }
  return missing.length === 0;
};

validateConfig();

// Initialize clients with provided URL or a placeholder to avoid initialization errors
// The placeholders follow the expected format but will fail safely on actual requests
const placeholderUrl = 'https://placeholder.supabase.co';

export const supabaseAdmin = createClient(
  supabaseUrl || placeholderUrl,
  supabaseServiceKey || 'placeholder-key'
);

export const supabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabaseAnonKey || 'placeholder-key'
);
