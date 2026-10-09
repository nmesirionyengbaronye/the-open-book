import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Uni UI V2: What Changes for Waitlist Members',
  description: 'Everything you need to know about the V2 rollout, creator network, and what early access means for you.',
  keywords: ['Uni UI V2', 'waitlist benefits', 'early access', 'Southern Nigeria expansion'],
  path: '/blog/uni-ui-v2-what-changes-for-waitlist-members',
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Uni UI V2</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Waitlist</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10">Updates</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight leading-[0.95]">
            Uni UI V2: What Changes for Waitlist Members
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
            <time dateTime="2026-07-01" className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              July 1, 2026
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              6 min read
            </span>
          </div>
        </header>

        <div className="prose prose-black max-w-none space-y-8">
          <p className="text-lg leading-relaxed">
            If you&apos;re on the Uni UI waitlist, you&apos;ve seen the roadmap: FUTO live now, first
            wave of 6 Southern universities in November 2026, then 3 per month through August 2027.
            But what does V2 actually change for you as a waitlist member? Here&apos;s the breakdown.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Your position in the queue is locked</h2>
          <p>
            Every verified referral moves you up. Your position when your university opens determines
            your access tier. Early signups get priority — that hasn&apos;t changed. What <em>has</em>
            changed is that V2 brings the creator network, which means your referrals now earn you
            more than just queue position.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Free first-semester materials</h2>
          <p>
            Waitlist members who join before their university&apos;s wave get free access to
            first-semester course materials. That&apos;s lecture slides, past questions, tutorial
            solutions — uploaded by course reps and the community, organized and ready from day one.
            No scrambling for materials in week 3.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Creator network = double the opportunity</h2>
          <p>
            V2 launches the Uni UI Creator Network alongside the platform. 500 founding spots.
            If you&apos;re a student who creates content (TikTok, Instagram, campus influence), you
            can apply. Approved creators get:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>A permanent referral slug (yours forever, not tied to a campaign)</li>
            <li>5,000 tokens to kickstart your audience building</li>
            <li>10–20% commission on subscriptions you drive, plus 5–10% recurring for 6 months</li>
            <li>Founding Creator status (permanent, numbered)</li>
            <li>First 20 creators get an additional +2.5% permanent rate bump</li>
          </ul>
          <p>
            Your waitlist referral link and your creator slug work together. You&apos;re not just
            climbing a queue anymore — you&apos;re building an asset.
          </p>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Better AI, more courses, deeper context</h2>
          <p>
            V2 isn&apos;t just a UI refresh. The underlying intelligence is deeper:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Multi-document reasoning across your entire semester</li>
            <li>Symbolic math verification for calculations</li>
            <li>Pidgin and Nigerian English support out of the box</li>
            <li>Offline-first sync for unreliable campus internet</li>
            <li>Study group workspaces built in</li>
          </ul>

          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">What you should do now</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>Stay on the waitlist.</strong> Your position is your asset.</li>
            <li><strong>Refer intentionally.</strong> Target coursemates who&apos;ll actually verify and engage.</li>
            <li><strong>Consider the creator programme.</strong> If you post student content, apply at <a href="/creators" className="text-gold underline">/creators</a>.</li>
            <li><strong>Watch WhatsApp.</strong> Wave announcements go there first.</li>
          </ol>

          <div className="rounded-2xl border border-gold/40 bg-gold/[0.07] p-6 mt-10">
            <h3 className="font-display text-lg font-bold text-gold">Not on the waitlist yet?</h3>
            <p className="mt-2 text-sm leading-relaxed">
              The first wave opens November 2026. Early signups get priority access and free
              first-semester materials.
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