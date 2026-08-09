import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';
import { assertCsrf } from '@/lib/csrf';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    assertCsrf(req);

    const body = await req.json();
    const { sql } = body;

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json({ error: 'Missing sql' }, { status: 400 });
    }

    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const results: { ok: boolean; error?: string }[] = [];
    for (const stmt of statements) {
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: stmt });
      results.push({ ok: !error, error: error?.message });
    }

    const failed = results.filter((r) => !r.ok);
    return NextResponse.json({
      ok: failed.length === 0,
      run: results.length,
      failed: failed.length,
      errors: failed.map((r) => r.error),
    });
  } catch (e) {
    console.error('[admin/migrate] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
