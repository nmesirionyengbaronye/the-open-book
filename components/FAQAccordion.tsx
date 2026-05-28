'use client';

import { useState } from 'react';

export default function FAQAccordion() {
  const faqs = [
    {
      question: "What is Uni UI?",
      answer: "Uni UI is a study organization platform built to help engineering students manage their coursework, track difficult subjects, and collaborate with peers through a referral-based waitlist system. I built it because I was tired of struggling with disorganized study materials and wanted a better way to succeed.",
      category: "General"
    },
    {
      question: "How does the referral system work?",
      answer: "When you join the waitlist, you get a unique referral code. For each friend who signs up using your code, you move up 3 positions in the waitlist. The more friends you refer, the sooner you get access. This creates a win-win situation where you help others succeed while advancing your own position.",
      category: "Waitlist"
    },
    {
      question: "Is Uni UI free to use?",
      answer: "Yes, Uni UI is completely free for all students. We believe in providing equal access to quality study tools regardless of financial background. There are no hidden fees, premium tiers, or paywalls. Our mission is to democratize access to effective study tools for engineering students across West Africa.",
      category: "Pricing"
    },
    {
      question: "What universities are currently supported?",
      answer: "We currently support FUTO and 9 other universities in West Africa. If your school isn't listed, you can select 'My school isn't listed' during registration and we'll add it within 24 hours. Our goal is to eventually support all engineering institutions in the region.",
      category: "Institutions"
    },
    {
      question: "How is my data protected?",
      answer: "We take data privacy seriously. All personal information is encrypted using AES-256 encryption and stored securely. We never share your data with third parties without your explicit consent. Our security practices include regular audits, penetration testing, and compliance with international data protection standards.",
      category: "Privacy"
    },
    {
      question: "Can I use Uni UI on mobile devices?",
      answer: "Yes, Uni UI is fully responsive and works on all devices including smartphones, tablets, and desktop computers. The interface adapts to your screen size for optimal usability. You can access all features whether you're on the go or at your desk.",
      category: "Accessibility"
    },
    {
      question: "What subjects does Uni UI cover?",
      answer: "Uni UI covers all engineering disciplines and related fields including Computer Engineering, Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, Petroleum Engineering, and more. The platform adapts to your specific course materials and helps you organize them effectively regardless of your specialization.",
      category: "Academics"
    },
    {
      question: "How do I get started with Uni UI?",
      answer: "Getting started is simple: 1) Visit our website and click 'Join Waitlist', 2) Fill out the registration form with your details, 3) Verify your WhatsApp number, 4) Receive your unique referral code, 5) Start sharing with friends to move up the waitlist. You'll be notified when it's your turn to access the premium features.",
      category: "Getting Started"
    }
  ];

const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-[#D4AF37]/20 rounded-lg overflow-hidden shadow-sm">
          <div
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between p-6 text-left font-heading text-[#D4AF37] bg-[#13131A] hover:bg-[#13131A]/50 transition-colors duration-300"
          >
            <div className="flex-1">
              <h3 className="text-lg">{faq.question}</h3>
              <p className="text-xs text-gray-500 mt-1">{faq.category}</p>
            </div>
            <div className="flex-shrink-0">
              <svg 
                className={`h-5 w-5 transition-transform duration-400 ${openIndex === index ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          {openIndex === index && (
            <div className="border-t border-[#D4AF37]/20 px-6 pb-5 pt-2 text-gray-300">
              <p className="text-sm leading-relaxed mb-3">{faq.answer}</p>
              <div className="text-xs text-gray-400">
                Updated: May 2026 • Based on feedback from 500+ engineering students
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}