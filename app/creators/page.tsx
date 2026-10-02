import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles, Coins, Megaphone, Users, Download, FileText, TrendingUp, Rocket,
  Link2, BadgeCheck, BarChart3, Award, Wifi, Briefcase, Shirt, Target, Clock,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';
import { CreatorApplicationForm } from '@/components/CreatorApplicationForm';
import { SeoJsonLd } from '@/components/SeoJsonLd';
import { pageMeta, webPageSchema, faqSchema, type Faq } from '@/lib/seo';
import {
  CREATOR_BUNDLE,
  FOUNDING_NETWORK_TIERS,
  FOUNDING_NETWORK_SIZE,
  IMMEDIATE_START_PATH,
  NETWORK_AUDIENCE,
  PRELAUNCH_PILLARS,
  PRELAUNCH_RULE,
} from '@/lib/creator-program';

const DESCRIPTION =
  `Join the Uni UI Creator Network. ${FOUNDING_NETWORK_SIZE} founding spots. Nigerian student ` +
  'creators get creator access, 5,000 tokens, a permanent referral slug and 10–20% commission ' +
  'plus 5–10% recurring. You start building your audience now — not at launch.';

const OG_IMAGE = '/og-creators.jpg';

const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const PERK_ICONS = {
  sparkles: Sparkles, coins: Coins, badge: BadgeCheck, link: Link2,
  chart: BarChart3, users: Users, megaphone: Megaphone, rocket: Rocket,
  award: Award, wifi: Wifi, briefcase: Briefcase, shirt: Shirt,
} as const;

const DOCS = [
  { href: '/creator-program/docs/02_creator_program_overview.pdf', title: 'Network Overview', meta: 'What the network is, the founding bundle, and how you are paid.' },
  { href: '/creator-program/docs/08_creator_program_terms.pdf', title: 'Programme Terms', meta: 'Commission tiers, attribution, fraud rules and weekly payout mechanics.' },
  { href: '/creator-program/docs/04_week1_onboarding_pack.pdf', title: 'Week 1 — Onboarding Pack', meta: 'Set up your creator identity and understand the network.' },
  { href: '/creator-program/docs/05_week2_product_demonstration_guide.pdf', title: 'Week 2 — Demonstration Guide', meta: 'Three demo formats, five hooks, and a 60-second structure.' },
  { href: '/creator-program/docs/06_week3_content_playbook_campaign_briefs.pdf', title: 'Week 3 — Content Playbook', meta: 'The six pre-launch pillars, campaign briefs and content rules.' },
  { href: '/creator-program/docs/07_approved_claims_messaging_guide.pdf', title: 'Approved Claims Guide', meta: 'What you may say about Uni UI, and what you must never say.' },
];

const FAQS: Faq[] = [
  {
    question: 'Do I have to wait for Uni UI V2 before I start?',
    answer:
      'No, and that is the point. The creator network exists independently of the product. Your referral slug and dashboard are issued at approval, not at launch, so you start building your audience on day one. When V2 launches you accelerate into an audience that already trusts you.',
  },
  {
    question: 'What am I actually selling if the product does not exist yet?',
    answer:
      'You are not selling a product. You are building an audience and a creator brand. The content pillars before launch are your own journey, the student problems Uni UI will eventually solve, your normal study and campus content, and the network itself. When V2 lands, that audience converts.',
  },
  {
    question: 'Do I need a minimum number of followers to join?',
    answer:
      'No. There is no follower threshold to clear. We select on audience relevance and genuine engagement in the comments. Creators typically have between 500 and 5,000 followers, and a student with 2,000 real campus followers is worth more to us than an account with 30,000 people outside the target audience.',
  },
  {
    question: 'How much can a creator earn?',
    answer:
      'Commission is a percentage of what a subscriber pays, not a flat fee. It scales with the number of paying subscribers you bring, from 10% of the first payment at Starter tier up to 20% at Top tier, plus recurring commission for six months. A typical creator earns between ₦1,000 and ₦2,400 per subscriber.',
  },
  {
    question: 'What is the founding creator bonus?',
    answer:
      'The first twenty approved creators receive an additional 2.5% added permanently to every commission rate. All 500 founding creators hold permanent numbered Founding Creator status, but the rate bump belongs to the first twenty.',
  },
  {
    question: 'What are the 5,000 tokens for?',
    answer:
      'Tokens are the network’s currency, not a reward. Creators gift them to their audience to drive engagement, spend them on subscriptions for giveaway winners, use them to run their own mini-campaigns, or hold them as an asset.',
  },
  {
    question: 'Is this the same as the Uni UI Ambassador Programme?',
    answer:
      'No, they are separate programmes with separate rates. Ambassadors earn for recruiting effort on campus. Creators earn for audience reach. If someone qualifies for both, they choose one and the two never stack.',
  },
  {
    question: 'How and when do I get paid?',
    answer:
      'Payouts run weekly through Paystack. Commission is held seven days after a subscriber pays to allow for refunds, and balances below ₦10,000 carry forward to the next batch rather than being forfeited.',
  },
];

