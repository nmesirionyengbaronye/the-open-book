import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';

function toCSV(rows: Record<string, any>[], columns: string[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(',');
  const body = (rows || [])
    .map((r) => columns.map((c) => escape(r[c])).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

const TABLES: Record<string, { table: string; columns: string[] }> = {
  users: {
    table: 'waitlist',
    columns: [
      'referral_code',
      'full_name',
      'whatsapp_number',
      'institution',
      'school_code',
      'department_code',
      'level',
      'telegram_verified',
      'mystery_boxes',
      'spin_tickets',
      'wallet_balance',
      'wallet_paid',
      'disqualified',
      'created_at',
    ],
  },
  referrals: {
    table: 'referrals',
    columns: ['id', 'referrer_id', 'referred_id', 'status', 'verified_at', 'created_at'],
  },
  spins: {
    table: 'spin_history',
    columns: ['id', 'user_id', 'prize', 'paid', 'created_at'],
  },
  payments: {
    table: 'payments',
    columns: ['id', 'user_id', 'amount', 'status', 'reference', 'paid_at', 'created_at'],
  },
};

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!isValidSession(session?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const table = req.nextUrl.searchParams.get('table') || 'users';
  const def = TABLES[table];
  if (!def) {
    return NextResponse.json({ error: 'unknown table' }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from(def.table)
    .select(def.columns.join(','));
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const csv = toCSV((data as Record<string, any>[]) || [], def.columns);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="uniui_${table}.csv"`,
    },
  });
}
