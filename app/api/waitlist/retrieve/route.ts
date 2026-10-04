import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !secret) {
    return NextResponse.json({ error: 'Waitlist is temporarily unavailable.' }, { status: 503 });
  }

  const phone = request.nextUrl.searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json({ error: "Phone parameter required" }, { status: 400 });
  }

  const normalized = phone.replace(/\D/g, "");
  const formatted = normalized.startsWith("234") ? "+" + normalized : "+234" + normalized.replace(/^0/, "");

  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .select('referral_code, position')
    .eq('whatsapp_number', formatted)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ referral_code: data.referral_code, position: data.position });
}