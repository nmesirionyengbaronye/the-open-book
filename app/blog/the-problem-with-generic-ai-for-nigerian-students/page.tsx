import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'The Problem with Generic AI for Nigerian Students',
  description: 'Why ChatGPT and Google fail your specific courses, and how course-grounded AI changes the game.',
  keywords: ['AI for students Nigeria', 'ChatGPT vs course AI', 'generic AI problems', 'Uni UI AI'],
  path: '/blog/the-problem-with-generic-ai-for-nigerian-students',
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">AI</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Course-Grounded</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Uni UI</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            The Problem with Generic AI for Nigerian Students
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-08-10" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              August 10, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              7 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            You&apos;ve probably tried it. You ask ChatGPT a question about your course — maybe
            "Explain the finite element method for my MCE 403 assignment" — and it gives you a
            beautifully written, completely useless answer. It explains the general theory from a
            US textbook. Your lecturer uses a Nigerian code of practice. The answer is technically
            correct and practically wrong.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">The internet is not your syllabus</h2>
          <p>
            Generic AI (ChatGPT, Google, Perplexity) is trained on the internet. The internet is
            mostly US/UK curricula, Indian engineering forums, and Stack Overflow. Your syllabus at
            FUTO, UNILAG, ABU, or OAU is none of those. Your lecturer has specific preferences,
            specific notation, specific "this is how we do it here" methods that exist nowhere on
            the public internet.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Hallucination is a feature, not a bug</h2>
          <p>
            LLMs predict the next probable token. When they don&apos;t know the answer, they
            invent one that <em>looks</em> right. In casual conversation, that&apos;s annoying. In
            your final year project, it&apos;s catastrophic. You can&apos;t afford "confident but
            wrong" when the answer gets cited in your thesis.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">No sources = no verification</h2>
          <p>
            "Trust me, bro" doesn&apos;t work in engineering. You need to know <em>where</em> the
            answer came from — which slide, which page of the textbook, which clause of the code.
            Generic AI gives you an answer. Course-grounded AI gives you an answer <em>with sources
            you can verify</em>.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Context window vs. your semester</h2>
          <p>
            You can paste your lecture slides into ChatGPT. Once. Maybe twice. But you have 8
            courses, 50+ lectures per course, past questions, tutorial solutions, lab manuals.
            That&apos;s thousands of pages. No context window fits your semester. Uni UI ingests
            it all and keeps it searchable.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">What "course-grounded" actually means</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Ingestion:</strong> Your course reps upload the actual materials — slides, notes, past questions.</li>
            <li><strong>Indexing:</strong> Every document is chunked, embedded, and tagged by course, week, topic.</li>
            <li><strong>Retrieval:</strong> When you ask a question, the system searches <em>only</em> your department&apos;s materials.</li>
            <li><strong>Synthesis:</strong> The AI builds an answer from retrieved chunks, citing each source.</li>
            <li><strong>Verification:</strong> You click the citation. It opens the exact slide or page.</li>
          </ul>

          <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-6 mt-10">
            <h3 className="font-display text-lg font-bold text-gold">This is what Uni UI does</h3>
            <p className="mt-2 text-sm leading-relaxed">
              We don&apos;t train models. We build the infrastructure that makes <em>your</em>
              materials the knowledge base. Live at FUTO now. Rolling out across Southern Nigeria
              through 2027.
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