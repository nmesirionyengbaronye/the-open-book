import { describe, it, expect } from 'vitest';
import { normalizeWhatsApp, isValidNigerianPhone } from './validation';

describe('normalizeWhatsApp', () => {
  it('should normalize numbers starting with +234', () => {
    expect(normalizeWhatsApp('+2348012345678')).toBe('+2348012345678');
    expect(normalizeWhatsApp('+234 801 234 5678')).toBe('+2348012345678');
    expect(normalizeWhatsApp('+234-801-234-5678')).toBe('+2348012345678');
  });

  it('should normalize numbers starting with 234', () => {
    expect(normalizeWhatsApp('2348012345678')).toBe('+2348012345678');
  });

  it('should normalize numbers starting with 0', () => {
    expect(normalizeWhatsApp('08012345678')).toBe('+2348012345678');
    expect(normalizeWhatsApp('0 801 234 5678')).toBe('+2348012345678');
  });

  it('should add +234 prefix to numbers without country code', () => {
    expect(normalizeWhatsApp('8012345678')).toBe('+2348012345678');
  });
});

describe('isValidNigerianPhone', () => {
  it('should return true for valid Nigerian phone numbers', () => {
    expect(isValidNigerianPhone('+2348012345678')).toBe(true);
    expect(isValidNigerianPhone('+2349012345678')).toBe(true);
    expect(isValidNigerianPhone('+2347012345678')).toBe(true);
  });

  it('should return false for invalid Nigerian phone numbers', () => {
    expect(isValidNigerianPhone('+2346012345678')).toBe(false);
    expect(isValidNigerianPhone('+23412345678')).toBe(false);
    expect(isValidNigerianPhone('1234567890')).toBe(false);
    expect(isValidNigerianPhone('')).toBe(false);
  });
});