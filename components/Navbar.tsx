import Link from 'next/link';

const PANTERO_URL = process.env.NEXT_PUBLIC_PANTERO_URL || 'https://pantero.vercel.app';

export default function Navbar() {
  return (
    <nav className="bg-[#13131A]/80 backdrop-blur-sm border-b border-[#D4AF37]/20 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-xl font-heading text-[#D4AF37]">Uni UI</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Home
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  About
                </Link>
                <Link href="/join" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Join
                </Link>
                <Link href="/retrieve" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Retrieve
                </Link>
                <Link href="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Leaderboard
                </Link>
                <Link href="/status" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Status
                </Link>
                <Link href="/milestones" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                  Milestones
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <a 
              href={PANTERO_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50"
            >
              Panter↗
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}