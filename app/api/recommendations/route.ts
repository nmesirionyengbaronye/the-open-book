import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const recommendationSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  recommendation: z.string().trim().min(10, "Recommendation must be at least 10 characters").max(1000),
});

/**
 * Public Recommendations API
 * Handles student feedback and improvements.
 * Includes IP-based rate limiting to prevent spam.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limiting: Check if this IP has submitted a recommendation in the last 60 seconds
    const { data: recent, error: rateError } = await supabaseAdmin
      .from('recommendations')
      .select('created_at')
      .eq('ip_address', ip)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recent && recent.length > 0) {
      const lastSubmit = new Date(recent[0].created_at).getTime();
      const now = Date.now();
      if (now - lastSubmit < 60000) { // 60 second cooldown
        return NextResponse.json(
          { error: "Too many submissions. Please wait a minute." }, 
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const parsed = recommendationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { error: insertError } = await supabaseAdmin.from('recommendations').insert({
      full_name: parsed.data.full_name,
      recommendation: parsed.data.recommendation,
      ip_address: ip
    });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Failed to submit recommendation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
