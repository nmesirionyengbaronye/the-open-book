'use client';

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Copy, Share2, ArrowRight, ArrowLeft, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { INSTITUTIONS } from "@/lib/institutions";
import { normalizeWhatsApp } from "@/lib/validation";
import useSound from "@/hooks/useSound";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { ReferralDashboard } from "@/components/ReferralDashboard";
import { WHATSAPP_URL } from "@/lib/links";

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

  const step1Valid = form.fullName.trim().length >= 2 && !!normalized;
  const step2Valid = !!form.institution && !!form.school && !!form.department && !!form.level && !!form.semester && form.hardestCourse.trim().length >= 3;

  const next = () => { play('ding'); setDirection(1); setStep((s) => s + 1); };
  const back = () => { play('ding'); setDirection(-1); setStep((s) => s - 1); };

   const submit = async () => {
     setError(null);
     setSubmitting(true);
     (document.activeElement as HTMLElement)?.blur();

     const res = await fetch("/api/waitlist/join", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         full_name: form.fullName.trim(),
         whatsapp_number: normalized,
         institution: form.institution,
         school: form.school,
         department: form.department,
         level: form.level,
         semester: form.semester,
         referred_by: refCode,
         hardest_course: form.hardestCourse.trim(),
       }),
     });

     setSubmitting(false);

     if (!res.ok) {
       play('error');
       const err = await res.json();
       console.log('Server response:', err);
       // Show the error from the server in an alert for debugging
       alert(`Error from server: ${JSON.stringify(err)}`);
       if (res.status === 409) {
         setError(`This number is already on the waitlist! ${err.code ? `Your code: ${err.code}` : ''}`);
         toast.error("", {
           description: (
             <>
               This WhatsApp number is already on the waitlist!{' '}
               <a href="/retrieve" className="underline cursor-pointer text-gold">
                 Retrieve your referral link here
               </a>
             </>
           ),
           id: "duplicate"
         });
       } else {
         setError(err.error || "Submission failed");
         toast.error("Error", { description: err.error, id: "join-error" });
       }
       return;
     }

     const data = await res.json();
     play('success');
     setResult({ fullName: form.fullName.trim(), position: data.position, referralCode: data.referral_code });
     setTotal(data.position + 10);
     if (!confettiFired.current) {
       confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: ["#D4AF37", "#FFD700", "#fff"] });
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
                 className="rounded-2xl p-8 text-center glass border border-[#D4AF37]/30 shadow-[0_0_15px_0_rgba(212,175,55,0.2)]">
                 <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 grid place-items-center">
                   <Check className="w-8 h-8 text-gold" />
                 </div>
                  <h3 className="mt-5 text-2xl font-display font-bold">You&apos;re in, {result.fullName.split(" ")[0]}.</h3>
                  <p className="mt-2 text-muted-foreground text-sm">We&apos;ll WhatsApp you when your school&apos;s beta opens.</p>

                  <div className="mt-6 flex flex-col gap-3">
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                       className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover">
                      <MessageCircle className="w-5 h-5" /> Join WhatsApp Community
                    </a>
                    <a href="/dashboard"
                       className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl glass border-gold/40 text-gold font-medium hover:bg-gold/10">
                      See your dashboard
                    </a>
                  </div>
                </motion.div>
             </div>
           </section>
           <ReferralDashboard initialCode={result.referralCode} />
         </>
       ) : (
         <section id="join" className="py-24 px-5">
           <div className="max-w-2xl mx-auto">
             <div className="text-center mb-10">
               <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">JOIN</div>
               <h2 className="mt-3 text-3xl sm:text-5xl font-display font-bold">
                 Get on the <span className="text-gold">WAITLIST</span>.
               </h2>
               <p className="mt-3 text-muted-foreground">
                 We're letting students in by school. Earlier signups = earlier access.
               </p>
             </div>

             {verifyingRef && (
               <div className="mb-5 glass rounded-xl p-4 flex items-center gap-3 text-sm">
                 <Loader2 className="w-4 h-4 animate-spin text-gold" /> Verifying your referral link…
               </div>
             )}
             {refCode && !verifyingRef && (
               <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                 className="mb-5 glass rounded-xl p-4 flex items-start gap-3 text-sm border-gold/40">
                 <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                 <div>
                   You were referred by <span className="text-gold font-semibold">{refCode}</span> — you'll both move up the queue.
                 </div>
               </motion.div>
             )}
             <div className="rounded-2xl p-8 sm:p-10 glass border border-[#D4AF37]/30 shadow-[0_0_15px_0_rgba(212,175,55,0.2)]">
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
                                   <AlertCircle className="w-5 h-5 text-destructive" />
                                 )}
                               </div>
                             )}
                             {form.whatsapp && !normalized && (
                               <p className="mt-2 text-xs text-destructive">Use a valid Nigerian number (e.g. 0801 234 5678).</p>
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
                               <option>200</option>
                               <option>300</option>
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
                           <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive flex items-start gap-2">
                             <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                             <div className="text-xs leading-relaxed">{error}</div>
                           </div>
                         )}
                       </div>
                     )}
                   </motion.div>
                 </AnimatePresence>
               </div>

               <div className="mt-6 flex items-center justify-between gap-3">
                 <button onClick={back} disabled={step === 0}
                   className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-gold disabled:opacity-30 inline-flex items-center gap-2">
                   <ArrowLeft className="w-4 h-4" /> Back
                 </button>
                 {step < 2 ? (
                   <button onClick={next}
                     disabled={(step === 0 && !step1Valid) || (step === 1 && !step2Valid)}
                     className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold disabled:opacity-40 inline-flex items-center gap-2 gold-glow-hover">
                     Continue <ArrowRight className="w-4 h-4" />
                   </button>
                 ) : (
                   <button onClick={submit} disabled={submitting}
                     className="px-5 py-2.5 rounded-lg bg-gold text-background font-semibold inline-flex items-center gap-2 gold-glow-hover disabled:opacity-60">
                     {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <>Claim my spot <Sparkles className="w-4 h-4" /></>}
                   </button>
                 )}
               </div>
             </div>
           </div>
         </section>
       )}
     </>
   );
}

