import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'How to Study Effectively in Nigerian Universities: A Practical Guide',
  description: 'Real strategies for managing coursework, past questions, and exam preparation when the system works against you.',
  keywords: ['study tips Nigeria', 'how to study effectively', 'Nigerian university study guide', 'exam preparation'],
  path: '/blog/how-to-study-effectively-in-nigerian-universities',
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Study Tips</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Nigerian Students</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Exam Prep</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            How to Study Effectively in Nigerian Universities: A Practical Guide
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-09-15" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              September 15, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              8 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            If you&apos;re a student at a Nigerian university, you already know the drill. The semester starts,
            and within three weeks you&apos;re drowning in WhatsApp groups, scattered notes, and the sinking
            feeling that you&apos;re falling behind. The usual advice — "read your notes," "start early,"
            "form a study group" — sounds reasonable until you try to actually do it alongside registration
            queues, transport wahala, and lecturers who change the syllabus mid-semester.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">1. Accept the chaos, then build your system</h2>
          <p>
            The first mistake is thinking you can organize the university&apos;s chaos. You can&apos;t. The
            registrar will still post the timetable on a notice board at 8pm on Friday. The lecturer will
            still cancel class without notice. What you <em>can</em> control is your personal system for
            capturing, organizing, and retrieving what matters.
          </p>
          <p>
            Start with one rule: <strong>if it&apos;s not in your system, it doesn&apos;t exist.</strong>
            Every announcement, every note, every past question — it goes into your system immediately.
            Not "later today." Not "this weekend." Immediately.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">2. Use the "One Semester, One Place" rule</h2>
          <p>
            Pick one place for all academic content. Not a folder on your phone. Not Google Drive. Not
            WhatsApp. One app, one notebook, one Notion workspace — whatever works, but <em>one</em>.
            Every course gets a section. Every week gets a page. Every past question gets tagged to its
            topic.
          </p>
          <p>
            This is exactly what Uni UI was built for. When your department&apos;s materials are uploaded,
            they&apos;re organized by course, week, and topic automatically. You don&apos;t build the system;
            you just use it.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">3. Past questions first, notes second</h2>
          <p>
            Most students read notes first, then try past questions. Flip it. Start with the past
            questions for your course. They tell you <em>what actually gets tested</em>. Your notes
            cover everything; past questions cover what matters.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Get the last 5 years of past questions for each course.</li>
            <li>Identify the topics that appear every single year.</li>
            <li>Master those topics first. They&apos;re your highest ROI.</li>
            <li>Then use your notes to fill gaps in your understanding of those topics.</li>
          </ul>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">4. Active recall beats passive reading</h2>
          <p>
            Reading your notes feels like studying. It&apos;s not. Testing yourself is studying. Every
            time you close your notes and try to explain a concept from memory, you&apos;re strengthening
            the neural pathway. Every time you re-read a slide, you&apos;re just recognizing it.
          </p>
          <p>
            Turn every topic into questions. "What are the three conditions for equilibrium?" not
            "Read the equilibrium slide." Practice answering without looking. The discomfort of not
            knowing is where learning happens.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">5. Spaced repetition, not cramming</h2>
          <p>
            You know this. But the Nigerian semester doesn&apos;t give you space — tests come fast,
            assignments pile up. The hack: <strong>10 minutes daily beats 3 hours weekly.</strong>
            Review one topic for 10 minutes before bed. Do it every day. The spacing effect works even
            in tiny doses.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">6. Study groups: quality over quantity</h2>
          <p>
            A WhatsApp group with 200 people is not a study group. Find 3–4 people in your course who
            actually show up. Meet once a week. Each person teaches one topic they understand well.
            Teaching forces clarity — if you can&apos;t explain it, you don&apos;t know it.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">7. Track what you don&apos;t know</h2>
          <p>
            Keep a "confusion log." Every time you hit a concept you don&apos;t understand, write it
            down. Review the log weekly. The goal isn&apos;t to feel good about what you know — it&apos;s
            to eliminate what you don&apos;t.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">8. Protect your sleep and fuel</h2>
          <p>
            You can&apos;t study effectively on 3 hours of sleep and gala + coke. It&apos;s not heroic;
            it&apos;s counterproductive. Your brain consolidates memory during sleep. Skip it, and
            yesterday&apos;s study session literally didn&apos;t happen.
          </p>

          <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-6 mt-10">
            <h3 className="font-display text-lg font-bold text-gold">The Uni UI shortcut</h3>
            <p className="mt-2 text-sm leading-relaxed">
              We built Uni UI because these systems are hard to maintain manually. When your school goes
              live on the platform, your courses are pre-structured, past questions are tagged to topics,
              and the AI answers questions from <em>your actual materials</em> — not the internet.
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