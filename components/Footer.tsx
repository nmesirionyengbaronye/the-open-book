import { Mail, MessageCircle, Award } from "lucide-react";

const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "sofia@uniui.com.ng";
const WA = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/uniui-community";

export function Footer() {
  return (
    <footer className="mt-10 rounded-2xl border border-black/10 bg-black/5 shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid sm:grid-cols-2 gap-6 items-center">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-lg bg-black grid place-items-center">
             <Award className="w-5 h-5 text-[#FFD93D]" strokeWidth={2.5} />
           </div>
          <div>
            <div className="font-display text-base">UNI <span className="underline decoration-black/40 underline-offset-4">UI</span></div>
            <p className="text-xs text-black/70 max-w-md mt-1">
              UNI UI — UNIVERSITY UPLOADED INTELLIGENCE | BUILT BY A STUDENT IN OWERRI, FOR STUDENTS ACROSS WEST AFRICA. 🇳🇬
            </p>
          </div>
        </div>
        <div className="flex sm:justify-end items-center gap-3">
          <a href={`mailto:${EMAIL}`} className="rounded-lg px-4 py-2 text-sm text-black hover:text-black/80 inline-flex items-center gap-2">
            <Mail className="w-4 h-4 text-black" /> {EMAIL}
          </a>
          <a href={WA} target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-lg border border-black/10 bg-black/5 grid place-items-center hover:bg-black/10" aria-label="WhatsApp community">
            <MessageCircle className="w-5 h-5 text-black" />
          </a>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-[11px] text-black/70">
        © {new Date().getFullYear()} Uni UI — Made with 💛 in Owerri
      </div>
    </footer>
  );
}
