'use client';

export default function WhatsAppBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a 
        href="https://whatsapp.com/channel/0029VabcdEFGHIJKL1234567" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center bg-[#D4AF37] hover:bg-[#FFD700] rounded-full shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h11a2 2 0 012 2v10M15 9a2 2 0 00-2 2M15 9a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-1z"/>
        </svg>
      </a>
    </div>
  );
}