export const metadata: Metadata = pageMeta({
  title: 'Creator Network – Build Your Audience From Day One | Uni UI',
  description: DESCRIPTION,
  keywords: [
    'Uni UI creator network', 'student creator Nigeria', 'TikTok creator programme Nigeria',
    'earn as a student creator', 'micro influencer Nigeria', 'university student creator',
    'creator community Nigeria', 'content creator earnings', 'student side hustle Nigeria',
    'founding creator', 'Uni UI creators', 'performance based commission',
    'student creator application', 'build audience Nigeria',
  ],
  path: '/creators',
  image: OG_IMAGE,
  imageAlt: 'Uni UI Creator Network — you are not promoting a product, you are building a network',
});

export default function CreatorsPage() {
  return (
    <>
      <SeoJsonLd
        data={webPageSchema({
          name: 'Uni UI Creator Network',
          description: DESCRIPTION,
          path: '/creators',
          breadcrumb: [{ name: 'Creator Network', path: '/creators' }],
        })}
      />
      <SeoJsonLd data={faqSchema(FAQS)} />

      {/* ---------------- Hero ---------------- */}
      <section className="relative isolate overflow-hidden pt-28 pb-16 px-5">
        <Image
          src="/creator-program/campus-group_study.jpg"
          alt="Nigerian university students studying together on campus"
          fill priority sizes="100vw"
          className="object-cover object-center -z-10"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08080C] via-[#08080C]/93 to-[#08080C]/55" />
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-[0.2em]">
            <Rocket className="w-3.5 h-3.5" />
            {FOUNDING_NETWORK_SIZE} founding spots
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight">
            You are not promoting a product.
            <br />
            <span className="text-gold">You are building a network.</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            We are building a network of {FOUNDING_NETWORK_SIZE} Nigerian student creators. You get
            tools, status and a share of what the network earns. You start now. You build your
            audience. When Uni UI V2 launches, you are already positioned.
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
            You own a piece of it — your slug, your audience, your earnings, your status, your place
            in the founding record.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#apply" className="px-6 py-3 rounded-xl bg-gold text-background font-semibold gold-glow-hover">
              Claim your spot
            </a>
            <a href="#network" className="px-6 py-3 rounded-xl glass border-gold/40 text-gold font-medium hover:bg-gold/10">
              See what you get
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Applications are reviewed within 48 hours · Your referral slug is issued at approval,
            not at launch.
          </p>
        </div>
      </section>

      {/* ---------------- The asset ---------------- */}
      <section className="px-5 py-14" aria-labelledby="asset-heading">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 id="asset-heading" className="font-display text-3xl font-bold tracking-tight">
              The network is the asset
            </h2>
            <p className="mt-3 text-muted-foreground">
              Uni UI is building three layers. The creator network is the second one — and it is
              the only one that launches now.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { n: '01', t: 'The AI academic platform', b: 'Uni UI V2. Launches whenever it is ready, into an audience that already exists.', active: false },
                { n: '02', t: 'The creator network', b: `${FOUNDING_NETWORK_SIZE} founding creators, live now. It does not need the product to exist in order to work.`, active: true },
                { n: '03', t: 'The audience it brings', b: 'Students who follow a creator they trust, and who arrive already knowing Uni UI is coming.', active: false },
              ].map((l) => (
                <div key={l.n} className={`rounded-xl p-5 border ${l.active ? 'border-gold/50 bg-gold/[0.07]' : 'border-white/5 bg-white/[0.02]'}`}>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-xs font-mono ${l.active ? 'text-gold' : 'text-muted-foreground'}`}>{l.n}</span>
                    <div>
                      <h3 className={`font-semibold ${l.active ? 'text-gold' : ''}`}>{l.t}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{l.b}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-8 border-gold/30 text-center">
            <Target className="w-8 h-8 text-gold mx-auto" />
            <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Warm audience at launch day
            </div>
            <div className="mt-2 text-5xl font-display font-bold text-gold">
              {NETWORK_AUDIENCE.toLocaleString('en-NG')}
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {FOUNDING_NETWORK_SIZE} creators averaging 1,000 engaged followers each. That is the
              asset the network builds before V2 exists — and the reason launch becomes a spike
              rather than a start.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Start now ---------------- */}
      <section id="start-now" className="px-5 py-14 scroll-mt-24" aria-labelledby="start-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="start-heading" className="font-display text-3xl font-bold tracking-tight">
            You start now. Not at launch.
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Your referral slug and dashboard are issued the moment you are approved. Nothing about
            the network waits on V2.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMMEDIATE_START_PATH.map((w, i) => (
              <div key={w.week} className="glass rounded-2xl p-5 border-gold/20">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{w.week}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{w.focus}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.posts}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pre-launch pillars ---------------- */}
      <section className="px-5 py-14" aria-labelledby="pillars-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="pillars-heading" className="font-display text-3xl font-bold tracking-tight">
            What you post before the product exists
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">{PRELAUNCH_RULE}</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRELAUNCH_PILLARS.map((p) => (
              <div key={p.name} className="glass rounded-2xl p-5 border-gold/20">
                <h3 className="font-display text-lg font-semibold text-gold">{p.name}</h3>
                <p className="mt-2 text-sm italic text-muted-foreground">{p.example}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.purpose}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-gold/40 bg-gold/[0.07] p-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-gold font-semibold">The rule that makes this work:</span> the
              metric that matters is not how many creators post on launch day. It is how large the
              network&rsquo;s combined audience is by launch day. That is what you are building, from
              today.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- The bundle ---------------- */}
      <section id="network" className="px-5 py-14 scroll-mt-24" aria-labelledby="bundle-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="bundle-heading" className="font-display text-3xl font-bold tracking-tight">
            What you get
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Every perk is a tool for building, not a product sample. Premium is the equipment you
            need to do the job; tokens are the currency you spend doing it.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CREATOR_BUNDLE.map((perk) => {
              const Icon = PERK_ICONS[perk.icon];
              return (
                <div key={perk.name} className="glass rounded-2xl p-5 border-gold/20">
                  <div className="w-9 h-9 rounded-lg bg-gold/15 grid place-items-center">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <h3 className="mt-3 font-semibold text-sm leading-snug">{perk.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{perk.tool}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Founding tiers ---------------- */}
      <section className="px-5 py-14" aria-labelledby="tiers-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="tiers-heading" className="font-display text-3xl font-bold tracking-tight">
            Founding spots are tiered by order of entry
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            All {FOUNDING_NETWORK_SIZE} founding creators hold permanent numbered status. The
            earlier cohorts carry a larger cash bundle, and the first twenty carry the permanent
            rate bump.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FOUNDING_NETWORK_TIERS.map((t) => (
              <div key={t.id} className="glass rounded-2xl p-6 border-gold/20">
                <h3 className="font-display text-lg font-semibold text-gold">{t.name}</h3>
                <div className="mt-2 text-3xl font-display font-bold">{naira(t.costEach)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.size} {t.size === 1 ? 'spot' : 'spots'} &middot; cumulative to {t.upTo}
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.bundle}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Commission rates are identical across all cohorts except the +2.5% founding bump. See
            the terms for the full rate table.
          </p>
        </div>
      </section>

      {/* ---------------- Commission ---------------- */}
      <section className="px-5 py-14" aria-labelledby="earnings-heading">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 id="earnings-heading" className="font-display text-3xl font-bold tracking-tight">
              How you are paid
            </h2>
            <p className="mt-2 text-muted-foreground">
              Commission is a percentage of what a subscriber pays, not a flat fee. It scales
              automatically with the number of paying subscribers you bring.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              The first twenty approved creators carry a permanent +2.5% on every rate.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Deep Study is a one-time purchase and earns no recurring commission. Its commission is
              capped at {naira(500)} so a single sale can never consume that product&rsquo;s margin.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 border-gold/20 overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Uni UI creator commission tiers by paying subscribers</caption>
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-gold/20">
                  <th scope="col" className="pb-2">Tier</th>
                  <th scope="col" className="pb-2">Subscribers</th>
                  <th scope="col" className="pb-2 text-right">First</th>
                  <th scope="col" className="pb-2 text-right">Monthly &times;6</th>
                  <th scope="col" className="pb-2 text-right">Founding total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { tier: 'Starter', range: '0–9', first: '10%', rec: '5%', fnd: '₦1,437.50' },
                  { tier: 'Growing', range: '10–49', first: '12.5%', rec: '7.5%', fnd: '₦1,875.00' },
                  { tier: 'Established', range: '50–199', first: '15%', rec: '10%', fnd: '₦2,312.50' },
                  { tier: 'Top', range: '200+', first: '20%', rec: '10%', fnd: '₦2,437.50' },
                ].map((r) => (
                  <tr key={r.tier}>
                    <th scope="row" className="py-2.5 font-medium text-gold">{r.tier}</th>
                    <td className="py-2.5 text-muted-foreground">{r.range}</td>
                    <td className="py-2.5 text-right">{r.first}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{r.rec}</td>
                    <td className="py-2.5 text-right">{r.fnd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Per paying subscriber on the {naira(2500)} Scholar subscription. Founding total
              includes the permanent +2.5% bump.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Selection ---------------- */}
      <section className="px-5 py-14" aria-labelledby="selection-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="selection-heading" className="font-display text-3xl font-bold tracking-tight">
            How selection works
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            We select on relevance and genuine engagement, not follower count.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Nigerian university or polytechnic student',
              'Posted on TikTok or Instagram in the last 14 days',
              'Student-relevant content: study, campus, exams, tech, lifestyle',
              'Genuine engagement in the comments, not just likes',
              'Typically between 500 and 5,000 followers',
              'Willing to post at least twice a week during campaigns',
            ].map((c, i) => (
              <div key={c} className="flex items-start gap-3 glass rounded-xl p-4 border-gold/15">
                <span className="text-gold font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm">{c}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-gold/40 bg-gold/[0.07] p-5">
            <p className="text-sm text-muted-foreground">
              <span className="text-gold font-semibold">Four or more yeses is an approval.</span> Two
              or fewer is a decline. Three is held for review, and we will tell you which criterion
              was unclear. Every application is answered within 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Onboarding imagery ---------------- */}
      <section className="px-5 py-14" aria-labelledby="onboarding-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="onboarding-heading" className="font-display text-3xl font-bold tracking-tight">
            Three weeks to get running
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Onboarding runs alongside your own posting, not instead of it. You are publishing
            throughout.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { week: 'Week 1', verb: 'Identify', body: 'Set up your creator identity and understand the network. Task: publish your introduction post.', img: '/creator-program/campus-student_studying.jpg', alt: 'Student working on a laptop with course notes' },
              { week: 'Week 2', verb: 'Demonstrate', body: 'Learn three demo formats and five hooks. Task: record one demo under 60 seconds and get group feedback.', img: '/creator-program/campus-phone_learning.jpg', alt: 'Student recording a short video on a phone while studying' },
              { week: 'Week 3', verb: 'Build', body: 'Pick two content pillars and draft three ideas each. Task: post six ideas with your disclosure line.', img: '/creator-program/campus-walkway.jpg', alt: 'University walkway between academic buildings' },
            ].map(({ week, verb, body, img, alt }) => (
              <figure key={week} className="glass rounded-2xl overflow-hidden border-gold/20">
                <div className="relative aspect-[16/10]">
                  <Image src={img} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-transparent" />
                  <figcaption className="absolute bottom-3 left-4">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{week}</span>
                    <span className="block font-display text-xl font-bold">{verb}</span>
                  </figcaption>
                </div>
                <div className="p-5"><p className="text-sm text-muted-foreground leading-relaxed">{body}</p></div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Documents ---------------- */}
      <section id="documents" className="px-5 py-14 scroll-mt-24" aria-labelledby="docs-heading">
        <div className="max-w-5xl mx-auto">
          <h2 id="docs-heading" className="font-display text-3xl font-bold tracking-tight">
            Programme documents
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Read the overview and terms before you apply. The weekly packs are released to approved
            creators.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DOCS.map((doc) => (
              <a key={doc.href} href={doc.href} className="group glass rounded-2xl p-5 border-gold/20 hover:border-gold/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 grid place-items-center shrink-0">
                    <FileText className="w-5 h-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold flex items-center gap-2">
                      {doc.title}
                      <Download className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold transition-colors" />
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{doc.meta}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Bank details are not collected at this stage. Those are collected at payout onboarding,
            once you have earned something. Questions?{' '}
            <Link href="/contact" className="text-gold underline">Contact us</Link>.
          </p>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="px-5 py-14" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="font-display text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.question} className="glass rounded-xl p-5 border-gold/20">
                <summary className="cursor-pointer font-medium">{f.question}</summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CreatorApplicationForm />
    </>
  );
}