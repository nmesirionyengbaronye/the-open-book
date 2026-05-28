'use client';

import React, { useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { normalizeWhatsApp, isValidNigerianPhone } from '@/lib/validation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppBubble from '@/components/WhatsAppBubble';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://waitlist.uniui.com.ng';

function RetrieveForm({ whatsappNumberParam }: { whatsappNumberParam: string }) {
  const [whatsappNumber, setWhatsAppNumber] = useState(whatsappNumberParam);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ referralCode: string; position: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp number');
      return;
    }

    if (!isValidNigerianPhone(whatsappNumber)) {
      setErrorMessage('Please enter a valid Nigerian WhatsApp number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const normalized = normalizeWhatsApp(whatsappNumber);

      if (attempts >= 3) {
        throw new Error('RATE_LIMIT');
      }

      const { data, error: dbErr } = await supabaseClient
        .from('waitlist')
        .select('referral_code, position')
        .eq('whatsapp_number', normalized)
        .single();

      if (dbErr) {
        if (dbErr.code === 'PGRST116') {
          throw new Error('NOT_FOUND');
        }
        throw dbErr;
      }

      if (data) {
        setResult({
          referralCode: data.referral_code,
          position: data.position
        });
        setErrorMessage('');
      } else {
        throw new Error('NOT_FOUND');
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message === 'NOT_FOUND') {
        setErrorMessage('No record found for this WhatsApp number. Please check the number and try again.');
      } else if (error.message === 'RATE_LIMIT') {
        setErrorMessage('Too many attempts. Please try again later or contact support.');
        setTimeout(() => {
          setAttempts(0);
        }, 60000);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      console.error('Retrieve error:', error);
    } finally {
      setIsSubmitting(false);
      if (!errorMessage) {
        setAttempts(prev => prev + 1);
      }
    }
  };

  const handleReset = () => {
    setWhatsAppNumber('');
    setResult(null);
    setErrorMessage('');
    setAttempts(0);
  };

  const copyReferralCode = () => {
    if (result) {
      navigator.clipboard.writeText(result.referralCode);
    }
  };

  const copyReferralLink = () => {
    if (result) {
      navigator.clipboard.writeText(`${SITE_URL}/join?ref=${result.referralCode}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <span className="text-[#D4AF37] font-bold text-xl">Search</span>
            </div>
            <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">Retrieve Your Uni UI Link</h2>
            <p className="text-lg text-gray-300 mb-6">Enter your WhatsApp number to get your referral link and current position</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                placeholder="+234 XXX XXX XXXX"
                className="w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                disabled={isSubmitting}
              />
              {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
              {!isValidNigerianPhone(whatsappNumber) && whatsappNumber && <p className="text-xs text-red-500 mt-1">Please enter a valid Nigerian WhatsApp number (e.g., +234 803 123 4567)</p>}
              <p className="text-xs text-gray-500 mt-2">This is the same number you used when joining the waitlist</p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#13131A] text-[#D4AF37] font-medium rounded-lg hover:bg-[#13131A]/50 transition-colors"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !whatsappNumber.trim()}
                className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Searching...' : 'Retrieve Link'}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-8 p-6 bg-[#13131A] rounded-xl border border-[#D4AF37]/20 space-y-5">
              <div className="text-center">
                <h3 className="font-heading text-lg text-[#D4AF37] mb-4">Here's Your Uni UI Information</h3>
                <p className="text-gray-400">Use this information to access the waitlist and share with friends</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">#{result.position}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg">Your Position</h3>
                    <p className="text-gray-400">You are currently position #{result.position} on the waitlist</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#D4AF37] font-bold">Key</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg">Your Referral Code</h3>
                    <p className="text-gray-400">Share this code with friends to move up the waitlist</p>
                    <div className="mt-2 flex items-center space-x-3">
                      <input
                        type="text"
                        value={result.referralCode}
                        readOnly
                        className="flex-1 px-3 py-2 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                      <button
                        onClick={copyReferralCode}
                        className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#FFD700] transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-[#D4AF37] rounded-full"></div>
                    <span className="text-white font-medium">Your referral link:</span>
                    <div className="flex-1 px-3 py-2 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-center font-mono">
                      {SITE_URL}/join?ref={result.referralCode}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={copyReferralLink}
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#FFD700] transition-colors"
                    >
                      Share Referral Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {attempts >= 2 && (
            <div className="mt-6 p-4 bg-[#EF4444]/20 rounded-lg border border-[#EF4444]/30">
              <p className="text-sm text-red-400">Warning: You have {attempts}/3 attempts remaining before temporary lockout</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const whatsappNumberParam = searchParams.get('whatsapp_number') || '';
  return <RetrieveForm whatsappNumberParam={whatsappNumberParam} />;
}

export default function RetrievePage() {
  return (
    <React.Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-[#D4AF37]/50 border-t-[#D4AF37]"></div>
            <p className="text-[#D4AF37]">Loading...</p>
          </div>
        </div>
        <Footer />
        <WhatsAppBubble />
      </>
    }>
      <SearchParamsWrapper />
    </React.Suspense>
  );
}