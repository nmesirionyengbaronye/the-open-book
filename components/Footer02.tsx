import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { X_URL, TIKTOK_URL, SUPPORT_EMAIL } from '@/lib/links';

export default function Footer02() {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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
              <li><Link href="/feedback" className="hover:text-gold transition">Feedback</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Legal</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/privacy" className="hover:text-gold transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition">Terms of Service</Link></li>
              <li><Link href="/data-deletion" className="hover:text-gold transition">Delete My Data</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Stay connected</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/contact" className="hover:text-gold transition">Contact</Link></li>
              <li><a href="https://wa.me/2348105799378" target="_blank" rel="noreferrer" className="hover:text-gold transition">WhatsApp</a></li>
              <li><a href={X_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition">X</a></li>
              <li><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition">TikTok</a></li>
              <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-gold transition">Email</a></li>
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
            <a href={X_URL} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="text-muted-foreground hover:text-gold transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok" className="text-muted-foreground hover:text-gold transition">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
                <path fillRule="evenodd" d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm4.479 9.42c-.159.023-3.096.372-6.125.753-.23-.4.417-.562.49-.578.375-.054 3.311-.463 3.64-.518.037-.232.062-.477.062-.713 0-.806-1.356-1.855-2.24-2.43-.296.385-.595.728-.967 1.002-.069.05-.149.112-.281.112-.103 0-.227-.057-.291-.138-.098-.123-1.356-1.855-1.356-1.855-.007.14-.018.291-.018.441 0 1.189.741 2.217 1.002 2.649.314.525.816 1.188 1.035 1.416l.029.03c.118.117.258.313.258.549 0 .062-.008.117-.02.166-1.561-.195-2.824-.372-3.857-.539-.674-.112-1.356-.232-1.775-.341a1.73 1.73 0 0 1-.593-.337.414.414 0 0 1-.153-.337c0-.305.337-.549.813-.549.307 0 1.02.184 1.79.43a35.08 35.08 0 0 0 4.724 0c.77-.246 1.483-.43 1.79-.43.476 0 .813.244.813.549 0 .133-.105.263-.296.337-.219.099-1.429.343-2.67.508 0 .209.011.424.031.637.019.191 2.258.39 2.673.39.149 0 .293-.008.426-.024.378-.045.752-.117 1.013-.203.054-.145.093-.296.093-.449 0-.55-.375-.962-1.389-1.509a5.328 5.328 0 0 1-.026-.015l-.002.002c-.007-.005-.014-.011-.02-.016z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-gold transition">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} aria-label="Email" className="text-muted-foreground hover:text-gold transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
