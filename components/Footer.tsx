import { Mail, MessageCircle, Award } from "lucide-react";

const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "sofia@uniui.com.ng";
const WA = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/uniui-community";

export function Footer() {
  return (
    <footer className="mt-10 glass-strong border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid sm:grid-cols-2 gap-6 items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-bright grid place-items-center">
             <Award className="w-5 h-5 text-background" strokeWidth={2.5} />
           </div>
          <div>
            <div className="font-display text-base">UNI <span className="text-gold">UI</span></div>
            <p className="text-xs text-muted-foreground max-w-md mt-1">
              UNI UI — UNIVERSITY UPLOADED INTELLIGENCE | BUILT BY A STUDENT IN OWERRI, FOR STUDENTS ACROSS WEST AFRICA. 🇳🇬
            </p>
          </div>
        </div>
        <div className="flex sm:justify-end items-center gap-3">
          <a href={`mailto:${EMAIL}`} className="glass rounded-lg px-4 py-2 text-sm text-foreground hover:text-gold inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold" /> {EMAIL}
          </a>
          <a href={WA} target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-lg glass grid place-items-center hover:bg-gold/10" aria-label="WhatsApp community">
            <MessageCircle className="w-5 h-5 text-gold" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Uni UI — Made with 💛 in Owerri
      </div>
    </footer>
  );
}
