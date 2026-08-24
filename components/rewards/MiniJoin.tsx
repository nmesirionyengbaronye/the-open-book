'use client';

import { useMemo, useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { INSTITUTIONS } from '@/lib/institutions';
import { normalizeWhatsApp } from '@/lib/validation';
import { toast } from 'sonner';
import { APP_URL, WAITLIST_TARGET_DATE } from '@/lib/links';
import { WaitlistRoadmap } from '@/components/WaitlistRoadmap';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20';

export default function MiniJoin({ onJoined }: { onJoined: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    whatsapp: '',
    institution: '',
    school: '',
    department: '',
    level: '',
    semester: '',
    hardestCourse: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalized = useMemo(() => normalizeWhatsApp(form.whatsapp), [form.whatsapp]);
  const institutionObj = useMemo(
    () => INSTITUTIONS.find((i) => i.code === form.institution),
    [form.institution]
  );
  const schoolObj = useMemo(
    () => institutionObj?.schools.find((s) => s.name === form.school),
    [institutionObj, form.school]
  );

  const step1Valid = form.fullName.trim().length >= 2 && !!normalized;
  const step2Valid =
    !!form.institution &&
    !!form.school &&
    !!form.department &&
    !!form.level &&
    !!form.semester &&
    form.hardestCourse.trim().length >= 3;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          whatsapp_number: normalized,
          institution: form.institution,
          school: form.school,
          department: form.department,
          level: form.level,
          semester: form.semester,
          hardest_course: form.hardestCourse.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not join the waitlist');
        toast.error(data.error || 'Could not join');
        return;
      }
      toast.success('You’re on the waitlist! Verifying…');
      onJoined();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#D4AF37]/30 bg-white/[0.04] p-5">
      <h3 className="text-sm font-semibold text-white">Join the waitlist</h3>
      <p className="mt-1 text-xs text-white/50">
        You’re not on the waitlist yet. Sign up here, then we’ll finish verifying your Telegram.
      </p>

      <div className="mt-4 space-y-3">
        {step === 0 ? (
          <>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">Full name</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Chisom Okeke"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">
                WhatsApp number
              </label>
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
                    {normalized ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                )}
              </div>
              {form.whatsapp && !normalized && (
                <p className="mt-1 text-[11px] text-red-400">Use a valid Nigerian number.</p>
              )}
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!step1Valid}
              className="w-full rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">Institution</label>
              <select
                value={form.institution}
                onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value, school: '', department: '' }))}
                className={inputCls}
              >
                <option value="">Select your school</option>
                {INSTITUTIONS.map((i) => (
                  <option key={i.code} value={i.code}>
                    {i.name}
                  </option>
                ))}
              </select>
              {institutionObj && (
                <p className="mt-1 text-[10px] text-white/40">
                  {institutionObj.live ? (
                    <span className="text-emerald-300">Uni UI is live for {institutionObj.name} — go to {APP_URL}.</span>
                  ) : (
                    <>
                      <span className="text-gold/80">{institutionObj.name} is on the waitlist until {WAITLIST_TARGET_DATE}.</span>
                      <span className="mt-1.5 block text-[10px] text-white/40">First wave opens November 2026; new universities go live each month.</span>
                    </>
                  )}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">School / Faculty</label>
              <select
                value={form.school}
                onChange={(e) => setForm((p) => ({ ...p, school: e.target.value, department: '' }))}
                disabled={!institutionObj}
                className={inputCls}
              >
                <option value="">{institutionObj ? 'Select faculty' : 'Pick an institution first'}</option>
                {institutionObj?.schools.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                disabled={!schoolObj}
                className={inputCls}
              >
                <option value="">{schoolObj ? 'Select department' : 'Pick a faculty first'}</option>
                {schoolObj?.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Pick</option>
                  <option>100</option>
                  <option>200</option>
                  <option>300</option>
                  <option>400</option>
                  <option>500</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">Semester</label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm((p) => ({ ...p, semester: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Pick</option>
                  <option>1st</option>
                  <option>2nd</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wider text-white/50">
                Hardest course
              </label>
              <input
                value={form.hardestCourse}
                onChange={(e) => setForm((p) => ({ ...p, hardestCourse: e.target.value }))}
                placeholder="e.g. MTH 101"
                className={inputCls}
              />
            </div>

            {error && <p className="text-[11px] text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white/60"
              >
                Back
              </button>
              <button
                onClick={submit}
                disabled={!step2Valid || submitting}
                className="flex-1 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-black disabled:opacity-40"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> Joining…
                  </>
                ) : (
                  'Join & continue'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
