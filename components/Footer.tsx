export default function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#13131A]/50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading text-[#D4AF37]">Uni UI</h3>
            <p className="text-gray-400 text-sm">
              University Uploaded Intelligence - A study organization platform built by students, for students.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-[#D4AF37]">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="/join" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">Join Waitlist</a>
              <a href="/retrieve" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">Retrieve Link</a>
              <a href="/leaderboard" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">Leaderboard</a>
              <a href="/status" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">Status</a>
              <a href="/milestones" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">Milestones</a>
              <a href="/about" className="text-gray-400 hover:text-[#D4AF37] transition-colors animated-underline text-sm">About</a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-heading text-[#D4AF37]">Connect</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">Built by a student in Owerri</p>
              <p className="text-gray-400">For students across West Africa 🇳🇬</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#D4AF37]/10">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Uni UI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}