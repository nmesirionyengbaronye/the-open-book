import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { pageMeta } from '@/lib/seo';

const POSTS = [
  {
    slug: 'how-to-study-effectively-in-nigerian-universities',
    title: 'How to Study Effectively in Nigerian Universities: A Practical Guide',
    excerpt: 'Real strategies for managing coursework, past questions, and exam preparation when the system works against you.',
    date: '2026-09-15',
    readTime: '8 min',
    tags: ['Study Tips', 'Nigerian Students', 'Exam Prep'],
  },
  {
    slug: 'why-past-questions-matter-more-than-you-think',
    title: 'Why Past Questions Matter More Than You Think',
    excerpt: 'The data behind why practicing past questions is the single highest-ROI study activity for Nigerian students.',
    date: '2026-08-28',
    readTime: '6 min',
    tags: ['Past Questions', 'Study Strategy', 'Exam Prep'],
  },
  {
    slug: 'the-problem-with-generic-ai-for-nigerian-students',
    title: 'The Problem with Generic AI for Nigerian Students',
    excerpt: 'Why ChatGPT and Google fail your specific courses, and how course-grounded AI changes the game.',
    date: '2026-08-10',
    readTime: '7 min',
    tags: ['AI', 'Course-Grounded', 'Uni UI'],
  },
  {
    slug: 'building-a-study-routine-that-actually-sticks',
    title: 'Building a Study Routine That Actually Sticks',
    excerpt: 'How to move from panic-studying to structured learning without burning out.',
    date: '2026-07-22',
    readTime: '5 min',
    tags: ['Study Habits', 'Routine', 'Productivity'],
  },
  {
    slug: 'uni-ui-v2-what-changes-for-waitlist-members',
    title: 'Uni UI V2: What Changes for Waitlist Members',
    excerpt: 'Everything you need to know about the V2 rollout, creator network, and what early access means for you.',
    date: '2026-07-01',
    readTime: '6 min',
    tags: ['Uni UI V2', 'Waitlist', 'Updates'],
  },
  {
    slug: 'how-to-get-the-most-from-your-referral-link',
    title: 'How to Get the Most from Your Uni UI Referral Link',
    excerpt: 'Proven tactics from top referrers to climb the waitlist queue and unlock rewards faster.',
    date: '2026-06-15',
    readTime: '7 min',
    tags: ['Referrals', 'Waitlist', 'Rewards'],
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Blog — Study Guides, Updates & Student Resources',
  description: 'Practical study guides, Uni UI updates, and resources for Nigerian university students. Learn how to study smarter, not harder.',
  keywords: [
    'Uni UI blog', 'study guides Nigeria', 'exam preparation tips', 'Nigerian student resources',
    'past questions guide', 'AI study assistant', 'university study tips',
  ],
  path: '/blog',
});

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-[#FFD93D] text-black font-body antialiased">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#FFD93D] shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Resources</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight leading-[0.95]">
            Guides & <span className="text-gold">Updates</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Practical study guides, product updates, and resources for Nigerian university students.
            Written by students, for students.
          </p>
        </div>

        <div className="space-y-8">
          {POSTS.map((post) => (
            <article
              key={post.slug}
              className="group glass rounded-2xl border border-black/10 bg-black/5 p-6 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:border-gold/50 transition-colors"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-[0.2em] text-black/70 px-2.5 py-1 rounded-full bg-black/5 border border-black/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="block"
              >
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight leading-snug group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-3 text-black/70 leading-relaxed">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
                <time dateTime={post.date} className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime} read
                </span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-gold font-semibold text-sm hover:underline"
              >
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-black/70 mb-4">
            Want to stay updated? Join the waitlist and we'll WhatsApp you when new guides drop.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-[#FFD93D] font-semibold shadow-[4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            Join the waitlist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}