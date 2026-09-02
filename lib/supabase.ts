import { createClient } from '@supabase/supabase-js';

// Supabase has deprecated the legacy anon / service_role JWT keys in favor of
// publishable (sb_publishable_...) and secret (sb_secret_...) keys. We prefer
// the new env var names and fall back to the legacy ones for compatibility.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // legacy fallback
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY; // legacy fallback

// Secret keys are intentionally absent from the browser bundle, so validate
// only on the server — warning about a missing secret key client-side is
// misleading noise (it fires from any client bundle that imports this module).
if (typeof window === 'undefined') {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseSecretKey) missing.push('SUPABASE_SECRET_KEY');
  if (!supabasePublishableKey) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn(`[Supabase] Warning: Missing environment variables: ${missing.join(', ')}`);
  }
}

const placeholderUrl = 'https://placeholder.supabase.co';

export const supabaseAdmin = createClient(
  supabaseUrl || placeholderUrl,
  supabaseSecretKey || 'placeholder-key'
);

export const supabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabasePublishableKey || 'placeholder-key'
);
