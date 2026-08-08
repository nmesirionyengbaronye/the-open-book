/**
 * Shared app-wide links and copy.
 *
 * Keep single-sourced values here rather than re-declaring them per component —
 * WHATSAPP_URL previously existed in both JoinForm.tsx and ReferralDashboard.tsx.
 */

export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || 'https://chat.whatsapp.com/UniUICommunity';
