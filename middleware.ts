import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get("admin_session");

    // If no cookie, redirect to login
    if (!cookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Validate session with database
    try {
      const { data: session, error } = await supabaseAdmin
        .from("admin_sessions")
        .select("admin_id, expires_at")
        .eq("token", cookie.value)
        .single();

      if (error || !session) {
        // Invalid session, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }

      // Check if session is expired
      const expiresAt = new Date(session.expires_at);
      if (expiresAt < new Date()) {
        // Delete expired session
        await supabaseAdmin
          .from("admin_sessions")
          .delete()
          .eq("token", cookie.value);

        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }

      // Session is valid, continue
      return NextResponse.next();
    } catch (error) {
      // On error, redirect to login for safety
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
