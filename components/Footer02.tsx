import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer02() {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-lg font-bold tracking-tight">Uni <span className="text-gold">UI</span></div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              University Uploaded Intelligence. AI that learns from your actual semester notes and materials — no generic internet answers.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Product</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/#features" className="hover:text-gold transition">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-gold transition">How it works</Link></li>
              <li><Link href="/#faq" className="hover:text-gold transition">FAQ</Link></li>
              <li><Link href="/rewards" className="hover:text-gold transition">Rewards</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Community</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-gold transition">About</Link></li>
              <li><Link href="/leaderboard" className="hover:text-gold transition">Leaderboard</Link></li>
              <li><Link href="/winners" className="hover:text-gold transition">Winners</Link></li>
              <li><Link href="/recommendations" className="hover:text-gold transition">Recommendations</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Stay connected</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
              <li><a href="https://wa.me/2348105799378" target="_blank" rel="noreferrer" className="hover:text-gold transition">WhatsApp</a></li>
              <li><a href="mailto:hello@uniui.com.ng" className="hover:text-gold transition">Email</a></li>
              <li><a href="https://github.com/Panther0508/the-open-book" target="_blank" rel="noreferrer" className="hover:text-gold transition">Open Source</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Uni UI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Panther0508/the-open-book" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-gold transition">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="text-muted-foreground hover:text-gold transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-gold transition">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="mailto:hello@uniui.com.ng" aria-label="Email" className="text-muted-foreground hover:text-gold transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
