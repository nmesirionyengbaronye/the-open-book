import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Verify session in database
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('token', sessionToken)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired session
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('token', sessionToken);

      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    // Get admin user info
    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name')
      .eq('id', session.admin_id)
      .single();

    if (userError || !adminUser) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name
      }
    });
  } catch (error: any) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}