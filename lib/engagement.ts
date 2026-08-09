import { supabaseAdmin } from '@/lib/supabase';

/**
 * Engagement utilities: streaks, milestones, badges, recaps, and notifications.
 */

const STREAK_REMINDER_HOURS = 24;
const LINK_EXPIRY_DAYS = 30;
const RECAPTCHA_WINDOW_DAYS = 7;

export async function touchUser(userId: string): Promise<void> {
  await supabaseAdmin
    .from('waitlist')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', userId);
}

export async function getStreak(userId: string): Promise<{ current: number; longest: number }> {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('current_streak, longest_streak, last_active_at')
    .eq('id', userId)
    .maybeSingle();

  return {
    current: data?.current_streak || 0,
    longest: data?.longest_streak || 0,
  };
}

export async function recordStreak(userId: string): Promise<{ current: number; longest: number; isNew: boolean }> {
  const { data: user } = await supabaseAdmin
    .from('waitlist')
    .select('current_streak, longest_streak, last_active_at')
    .eq('id', userId)
    .maybeSingle();

  const now = new Date();
  const lastActive = user?.last_active_at ? new Date(user.last_active_at) : null;
  const current = user?.current_streak || 0;
  const longest = user?.longest_streak || 0;

  let nextCurrent = current;
  let isNew = false;

  if (!lastActive) {
    nextCurrent = 1;
    isNew = true;
  } else {
    const hoursSince = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    if (hoursSince <= 24) {
      nextCurrent = current + 1;
      isNew = true;
    } else if (hoursSince > 24 && hoursSince <= 48) {
      nextCurrent = 1;
    } else {
      nextCurrent = 1;
    }
  }

  const nextLongest = Math.max(longest, nextCurrent);

  await supabaseAdmin
    .from('waitlist')
    .update({
      current_streak: nextCurrent,
      longest_streak: nextLongest,
      last_active_at: now.toISOString(),
    })
    .eq('id', userId);

  return { current: nextCurrent, longest: nextLongest, isNew };
}

export async function getMilestoneCelebrations(userId: string): Promise<number[]> {
  const { data } = await supabaseAdmin
    .from('milestone_celebrations')
    .select('milestone')
    .eq('user_id', userId);

  return (data || []).map((r: any) => r.milestone);
}

export async function celebrateMilestone(userId: string, milestone: number): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('milestone_celebrations')
    .insert({ user_id: userId, milestone })
    .select()
    .single();

  if (error) return false;

  // Award bonus tokens/spins for milestone celebration
  const bonusSpins = milestone >= 35 ? 5 : milestone >= 21 ? 3 : 1;
  try {
    await supabaseAdmin.rpc('increment_spin_tickets', {
      p_user_id: userId,
      p_delta: bonusSpins,
    });
  } catch {
    // ignore missing RPC
  }

  return true;
}

export async function getUserBadges(userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('user_badges')
    .select('badge_key')
    .eq('user_id', userId)
    .order('earned_at', { ascending: true });

  return (data || []).map((r: any) => r.badge_key);
}

export async function awardBadge(userId: string, badgeKey: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('user_badges')
    .insert({ user_id: userId, badge_key: badgeKey })
    .select()
    .single();

  return !error;
}

export function getBadgeConfig(badgeKey: string): { label: string; emoji: string; color: string } {
  const badges: Record<string, { label: string; emoji: string; color: string }> = {
    first_join: { label: 'Early Bird', emoji: '🐦', color: '#D4AF37' },
    first_referral: { label: 'Networker', emoji: '🤝', color: '#4ade80' },
    five_referrals: { label: 'Influencer', emoji: '⭐', color: '#facc15' },
    ten_referrals: { label: 'Super Connector', emoji: '🔥', color: '#f97316' },
    fifteen_referrals: { label: 'Ambassador', emoji: '🏆', color: '#D4AF37' },
    twenty_referrals: { label: 'Champion', emoji: '👑', color: '#a855f7' },
    telegram_verified: { label: 'Verified', emoji: '✓', color: '#22c55e' },
    streak_3: { label: '3-Day Streak', emoji: '🔥', color: '#ef4444' },
    streak_7: { label: 'Weekly Regular', emoji: '📅', color: '#3b82f6' },
    box_opener: { label: 'Box Opener', emoji: '📦', color: '#ec4899' },
    spinner: { label: 'Lucky Spinner', emoji: '🎰', color: '#eab308' },
    winner: { label: 'Winner', emoji: '💰', color: '#10b981' },
  };

  return badges[badgeKey] || { label: badgeKey, emoji: '🎖️', color: '#D4AF37' };
}

export async function getReferralLinkExpiry(userId: string): Promise<Date | null> {
  const { data } = await supabaseAdmin
    .from('waitlist')
    .select('referral_link_expires_at')
    .eq('id', userId)
    .maybeSingle();

  return data?.referral_link_expires_at ? new Date(data.referral_link_expires_at) : null;
}

export async function setReferralLinkExpiry(userId: string, days = LINK_EXPIRY_DAYS): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  await supabaseAdmin
    .from('waitlist')
    .update({ referral_link_expires_at: expiresAt.toISOString() })
    .eq('id', userId);
}

export function isLinkExpiringSoon(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 7 && days > 0;
}

export function isLinkExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}
