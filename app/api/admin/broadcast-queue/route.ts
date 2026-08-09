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

    const { data } = await supabaseAdmin
      .from('broadcast_queue')
      .select('id, message, scheduled_at, status, sent, failed')
      .order('scheduled_at', { ascending: true });

    return NextResponse.json({ queue: data || [] });
  } catch (e) {
    console.error('[admin/broadcast-queue] server error');
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
    const { message, scheduled_at, timezone = 'Africa/Lagos' } = body;

    if (!message || !scheduled_at) {
      return NextResponse.json({ error: 'message and scheduled_at are required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('broadcast_queue').insert({
      message,
      scheduled_at,
      timezone,
    });

    if (error) {
      console.error('[admin/broadcast-queue] database error');
      return NextResponse.json({ error: 'Failed to schedule broadcast' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[admin/broadcast-queue] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
