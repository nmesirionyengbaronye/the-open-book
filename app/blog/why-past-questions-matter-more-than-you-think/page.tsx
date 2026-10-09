import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Why Past Questions Matter More Than You Think',
  description: 'The data behind why practicing past questions is the single highest-ROI study activity for Nigerian students.',
  keywords: ['past questions Nigeria', 'past questions importance', 'exam preparation tips', 'study strategy'],
  path: '/blog/why-past-questions-matter-more-than-you-think',
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Past Questions</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Study Strategy</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Exam Prep</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            Why Past Questions Matter More Than You Think
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-08-28" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              August 28, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              6 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            Ask any final-year student what they&apos;d tell their 200-level self, and the answer is
            almost always the same: "Start past questions earlier." But why? What makes past questions
            so uniquely valuable compared to textbooks, lecture slides, or tutorial notes?
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">They&apos;re the exam, not the curriculum</h2>
          <p>
            Your curriculum is everything the lecturer <em>could</em> test. The exam is what they
            <em>actually</em> test. In Nigerian universities, the gap between those two is massive.
            Lecturers teach 50 topics; exams cover 8–12. Past questions map the 12.
          </p>
          <p>
            When you study from textbooks, you&apos;re studying the 50. When you study past questions,
            you&apos;re studying the 12. The ROI difference is 4x.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Patterns are predictable</h2>
          <p>
            Nigerian examiners are creatures of habit. The same questions reappear with minor
            variations year after year. A 2018 Fluid Mechanics question will appear in 2024 with
            different numbers. The <em>structure</em> of the answer — the steps, the formula, the
            assumptions — stays identical.
          </p>
          <p>
            If you&apos;ve seen the pattern once, you&apos;ve seen it for every year. That&apos;s why
            the last 5 years of past questions are worth more than any textbook.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">They teach you the <em>language</em> of the exam</h2>
          <p>
            Every course has a dialect. In Thermodynamics, "show that" means derive from first
            principles. In Circuit Analysis, "determine" means solve numerically. In Soil Mechanics,
            "comment on" means state the implication. Past questions teach you this dialect. Your
            notes don&apos;t.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">They expose the trap questions</h2>
          <p>
            Some questions look straightforward but have a hidden assumption that changes everything.
            The only way to learn the trap is to fall into it during practice — not in the exam hall.
            Past questions are your safe failure space.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">How to actually use them (not just "do them")</h2>
          <ol className="list-decimal list-inside space-y-4">
            <li>
              <strong>Do them timed.</strong> Same duration as the real exam. No notes. No calculator if
              the exam doesn&apos;t allow one.
            </li>
            <li>
              <strong>Mark them honestly.</strong> Don&apos;t give yourself "half marks" for "I knew
              that." You either got it or you didn&apos;t.
            </li>
            <li>
              <strong>Categorize every error.</strong> Was it a knowledge gap? A misread? A calculation
              mistake? A time issue? Different fixes for each.
            </li>
            <li>
              <strong>Re-do the wrong ones in 48 hours.</strong> Not "review." Re-do. Fresh paper.
              Different numbers if possible.
            </li>
            <li>
              <strong>Build your "cheat sheet" from errors.</strong> Every mistake becomes a one-line
              rule on your final review sheet. "Always check units before substituting." "Distinguish
              between shear stress and bending stress."
            </li>
          </ol>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">The Uni UI approach</h2>
          <p>
            On Uni UI, past questions aren&apos;t PDFs you download and forget. They&apos;re structured
            by topic, linked to the exact lecture slides they reference, and the AI walks you through
            the solution step-by-step — citing the source material. You practice, you get stuck, you
            ask, you learn.
          </p>
          <p>
            <Link href="/join" className="text-gold underline font-semibold">
              Join the waitlist →
            </Link>
          </p>
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