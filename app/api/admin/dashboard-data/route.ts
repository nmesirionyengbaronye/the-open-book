import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      { count: totalSignups },
      { count: todaySignups },
      { count: weekSignups },
      { data: topReferrers },
      { data: hardestCourses },
      { data: recentRecommendations },
      { data: waitlist },
    ] = await Promise.all([
      supabaseAdmin.from('waitlist').select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
      supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin
        .from('waitlist')
        .select('referred_by')
        .not('referred_by', 'is', null),
      supabaseAdmin
        .from('waitlist')
        .select('hardest_course')
        .not('hardest_course', 'is', null)
        .neq('hardest_course', ''),
      supabaseAdmin
        .from('waitlist')
        .select('full_name, recommendation, created_at')
        .not('recommendation', 'is', null)
        .neq('recommendation', '')
        .order('created_at', { ascending: false })
        .limit(20),
      supabaseAdmin.from('waitlist').select('*').order('created_at', { ascending: false }),
    ]);

    const referrerCounts: Record<string, number> = {};
    topReferrers?.forEach((r) => {
      if (r.referred_by) {
        referrerCounts[r.referred_by] = (referrerCounts[r.referred_by] || 0) + 1;
      }
    });
    const topReferrersArray = Object.entries(referrerCounts)
      .map(([referral_code, count]) => ({ referral_code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const courseCounts: Record<string, number> = {};
    hardestCourses?.forEach((c) => {
      if (c.hardest_course) {
        courseCounts[c.hardest_course] = (courseCounts[c.hardest_course] || 0) + 1;
      }
    });
    const hardestCoursesArray = Object.entries(courseCounts)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalSignups: totalSignups || 0,
      todaySignups: todaySignups || 0,
      weekSignups: weekSignups || 0,
      topReferrers: topReferrersArray,
      hardestCourses: hardestCoursesArray,
      recentRecommendations: recentRecommendations || [],
      waitlist: waitlist || [],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}