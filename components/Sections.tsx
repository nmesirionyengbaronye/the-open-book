'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Upload, ShieldCheck, Sparkles, Brain, FileSearch, MessageSquare, Award, ChevronDown, MessageCircle, Share2 } from "lucide-react";

const spring = { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 } as const;

export function WhatIs() {
  return (
    <section id="about" className="relative py-24 px-5">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} transition={spring}>
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">ABOUT</div>
          <h2 className="mt-3 text-3xl sm:text-5xl font-display font-bold">
            WHAT IS <span className="text-gold">UNI UI</span>?
          </h2>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={1} transition={spring}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed space-y-4"
        >
          <p>
            UNI UI STANDS FOR <span className="text-foreground font-medium">UNIVERSITY UPLOADED INTELLIGENCE</span>.
            YOU UPLOAD YOUR SEMESTER MATERIALS AND OUR AI STRUCTURES THEM.
          </p>
          <p>
            THEN YOU ASK QUESTIONS AND GET ANSWERS FROM <span className="text-gold">YOUR OWN NOTES</span>, NOT THE WHOLE INTERNET.
            NO HALLUCINATIONS. NO OFF-SYLLABUS GUESSES. JUST THE MATERIAL YOUR LECTURER ACTUALLY GAVE YOU.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: FileSearch, title: "SEMSTER-SPECIFIC ANSWERS", body: "Answers sourced from your exact course materials. Cited, page-numbered, traceable." },
  { icon: ShieldCheck, title: "VERIFIED MATH", body: "Every calculation double-checked by a symbolic math engine. No more wrong derivations." },
  { icon: Award, title: "EARN FREE ACCESS", body: "Upload your notes and earn free question credits. Help your school, help yourself." },
];

