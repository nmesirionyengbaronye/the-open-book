'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { normalizeWhatsApp } from '@/lib/validation';
import { CONTENT_TYPES, CREATOR_LEVELS } from '@/lib/creators';
import { WHATSAPP_URL } from '@/lib/links';

const inputCls =
  'w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition';

const STEPS = ['You', 'Reach', 'Content', 'Pitch'];

const EMPTY = {
  fullName: '',
  whatsapp: '',
  email: '',
  institution: '',
  level: '',
  department: '',
  tiktokHandle: '',
  instagramHandle: '',
  tiktokFollowers: '',
  instagramFollowers: '',
  avgViews: '',
  contentTypes: [] as string[],
  whyJoin: '',
  howPromote: '',
  promotedBefore: '' as '' | 'yes' | 'no',
  promotedBeforeDetail: '',
  website: '',
};

export function CreatorApplicationForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ ...EMPTY });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ code: string; referredBy: string | null } | null>(null);

  // A creator who was sent /creators?ref=CRT-XXXXXX gets credited for the
  // referral. Captured once, on mount, like JoinForm does for waitlist refs.
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref && /^CRT-[A-Z2-9]{6}$/i.test(ref.trim())) {
      setReferralCode(ref.trim().toUpperCase());
    }
  }, []);

  const normalized = useMemo(() => normalizeWhatsApp(form.whatsapp), [form.whatsapp]);
  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()), [form.email]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const stepValid = [
    form.fullName.trim().length >= 2 && !!normalized && emailOk &&
      form.institution.trim().length >= 2 && !!form.level && form.department.trim().length >= 2,
    form.tiktokHandle.trim().length >= 2 && form.tiktokFollowers !== '' && form.avgViews !== '',
    form.contentTypes.length > 0 && form.promotedBefore !== '',
    form.whyJoin.trim().length >= 20 && form.howPromote.trim().length >= 15 && consent,
  ][step];

  const next = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const toggleContentType = (t: string) =>
    setForm((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(t)
        ? prev.contentTypes.filter((x) => x !== t)
        : [...prev.contentTypes, t],
    }));

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    (document.activeElement as HTMLElement)?.blur();

    const payload = {
      full_name: form.fullName.trim(),
      whatsapp_number: normalized,
      email: form.email.trim(),
      institution: form.institution.trim(),
      level: form.level,
      department: form.department.trim(),
      tiktok_handle: form.tiktokHandle.trim(),
      instagram_handle: form.instagramHandle.trim(),
      tiktok_followers: form.tiktokFollowers,
      instagram_followers: form.instagramFollowers,
      avg_views: form.avgViews,
      content_types: form.contentTypes,
      why_join: form.whyJoin.trim(),
      how_promote: form.howPromote.trim(),
      promoted_before: form.promotedBefore === 'yes',
      promoted_before_detail: form.promotedBeforeDetail.trim(),
      referred_by: referralCode ?? '',
      website: form.website,
    };

    try {
      const res = await fetch('/api/creators/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Submission failed. Please try again.');
        toast.error('Could not submit', { description: data.error, id: 'creator-apply' });
        return;
      }

      setDone({ code: data.creator_code, referredBy: data.referred_by ?? null });
      toast.success('Application received', {
        description: 'We review applications within 48 hours.',
        id: 'creator-ok',
      });
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <ApplicationSent code={done.code} referredBy={done.referredBy} />;

  return (
    <section id="apply" className="py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-8 sm:p-10 glass border border-[#D4AF37]/30 shadow-[0_0_15px_0_rgba(212,175,55,0.2)]">
          <Progress step={step} />

          <div className="relative mt-8 overflow-hidden" style={{ minHeight: 360 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
                className="space-y-5"
              >
                {step === 0 && (
                  <>
                    <Field label="Full name">
                      <input
                        value={form.fullName}
                        onChange={(e) => set('fullName', e.target.value)}
                        placeholder="Chisom Okeke"
                        className={inputCls}
                        autoComplete="name"
                      />
                    </Field>
                    <Field
                      label="WhatsApp number"
                      hint="This is how we send your invite and campaign briefs."
                    >
                      <input
                        value={form.whatsapp}
                        onChange={(e) => set('whatsapp', e.target.value)}
                        placeholder="080 1234 5678"
                        inputMode="tel"
                        className={inputCls}
                        autoComplete="tel"
                      />
                      {form.whatsapp && !normalized && (
                        <p className="mt-2 text-xs text-destructive">
                          Use a valid Nigerian number (e.g. 0801 234 5678).
                        </p>
                      )}
                      {normalized && (
                        <p className="mt-2 text-xs text-emerald-400">Looks good — {normalized}</p>
                      )}
                    </Field>
                    <Field label="Email">
                      <input
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@example.com"
                        inputMode="email"
                        className={inputCls}
                        autoComplete="email"
                      />
                      {form.email && !emailOk && (
                        <p className="mt-2 text-xs text-destructive">Enter a valid email address.</p>
                      )}
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="University / Polytech">
                        <input
                          value={form.institution}
                          onChange={(e) => set('institution', e.target.value)}
                          placeholder="e.g. UNILAG, FUTO, UNIBEN"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Department">
                        <input
                          value={form.department}
                          onChange={(e) => set('department', e.target.value)}
                          placeholder="e.g. Computer Science"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field label="Level">
                      <div className="flex flex-wrap gap-2">
                        {CREATOR_LEVELS.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => set('level', l)}
                            className={`px-4 py-2 rounded-lg text-sm border transition ${
                              form.level === l
                                ? 'border-gold bg-gold/15 text-gold'
                                : 'border-gold/20 text-muted-foreground hover:border-gold/40'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field
                      label="TikTok handle"
                      hint="Required. Instagram only? Put it here too and put your TikTok below — we support both."
                    >
                      <input
                        value={form.tiktokHandle}
                        onChange={(e) => set('tiktokHandle', e.target.value)}
                        placeholder="@chisom.exams"
                        className={inputCls}
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="TikTok followers">
                        <input
                          value={form.tiktokFollowers}
                          onChange={(e) => set('tiktokFollowers', e.target.value)}
                          placeholder="1250"
                          inputMode="numeric"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Avg views (last 5 videos)" hint="Reach matters more than follower count here.">
                        <input
                          value={form.avgViews}
                          onChange={(e) => set('avgViews', e.target.value)}
                          placeholder="800"
                          inputMode="numeric"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <Field label="Instagram handle" hint="Optional.">
                      <input
                        value={form.instagramHandle}
                        onChange={(e) => set('instagramHandle', e.target.value)}
                        placeholder="@chisom.exams"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Instagram followers" hint="Optional.">
                      <input
                        value={form.instagramFollowers}
                        onChange={(e) => set('instagramFollowers', e.target.value)}
                        placeholder="430"
                        inputMode="numeric"
                        className={inputCls}
                      />
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="What do you post?" hint="Pick everything that applies.">
                      <div className="flex flex-wrap gap-2">
                        {CONTENT_TYPES.map((t) => {
                          const active = form.contentTypes.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleContentType(t)}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm border transition ${
                                active
                                  ? 'border-gold bg-gold/15 text-gold'
                                  : 'border-gold/20 text-muted-foreground hover:border-gold/40'
                              }`}
                            >
                              {active && <Check className="w-3.5 h-3.5" />}
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                    <Field label="Have you promoted a product or brand before?">
                      <div className="flex gap-2">
                        {(['yes', 'no'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => set('promotedBefore', v)}
                            className={`px-5 py-2 rounded-lg text-sm border transition ${
                              form.promotedBefore === v
                                ? 'border-gold bg-gold/15 text-gold'
                                : 'border-gold/20 text-muted-foreground hover:border-gold/40'
                            }`}
                          >
                            {v === 'yes' ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </Field>
                    {form.promotedBefore === 'yes' && (
                      <Field label="Tell us briefly" hint="Brand, what you posted, rough results.">
                        <textarea
                          value={form.promotedBeforeDetail}
                          onChange={(e) => set('promotedBeforeDetail', e.target.value)}
                          rows={3}
                          placeholder="Promoted a phone accessory brand, did 2 TikToks, roughly 3k views each."
                          className={inputCls + ' resize-y'}
                        />
                      </Field>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    {referralCode && (
                      <div className="glass rounded-xl p-4 flex items-start gap-3 text-sm border-gold/40">
                        <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                        <div>
                          Referred by <span className="text-gold font-semibold">{referralCode}</span> — you both get
                          credit.
                        </div>
                      </div>
                    )}
                    <Field
                      label="Why do you want to join?"
                      hint="Minimum 20 characters. We read every one."
                    >
                      <textarea
                        value={form.whyJoin}
                        onChange={(e) => set('whyJoin', e.target.value)}
                        rows={4}
                        placeholder="I make JAMB and WAEC prep content for students who can't afford the courses..."
                        className={inputCls + ' resize-y'}
                      />
                      <span className="mt-1.5 block text-[11px] text-muted-foreground/70">
                        {form.whyJoin.trim().length} characters
                      </span>
                    </Field>
                    <Field label="How would you promote UniUI?">
                      <textarea
                        value={form.howPromote}
                        onChange={(e) => set('howPromote', e.target.value)}
                        rows={4}
                        placeholder="I'd do a 30-second screen recording of me searching my lecture notes, then post it during exam season..."
                        className={inputCls + ' resize-y'}
                      />
                      <span className="mt-1.5 block text-[11px] text-muted-foreground/70">
                        {form.howPromote.trim().length} characters
                      </span>
                    </Field>

                    {/* Honeypot. Hidden from humans, irresistible to bots. */}
                    <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="creator-website">Website</label>
                      <input
                        id="creator-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) => set('website', e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div className="text-xs leading-relaxed">{error}</div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="creator-consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-gold"
                        required
                      />
                      <label htmlFor="creator-consent" className="text-xs text-muted-foreground leading-relaxed">
                        I agree that Uni UI may contact me on WhatsApp about the Creator Program and store these
                        details to review my application. Payout details are collected separately, and only once
                        I have earned something. See the{' '}
                        <a href="/privacy" className="text-gold underline">Privacy Policy</a> and{' '}
                        <a href="/terms" className="text-gold underline">Terms</a>.
                      </label>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={back}
              disabled={step === 0}
              className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-gold disabled:opacity-30 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={!stepValid}
                className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold disabled:opacity-40 inline-flex items-center gap-2 gold-glow-hover"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting || !stepValid}
                className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold inline-flex items-center gap-2 gold-glow-hover disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Apply to the program
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
          No follower minimum. No contract. You post when you want. Applications are reviewed within 48 hours.
        </p>
      </div>
    </section>
  );
}

function ApplicationSent({ code, referredBy }: { code: string; referredBy: string | null }) {
  return (
    <section id="apply" className="py-16 px-5">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 text-center glass border border-[#D4AF37]/30 shadow-[0_0_15px_0_rgba(212,175,55,0.2)]"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 grid place-items-center">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <h3 className="mt-5 text-2xl font-display font-bold">Application received.</h3>
          <p className="mt-2 text-muted-foreground text-sm">
            We review applications within 48 hours. If approved, you&apos;ll get a WhatsApp message with your
            next steps and an invite to the UNIUI Creators group.
          </p>

          <div className="mt-6 glass rounded-xl p-4 text-left">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Your creator code
            </div>
            <div className="mt-1 font-mono text-xl text-gold">{code}</div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Send this to creators you refer so they can link it to their application. If they apply through
              your link, you both get credit.
            </p>
          </div>

          {referredBy && (
            <div className="mt-4 glass rounded-xl p-4 text-left flex items-start gap-3 border-gold/40">
              <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your referral from <span className="text-gold font-semibold">{referredBy}</span> has been
                recorded. They&apos;ve been told about you.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover"
            >
              <MessageCircle className="w-5 h-5" /> Join the WhatsApp community
            </a>
            <a
              href="/join"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl glass border-gold/40 text-gold font-medium hover:bg-gold/10"
            >
              Join the waitlist while you wait
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground/70 mt-1.5">{hint}</span>}
    </label>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((l, i) => (
        <div key={l} className="flex-1 flex items-center gap-2">
          <div
            className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? 'bg-gold' : 'bg-white/10'}`}
          />
          <span
            className={`text-[10px] uppercase tracking-wider ${i <= step ? 'text-gold' : 'text-muted-foreground'}`}
          >
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}
