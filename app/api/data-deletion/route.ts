import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email, reason } = body;

    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 });
    }

    // Store deletion request for admin processing
    const { error } = await supabaseAdmin
      .from('data_deletion_requests')
      .insert({
        phone: phone || null,
        email: email || null,
        reason: reason || null,
        status: 'pending',
        requested_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[data-deletion] insert error');
      return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Deletion request submitted. We will process it within 30 days.' });
  } catch (e) {
    console.error('[data-deletion] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
