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
      { data: topReferrersData },
      { data: hardestCoursesData },
      { data: recommendationsData },
      { data: waitlistData },
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
        .from('recommendations')
        .select('full_name, recommendation, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabaseAdmin.from('waitlist').select('*').order('created_at', { ascending: false }),
    ]);

    // Aggregate Referrers
    const referrerCounts: Record<string, number> = {};
    topReferrersData?.forEach((r) => {
      if (r.referred_by) {
        referrerCounts[r.referred_by] = (referrerCounts[r.referred_by] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .map(([referral_code, count]) => ({ referral_code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate Hardest Courses
    const courseCounts: Record<string, number> = {};
    hardestCoursesData?.forEach((c) => {
      if (c.hardest_course) {
        const course = c.hardest_course.trim().toUpperCase();
        courseCounts[course] = (courseCounts[course] || 0) + 1;
      }
    });
    const hardestCourses = Object.entries(courseCounts)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      totalSignups: totalSignups || 0,
      todaySignups: todaySignups || 0,
      weekSignups: weekSignups || 0,
      topReferrers,
      hardestCourses,
      recentRecommendations: recommendationsData || [],
      waitlist: waitlistData || [],
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
