export function normalizeWhatsApp(number: string): string {
  let cleaned = number.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+234')) {
    return cleaned;
  } else if (cleaned.startsWith('234')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+234' + cleaned.slice(1);
  }
  return '+234' + cleaned;
}

export function isValidNigerianPhone(number: string): boolean {
  const normalized = normalizeWhatsApp(number);
  return /^\+234[7-9]\d{9}$/.test(normalized);
}