'use client';

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Copy, Share2, ArrowRight, ArrowLeft, Loader2, MessageCircle, Sparkles, WifiOff } from "lucide-react";
import { INSTITUTIONS, isLiveInstitution } from "@/lib/institutions";
import { normalizeWhatsApp } from "@/lib/validation";
import useSound from "@/hooks/useSound";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { ReferralDashboard } from "@/components/ReferralDashboard";
import { WaitlistRoadmap } from "@/components/WaitlistRoadmap";
import { WHATSAPP_URL, APP_URL, WAITLIST_TARGET_DATE } from "@/lib/links";
import { useOfflineQueue } from "@/lib/offline-queue";

function normalizeNG(input: string): string | null {
  return normalizeWhatsApp(input);
}

export function JoinForm({ konamiUnlocked = false }: { konamiUnlocked?: boolean }) {
  const { play } = useSound();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [verifyingRef, setVerifyingRef] = useState(false);
  const [result, setResult] = useState<{ fullName: string; position: number; referralCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const confettiFired = useRef(false);
  const [form, setForm] = useState({
    fullName: "",
    whatsapp: "",
    institution: "",
    school: "",
    department: "",
    level: "",
    semester: "",
    hardestCourse: "",
  });
  const [offline, setOffline] = useState(false);
  const [liveTotal, setLiveTotal] = useState<number | null>(null);
  const [liveVerified, setLiveVerified] = useState<number | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let cancelled = false;
    fetch('/api/waitlist/stats')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setLiveTotal(typeof d.total === 'number' ? d.total : null);
          setLiveVerified(typeof d.verified === 'number' ? d.verified : null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const { enqueue } = useOfflineQueue({
    onOnline: async (payload: any) => {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setVerifyingRef(true);
      setRefCode(ref);
      if (ref === 'UNI-ELON' || konamiUnlocked) {
        play('unlock');
        toast.success("ELON WOULD BE PROUD", { description: "Special bonus credits activated!", id: "konami" });
      }
      const t = setTimeout(() => setVerifyingRef(false), 900);
      return () => clearTimeout(t);
    }
  }, [konamiUnlocked, play]);

  const normalized = useMemo(() => normalizeNG(form.whatsapp), [form.whatsapp]);
  const institutionObj = useMemo(() => INSTITUTIONS.find((i) => i.code === form.institution), [form.institution]);
  const schoolObj = useMemo(() => institutionObj?.schools.find((s) => s.name === form.school), [institutionObj, form.school]);
  const isLiveSchool = useMemo(() => isLiveInstitution(form.institution), [form.institution]);

  const step1Valid = form.fullName.trim().length >= 2 && !!normalized;
  const step2Valid = !!form.institution && !!form.school && !!form.department && !!form.level && !!form.semester && form.hardestCourse.trim().length >= 3 && consentChecked;

  const next = () => { play('ding'); setDirection(1); setStep((s) => s + 1); };
  const back = () => { play('ding'); setDirection(-1); setStep((s) => s - 1); };

    const submit = async () => {
      setError(null);
      setSubmitting(true);
      (document.activeElement as HTMLElement)?.blur();

      const payload = {
        full_name: form.fullName.trim(),
        whatsapp_number: normalized,
        institution: form.institution,
        school: form.school,
        department: form.department,
        level: form.level,
        semester: form.semester,
        referred_by: refCode,
        hardest_course: form.hardestCourse.trim(),
      };

      if (!navigator.onLine) {
        enqueue(payload);
        toast.success('You are offline', { description: 'Your submission will be sent when you reconnect.' });
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitting(false);

      if (!res.ok) {
        play('error');
        const err = await res.json();
        console.log('Server response:', err);
        setError(err.error || "Submission failed");
        if (res.status === 409) {
          toast.error("", {
            description: (
              <>
                This WhatsApp number is already on the waitlist!{' '}
                <a href="/retrieve" className="underline cursor-pointer text-black">
                  Retrieve your referral link here
                </a>
              </>
            ),
            id: "duplicate"
          });
        } else {
          toast.error("Error", { description: err.error, id: "join-error" });
        }
        return;
      }

     const data = await res.json();
     play('success');
     setResult({ fullName: form.fullName.trim(), position: data.position, referralCode: data.referral_code });
     setTotal(data.position + 10);
     if (!confettiFired.current) {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#000000", "#FFD93D", "#FFFFFF"] });
       confettiFired.current = true;
     }
     toast.success("Welcome!", { description: "You're on the waitlist.", id: "welcome" });
   };

   return (
    <>
      {result ? (
        <>
          <section id="join" className="py-24 px-5">
            <div className="max-w-2xl mx-auto">
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                 className="rounded-2xl p-8 text-center border border-black/10 bg-black/5 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
                 <div className="w-16 h-16 mx-auto rounded-full bg-black text-[#FFD93D] grid place-items-center">
                   <Check className="w-8 h-8" />
                 </div>
<h3 className="mt-5 text-2xl font-display font-bold">You&apos;re in, {result.fullName.split(" ")[0]}.</h3>
                  <p className="mt-2 text-black/70 text-sm">
                    {institutionObj?.live
                      ? `Go to ${APP_URL} to start uploading your materials now.`
                      : `We'll WhatsApp you when access for ${institutionObj?.name || "your school"} opens. The first wave of universities goes live November 2026, with new schools going live every month through August 2027.`}
                  </p>

                  {!institutionObj?.live && <WaitlistRoadmap />}

                 <div className="mt-6 flex flex-col gap-3">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-black text-[#FFD93D] font-semibold">
                      <MessageCircle className="w-5 h-5" /> Join WhatsApp Community
                    </a>
                    <a href="/dashboard"
                       className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-black/10 bg-black/5 text-black font-medium hover:bg-black/10">
                      See your dashboard
                    </a>
                  </div>
                </motion.div>
             </div>
          </section>
          <ReferralDashboard initialCode={result.referralCode} />
        </>
      ) : (
        <section id="join" className="py-24 px-5 bg-black text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-[#FFD93D] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD93D] text-black shadow-[4px_4px_0px_rgba(255,255,255,0.25)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Join</span>
              </div>
              <h2 className="mt-6 text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight leading-[0.95]">
                Get on the <span className="text-[#FFD93D]">WAITLIST</span>.
              </h2>
              <p className="mt-3 text-white/70">
                We're letting students in by school. Earlier signups = earlier access.
              </p>
            </div>

            {verifyingRef && (
              <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#FFD93D]" /> Verifying your referral link…
              </div>
            )}
            {offline && (
              <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-3 text-sm text-white">
                <WifiOff className="w-4 h-4" /> You are offline. Submissions will be queued and sent when you reconnect.
              </div>
            )}
            {refCode && !verifyingRef && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 rounded-xl border border-[#FFD93D]/30 bg-[#FFD93D]/10 p-4 flex items-start gap-3 text-sm">
                <Sparkles className="w-5 h-5 text-[#FFD93D] shrink-0 mt-0.5" />
                <div>
                  You were referred by <span className="text-[#FFD93D] font-semibold">{refCode}</span> — you'll both move up the queue.
                </div>
              </motion.div>
            )}

            <div className="rounded-2xl p-6 sm:p-10 border border-white/10 bg-white/5 shadow-[4px_4px_0px_rgba(255,255,255,0.25)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Waitlist Entry</div>
                  <div className="text-lg font-display font-semibold text-white">
                    Claim your spot before the next wave.
                  </div>
                </div>
                {liveTotal != null && (
                  <div className="text-xs text-white/70">
                    <span className="text-[#FFD93D] font-semibold">{liveTotal.toLocaleString()}</span> students on the waitlist ·{' '}
                    <span className="text-emerald-400 font-semibold">{liveVerified == null ? '—' : `${liveVerified.toLocaleString()}`}</span> verified for rewards
                  </div>
                )}
                {liveTotal === null && (
                  <div className="text-xs text-white/70">Loading waitlist count…</div>
                )}
              </div>

              <Progress step={step} />

              <div className="relative mt-8 overflow-hidden" style={{ minHeight: 340 }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -direction * 40 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                  >
                  {step === 0 && (
                    <div className="space-y-5">
                      <Field label="Full name">
                        <input
                          value={form.fullName} onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Chisom Okeke" className={inputCls}
                        />
                      </Field>
                      <Field label="WhatsApp number" hint="We'll only use this to send your invite.">
                        <div className="relative">
                          <input
                            value={form.whatsapp} onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                            placeholder="080 1234 5678" inputMode="tel" className={inputCls}
                          />
                          {form.whatsapp && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {normalized ? (
                                <Check className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                          )}
                          {form.whatsapp && !normalized && (
                            <p className="mt-2 text-xs text-red-400">Use a valid Nigerian number (e.g. 0801 234 5678).</p>
                          )}
                          {normalized && (
                            <p className="mt-2 text-xs text-emerald-400">Looks good — {normalized}</p>
                          )}
                        </div>
                      </Field>
                    </div>
                  )}
                      {step === 1 && (
                        <div className="space-y-4">
                           <Field label="Institution">
                             <select value={form.institution} onChange={(e) => { setForm(prev => ({ ...prev, institution: e.target.value, school: "", department: "" })); }} className={inputCls}>
                               <option value="">Select your school</option>
                               {INSTITUTIONS.map((i) => <option key={i.code} value={i.code}>{i.name}</option>)}
                             </select>
                           </Field>

                             {institutionObj && (
                               <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                 className="text-[11px] flex items-center gap-1.5 px-1">
                                 {institutionObj.live ? (
                                   <>
                                     <Check className="w-3.5 h-3.5 text-emerald-400" />
                                     <span className="text-emerald-400">Uni UI is <span className="font-semibold">live</span> for {institutionObj.name}.</span>
                                   </>
                                 ) : (
                                   <>
                                     <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                     <span className="text-white/80">{institutionObj.name} is on the waitlist. First wave opens November 2026; new universities go live each month through {WAITLIST_TARGET_DATE}.</span>
                                   </>
                                 )}
                               </motion.div>
                             )}

                            <Field label="School / Faculty">
                             <select value={form.school} onChange={(e) => { setForm(prev => ({ ...prev, school: e.target.value, department: "" })); }} disabled={!institutionObj} className={inputCls}>
                               <option value="">{institutionObj ? "Select faculty" : "Pick an institution first"}</option>
                               {institutionObj?.schools.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                             </select>
                           </Field>

                           <Field label="Department">
                             <select value={form.department} onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))} disabled={!schoolObj} className={inputCls}>
                               <option value="">{schoolObj ? "Select department" : "Pick a faculty first"}</option>
                               {schoolObj?.departments.map((d) => <option key={d} value={d}>{d}</option>)}
                             </select>
                           </Field>

                          <div className="grid grid-cols-2 gap-3">
                             <Field label="Level">
                               <select value={form.level} onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value }))} className={inputCls}>
                                 <option value="">Pick</option>
                                 <option>100</option>
                                 <option>200</option>
                                 <option>300</option>
                                 <option>400</option>
                                 <option>500</option>
                               </select>
                             </Field>
                            <Field label="Semester">
                              <select value={form.semester} onChange={(e) => setForm(prev => ({ ...prev, semester: e.target.value }))} className={inputCls}>
                                <option value="">Pick</option>
                                <option>1st</option>
                                <option>2nd</option>
                              </select>
                            </Field>
                          </div>

                          <Field label="Hardest Course" hint="Which course is giving you the most stress?">
                            <input
                              value={form.hardestCourse}
                              onChange={(e) => setForm(prev => ({ ...prev, hardestCourse: e.target.value }))}
                              placeholder="e.g. MTH 101, GST 111..."
                              className={inputCls}
                            />
                          </Field>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-3 text-sm">
                          <ReviewRow k="Name" v={form.fullName} />
                          <ReviewRow k="WhatsApp" v={normalized!} />
                          <ReviewRow k="Institution" v={institutionObj?.name || form.institution} />
                          <ReviewRow k="School" v={form.school} />
                          <ReviewRow k="Department" v={form.department} />
                          <ReviewRow k="Level / Semester" v={`${form.level} · ${form.semester}`} />
                          <ReviewRow k="Hardest Course" v={form.hardestCourse} />
                          {refCode && <ReviewRow k="Referred by" v={refCode} accent />}
                           {error && (
                             <div className="mt-4 rounded-lg border border-red-600/40 bg-red-600/10 p-3 text-red-600 flex items-start gap-2">
                               <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                               <div className="text-xs leading-relaxed">{error}</div>
                             </div>
                           )}
                           <div className="mt-4 flex items-start gap-2">
                             <input
                               type="checkbox"
                               id="consent"
                               checked={consentChecked}
                               onChange={(e) => setConsentChecked(e.target.checked)}
                               className="mt-0.5 w-4 h-4 accent-black"
                               required
                             />
                             <label htmlFor="consent" className="text-xs text-black/80 leading-relaxed">
                               I agree to Uni UI collecting my WhatsApp number and details for waitlist purposes,
                               notifications, and referral tracking. I've read and understood the{' '}
                               <a href="/privacy" className="text-black underline underline-offset-2">Privacy Policy</a> and{' '}
                               <a href="/terms" className="text-black underline underline-offset-2">Terms of Service</a>.
                             </label>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                 <div className="mt-6 flex items-center justify-between gap-3">
                    <button onClick={back} disabled={step === 0}
                      className="px-4 py-2.5 rounded-lg text-sm text-white/70 hover:text-white disabled:opacity-30 inline-flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    {step < 2 ? (
                      <button onClick={next}
                        disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                        className="px-5 py-2.5 rounded-lg bg-[#FFD93D] text-black font-semibold disabled:opacity-40 inline-flex items-center gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={submit} disabled={submitting}
                        className="px-5 py-2.5 rounded-lg bg-[#FFD93D] text-black font-semibold inline-flex items-center gap-2 disabled:opacity-60">
                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Claim my spot <Sparkles className="w-4 h-4" /></>}
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-center text-[10px] text-white/70">
                    By joining you agree to be notified about Uni UI. See{' '}
                    <a href="/privacy" className="underline hover:text-[#FFD93D]">Privacy Policy</a> and{' '}
                    <a href="/terms" className="underline hover:text-[#FFD93D]">Terms</a>.
                  </p>
                </div>
              </div>
            </section>
          )}
          {institutionObj?.live && (
            <section className="py-10 px-5">
              <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-6 sm:p-8 border border-[#FFD93D]/30 bg-[#FFD93D]/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#FFD93D] font-semibold mb-1">App is live</div>
                      <div className="text-sm text-white">
                        {institutionObj.name} students can use Uni UI right now at{' '}
                        <span className="font-semibold text-[#FFD93D]">{APP_URL}</span>.
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a href={APP_URL} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FFD93D] text-black text-xs font-semibold hover:bg-[#FFD93D]/90 transition">
                        Enter the app
                      </a>
                      <button onClick={() => setForm(prev => ({ ...prev, institution: "", school: "", department: "", level: "", semester: "", hardestCourse: "" }))}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 transition">
                        Wrong school
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          )}
        </>
      );
    }

  const inputCls = "w-full bg-white text-black border border-black/15 rounded-lg px-3.5 py-2.5 text-sm placeholder:text-black/60 focus:outline-none focus:border-black transition";

  function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
      <label className="block">
        <span className="block text-xs uppercase tracking-wider text-black/80 mb-1.5">{label}</span>
        {children}
        {hint && <span className="block text-[11px] text-black/70 mt-1.5">{hint}</span>}
      </label>
    );
  }

  function ReviewRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
    return (
      <div className="flex justify-between gap-4 py-2 border-b border-black/10">
        <span className="text-black/70">{k}</span>
        <span className={accent ? "text-[#FFD93D] font-medium" : "text-black font-medium"}>{v}</span>
      </div>
    );
  }

  function Progress({ step }: { step: number }) {
    const labels = ["You", "School", "Confirm"];
    return (
      <div className="flex items-center gap-2">
        {labels.map((l, i) => (
          <div key={l} className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? "bg-black" : "bg-black/10"}`} />
            <span className={`text-[10px] uppercase tracking-wider ${i <= step ? "text-black" : "text-black/60"}`}>{l}</span>
          </div>
        ))}
      </div>
    );
  }

  function SuccessCard({ entry, total }: { entry: { fullName: string; position: number; referralCode: string }; total: number }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== "undefined" ? `${window.location.origin}/join?ref=${entry.referralCode}` : `/join?ref=${entry.referralCode}`;
    const share = () => {
      const text = `I just joined the Uni UI waitlist (#${entry.position}). Join with my link, we both jump the queue: ${url}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };
    return (
      <section id="join" className="py-24 px-5 bg-black text-white">
        <div className="max-w-xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 text-center border border-white/10 bg-white/5 shadow-[4px_4px_0px_rgba(255,255,255,0.25)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFD93D] text-black grid place-items-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="mt-5 text-2xl font-display font-bold text-white">You&apos;re in, {entry.fullName.split(" ")[0]}.</h3>
            <p className="mt-2 text-white/70 text-sm">We&apos;ll WhatsApp you when your school&apos;s beta opens.</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Your position" value={`#${entry.position}`} />
              <Stat label="Total waitlist" value={total.toString()} />
            </div>

            <div className="mt-6 text-left">
              <div className="text-xs uppercase tracking-wider text-white/80 mb-2">Your referral link</div>
              <div className="flex gap-2">
                <input readOnly value={url} className={inputCls + " font-mono text-xs"} />
                <button
                  onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="px-3 rounded-lg border border-white/10 hover:bg-white/5"
                  aria-label="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-[#FFD93D]" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
                <button onClick={share} className="px-3 rounded-lg border border-white/10 hover:bg-white/5" aria-label="Share">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
             <p className="text-[11px] text-black/70 mt-2">
               Code: <span className="font-mono text-black">{entry.referralCode}</span>
             </p>
             <a href="/dashboard" className="mt-3 inline-flex items-center gap-2 text-sm text-black underline underline-offset-2">
               Open your referral dashboard
             </a>
           </div>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
               className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-black text-[#FFD93D] font-semibold">
              <MessageCircle className="w-5 h-5" /> Join the WhatsApp Community
            </a>
         </motion.div>
       </div>
     </section>
   );
 }

 function Stat({ label, value }: { label: string; value: string }) {
   return (
     <div className="rounded-xl border border-black/10 bg-black/5 p-4">
       <div className="text-[10px] uppercase tracking-wider text-black/80">{label}</div>
       <div className="mt-1 text-2xl font-display font-bold text-black">{value}</div>
     </div>
   );
 }
