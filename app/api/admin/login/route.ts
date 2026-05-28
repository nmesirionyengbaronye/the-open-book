import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 },
      );
    }

    // Find admin user by username
    const { data: adminUser, error: fetchError } = await supabaseAdmin
      .from("admin_users")
      .select("id, username, password_hash")
      .eq("username", username)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        // User not found
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 },
        );
      }
      throw fetchError;
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      adminUser.password_hash,
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Create session token
    const sessionToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store session in database
    const { error: sessionError } = await supabaseAdmin
      .from("admin_sessions")
      .insert({
        admin_id: adminUser.id,
        token: sessionToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

    if (sessionError) {
      throw sessionError;
    }

    // Set cookie
    const response = NextResponse.json(
      { success: true, message: "Logged in successfully" },
      { status: 200 },
    );

    // Set httpOnly cookie
    response.headers.set(
      "Set-Cookie",
      `admin_session=${sessionToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict`,
    );

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
