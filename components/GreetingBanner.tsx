'use client';

import { useEffect, useState } from 'react';

export default function GreetingBanner() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let msg = '';
      if (hour >= 5 && hour < 11) {
        msg = "Good morning. Time to upload your semester and study smarter.";
      } else if (hour >= 11 && hour < 16) {
        msg = "Good afternoon. Don't let the lecture notes pile up.";
      } else if (hour >= 16 && hour < 22) {
        msg = "Good evening. Review your materials before tomorrow's class.";
      } else {
        msg = "Still awake? The best study happens in the quiet hours. Welcome.";
      }
      setMessage(msg);
    };

    updateGreeting();
    // Update every hour to change the message if needed
    const timer = setInterval(updateGreeting, 3600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-gold italic text-center py-2 px-4 animate-fade-in">
      {message}
    </div>
  );
}