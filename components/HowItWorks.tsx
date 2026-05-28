'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export default function HowItWorks() {
  const [steps, setSteps] = useState([
    {
      number: '01',
      title: 'Join the Waitlist',
      description: 'Sign up with your details to get early access to Uni UI. Provide your full name, WhatsApp number, and academic information to secure your position.',
      icon: 'UserPlus',
      color: 'bg-[#D4AF37]/20'
    },
    {
      number: '02',
      title: 'Get Your Referral Code',
      description: 'Receive a unique code to share with friends and move up the waitlist. For each friend who signs up using your code, you advance 3 positions.',
      icon: 'Share2',
      color: 'bg-[#D4AF37]/20'
    },
    {
      number: '03',
      title: 'Access Premium Features',
      description: 'Unlock organized study tools, progress tracking, and collaborative learning. Gain access to our full suite of features designed for engineering students.',
      icon: 'UnlockKey',
      color: 'bg-[#D4AF37]/20'
    },
    {
      number: '04',
      title: 'Succeed Together',
      description: 'Study smarter with friends and achieve your academic goals faster. Our community-driven approach helps everyone succeed collectively.',
      icon: 'Users',
      color: 'bg-[#D4AF37]/20'
    }
  ]);

  const [animatedSteps, setAnimatedSteps] = useState(Array(steps.length).fill(false));

  useEffect(() => {
    const handleStepAnimation = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry, index) => {
        if (entry.isIntersecting) {
          setAnimatedSteps(prev => {
            const newArray = [...prev];
            newArray[index] = true;
            return newArray;
          });
        }
      });
    };

    const observerOptions = {
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver(handleStepAnimation, observerOptions);

    // Observe each step element
    const observeSteps = () => {
      const stepElements = document.querySelectorAll('.step-trigger');
      stepElements.forEach((el, index) => {
        observer.observe(el);
      });
      
      return () => {
        stepElements.forEach((el) => observer.unobserve(el));
      };
    };

    const cleanup = observeSteps();
    
    return cleanup;
  }, []);

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-heading text-[#D4AF37] text-center mb-10">
        How It Works
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div 
            key={step.number} 
            className="relative group"
          >
            {/* Step trigger for animation */}
            <div 
              className="step-trigger h-full w-full" 
              style={{ height: '200px' }}
            ></div>
            
            {/* Step content */}
            <div className={`step-content p-6 text-center transition-all duration-700 ${
              animatedSteps[index] 
                ? 'transform scale-[1.03] bg-[#13131A]/50 border border-[#D4AF37]/30' 
                : 'bg-[#13131A]/30 border border-[#D4AF37]/20'
            }`}>
              {/* Step number with animation */}
              <div className={`relative h-12 w-12 mx-auto mb-5 flex items-center justify-center ${
                animatedSteps[index] 
                  ? 'bg-[#D4AF37] text-black' 
                  : 'border-2 border-[#D4AF37]'
              } transition-all duration-700`}>
                <span className={`text-xl font-bold ${
                  animatedSteps[index] 
                    ? 'text-black' 
                    : 'text-[#D4AF37]'
                } transition-all duration-700`}>
                  {step.number}
                </span>
              </div>
              
              {/* Step icon */}
              <div className={`h-10 w-10 mx-auto mb-4 flex items-center justify-center ${step.color} rounded-full transition-all duration-700 ${
                animatedSteps[index] 
                  ? 'scale-110' 
                  : 'scale-100'
              }`}>
                {/* Lucide icon would go here */}
                <span className={`text-[#D4AF37] text-xl transition-all duration-700 ${
                  animatedSteps[index] 
                    ? 'text-black' 
                    : 'text-white'
                }`}>
                  {step.icon.charAt(0)}
                </span>
              </div>
              
              {/* Step title */}
              <h3 className={`font-heading text-lg mb-3 ${
                animatedSteps[index] 
                  ? 'text-white' 
                  : 'text-[#D4AF37]'
              } transition-all duration-700`}>
                {step.title}
              </h3>
              
              {/* Step description */}
              <p className={`text-gray-400 text-sm ${
                animatedSteps[index] 
                  ? 'text-gray-300' 
                  : 'text-gray-400'
              } transition-all duration-700 leading-relaxed`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Animated connector lines */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="relative h-full w-full">
          {steps.map((step, index) => 
            index < steps.length - 1 && (
              <div 
                key={index} 
                className="absolute left-1/2 -translate-x-0.5 top-[20%] h-[60%] w-[1px] bg-[#D4AF37]/20"
              >
                {/* Animated dots on line */}
                <div className="absolute -translate-y-1/2 left-0 -translate-x-1/2 h-4 w-4 bg-[#D4AF37] rounded-full animate-pulse"></div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}