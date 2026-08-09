import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';
import { assertCsrf } from '@/lib/csrf';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const code = req.nextUrl.searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });

    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('referral_code', code.trim())
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { data } = await supabaseAdmin
      .from('admin_user_notes')
      .select('id, note, admin_identifier, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return NextResponse.json({ notes: data || [] });
  } catch (e) {
    console.error('[admin/notes] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    assertCsrf(req);

    const body = await req.json();
    const { code, note } = body;

    if (!code || !note) {
      return NextResponse.json({ error: 'code and note are required' }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from('waitlist')
      .select('id')
      .eq('referral_code', code.trim())
      .maybeSingle();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await supabaseAdmin.from('admin_user_notes').insert({
      user_id: user.id,
      note,
      admin_identifier: req.headers.get('x-admin-id') || 'unknown',
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/notes] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
