import Link from 'next/link';
import { GraduationCap, Clapperboard, Landmark, Users } from 'lucide-react';

/**
 * Four-path chooser rendered on the landing page.
 *
 * Shows the two existing paths (student → /join, creator → /creators) plus
 * the two NEW paths (/institutions, /families). Additive: does not touch
 * any existing content.
 */
export function WaitlistPaths() {
  const PATHS = [
    {
      label: 'I\'m a Student',
      sub: 'Join the waitlist',
      href: '/join',
      icon: <GraduationCap className="w-5 h-5 text-black" />,
    },
    {
      label: 'I\'m a Creator',
      sub: 'Apply to the Creator Program',
      href: '/creators',
      icon: <Clapperboard className="w-5 h-5 text-black" />,
    },
    {
      label: 'I\'m an Institution',
      sub: 'Request recognition and early access',
      href: '/institutions',
      icon: <Landmark className="w-5 h-5 text-black" />,
    },
    {
      label: 'I\'m a Parent',
      sub: 'Join the family waitlist',
      href: '/families',
      icon: <Users className="w-5 h-5 text-black" />,
    },
  ] as const;

  return (
    <section className="py-20 px-5" aria-labelledby="waitlist-paths-heading">
      <div className="max-w-5xl mx-auto text-center">
        <h2 id="waitlist-paths-heading" className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
          Pick your path.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Uni UI serves students, creators, institutions, and parents. Wherever you fit, there's a place for you on the waitlist.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-center gap-4 rounded-2xl p-6 border border-black/10 bg-black text-white shadow-[4px_4px_0px_rgba(0,0,0,0.25)] hover:border-[#FFD93D]/50 transition-all"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFD93D] text-black">
                {p.icon}
              </span>
              <div className="text-left">
                <div className="font-display text-lg font-semibold group-hover:text-[#FFD93D] transition-colors">
                  {p.label}
                </div>
                <div className="text-sm text-white/70">{p.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WaitlistPaths;