const inputCls = "w-full bg-background/60 border border-gold/20 rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground/70 mt-1.5">{hint}</span>}
    </label>
  );
}

function ReviewRow({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-white/5">
      <span className="text-muted-foreground">{k}</span>
      <span className={accent ? "text-gold font-medium" : "text-foreground font-medium"}>{v}</span>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["You", "School", "Confirm"];
  return (
    <div className="flex items-center gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex-1 flex items-center gap-2">
          <div className={`h-1.5 rounded-full flex-1 transition-all ${i <= step ? "bg-gold" : "bg-white/10"}`} />
          <span className={`text-[10px] uppercase tracking-wider ${i <= step ? "text-gold" : "text-muted-foreground"}`}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function SuccessCard({ entry, total }: { entry: { fullName: string; position: number; referralCode: string }; total: number }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/?ref=${entry.referralCode}` : `?ref=${entry.referralCode}`;
  const share = () => {
    const text = `I just joined the Uni UI waitlist (#${entry.position}). Join with my link, we both jump the queue: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };
  return (
    <section id="join" className="py-24 px-5">
      <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-8 text-center glass border border-[#D4AF37]/30 shadow-[0_0_15px_0_rgba(212,175,55,0.2)]">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 grid place-items-center">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <h3 className="mt-5 text-2xl font-display font-bold">You're in, {entry.fullName.split(" ")[0]}.</h3>
          <p className="mt-2 text-muted-foreground text-sm">We'll WhatsApp you when your school's beta opens.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Your position" value={`#${entry.position}`} />
            <Stat label="Total waitlist" value={total.toString()} />
          </div>

          <div className="mt-6 text-left">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your referral link</div>
            <div className="flex gap-2">
              <input readOnly value={url} className={inputCls + " font-mono text-xs"} />
              <button
                onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="px-3 rounded-lg glass border-gold/40 hover:bg-gold/10"
                aria-label="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
              </button>
              <button onClick={share} className="px-3 rounded-lg glass border-gold/40 hover:bg-gold/10" aria-label="Share">
                <Share2 className="w-4 h-4 text-gold" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Code: <span className="font-mono text-gold">{entry.referralCode}</span>
            </p>
            <a href="/dashboard" className="mt-3 inline-flex items-center gap-2 text-sm text-gold hover:underline">
              Open your referral dashboard
            </a>
          </div>

          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
             className="mt-6 inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover">
            <MessageCircle className="w-5 h-5" /> Join the WhatsApp Community
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-display font-bold text-gold">{value}</div>
    </div>
  );
}