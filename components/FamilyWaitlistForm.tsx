'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  AlertCircle,
  ArrowRight,
  Loader2,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { normalizePhone } from '@/lib/waitlist-types';
import {
  FAMILY_RELATIONSHIPS,
  FAMILY_CHILD_STATUS,
  FAMILY_CHILD_COUNTS,
  FAMILY_INTERESTS,
} from '@/lib/waitlist-types';

const inputCls =
  'mt-1 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-black/50 focus:outline-none focus:border-black/40 transition';

type FormState = {
  full_name: string;
  email: string;
  whatsapp: string;
  relationship: string;
  relationship_other: string;
  child_status: string;
  child_detail: string;
  child_count: string;
  interests: string[];
  consent: boolean;
};

export function FamilyWaitlistForm() {
  const [form, setForm] = useState<FormState>({
    full_name: '',
    email: '',
    whatsapp: '',
    relationship: '',
    relationship_other: '',
    child_status: '',
    child_detail: '',
    child_count: '',
    interests: [],
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fullName: string; position: number } | null>(null);

  const normalizedPhone = useMemo(() => normalizePhone(form.whatsapp), [form.whatsapp]);
  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(form.email.trim()), [form.email]);
  const wantsChildDetail = form.child_status === FAMILY_CHILD_STATUS[0];

  const canSubmit =
    form.full_name.trim().length >= 2 &&
    emailOk &&
    !!normalizedPhone &&
    !!form.relationship &&
    (form.relationship !== 'Other' || form.relationship_other.trim().length >= 2) &&
    !!form.child_status &&
    (form.child_status !== FAMILY_CHILD_STATUS[0] || form.child_detail.trim().length >= 1) &&
    !!form.child_count &&
    form.consent;

  const toggleInterest = (i: string) =>
    setForm((p) => ({
      ...p,
      interests: p.interests.includes(i) ? p.interests.filter((x) => x !== i) : [...p.interests, i],
    }));

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    (document.activeElement as HTMLElement)?.blur();

    const payload: Record<string, unknown> = {
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      whatsapp_number: form.whatsapp.trim(),
      relationship: form.relationship === 'Other' ? form.relationship_other.trim() : form.relationship,
      child_status: form.child_status,
      child_detail: form.child_detail.trim() || null,
      child_count: form.child_count,
      interests: form.interests,
    };

    if (!navigator.onLine) {
      toast.error('You are offline', { description: 'Please reconnect and try again.' });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/waitlist/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitting(false);

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          toast.error('Already registered', {
            description: err.error || 'You are already on the family waitlist.',
            id: 'fam-duplicate',
          });
        } else {
          toast.error('Submission failed', { description: err.error || 'Please try again.', id: 'fam-error' });
        }
        setError(err.error || 'Submission failed');
        return;
      }

      const data = await res.json();
      toast.success('You are on the family waitlist!', { id: 'fam-success' });
      setResult({ fullName: form.full_name.trim(), position: data.position });
    } catch {
      setSubmitting(false);
      setError('Network error. Please try again.');
      toast.error('Network error', { id: 'fam-network' });
    }
  };

  if (result) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/families` : '/families';
    const shareText = `Uni UI family accounts let parents track their child's progress and pay fees in one place. I just joined the waitlist (${result.position}). Join me: ${url}`;
    return (
      <section id="fam-join" className="py-20 px-5">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-8 text-center border border-black/10 bg-black/5 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFD93D] text-black grid place-items-center">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="mt-5 text-2xl font-display font-bold">
              You&apos;re on the family waitlist, {result.fullName.split(' ')[0]}.
            </h3>
            <p className="mt-3 text-black/70 text-sm">
              We&apos;ll email you onboarding details when family accounts open. If your child is already on Uni UI, we&apos;ll connect you (with their consent).
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-black/10 bg-black/5 p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-black/70">Your queue position</div>
                <div className="mt-1 text-3xl font-display font-bold text-[#FFD93D]">#{result.position}</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-black/5 p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-black/70">Family plans start at</div>
                <div className="mt-1 text-3xl font-display font-bold text-black">₦5,000/mo</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  const text = encodeURIComponent(shareText);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-[#FFD93D] text-black font-semibold"
              >
                <Share2 className="w-4 h-4" /> Tell another parent
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-black/10 bg-black/5 text-black font-medium hover:bg-black/10"
              >
                Back to home
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="fam-join" className="py-24 px-5">
      <div className="max-w-3xl mx-auto">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl border border-red-600/20 bg-red-600/5 p-4 flex items-start gap-3 text-sm text-red-700"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>{error}</div>
          </motion.div>
        )}

        <div className="space-y-5">
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Your name *</span>
            <input
              value={form.full_name}
              onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="Chioma Okafor"
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Your email *</span>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className={inputCls}
              />
              {form.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailOk ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              )}
            </div>
            {form.email && !emailOk && (
              <p className="mt-1.5 text-xs text-red-600">Enter a valid email address.</p>
            )}
          </label>

          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Phone number (WhatsApp) *</span>
            <div className="relative">
              <input
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="080 1234 5678"
                inputMode="tel"
                className={inputCls}
              />
              {form.whatsapp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {normalizedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              )}
            </div>
            {form.whatsapp && !normalizedPhone && (
              <p className="mt-1.5 text-xs text-red-600">Use a valid Nigerian number (e.g. 0801 234 5678).</p>
            )}
            {normalizedPhone && (
              <p className="mt-1.5 text-xs text-emerald-600">Looks good — {normalizedPhone}</p>
            )}
          </label>

          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Relationship to student *</span>
            <div className="flex flex-wrap gap-3">
              {FAMILY_RELATIONSHIPS.map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="relationship"
                    value={r}
                    checked={form.relationship === r}
                    onChange={(e) => setForm((p) => ({ ...p, relationship: e.target.value, relationship_other: '' }))}
                    className="accent-black"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {form.relationship === 'Other' && (
              <input
                value={form.relationship_other}
                onChange={(e) => setForm((p) => ({ ...p, relationship_other: e.target.value }))}
                placeholder="Your relationship"
                className={`mt-3 ${inputCls}`}
              />
            )}
          </fieldset>

          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">
              Is your child already on Uni UI? *
            </span>
            <div className="flex flex-wrap gap-3">
              {FAMILY_CHILD_STATUS.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="child_status"
                    value={s}
                    checked={form.child_status === s}
                    onChange={(e) => setForm((p) => ({ ...p, child_status: e.target.value, child_detail: '' }))}
                    className="accent-black"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            {wantsChildDetail && (
              <input
                value={form.child_detail}
                onChange={(e) => setForm((p) => ({ ...p, child_detail: e.target.value }))}
                placeholder="Their name or matric number"
                className={`mt-3 ${inputCls}`}
              />
            )}
          </fieldset>

          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">
              How many children will you be linking? *
            </span>
            <div className="flex flex-wrap gap-3">
              {FAMILY_CHILD_COUNTS.map((c) => (
                <label key={c} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="child_count"
                    value={String(c)}
                    checked={form.child_count === String(c)}
                    onChange={(e) => setForm((p) => ({ ...p, child_count: e.target.value }))}
                    className="accent-black"
                  />
                  <span>{c === 3 ? '3 or more children' : `${c} child${c > 1 ? 'ren' : ''}`}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">
              What are you most interested in? (Optional)
            </span>
            <div className="flex flex-wrap gap-3">
              {FAMILY_INTERESTS.map((i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={i}
                    checked={form.interests.includes(i)}
                    onChange={() => toggleInterest(i)}
                    className="accent-black"
                  />
                  <span>{i}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="fam-consent"
              checked={form.consent}
              onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-black"
              required
            />
            <label htmlFor="fam-consent" className="text-xs text-black/80 leading-relaxed">
              I agree to Uni UI collecting my details for family account outreach. I&apos;ve read the{' '}
              <a href="/privacy" className="underline">Privacy Policy</a> and{' '}
              <a href="/terms" className="underline">Terms</a>.
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={submit}
            disabled={!canSubmit || submitting}
            className="w-full px-5 py-3 rounded-xl bg-[#FFD93D] text-black font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Join the family waitlist
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default FamilyWaitlistForm;
