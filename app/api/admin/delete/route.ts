import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * DELETE API for Admin Management.
 * Allows authenticated admins to remove a specific signup from the waitlist.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { whatsapp_number } = await request.json();

    if (!whatsapp_number) {
      return NextResponse.json({ error: 'WhatsApp number is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('waitlist')
      .delete()
      .eq('whatsapp_number', whatsapp_number);

    if (error) {
      console.error('[AdminDelete] Error:', error);
      return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[AdminDelete] Unhandled Exception:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
