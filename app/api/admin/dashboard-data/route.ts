import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    // Total users
    const totalUsers = await supabaseAdmin.from('waitlist').select('*', { count: 'exact', head: true });
    
    // Today's users
    const todayUsers = await supabaseAdmin.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', format(new Date(), 'yyyy-MM-dd'));
    
    // This week's users
    const weekUsers = await supabaseAdmin.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', format(startOfWeek(new Date()), 'yyyy-MM-dd'));
    
    // This month's users
    const monthUsers = await supabaseAdmin.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    
    // Level distribution - use RPC or count manually
    const level200 = await supabaseAdmin.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('level', '200');
    const level300 = await supabaseAdmin.from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('level', '300');
    
    // Institution distribution (top 10)
    const institutionStats = await supabaseAdmin.from('waitlist')
      .select('institution')
      .order('created_at', { ascending: false })
      .limit(1000);
    
    // Recent signups (last 10)
    const recentUsers = await supabaseAdmin.from('waitlist')
      .select('full_name, institution, level, semester, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Hourly signup data for last 24 hours
    const hourlySignupData = await supabaseAdmin.from('waitlist')
      .select('created_at')
      .gte('created_at', format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'))
      .order('created_at', { ascending: true });

    // Process results
    const total = totalUsers.count || 0;
    const today = todayUsers.count || 0;
    const week = weekUsers.count || 0;
    const month = monthUsers.count || 0;
    
    // Level stats
    const levelStatsObj = { '200': level200.count || 0, '300': level300.count || 0 };
    
    // Institution stats (manual grouping)
    const institutionMap: Record<string, number> = {};
    (institutionStats.data || []).forEach((item: any) => {
      const inst = item.institution;
      if (inst) institutionMap[inst] = (institutionMap[inst] || 0) + 1;
    });
    const institutionStatsObj = Object.entries(institutionMap)
      .map(([institution, count]) => ({ institution, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Semester stats (manual from full data)
    const fullWaitlist = await supabaseAdmin.from('waitlist')
      .select('semester')
      .limit(10000);
    const semesterStatsObj: Record<string, number> = { '1st': 0, '2nd': 0 };
    (fullWaitlist.data || []).forEach((item: any) => {
      const sem = item.semester;
      if (sem && semesterStatsObj.hasOwnProperty(sem)) {
        semesterStatsObj[sem]++;
      }
    });
    
    // Recent users
    const recentUsersArray = (recentUsers.data || []).map((user: any) => ({
      fullName: user.full_name,
      institution: user.institution,
      level: user.level,
      semester: user.semester,
      joinedAt: user.created_at
    }));
    
    // Hourly signup data
    const hourlyMap: Record<string, number> = {};
    (hourlySignupData.data || []).forEach((user: any) => {
      const date = new Date(user.created_at);
      const hourKey = date.toISOString().slice(0, 13);
      hourlyMap[hourKey] = (hourlyMap[hourKey] || 0) + 1;
    });
    
    const hourlyData = Object.keys(hourlyMap).map(hour => ({
      hour,
      signups: hourlyMap[hour]
    })).sort((a, b) => a.hour.localeCompare(b.hour));

    return NextResponse.json({
      stats: { totalUsers: total, todayUsers: today, weekUsers: week, monthUsers: month },
      levelStats: levelStatsObj,
      institutionStats: institutionStatsObj,
      semesterStats: semesterStatsObj,
      recentUsers: recentUsersArray,
      hourlySignupData: hourlyData
    });
  } catch (error: any) {
    console.error('Admin dashboard data error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}