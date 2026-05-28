export default function FeatureCards() {
  const features = [
    {
      icon: 'Zap',
      title: 'Instant Organization',
      description: 'Turn chaotic study materials into structured, easy-to-follow learning paths. Our smart categorization system automatically organizes your notes, practice problems, and resources by course, topic, and difficulty level.',
      benefit: 'Save 10+ hours per week on organization'
    },
    {
      icon: 'TrendingUp',
      title: 'Smart Progress Tracking',
      description: 'See exactly what you need to focus on to improve your grades efficiently. Our AI-powered analytics identify your weak areas and suggest targeted study plans.',
      benefit: 'Improve grades by 20-30%'
    },
    {
      icon: 'Share2',
      title: 'Collaborative Learning',
      description: 'Refer friends and grow together - the more you share, the better you all do. Our referral system rewards you for helping others succeed.',
      benefit: 'Build a stronger study network'
    },
    {
      icon: 'Heart',
      title: 'Mental Wellness',
      description: 'Reduce study-related stress and anxiety with our balanced approach to learning. We promote sustainable study habits that prevent burnout.',
      benefit: 'Lower stress levels by 40%'
    },
    {
      icon: 'Brain',
      title: 'Knowledge Retention',
      description: 'Remember what you learn longer with our spaced repetition system. We help you review material at optimal intervals for maximum retention.',
      benefit: 'Increase retention by 50%'
    },
    {
      icon: 'Shield',
      title: 'Data Security',
      description: 'Your data is protected with enterprise-grade encryption and privacy controls. We never sell your information or use it for advertising.',
      benefit: 'Peace of mind'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div 
          key={feature.icon} 
          className="bg-[#13131A] p-6 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
        >
          <div className="flex h-12 w-12 items-center justify-center bg-[#D4AF37]/20 rounded-lg mb-5">
            {/* Lucide icon would go here */}
            <span className="text-[#D4AF37] font-bold text-xl">{feature.icon}</span>
          </div>
          <h3 className="font-heading text-lg mb-3">{feature.title}</h3>
          <p className="text-gray-400 mb-4">{feature.description}</p>
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-3 w-3 bg-[#D4AF37] rounded-full"></div>
            <span className="font-medium text-[#D4AF37]">{feature.benefit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}