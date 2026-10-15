'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertCircle,
  ArrowRight,
  Loader2,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { normalizePhone } from '@/lib/waitlist-types';
import {
  INSTITUTION_TYPES,
  OWNERSHIP_TYPES,
  INSTITUTION_ROLES,
  INSTITUTION_INTERESTS,
  INSTITUTION_SIZES,
  NIGERIAN_STATES,
} from '@/lib/waitlist-types';
import { WHATSAPP_URL } from '@/lib/links';

const inputCls =
  'mt-1 w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm text-black placeholder:text-black/50 focus:outline-none focus:border-black/40 transition';

type FormState = {
  full_name: string;
  email: string;
  whatsapp: string;
  organization_name: string;
  organization_type: string;
  ownership: string;
  state: string;
  role: string;
  role_other: string;
  interests: string[];
  institution_size: string;
  consent: boolean;
};

export function InstitutionWaitlistForm() {
  const [form, setForm] = useState<FormState>({
    full_name: '',
    email: '',
    whatsapp: '',
    organization_name: '',
    organization_type: '',
    ownership: '',
    state: '',
    role: '',
    role_other: '',
    interests: [],
    institution_size: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fullName: string; position: number } | null>(null);

  const normalizedPhone = useMemo(() => normalizePhone(form.whatsapp), [form.whatsapp]);
  const eduNgOk = useMemo(() => /^[\w.+-]+@[\w.-]+\.edu\.ng$/i.test(form.email.trim()), [form.email]);

  const roleOther = form.role === 'Other';

  const canSubmit =
    form.full_name.trim().length >= 2 &&
    eduNgOk &&
    !!normalizedPhone &&
    form.organization_name.trim().length >= 2 &&
    !!form.organization_type &&
    !!form.ownership &&
    !!form.state &&
    !!form.role &&
    (form.role !== 'Other' || form.role_other.trim().length >= 2) &&
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
      organization_name: form.organization_name.trim(),
      organization_type: form.organization_type,
      ownership: form.ownership,
      state: form.state,
      role: form.role === 'Other' ? form.role_other.trim() : form.role,
      interests: form.interests,
      institution_size: form.institution_size || null,
    };

    if (!navigator.onLine) {
      toast.error('You are offline', { description: 'Please reconnect and try again.' });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/waitlist/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitting(false);

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409) {
          toast.error('Already registered', {
            description: err.error || 'This institution is already in the queue.',
            id: 'inst-duplicate',
          });
        } else {
          toast.error('Submission failed', { description: err.error || 'Please try again.', id: 'inst-error' });
        }
        setError(err.error || 'Submission failed');
        return;
      }

      const data = await res.json();
      toast.success('Welcome to the institution waitlist!', { description: 'Your request has been received.', id: 'inst-success' });
      setResult({ fullName: form.full_name.trim(), position: data.position });
    } catch {
      setSubmitting(false);
      setError('Network error. Please try again.');
      toast.error('Network error', { description: 'Please try again.', id: 'inst-network' });
    }
  };

  const reset = () => {
    setForm({
      full_name: '', email: '', whatsapp: '', organization_name: '', organization_type: '',
      ownership: '', state: '', role: '', role_other: '', interests: [], institution_size: '', consent: false,
    });
    setResult(null);
    setError(null);
  };

  if (result) {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/institutions`
      : '/institutions';
    const shareText = `Uni UI is bringing its analytics platform to institutions. I've joined the institution waitlist (${result.position} in queue). Join me: ${url}`;
    return (
      <section id="inst-join" className="py-20 px-5">
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
              Thank you, {result.fullName.split(' ')[0]}.
            </h3>
            <p className="mt-3 text-black/70 text-sm">
              We&apos;ve received your request to bring Uni UI to your institution. We review institutional requests weekly and will email onboarding details. Priority is given to early requests.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-black/10 bg-black/5 p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-black/70">Your queue position</div>
                <div className="mt-1 text-3xl font-display font-bold text-[#FFD93D]">#{result.position}</div>
              </div>
              <div className="rounded-xl border border-black/10 bg-black/5 p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-black/70">Total institutions</div>
                <div className="mt-1 text-3xl font-display font-bold text-black">{result.position + 10}+</div>
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
                <Share2 className="w-4 h-4" /> Share with a colleague
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
    <section id="inst-join" className="py-24 px-5">
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
          {/* Name */}
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Your name *</span>
            <input
              value={form.full_name}
              onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
              placeholder="Dr. Chinedu Okonkwo"
              className={inputCls}
            />
          </label>

          {/* Official email — must be .edu.ng */}
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Official email *</span>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="you@institution.edu.ng"
                className={inputCls}
              />
              {form.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {eduNgOk ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {!eduNgOk && form.email.trim().length > 0 && (
              <p className="mt-1.5 text-xs text-red-600">
                Must be an official institutional email ending in <span className="font-mono">.edu.ng</span>.
              </p>
            )}
          </label>

          {/* Phone */}
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Phone number *</span>
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
                  {normalizedPhone ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
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

          {/* Institution name */}
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Institution name *</span>
            <input
              value={form.organization_name}
              onChange={(e) => setForm((p) => ({ ...p, organization_name: e.target.value }))}
              placeholder="Federal University of Technology, Owerri"
              className={inputCls}
            />
          </label>

          {/* Institution type */}
          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Institution type *</span>
            <div className="flex flex-wrap gap-3">
              {INSTITUTION_TYPES.map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="organization_type"
                    value={t}
                    checked={form.organization_type === t}
                    onChange={(e) => setForm((p) => ({ ...p, organization_type: e.target.value }))}
                    className="accent-black"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Ownership */}
          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Ownership *</span>
            <div className="flex flex-wrap gap-3">
              {OWNERSHIP_TYPES.map((o) => (
                <label key={o} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="ownership"
                    value={o}
                    checked={form.ownership === o}
                    onChange={(e) => setForm((p) => ({ ...p, ownership: e.target.value }))}
                    className="accent-black"
                  />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* State */}
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">State *</span>
            <select
              value={form.state}
              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
              className={inputCls}
            >
              <option value="">Select state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* Role */}
          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">Your role *</span>
            <div className="flex flex-wrap gap-3">
              {INSTITUTION_ROLES.map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={(e) => setForm((p) => ({ ...p, role: e.target.value, role_other: '' }))}
                    className="accent-black"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {roleOther && (
              <input
                value={form.role_other}
                onChange={(e) => setForm((p) => ({ ...p, role_other: e.target.value }))}
                placeholder="Your role"
                className={`mt-3 ${inputCls}`}
              />
            )}
          </fieldset>

          {/* Interests (optional) */}
          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">
              What are you most interested in? (Optional)
            </span>
            <div className="flex flex-wrap gap-3">
              {INSTITUTION_INTERESTS.map((i) => (
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

          {/* Institution size (optional) */}
          <fieldset className="block">
            <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">
              How many students does your institution have? (Optional)
            </span>
            <div className="flex flex-wrap gap-3">
              {INSTITUTION_SIZES.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="institution_size"
                    value={s}
                    checked={form.institution_size === s}
                    onChange={(e) => setForm((p) => ({ ...p, institution_size: e.target.value }))}
                    className="accent-black"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Consent */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="inst-consent"
              checked={form.consent}
              onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-black"
              required
            />
            <label htmlFor="inst-consent" className="text-xs text-black/80 leading-relaxed">
              I agree to Uni UI collecting my details for institutional outreach. I&apos;ve read the{' '}
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
                Request recognition
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default InstitutionWaitlistForm;
