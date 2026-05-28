'use client';

import { useEffect, useState } from 'react';

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Adaobi N.",
      institution: "FUTO",
      course: "Computer Engineering",
      text: "Uni UI cut my study time in half. I finally understand topics that used to take me days to grasp. The way it organizes my lecture notes and practice problems has transformed how I approach my coursework.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Chinedu O.",
      institution: "UNN",
      course: "Electrical Engineering",
      text: "The referral system motivated me to share with my classmates. Now we're all succeeding together. I've referred 5 friends and moved up 15 positions in the waitlist. It's amazing how helping others helps you too.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Zainab A.",
      institution: "FUTO",
      course: "Petroleum Engineering",
      text: "As a working student, Uni UI's organized approach helped me balance work and studies effectively. I can quickly find what I need for each course without wasting time searching through disorganized files.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Emeka I.",
      institution: "UNILAG",
      course: "Mechanical Engineering",
      text: "The hardest course tracking feature helped me focus on what mattered most. My grades improved significantly after I started focusing on the topics Uni UI identified as my weak areas.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Ngozi E.",
      institution: "FUTO",
      course: "Chemical Engineering",
      text: "I was skeptical at first, but after using Uni UI for a month, I can't imagine studying without it. The spaced repetition system has helped me retain information much better than before.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Tunde A.",
      institution: "UNN",
      course: "Civil Engineering",
      text: "The collaborative features are amazing. My study group shares resources through Uni UI, and we've all seen improvements in our understanding of complex topics like fluid mechanics and structural analysis.",
      avatar: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const getBackgroundStyle = () => {
    const backgrounds = [
      'bg-[#13131A]/80 backdrop-blur-sm border border-[#D4AF37]/30',
      'bg-[#13131A]/70 backdrop-blur-sm border border-[#D4AF37]/25',
      'bg-[#13131A]/90 backdrop-blur-sm border border-[#D4AF37]/35'
    ];
    return backgrounds[index % backgrounds.length];
  };

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Background waves */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-20 bg-[#D4AF37]/10"></div>
      </div>
      
      {/* Testimonial content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className={`${getBackgroundStyle()} p-8 rounded-xl max-w-2xl text-center relative`}>
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
          
          <p className="text-lg font-heading text-[#D4AF37] mb-6 leading-relaxed">
            "{testimonials[index].text}"
          </p>
          
          <div className="flex items-center space-x-6 mt-8">
            <div className="flex-shrink-0">
              <div className="relative h-14 w-14">
                <img 
                  src={testimonials[index].avatar} 
                  alt={`${testimonials[index].name}'s avatar`} 
                  className="h-14 w-14 rounded-full border-2 border-[#D4AF37] object-cover"
                />
                <div className="absolute bottom-0 right-0 h-4 w-4 bg-[#D4AF37] rounded-full border-2 border-[#13131A]"></div>
              </div>
            </div>
            <div className="text-left">
              <p className="font-medium text-white">{testimonials[index].name}</p>
              <p className="text-sm text-gray-400">{testimonials[index].institution} • {testimonials[index].course}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {testimonials.map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full transition-all duration-500 ${
              i === index 
                ? 'bg-[#D4AF37] scale-110' 
                : 'bg-[#D4AF37]/30'
            }`}
            onClick={() => setIndex(i)}
          ></div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 -z-10 flex items-center space-x-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="p-2 rounded-full bg-[#13131A]/50 hover:bg-[#13131A]/70 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
          className="p-2 rounded-full bg-[#13131A]/50 hover:bg-[#13131A]/70 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}