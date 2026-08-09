import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data } = await supabaseAdmin
      .from('referral_fraud_flags')
      .select('*')
      .order('device_count', { ascending: false })
      .limit(50);

    return NextResponse.json({ flags: data || [] });
  } catch (e) {
    console.error('[admin/fraud] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
