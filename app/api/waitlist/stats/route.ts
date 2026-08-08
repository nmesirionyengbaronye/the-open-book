import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getRankedReferrers } from '@/lib/referral-counts';

export async function GET() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 86400000).toISOString();

    const { count: total, data: entries } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact' });

    const { count: today } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay);

    const { count: week } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek);

    const recent = entries && entries.length > 0
      ? [...(entries || [])]
          .sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at))
          .slice(0, 7)
          .map((e: any) => e.full_name.split(' ')[0])
      : [] as string[];

    const { data: all } = await supabaseAdmin.from('waitlist').select('referral_code');

    // Canonical leaderboard — same board the rewards leaderboard and rank use,
    // so the homepage can never show a different order or different numbers.
    const board = await getRankedReferrers();
    const topReferrers = board.slice(0, 10).map((r) => ({
      code: r.referralCode,
      name: (r.fullName || r.referralCode).split(' ')[0],
      count: r.count,
    }));

    // Real referral total: people who joined via someone's link. Previously the
    // contest UI displayed `total` (the whole waitlist) as "total referrals".
    const { count: totalReferrals } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .not('referred_by', 'is', null);

    const { data: hardest } = await supabaseAdmin.from('waitlist').select('hardest_course');
    const courseCounts = new Map<string, number>();
    (hardest || []).forEach((e: any) => {
      if (e.hardest_course) {
        courseCounts.set(e.hardest_course, (courseCounts.get(e.hardest_course) || 0) + 1);
      }
    });
    const hardestCourses = [...courseCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) as any[];

    const dailyData = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 86400000);
      const label = `${day.getDate()}/${day.getMonth() + 1}`;
      const dateStr = day.toISOString().split('T')[0];
      const count = (entries || []).filter((e: any) => {
        const d = new Date(e.created_at);
        return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getFullYear() === day.getFullYear();
      }).length;
      dailyData.push({ label, signups: count });
    }

    return NextResponse.json({
      total: total || 0,
      totalReferrals: totalReferrals || 0,
      today: today || 0,
      week: week || 0,
      recentNames: recent,
      topReferrers,
      hardestCourses,
      dailyData,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}