import { createClient } from '@supabase/supabase-js';

// Supabase has deprecated the legacy anon / service_role JWT keys in favor of
// publishable (sb_publishable_...) and secret (sb_secret_...) keys. We prefer
// the new env var names and fall back to the legacy ones so existing
// deployments keep working without a config change.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // legacy fallback
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // legacy fallback

const pubKey = supabasePublishableKey || supabaseAnonKey;
const secretKey = supabaseSecretKey || supabaseServiceKey;

/**
 * Validation helper to ensure we have the required configuration.
 * During build time, we provide fallback values to prevent compilation failure,
 * while ensuring runtime safety through clear console warnings.
 */
const validateConfig = () => {
  const missing = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!secretKey) missing.push('SUPABASE_SECRET_KEY');
  if (!pubKey) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

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
  secretKey || 'placeholder-key'
);

export const supabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  pubKey || 'placeholder-key'
);
