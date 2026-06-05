import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const importSchema = z.array(z.object({
  whatsapp_number: z.string().trim().min(5),
  full_name: z.string().trim().min(2),
  institution: z.string().trim(),
  school_code: z.string().trim(),
  department_code: z.string().trim(),
  level: z.string().trim(),
  semester: z.string().trim(),
  referral_code: z.string().trim(),
  referred_by: z.string().trim().nullable().optional(),
  position: z.number().int().optional(),
  hardest_course: z.string().trim().nullable().optional(),
}));

/**
 * Bulk Import API for Admin Management.
 * Processes an array of waitlist entries for batch insertion.
 * Validates each row and handles collisions gracefully.
 */
export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get('admin_session');
    if (session?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { entries } = await request.json();

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'Valid entries array is required' }, { status: 400 });
    }

    const parsed = importSchema.safeParse(entries);
    if (!parsed.success) {
      return NextResponse.json({ error: `Validation failed: ${parsed.error.errors[0].message}` }, { status: 400 });
    }

    // Use upsert to handle existing records or insert new ones
    // We target whatsapp_number as the resolution key
    const { data, error } = await supabaseAdmin
      .from('waitlist')
      .upsert(parsed.data, { onConflict: 'whatsapp_number' });

    if (error) {
      console.error('[AdminImport] Database Error:', error);
      return NextResponse.json({ error: 'Bulk import failed. Check console for details.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: parsed.data.length });
  } catch (e) {
    console.error('[AdminImport] Unhandled Exception:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
