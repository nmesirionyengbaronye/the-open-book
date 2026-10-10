/**
 * Waitlist Ecosystem v2: Institution + Family sign-up support.
 *
 * This module is the single source of truth for:
 *  - waitlist type values
 *  - Nigeria state list (for the institution form dropdown)
 *  - role / relationship / interest options
 *  - Zod validation schemas for the institution and family endpoints
 *
 * The public form components live in components/, the API routes in
 * app/api/waitlist/*. Each route imports its schema from here so the
 * form and the server never disagree on what a valid row looks like.
 */
import { z } from 'zod';
import { normalizeWhatsApp } from './validation';
import { sanitizeText } from './sanitize';

export const WAITLIST_TYPES = ['student', 'creator', 'institution', 'family'] as const;
export type WaitlistType = (typeof WAITLIST_TYPES)[number];

// ---------------------------------------------------------------------------
// Institution waitlist options
// ---------------------------------------------------------------------------
export const INSTITUTION_TYPES = ['University', 'Polytechnic', 'College of Education'] as const;
export type InstitutionType = (typeof INSTITUTION_TYPES)[number];

export const OWNERSHIP_TYPES = ['Federal', 'State', 'Private'] as const;
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];

export const INSTITUTION_ROLES = ['Vice-Chancellor', 'Registrar', 'DVC', 'Dean', 'HOD', 'ICT Director', 'Other'] as const;
export type InstitutionRole = (typeof INSTITUTION_ROLES)[number];

export const INSTITUTION_INTERESTS = [
  'Student analytics',
  'Curriculum insights',
  'Communication tools',
  'Research collaboration',
  'All of the above',
] as const;

export const INSTITUTION_SIZES = ['Under 5,000', '5,000 - 20,000', '20,000 - 50,000', '50,000+'] as const;

/** All 36 states + FCT, for the dropdown. */
export const NIGERIAN_STATES: string[] = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory (FCT)',
];

// ---------------------------------------------------------------------------
// Family / parent waitlist options
// ---------------------------------------------------------------------------
export const FAMILY_RELATIONSHIPS = ['Mother', 'Father', 'Guardian', 'Sibling', 'Other'] as const;

export const FAMILY_CHILD_STATUS = [
  'Yes, they are a current student',
  'No, not yet',
  "I'm not sure",
] as const;

/** [1 child, 2 children, 3 or more] → stored as 1, 2, 3. */
export const FAMILY_CHILD_COUNTS = [1, 2, 3] as const;

export const FAMILY_INTERESTS = [
  'Academic progress',
  'Fee payments',
  'Emergency updates',
  'All of the above',
] as const;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
/** Official institutional email must end in .edu.ng */
export const isOfficialInstitutionalEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.edu\.ng$/i.test(email.trim());

/** Normalise + validate a Nigerian WhatsApp/phone number. */
export const normalizePhone = (input: string): string | null => {
  const n = normalizeWhatsApp(input);
  return /^[+]234\d{10}$/.test(n ?? '') ? n : null;
};

const phoneField = z
  .string()
  .transform((v) => normalizePhone(v) ?? '')
  .refine((v) => /^\+234\d{10}$/.test(v), {
    message: 'Use a valid Nigerian number (e.g. 0801 234 5678).',
  });

// ---------------------------------------------------------------------------
// Institution waitlist schema
// ---------------------------------------------------------------------------
export const InstitutionWaitlistSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Your name is required (at least 2 characters).')
    .max(100, 'Name is too long.')
    .transform((s) => s.replace(/<[^>]*>/g, '')),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((s) => isOfficialInstitutionalEmail(s), {
      message: 'Use your official institutional email (ending in .edu.ng).',
    }),
  whatsapp_number: phoneField,
  organization_name: z
    .string()
    .trim()
    .min(2, 'Institution name is required.')
    .max(160, 'Institution name is too long.'),
  organization_type: z.enum([...INSTITUTION_TYPES], {
    invalid_type_error: 'Pick a type: University, Polytechnic, or College of Education.',
  }),
  ownership: z.enum([...OWNERSHIP_TYPES], {
    invalid_type_error: 'Pick an ownership type.',
  }),
  state: z.string().trim().min(1, 'State is required.'),
  role: z.string().trim().min(1, 'Your role is required.'),
  role_other: z.string().trim().optional().or(z.literal('')),
  interests: z
    .array(z.enum([...INSTITUTION_INTERESTS]))
    .optional()
    .transform((arr) => arr ?? []),
  institution_size: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
});

export type InstitutionWaitlistInput = z.infer<typeof InstitutionWaitlistSchema>;

// ---------------------------------------------------------------------------
// Family waitlist schema
// ---------------------------------------------------------------------------
export const FamilyWaitlistSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Your name is required (at least 2 characters).')
    .max(100, 'Name is too long.')
    .transform((s) => s.replace(/<[^>]*>/g, '')),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address.')
    .max(160, 'Email is too long.'),
  whatsapp_number: phoneField,
  relationship: z.enum([...FAMILY_RELATIONSHIPS], {
    invalid_type_error: 'Tell us your relationship to the student.',
  }),
  relationship_other: z.string().trim().optional().or(z.literal('')),
  child_status: z.enum([...FAMILY_CHILD_STATUS], {
    invalid_type_error: 'Let us know whether your child is already on Uni UI.',
  }),
  child_detail: z.string().trim().max(120, 'Too long.').optional().or(z.literal('')),
  child_count: z.enum(['1', '2', '3']).transform((n) => Number(n)),
  interests: z
    .array(z.enum([...FAMILY_INTERESTS]))
    .optional()
    .transform((arr) => arr ?? []),
});

export type FamilyWaitlistInput = z.infer<typeof FamilyWaitlistSchema>;

// ---------------------------------------------------------------------------
// Server-side sanitization map used by both API routes.
// ---------------------------------------------------------------------------
export function sanitizeInstitutionRow(data: InstitutionWaitlistInput) {
  const roleValue = data.role === 'Other' && data.role_other
    ? data.role_other.trim()
    : data.role;
  return {
    full_name: sanitizeText(data.full_name, 100),
    email: data.email,
    whatsapp_number: data.whatsapp_number,
    organization_name: sanitizeText(data.organization_name, 160),
    organization_type: data.organization_type,
    ownership: data.ownership,
    state: sanitizeText(data.state, 80),
    role: sanitizeText(roleValue, 60),
    interests: data.interests,
    institution_size: data.institution_size || null,
  };
}

export function sanitizeFamilyRow(data: FamilyWaitlistInput) {
  const relValue = data.relationship === 'Other' && data.relationship_other
    ? data.relationship_other.trim()
    : data.relationship;
  const child_linked = data.child_status === FAMILY_CHILD_STATUS[0];
  return {
    full_name: sanitizeText(data.full_name, 100),
    email: data.email,
    whatsapp_number: data.whatsapp_number,
    relationship: sanitizeText(relValue, 60),
    child_count: data.child_count,
    child_linked,
    child_detail: data.child_detail ? sanitizeText(data.child_detail, 120) : null,
    interests: data.interests,
  };
}
