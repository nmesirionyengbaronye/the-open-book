import { z } from 'zod';

export const JoinWaitlistSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  whatsapp_number: z.string().regex(/^\+234\d{10}$/, "Invalid Nigerian WhatsApp number (+234 format)"),
  institution: z.string().min(1, "Institution is required"),
  school: z.string().min(1, "School/Faculty required"),
  department: z.string().min(1, "Department is required"),
  level: z.string().min(1, "Level is required"),
  semester: z.string().min(1, "Semester is required"),
  referred_by: z.string().optional(),
  hardest_course: z.string().optional(),
  recommendation: z.string().optional(),
});

export type JoinWaitlistInput = z.infer<typeof JoinWaitlistSchema>;

export function normalizeWhatsApp(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.startsWith("234") && d.length === 13) return "+" + d;
  if (d.startsWith("0") && d.length === 11) return "+234" + d.slice(1);
  if (d.length === 10) return "+234" + d;
  return null;
}

export function isValidNigerianPhone(phone: string): boolean {
  return /^\+234\d{10}$/.test(phone);
}

/**
 * Loose check used to decide whether a lookup value is a phone number or a
 * referral code. Deliberately permissive — `normalizeWhatsApp` does the strict
 * validation afterwards. Single definition; do not re-inline this regex.
 */
export function isLikelyPhone(value: string): boolean {
  return /^\+?\d{10,15}$/.test(value.replace(/\s/g, ''));
}
