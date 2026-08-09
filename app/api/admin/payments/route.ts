import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const code = req.nextUrl.searchParams.get('code');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || '50'), 200);

    let query = supabaseAdmin
      .from('payments')
      .select('id, user_id, amount, status, reference, paid_at, created_at, waitlist(referral_code, full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (code) {
      const { data: user } = await supabaseAdmin
        .from('waitlist')
        .select('id')
        .eq('referral_code', code.trim())
        .maybeSingle();

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data || []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      referral_code: p.waitlist?.referral_code || null,
      full_name: p.waitlist?.full_name || null,
      amount: p.amount,
      status: p.status,
      reference: p.reference,
      paid_at: p.paid_at,
      created_at: p.created_at,
    }));

    return NextResponse.json({ payments: rows });
  } catch (e) {
    console.error('[admin/payments]', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
