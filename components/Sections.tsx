'use client';

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Upload, ShieldCheck, Sparkles, Brain, FileSearch, MessageSquare, Award, ChevronDown } from "lucide-react";

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
  { n: "01", t: "UPLOAD YOUR MATERIALS", d: "DROP YOUR PDFS, SLIDES, PAST QUESTIONS, AND HANDWRITTEN NOTES.", icon: Upload },
  { n: "02", t: "AI STRUCTURES THEM", d: "WE EXTRACT TOPICS, EQUATIONS, DEFINITIONS, AND WORKED EXAMPLES.", icon: Brain },
  { n: "03", t: "ASK ANYTHING", d: "USE PLAIN ENGLISH. PIDGIN WORKS TOO. WE UNDERSTAND BOTH.", icon: MessageSquare },
  { n: "04", t: "GET VERIFIED ANSWERS", d: "EVERY ANSWER CITES THE EXACT SLIDE OR PAGE IT CAME FROM.", icon: Sparkles },
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
  { q: "WHAT IS UNI UI?", a: "IT'S AN AI STUDY ASSISTANT TRAINED ONLY ON THE MATERIALS YOU AND YOUR CLASSMATES UPLOAD. NO RANDOM INTERNET SOURCES." },
  { q: "HOW IS IT DIFFERENT FROM CHATGPT?", a: "CHATGPT GUESSES FROM THE WHOLE INTERNET. UNI UI ONLY ANSWERS FROM YOUR UPLOADED NOTES, PAST QUESTIONS, AND SLIDES. EVERY ANSWER CITES A PAGE." },
  { q: "WHEN DOES IT LAUNCH?", a: "CLOSED BETA OPENS FOR THE FIRST 100 WAITLIST SIGNUPS. PUBLIC BETA AFTER WE HIT 500. TARGETING BEFORE NEXT SEMESTER RESUMES." },
  { q: "IS IT FREE?", a: "YOU GET FREE CREDITS FOR EVERY SET OF NOTES YOU UPLOAD. HEAVY USERS CAN BUY A SMALL CREDIT PACK — FAR LESS THAN ONE TUTORIAL." },
  { q: "WHICH SCHOOLS ARE SUPPORTED AT LAUNCH?", a: "FUTO FIRST, THEN UNILAG, UI, UNN, ABU, OAU, UNIBEN, FUTA, AND UNIPORT." },
  { q: "WILL MY NOTES BE SHARED?", a: "ONLY WITH PEOPLE IN THE SAME COURSE CODE AT YOUR SCHOOL — AND ONLY AFTER YOU OPT IN. YOUR NAME IS NEVER ATTACHED." },
  { q: "DOES IT HANDLE PIDGIN AND CODE-MIXED QUESTIONS?", a: "YES. WE TESTED IT ON IGBO, YORUBA, HAUSA, AND PIDGIN PHRASING. ASK HOW YOU'D ASK A FRIEND." },
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};