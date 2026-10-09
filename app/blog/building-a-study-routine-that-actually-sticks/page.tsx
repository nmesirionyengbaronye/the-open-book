import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Building a Study Routine That Actually Sticks',
  description: 'How to move from panic-studying to structured learning without burning out.',
  keywords: ['study routine Nigeria', 'study habits students', 'how to study consistently', 'productivity tips'],
  path: '/blog/building-a-study-routine-that-actually-sticks',
});

export default function BlogPost() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-[#FFD93D] text-black font-body antialiased">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Guides
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Study Habits</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Routine</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Productivity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            Building a Study Routine That Actually Sticks
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-07-22" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              July 22, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              5 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            You know the cycle. Monday: "This semester I&apos;m serious." You make a timetable.
            Color-coded. 6am wake up. Two hours per course. Sunday review. By Wednesday, you&apos;ve
            hit snooze three times, missed the 6am slot, and the timetable is now a source of guilt
            rather than structure. By Friday, it&apos;s abandoned. Sound familiar?
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">The problem isn&apos;t discipline. It&apos;s design.</h2>
          <p>
            Most study routines fail because they&apos;re designed for a person who doesn&apos;t exist:
            someone with perfect sleep, no transport issues, no surprise assignments, and infinite
            willpower. You need a routine designed for <em>you</em> — Nigerian university edition.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">1. Anchor to what already exists</h2>
          <p>
            Don&apos;t create new time slots. Anchor study to things that already happen every day:
            the bus ride, the hour between classes, the 30 minutes before bed. "I&apos;ll review
            flashcards on the bus" works. "I&apos;ll wake up at 5am" doesn&apos;t.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">2. Minimum viable session: 15 minutes</h2>
          <p>
            If your routine requires 2 hours, you&apos;ll skip it when busy. If it requires 15
            minutes, you&apos;ll do it even on the worst day. 15 minutes of active recall beats 0
            minutes of planned 2-hour session. Always.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">3. One course per day, not all courses every day</h2>
          <p>
            Trying to touch 5 courses daily means you touch none deeply. Pick one course per
            weekday. Go deep. Saturday = review week. Sunday = rest or light reading. The depth
            compounds.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">4. Track streaks, not hours</h2>
          <p>
            "I studied 10 hours this week" is a vanity metric. "I did 15 minutes of active recall
            for 21 days straight" is a system. Streaks create identity — "I&apos;m someone who
            studies daily" — and identity drives behavior more than goals.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">5. Plan for the chaos days</h2>
          <p>
            You <em>will</em> have days with surprise tests, transport nightmares, or family
            emergencies. Have a "chaos protocol": 5 minutes of flashcard review on your phone.
            That&apos;s it. The streak survives. The identity holds.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">6. Weekly review = course correction</h2>
          <p>
            Every Sunday, 10 minutes. What did I cover? What did I miss? What&apos;s coming next
            week? Adjust. The routine isn&apos;t the timetable — the routine is the weekly review
            that keeps the timetable honest.
          </p>

          <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-6 mt-10">
            <h3 className="font-display text-lg font-bold text-gold">Uni UI builds the streak for you</h3>
            <p className="mt-2 text-sm leading-relaxed">
              Daily practice questions. Streak tracking. Progress visibility. The platform handles
              the system so you just show up.
              <br /><br />
              <Link href="/join" className="text-gold underline font-semibold">
                Join the waitlist →
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-black/10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Guides
          </Link>
        </footer>
      </article>
    </main>
  );
}