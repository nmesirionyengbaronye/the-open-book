import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'How to Get the Most from Your Uni UI Referral Link',
  description: 'Proven tactics from top referrers to climb the waitlist queue and unlock rewards faster.',
  keywords: ['Uni UI referrals', 'referral strategy', 'waitlist queue', 'student rewards Nigeria'],
  path: '/blog/how-to-get-the-most-from-your-referral-link',
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Referrals</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Waitlist</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Rewards</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            How to Get the Most from Your Uni UI Referral Link
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-06-15" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              June 15, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              7 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            Your referral link is the single most powerful tool on the platform. Every verified
            friend who joins moves you up the queue, earns you spins, badges, and leaderboard
            position. But most people share it once, get 2–3 signups, and stop. The top referrers
            do it differently. Here&apos;s how.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">1. Personal message beats broadcast</h2>
          <p>
            Posting your link on your WhatsApp status gets views. Sending a personal message to
            Chisom saying "Hey, I know you&apos;re struggling with MTH 201 — this platform has the
            past questions organized by topic, thought it&apos;d help" gets <em>verified</em>
            signups. The conversion rate on personal messages is 10x higher.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">2. Target the pain point, not the platform</h2>
          <p>
            Don&apos;t say "Join Uni UI." Say "You know how we can never find the right past
            questions for CSC 301? This has them organized by topic and year." People join for
            their problem, not your link.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">3. The "study squad" strategy</h2>
          <p>
            Identify 3–4 people you already study with. Get all of them on. When you study
            together, you&apos;re naturally talking about the platform. "Did you see the solution
            for question 4?" "Yeah, it&apos;s on Uni UI." That&apos;s organic, recurring referral
            fuel.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">4. Follow up on pending referrals</h2>
          <p>
            Pending referrals don&apos;t count. Only verified ones do. Check your dashboard weekly.
            Message the people stuck on "pending" — "Hey, you need to verify on Telegram for it to
            count. Takes 30 seconds, here&apos;s the link." Most just forgot.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">5. Use the share templates</h2>
          <p>
            Your dashboard has pre-written templates for WhatsApp, X, Instagram, Email. They&apos;re
            tested. Use them. Customize the first line. Don&apos;t rewrite from scratch.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">6. Milestones are your marketing calendar</h2>
          <p>
            7 verified referrals = 1 spin. 14 = 2 spins. 21 = 3 spins. Every milestone is a
            reason to post: "Just hit 14 referrals — 2 spins unlocked! If you&apos;re not on the
            waitlist yet, here&apos;s my link." Milestones create natural, non-awkward reasons to
            share again.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">7. Creator network = compounding referrals</h2>
          <p>
            If you join the Creator Network, your referral slug becomes permanent. Every piece of
            content you post — TikTok, Instagram, campus talk — drives referrals passively. The
            top referrers aren&apos;t messaging people daily; they&apos;ve built an audience that
            refers itself.
          </p>

          <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-6 mt-10">
            <h3 className="font-display text-lg font-bold text-gold">Check your dashboard</h3>
            <p className="mt-2 text-sm leading-relaxed">
              See your position, pending referrals, and share templates at
              <Link href="/referral" className="text-gold underline font-semibold">
                /referral
              </Link>
              .
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