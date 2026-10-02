import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidSession } from '@/lib/admin-session';
import { assertCsrf } from '@/lib/csrf';
import { sanitizeText } from '@/lib/sanitize';
import {
  CREATOR_STATUSES,
  CREATOR_TIERS,
  STATUS_META,
  TIER_META,
} from '@/lib/creators';

/**
 * Admin Creator Program management — /api/admin/creators
 *
 *   GET    list every row (applications + outreach rows), newest first
 *   POST   create an outreach row directly (the "found 50 creators" step, which
 *          happens long before anyone fills in the public form)
 *   PATCH  move a row through the pipeline: status, tier, campaign, notes
 *
 * Everything here is behind the admin session guard, and every mutation is
 * behind the CSRF custom-header check, matching app/api/admin/notes.
 */

const SELECT_COLUMNS = `
  id, full_name, whatsapp_number, email, institution, level, department,
  tiktok_handle, instagram_handle, tiktok_followers, instagram_followers, avg_views,
  content_types, why_join, how_promote, promoted_before, promoted_before_detail,
  referred_by, referral_code, status, tier, dm_sent_at, approved_at,
  whatsapp_added_at, campaign, notes, created_at, updated_at
`;

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) return unauthorized();

    const { data, error } = await supabaseAdmin
      .from('creators')
      .select(SELECT_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/creators] fetch failed:', error.message);
      return NextResponse.json(
        {
          error:
            'Could not load creators. If this is a fresh install, run scripts/setup-creators.sql in the Supabase SQL Editor first.',
        },
        { status: 500 }
      );
    }

    const rows = data || [];

    // Funnel counts, computed server-side so the tracker header does not have to
    // recompute them on every filter change.
    const byStatus: Record<string, number> = {};
    for (const s of CREATOR_STATUSES) byStatus[s] = 0;
    const byTier: Record<string, number> = {};
    for (const t of CREATOR_TIERS) byTier[t] = 0;
    let referredCount = 0;

    for (const r of rows as any[]) {
      if (r.status in byStatus) byStatus[r.status]++;
      if (r.tier in byTier) byTier[r.tier]++;
      if (r.referred_by) referredCount++;
    }

    return NextResponse.json({
      creators: rows,
      stats: {
        total: rows.length,
        byStatus,
        byTier,
        referred: referredCount,
      },
      meta: {
        statusMeta: STATUS_META,
        tierMeta: TIER_META,
      },
    });
  } catch (e) {
    console.error('[admin/creators] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

/**
 * Seeded outreach rows. Deliberately loose: a creator found via hashtag search
 * may have only a handle and a follower count, and forcing the full application
 * schema here would mean parking them in a spreadsheet again.
 */
const OutreachSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  tiktok_handle: z.string().trim().min(1).max(40).optional().or(z.literal('')),
  instagram_handle: z.string().trim().max(40).optional().or(z.literal('')),
  tiktok_followers: z.coerce.number().int().min(0).optional(),
  instagram_followers: z.coerce.number().int().min(0).optional(),
  avg_views: z.coerce.number().int().min(0).optional(),
  institution: z.string().trim().max(120).optional().or(z.literal('')),
  content_types: z.array(z.string()).max(10).optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
  status: z.enum(CREATOR_STATUSES).default('discovered'),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) return unauthorized();
    assertCsrf(req);

    const parsed = OutreachSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      return NextResponse.json(
        { error: issue.message, field: issue.path.join('.') },
        { status: 400 }
      );
    }
    const d = parsed.data;

    // An outreach row is not an application, so it has no email and possibly no
    // WhatsApp number yet — which is why those columns are nullable in SQL.
    const { data, error } = await supabaseAdmin
      .from('creators')
      .insert({
        full_name: sanitizeText(d.full_name, 100),
        whatsapp_number: null,
        email: null,
        institution: d.institution ? sanitizeText(d.institution, 120) : null,
        level: null,
        department: null,
        tiktok_handle: d.tiktok_handle ? sanitizeText(d.tiktok_handle, 40) : null,
        instagram_handle: d.instagram_handle ? sanitizeText(d.instagram_handle, 40) : null,
        tiktok_followers: d.tiktok_followers ?? null,
        instagram_followers: d.instagram_followers ?? null,
        avg_views: d.avg_views ?? null,
        content_types: d.content_types ?? [],
        why_join: '',
        how_promote: '',
        promoted_before: false,
        status: d.status,
        tier: 'seed',
        dm_sent_at: d.status === 'dm_sent' ? new Date().toISOString() : null,
        notes: d.notes ? sanitizeText(d.notes, 1000) : null,
      })
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      console.error('[admin/creators] outreach insert failed:', error.message);
      return NextResponse.json({ error: 'Could not save this creator' }, { status: 500 });
    }

    return NextResponse.json({ creator: data });
  } catch (e) {
    console.error('[admin/creators] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

const PatchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(CREATOR_STATUSES).optional(),
  tier: z.enum(CREATOR_TIERS).optional(),
  campaign: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value;
    if (!isValidSession(token)) return unauthorized();
    assertCsrf(req);

    const parsed = PatchSchema.safeParse(await req.json());
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      return NextResponse.json(
        { error: issue.message, field: issue.path.join('.') },
        { status: 400 }
      );
    }
    const { id, status, tier, campaign, notes } = parsed.data;

    // Only send the keys the caller actually changed, so updated_at and the
    // timestamp columns stay truthful.
    const update: Record<string, unknown> = {};
    if (status) {
      update.status = status;
      // Advance the matching milestone exactly once, on the transition.
      if (status === 'dm_sent') update.dm_sent_at = new Date().toISOString();
      if (status === 'approved') update.approved_at = new Date().toISOString();
      if (status === 'whatsapp') update.whatsapp_added_at = new Date().toISOString();
    }
    if (tier) update.tier = tier;
    if (campaign !== undefined) update.campaign = sanitizeText(campaign, 160) || null;
    if (notes !== undefined) update.notes = sanitizeText(notes, 1000) || null;

    const { data, error } = await supabaseAdmin
      .from('creators')
      .update(update)
      .eq('id', id)
      .select(SELECT_COLUMNS)
      .single();

    if (error) {
      console.error('[admin/creators] patch failed:', error.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ creator: data });
  } catch (e) {
    console.error('[admin/creators] server error');
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
