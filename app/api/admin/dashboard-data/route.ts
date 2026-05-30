import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token');
    if (token?.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count: total } = await supabaseAdmin.from('waitlist').select('*', { count: 'exact', head: true });
    
    const { data: topReferrers } = await supabaseAdmin
      .from('waitlist')
      .select('full_name, referral_code')
      .order('position', { ascending: true })
      .limit(10);

    const { data: hardestCourses } = await supabaseAdmin
      .from('waitlist')
      .select('hardest_course')
      .not('hardest_course', 'is', null)
      .limit(5);

    const { data: recommendations } = await supabaseAdmin
      .from('waitlist')
      .select('recommendation')
      .not('recommendation', 'is', null)
      .limit(5);

    const { data: entries } = await supabaseAdmin
      .from('waitlist')
      .select('full_name, institution, whatsapp_number, position, created_at')
      .order('position', { ascending: true });

    return NextResponse.json({
      total,
      topReferrers,
      hardestCourses,
      recommendations,
      entries,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}