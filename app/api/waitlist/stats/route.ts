import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    // Total signups
    const totalResult = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    // Today's signups
    const todayResult = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .gte("created_at", format(new Date(), "yyyy-MM-dd"));

    // This week's signups
    const weekResult = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      );

    // Recent signups (first names only, last 7)
    const recentNamesResult = await supabaseAdmin
      .from("waitlist")
      .select("full_name")
      .order("created_at", { ascending: false })
      .limit(7);

    // All waitlist data for processing
    const allWaitlist = await supabaseAdmin
      .from("waitlist")
      .select("referred_by, hardest_course")
      .limit(10000);

    // Process results
    const total = totalResult.count || 0;
    const today = todayResult.count || 0;
    const week = weekResult.count || 0;

    // Extract first names only for privacy
    const recentNames = (recentNamesResult.data || [])
      .map((item) => item.full_name.split(" ")[0])
      .filter((name, index, self) => index === self.indexOf(name));

    // Format top referrers (manual grouping)
    const referrerMap: Record<string, number> = {};
    (allWaitlist.data || []).forEach((item: any) => {
      if (item.referred_by) {
        referrerMap[item.referred_by] =
          (referrerMap[item.referred_by] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerMap)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Format hardest courses (manual grouping)
    const courseMap: Record<string, number> = {};
    (allWaitlist.data || []).forEach((item: any) => {
      if (item.hardest_course) {
        courseMap[item.hardest_course] =
          (courseMap[item.hardest_course] || 0) + 1;
      }
    });
    const hardestCourses = Object.entries(courseMap)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      total,
      today,
      week,
      recentNames,
      topReferrers,
      hardestCourses,
    });
  } catch (error: any) {
    console.error("Waitlist stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