export function Features() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring}
          className="text-3xl sm:text-4xl font-display font-bold text-center"
        >
          BUILT FOR THE WAY YOU <span className="text-gold">ACTUALLY STUDY</span>.
        </motion.h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={i} transition={spring}
              className="glass rounded-2xl p-6 gold-glow-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/15 grid place-items-center">
                <f.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold">{f.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: "SIGN UP WITH WHATSAPP", d: "JOIN THE WAITLIST USING YOUR WHATSAPP NUMBER. NO EMAIL NEEDED.", icon: MessageCircle },
  { n: "02", t: "SHARE YOUR REFERRAL LINK", d: "GET A UNIQUE REFERRAL CODE AND SHARE IT WITH COURSEMATES TO MOVE UP THE QUEUE.", icon: Share2 },
  { n: "03", t: "WE PROCESS YOUR DEPARTMENT'S MATERIALS", d: "AFTER THE WAITLIST PHASE, I COLLECT AND STRUCTURE ALL THE NOTES, PAST QUESTIONS, AND HANDOUTS FOR YOUR COURSES.", icon: Upload },
  { n: "04", t: "AI LEARNS YOUR SYLLABUS", d: "THE UPLOADED INTELLIGENCE ORGANISES THE MATERIALS INTO A SEARCHABLE, STRUCTURED KNOWLEDGE BASE SPECIFIC TO YOUR SCHOOL, DEPARTMENT, AND LEVEL.", icon: Brain },
  { n: "05", t: "ASK ANYTHING", d: "TYPE ANY QUESTION IN PLAIN ENGLISH. THE AI SEARCHES ONLY YOUR APPROVED MATERIALS AND BUILDS A STEP-BY-STEP ANSWER.", icon: FileSearch },
  { n: "06", t: "ACE YOUR EXAMS", d: "WALK INTO THE EXAM HALL PREPARED, WITH CONFIDENCE THAT YOU'VE STUDIED THE RIGHT MATERIAL, THE RIGHT WAY.", icon: Award },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <section className="py-20 px-5 bg-surface/30">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring}
          className="text-3xl sm:text-4xl font-display font-bold text-center">
          HOW IT WORKS
        </motion.h2>
        <div className="mt-14 relative">
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gold/15" />
          <div
            className="absolute left-6 sm:left-1/2 top-0 w-px bg-gradient-to-b from-gold to-gold-bright transition-all duration-1000"
            style={{ height: inView ? "100%" : "0%" }}
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ ...spring, delay: i * 0.05 }}
              className={`relative flex sm:grid sm:grid-cols-2 gap-6 sm:gap-12 mb-10 ${i % 2 ? "sm:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="hidden sm:block" />
              <div className="pl-16 sm:pl-0">
                <div className="absolute left-0 sm:left-1/2 top-0 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-background border-2 border-gold grid place-items-center gold-glow">
                  <s.icon className="w-5 h-5 text-gold" />
                </div>
                <div className="text-gold font-display text-sm tracking-widest">{s.n}</div>
                <h3 className="mt-1 text-xl font-display font-semibold">{s.t}</h3>
                <p className="mt-1 text-muted-foreground text-sm">{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Chisom", dept: "MCE 300L · FUTO", text: "I paid ₦5,000 for MTH 201 tutorials. Still failed. Uni UI helped me pass with a B. Free." },
  { name: "Tunde", dept: "EEE 200L · UNILAG", text: "It pulled an answer straight from my lecturer's slide. I literally saw the page number. Mind blown." },
  { name: "Amaka", dept: "Biochem 300L · UNN", text: "Glycolysis used to scare me. Asked Uni UI three follow-ups and finally got it. In Pidgin sef." },
  { name: "Ifeanyi", dept: "Comp Sci 200L · FUTO", text: "I uploaded my entire DSA past question pack. The verified solutions saved my CGPA." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">FROM STUDENTS</div>
        <div className="mt-8 relative h-56">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 glass rounded-2xl p-8 flex flex-col justify-center"
            >
              <p className="font-display text-xl sm:text-2xl text-foreground/90 leading-snug">
                "{TESTIMONIALS[i].text}"
              </p>
              <div className="mt-5 text-sm">
                <span className="text-gold font-semibold">— {TESTIMONIALS[i].name}</span>
                <span className="text-muted-foreground">, {TESTIMONIALS[i].dept}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-gold" : "w-1.5 bg-white/20"}`}
              aria-label={`Show testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "WHAT EXACTLY IS UNI UI, AND HOW DOES IT WORK?",
    a: "UNI UI IS AN AI STUDY ASSISTANT BUILT FOR WEST AFRICAN STUDENTS. YOU JOIN THE WAITLIST WITH YOUR WHATSAPP NUMBER, SHARE YOUR REFERRAL LINK TO MOVE UP THE QUEUE, AND ONCE IN, YOU UPLOAD YOUR COURSE MATERIALS (NOTES, SLIDES, PAST QUESTIONS). OUR AI STRUCTURES THEM INTO A PERSONAL KNOWLEDGE BASE THAT ANSWERS QUESTIONS USING ONLY YOUR UPLOADED CONTENT—NO INTERNET GUESSES, NO HALLUCINATIONS. IT’S LIKE HAVING YOUR LECTURER’S BRAIN IN YOUR POCKET.",
  },
  {
    q: "HOW IS THIS DIFFERENT FROM USING CHATGPT OR GOOGLE?",
    a: "CHATGPT AND GOOGLE PULL FROM THE ENTIRE INTERNET, WHICH OFTEN LEADS TO WRONG OR IRRELEVANT ANSWERS FOR YOUR SPECIFIC COURSE. UNI UI IS TRAINED EXCLUSIVELY ON THE MATERIALS YOU AND YOUR CLASSMATES UPLOAD FOR YOUR DEPARTMENT AND LEVEL. EVERY ANSWER IS CITED TO THE EXACT PAGE OR SLIDE IT CAME FROM, SO YOU KNOW IT’S ACCURATE AND SYLLABUS-SPECIFIC.",
  },
  {
    q: "IS MY WHATSAPP NUMBER SAFE? WILL I GET SPAM?",
    a: "ABSOLUTELY SAFE. WE ONLY USE YOUR NUMBER TO SEND YOU INVITATIONS WHEN YOUR SCHOOL’S BETA OPENS AND OCCASIONAL IMPORTANT UPDATES. WE NEVER SHARE IT WITH THIRD PARTIES OR SEND PROMOTIONAL MESSAGES. YOUR PRIVACY IS NON-NEGOTIABLE.",
  },
    {
      q: "DO I NEED TO PAY TO USE UNI UI?",
      a: "YOU WILL HAVE A GENEROUS FREE TIER BUT AT THE END YOU WILL PAY CONSIDERABLY CHEAP AMOUNT.",
    },
  {
    q: "WHICH UNIVERSITIES AND COURSES ARE SUPPORTED AT LAUNCH?",
    a: "AT LAUNCH, WE’RE FOCUSED ON FUTO (FEDERAL UNIVERSITY OF TECHNOLOGY, OWERRI) FOR ENGINEERING, SCIENCE, AND TECHNOLOGY COURSES. WE PLAN TO EXPAND TO UNILAG, UI, UNN, ABU, OAU, UNIBEN, FUTA, AND UNIPORT IN PHASES BASED ON WAITLIST DEMAND. IF YOU’RE FROM ANOTHER SCHOOL, JOIN THE WAITLIST ANYWAY—WE’LL PRIORITIZE SCHOOLS WITH THE MOST SIGNUPS.",
  },
    {
      q: "WHAT YEAR/LEVEL OF STUDENTS CAN JOIN?",
      a: "ONLY 200 LEVEL AND 300 LEVEL STUDENTS ARE ELIGIBLE TO JOIN THE WAITLIST. THIS ENSURWE FOCUS ON STUDENTS IN THE MIDDLE OF THEIR ACADEMIC JOURNEY WHO HAVE SUFFICIENT COURSE MATERIALS TO CONTRIBUTE TO THE KNOWLEDGE BASE WHILE STILL BENEFITING FROM THE AI ASSISTANCE FOR THEIR UPCOMING EXAMS.",
    },
    {
      q: "HOW DOES THE REFERRAL SYSTEM BENEFIT ME?",
      a: "YOU GET TOKENS AND PRIVILEGES ON LAUNCH FOR EVERY FRIEND WHO JOINS USING YOUR REFERRAL LINK. THE MORE YOU SHARE, THE MORE REWARDS YOU EARN. IT'S OUR WAY OF REWARDING YOU FOR BUILDING THE COMMUNITY THAT MAKES UNI UI VALUABLE—YOUR CLASSMATES' NOTES MAKE THE AI SMARTER FOR EVERYONE.",
    },
    {
      q: "WHEN WILL THE PLATFORM BE FULLY AVAILABLE?",
      a: "IT WILL BE OPEN FOR ALL FUTO STUDENTS AS A WEB APP FOR 2025/2026 ACADEMIC SECTION, THEN THE APP WILL BE AVAILABLE BY NEXT SEMESTER, EXPANSION WILL BEGIN AT SECOND SEMESTER OF 2026/2027.",
    },
  {
    q: "WHAT MATERIALS SHOULD I UPLOAD?",
    a: "UPLOAD ANYTHING YOUR LECTURER GAVE YOU: LECTURE SLIDES (PDF OR PPT), CLASS NOTES (TYPED OR HANDWRITTEN SCANS), PAST QUESTION PAPERS, TUTORIAL SOLUTIONS, AND LAB MANUALS. THE MORE COMPLETE YOUR UPLOAD, THE BETTER THE AI CAN HELP YOU. WE ACCEPT PDF, JPEG, AND PNG FILES.",
  },
  {
    q: "WHO BUILT UNI UI, AND WHY SHOULD I TRUST IT?",
    a: "I’M A SOLO FOUNDER AND A FUTO ENGINEERING STUDENT WHO BUILT THIS FROM A HOSTEL ROOM BECAUSE I WAS TIRED OF PAYING FOR TUTORIALS THAT GAVE WRONG ANSWERS. I DESIGNED UNI UI TO BE THE TOOL I WISHED I HAD—ONE THAT ONLY USES YOUR MATERIALS SO YOU NEVER HAVE TO WONDER IF THE ANSWER IS RIGHT. TRUST COMES FROM TRANSPARENCY: EVERY ANSWER SHOWS ITS SOURCE.",
  },
    {
      q: "CAN I USE UNI UI WITHOUT UPLOADING ANYTHING?",
      a: "YES, YOU CAN USE UNI UI WITHOUT UPLOADING ANYTHING. UPLOADING IS JUST A BENEFIT TO GET TOKENS AND REWARDS ON LAUNCH.",
    },
  {
    q: "HOW DO I GET HELP IF SOMETHING GOES WRONG?",
    a: "IF YOU ENCOUNTER AN ISSUE, EMAIL ME DIRECTLY AT 1stuniui@gmail.com OR MESSAGE ME ON WHATSAPP VIA THE COMMUNITY LINK IN THE FOOTER. I RESPOND PERSONALLY TO EVERY STUDENT REACHING OUT—NO BOTS, NO TICKET SYSTEMS. IF IT’S URGENT (LIKE A PLATFORM BUG DURING EXAM PREP), I’LL PRIORITIZE IT.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring}
          className="text-3xl sm:text-4xl font-display font-bold text-center">
          QUESTIONS, <span className="text-gold">ANSWERED</span>.
        </motion.h2>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const active = open === i;
            return (
              <div key={i} className={`glass rounded-xl overflow-hidden transition-colors ${active ? "border-gold/60" : ""}`}>
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-medium text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold shrink-0 transition-transform ${active ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ fullName: '', recommendation: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.fullName, recommendation: form.recommendation }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="recommendations" className="py-24 px-5 bg-surface/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">FEEDBACK</div>
        <h2 className="mt-3 text-3xl sm:text-5xl font-display font-bold">
          HELP US <span className="text-gold">BUILD</span> THE FUTURE.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          What features or improvements would make Uni UI indispensable for your studies? We're listening.
        </p>

        <div className="mt-12 max-w-lg mx-auto">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="glass-strong p-10 rounded-2xl border border-gold/30">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Recommendation Received!</h3>
              <p className="text-sm text-muted-foreground">Thank you for helping us improve Uni UI.</p>
              <button onClick={() => { setSubmitted(false); setForm({ fullName: '', recommendation: '' }); }}
                className="mt-6 text-gold text-sm font-semibold hover:underline">Submit another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="glass rounded-xl p-6 border border-gold/10 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Full Name</label>
                  <input
                    required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Your name" className="w-full bg-background/40 border border-gold/10 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Your Recommendation</label>
                  <textarea
                    required rows={4} value={form.recommendation} onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                    placeholder="I would love to see..." className="w-full bg-background/40 border border-gold/10 rounded-lg px-4 py-3 text-sm focus:border-gold outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gold text-background font-bold uppercase tracking-widest text-xs gold-glow-hover flex items-center justify-center gap-2"
                >
                  {loading ? <Upload className="w-4 h-4 animate-spin" /> : "Send Feedback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};