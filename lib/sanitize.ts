/**
 * Input sanitization utilities for user-facing fields.
 *
 * These helpers reduce SQL injection and XSS risk from user input before it
 * reaches queries or JSON responses. They are defensive, not a substitute for
 * parameterized queries / ORM usage.
 */

/** Strip control characters and trim. */
export function sanitizeText(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.replace(/[\x00-\x1F\x7F]+/g, '').trim();
  return trimmed.slice(0, maxLength);
}

/** Allow only safe filename chars. */
export function sanitizeFilename(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9_\-\.]+/g, '_').slice(0, 100);
}

/** Allow only alphanumeric plus limited symbols. */
export function sanitizeAlphanumeric(input: unknown, maxLength = 100): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[^a-zA-Z0-9 ,.\-_/]+/g, '').slice(0, maxLength);
}

/** Remove SQL comment and quote patterns. */
export function sanitizeLike(input: unknown, maxLength = 120): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/['"\\]/g, '')
    .trim()
    .slice(0, maxLength);
}

/** Light HTML escape for echoing user content back. */
export function escapeHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
