import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || '100'), 500);

    const { data } = await supabaseAdmin
      .from('telegram_delivery_logs')
      .select('id, chat_id, status, error_message, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    return NextResponse.json({ logs: data || [] });
  } catch (e) {
    console.error('[admin/webhook-logs] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
