"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion() {
  const faqs = [
    {
      question: "What is Uni UI?",
      answer:
        "Uni UI is a study organization platform built to help engineering students manage their coursework, track difficult subjects, and collaborate with peers through a referral-based waitlist system.",
      category: "General",
    },
    {
      question: "How does the referral system work?",
      answer:
        "When you join the waitlist, you get a unique referral code. For each friend who signs up using your code, you move up 3 positions in the waitlist. The more friends you refer, the sooner you get access.",
      category: "Waitlist",
    },
    {
      question: "Is Uni UI free to use?",
      answer:
        "Yes, Uni UI is completely free for all students. We believe in providing equal access to quality study tools regardless of financial background.",
      category: "Pricing",
    },
    {
      question: "What universities are currently supported?",
      answer:
        "We currently support FUTO and 9 other universities in West Africa. If your school isn't listed, you can select 'My school isn't listed' during registration and we'll add it within 24 hours.",
      category: "Institutions",
    },
    {
      question: "How is my data protected?",
      answer:
        "We take data privacy seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your explicit consent.",
      category: "Privacy",
    },
    {
      question: "Can I use Uni UI on mobile devices?",
      answer:
        "Yes, Uni UI is fully responsive and works on all devices including smartphones, tablets, and desktop computers.",
      category: "Accessibility",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#D4AF37]/30"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-6 text-left group"
          >
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]/60 font-bold mb-1 block">
                {faq.category}
              </span>
              <h3
                className={`text-lg font-heading transition-colors duration-300 ${openIndex === index ? "text-[#D4AF37]" : "text-white group-hover:text-[#D4AF37]/80"}`}
              >
                {faq.question}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`flex-shrink-0 ml-4 p-2 rounded-full ${openIndex === index ? "bg-[#D4AF37] text-black" : "bg-white/5 text-[#D4AF37]"}`}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
