'use client';

import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Flag,
  Search,
  Users,
  Target,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const spring = { type: 'spring', stiffness: 100, damping: 12, mass: 0.5 } as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-[10px] uppercase tracking-[0.3em] text-black/70 font-semibold">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight leading-[0.95]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-black/75 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

function BenefitCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/5 p-6 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-black text-[#FFD93D] grid place-items-center font-display text-sm font-bold">
          {number}
        </div>
        <h3 className="font-display text-xl font-bold uppercase tracking-tight">{title}</h3>
      </div>
      <p className="text-sm sm:text-base leading-relaxed text-black/80">{body}</p>
    </div>
  );
}

function WeekItem({
  day,
  title,
  body,
}: {
  day: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 sm:gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-black text-[#FFD93D] grid place-items-center font-display text-sm font-bold shrink-0">
          {day}
        </div>
        <div className="mt-3 w-px flex-1 bg-black/15" />
      </div>
      <div className="pb-10">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/80">{body}</p>
      </div>
    </div>
  );
}

export default function AboutClient() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-[#FFD93D] text-black font-body antialiased">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">About Uni UI</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight leading-[0.95]">
            UNIVERSITY<br className="hidden sm:block" /> UPLOADED INTELLIGENCE.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Built by a FUTO student, for Nigerian students. This is the full story of why Uni UI exists,
            what it actually does, and why the way you study right now is quietly costing you more than
            you realize.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-24">
          <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="The problem"
                title="The semester is chaos."
                description={
                  <>
                    You&apos;re a student at a Nigerian university. You&apos;re studying something —
                    engineering, accounting, mass communication. You&apos;re in your second year, or
                    your third, or your final year. And every single semester, you go through the same
                    thing.
                    <br /><br />
                    It starts with registration. You join the class WhatsApp group. Then the department
                    group. Then the faculty group. Then someone creates a group for your study squad.
                    Then another for the course with the difficult lecturer. Then another for the
                    assignment due Friday.
                    <br /><br />
                    By week three, you&apos;re in eleven groups. You&apos;ve muted nine of them. You
                    still miss announcements because the one you muted is the one that mattered.
                  </>
                }
              />
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
              <p className="text-sm leading-relaxed text-black/80">
                Your notes are worse. Some are in a notebook you carried for the first two weeks and
                then abandoned. Some are photos on your phone — 340 images in your gallery, and you
                can&apos;t find the one with the diagram from that Tuesday lecture. Some are PDFs
                someone sent on WhatsApp that you saved to downloads and never opened again. Some are
                voice notes you recorded at 2am. Some are in your head, where they&apos;ll stay for a
                week and then evaporate.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-black/80">
                Your past questions are a mess. A PDF from a senior who graduated three years ago. A
                photo of a photo of a handwritten sheet. A Google Drive link you saved but never
                clicked. You have no idea which is current, which is outdated, which is even real.
              </p>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="The vision"
              title="What if one place held everything?"
              description={
                <>
                  Imagine opening one app on your phone. It knows your courses because you entered
                  them once at the start of the semester. It knows your level, your department, your
                  faculty. You tap into your course for the day. The notes are there — organized by
                  week and topic, not scattered across WhatsApp files.
                  <br /><br />
                  You have a question. You type it and get an answer, with sources. The answer is
                  built for your course and your level, not some generic curriculum. You want to
                  practice. There are past questions for your course, and they&apos;re actually from
                  your course. You do ten. You see which ones you got wrong. The system remembers
                  that you struggled with Topic 4 and shows you more like it.
                  <br /><br />
                  You finish the semester. Your notes, your progress, your test history — everything
                  is in one place. That&apos;s UniUI. It&apos;s not an app you open occasionally.
                  It&apos;s the place where your academic life lives.
                </>
              }
            />
          </section>

          <section>
            <div className="text-center mb-12">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/70 font-semibold">
                The benefits
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase tracking-tight leading-[0.95]">
                WHY THIS CHANGES<br className="hidden sm:block" /> EVERYTHING.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <BenefitCard
                number="01"
                title="You stop losing things."
                body="Every semester, a student loses hours just trying to locate things that should have
                  been in one place. Notes they need to study. Past questions they need to practice.
                  The announcement about the test. The assignment brief. The formula they need. UniUI
                  collapses all of that into one place. You don&apos;t lose things because
                  there&apos;s nowhere for them to go."
              />
              <BenefitCard
                number="02"
                title="You understand what you don't know."
                body="Most Nigerian students don&apos;t know what they don&apos;t know until the exam
                  proves it. UniUI closes that gap by giving you a way to test yourself
                  continuously. When you practice past questions, you see results immediately. The
                  system tracks which topics you struggle with — for you specifically. If you fail
                  three questions in a row about thermodynamics but pass everything else, the platform
                  knows. It gives you a mirror. You can see, in real time, where you actually are."
              />
              <BenefitCard
                number="03"
                title="You study with structure, not panic."
                body="There are two ways to study in Nigeria: panic and structure. Almost every student
                  wants structure. Almost every student lives in panic. The reason isn&apos;t
                  laziness. It&apos;s that structure is hard to maintain without a system. UniUI gives
                  you the structure without requiring you to build it yourself. Your courses are laid
                  out. You see what&apos;s covered and what&apos;s not. You see what&apos;s coming.
                  The difference between panic studying and structured studying is not the amount of
                  effort. It&apos;s the amount of direction."
              />
              <BenefitCard
                number="04"
                title="You're not alone in it."
                body="Studying alone is one of the worst parts of Nigerian university life. Alone,
                  everything compounds badly. You don&apos;t understand something. You have no one to
                  ask. You leave it. You fall behind. You can&apos;t catch up. UniUI puts you with
                  your people — your course mates, your class. You can share notes. You can ask
                  questions. You can find someone to study with. The loneliness of studying is a real
                  cost. UniUI removes it."
              />
              <BenefitCard
                number="05"
                title="Your progress becomes visible."
                body="For most of your academic life, you don&apos;t have a clear view of your own
                  progress. You get a result at the end of the semester. That&apos;s the only data
                  point. UniUI gives you visibility into the process: your streak, your practice
                  scores over time, the topics you&apos;ve covered and the ones you haven&apos;t.
                  These aren&apos;t vanity numbers. They&apos;re the raw material of
                  self-correction. Most students are flying blind. UniUI gives you instruments."
              />
              <BenefitCard
                number="06"
                title="You get something back for the work."
                body="Studying is real work, and Nigerian students do a lot of it with almost nothing to
                  show for it in the short term. The payoff is a grade at the end of the semester and
                  a degree at the end of four or five years. But the daily work has no immediate
                  return. UniUI gives you something back along the way: streaks, small rewards,
                  leaderboard positions, tokens. Showing up is the hardest part, and it should be
                  recognized."
              />
              <BenefitCard
                number="07"
                title="Your semester becomes a record."
                body="Your academic life is invisible. You studied hard for four or five years, and what
                  do you have to show for it? A certificate. A transcript. A grade point average.
                  Three artifacts, none of which say anything about what you actually know. UniUI
                  creates a record that closes that gap. Courses covered. Topics studied. Practice
                  questions completed. Your semester is a record, not a set of things that vanish when
                  you close your notebook."
              />
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-black/10 bg-black/5 p-6 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
              <SectionHeading
                eyebrow="A real week"
                title="What this actually looks like."
                description="Not a marketing version. A real week in the life of a student using UniUI."
              />
              <div className="mt-10">
                <WeekItem
                  day="MON"
                  title="You open UniUI and see the week ahead."
                  body="You see the courses with lectures, the topics covered, any deadlines coming. You open
                    the course you have at 10am and skim the notes from last week to refresh. You ask
                    one question about something that confused you. You read the answer. You save it to
                    your notes for that course."
                />
                <WeekItem
                  day="TUE"
                  title="You have a test on Friday. You didn&apos;t study over the weekend."
                  body="But the platform reminded you this morning. You open the practice questions for the
                    course. You answer ten. You get six right. You review the four you missed. Three
                    of them were from the same topic. You open the notes on that topic and read them
                    again."
                />
                <WeekItem
                  day="WED"
                  title="You&apos;re in your study group."
                  body="Someone posted a note they took from the lecture you missed. You read it, add a
                    comment, and share a small thing you understood that they might not have. You&apos;re
                    not behind anymore."
                />
                <WeekItem
                  day="THU"
                  title="You study the topic that you struggled with on Tuesday."
                  body="You do another set of practice questions — ten more. You get eight right this time.
                    You see the improvement. You feel it. You&apos;re not panicking for tomorrow."
                />
                <WeekItem
                  day="FRI"
                  title="The test is today."
                  body="You take it. You know the material. It feels different from a normal test. Not
                    because you&apos;re smarter, but because you&apos;re prepared. You walk out not
                    wondering if you passed."
                />
                <WeekItem
                  day="SAT"
                  title="You relax. You have a streak going."
                  body="Four weeks of studying without a break. You don&apos;t want to lose it. You do a
                    small session — ten practice questions on a different course. It takes twenty
                    minutes. The streak continues."
                />
                <WeekItem
                  day="SUN"
                  title="You look at your progress."
                  body="You see the topics covered, the questions answered, the streak. You see the courses
                    you&apos;ve been neglecting. You decide to spend some time on the neglected one
                    next week."
                />
              </div>
            </div>
          </section>

          <section>
            <SectionHeading
              eyebrow="Why it matters"
              title="Why this matters more than it sounds."
              description="The individual benefits sound small. They compound."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">The chain reaction</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/80">
                  If you don&apos;t lose notes, you can study more. If you study more, you understand
                  more. If you understand more, you practice better. If you practice better, you feel
                  more in control. If you feel more in control, you don&apos;t panic. If you
                  don&apos;t panic, you study with structure. The chain reaction is what matters.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black/5 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">The honest limits</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/80">
                  UniUI doesn&apos;t replace your lecturers. It doesn&apos;t guarantee you&apos;ll
                  pass. It doesn&apos;t take away the difficulty of learning. What it does is give you
                  a system. A place where your academic life lives, where the information stays, where
                  the structure is provided, where you&apos;re not alone. The rest is you.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
              <Sparkles className="w-5 h-5" />
              <span className="font-display text-lg font-bold uppercase tracking-tight">
                The one-line answer
              </span>
            </div>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-black/85 max-w-3xl mx-auto">
              UniUI is where a student uploads their entire semester — courses, notes, past questions,
              deadlines, groups, progress — into one place, and the platform then runs the semester: it
              keeps what you&apos;d lose, it shows you what you don&apos;t know, it gives you
              structure so you don&apos;t study in panic, it keeps you with your people so you&apos;re
              not alone, it makes your progress visible so you can correct in real time, it gives you
              something back for the work you do along the way, and it turns your semester into a
              record instead of a set of things that vanish.
            </p>
            <div className="mt-8">
              <a
                href="/join"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-[#FFD93D] font-semibold shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:translate-y-[-2px] transition-transform"
              >
                Join the waitlist <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}