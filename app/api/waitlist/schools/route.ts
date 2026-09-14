import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INSTITUTIONS } from '@/lib/institutions';

/**
 * Per-school waitlist counters. Returns counts grouped by institution code,
 * sorted descending so the most-active schools appear first.
 *
 * This powers the "UNILAG: 142 students waiting" style counters that drive
 * the funnel — visible progress drives more signups.
 */
export async function GET() {
  try {
    const { data: entries, error } = await supabaseAdmin
      .from('waitlist')
      .select('institution');

    if (error || !entries) {
      return NextResponse.json({ error: 'Failed to load school counts' }, { status: 500 });
    }

    const counts = new Map<string, number>();
    for (const e of entries as Array<{ institution: string }>) {
      const code = (e.institution || '').toUpperCase();
      counts.set(code, (counts.get(code) || 0) + 1);
    }

    const schools = INSTITUTIONS.map((inst) => ({
      code: inst.code,
      name: inst.name,
      live: inst.live ?? false,
      count: counts.get(inst.code) || 0,
    })).sort((a, b) => b.count - a.count);

    const total = schools.reduce((s, x) => s + x.count, 0);

    return NextResponse.json({ schools, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
