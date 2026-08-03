'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, TrendingUp, Flame } from 'lucide-react';

interface ActivityItem {
  full_name: string;
  created_at: string;
  action: 'joined' | 'referred';
  ref_code?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/waitlist/stats')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.recent)) {
          const mapped: ActivityItem[] = data.recent.slice(0, 12).map((name: string, i: number) => ({
            full_name: name,
            created_at: i === 0 ? new Date().toISOString() : new Date(Date.now() - i * 60000).toISOString(),
            action: 'joined',
          }));
          setActivities(mapped);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs tracking-[0.3em] text-gold/80 uppercase">Live</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold">
            Recent <span className="text-gold">activity</span>
          </h2>
        </div>
        <div className="glass-strong rounded-2xl p-6 border border-gold/20">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 shimmer rounded-lg" style={{ width: `${70 + (i * 13) % 30}%` }} />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Be the first to join!</div>
          ) : (
            <div className="space-y-3">
              {activities.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/15 grid place-items-center">
                      <Users className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <span className="text-foreground/90">{item.full_name}</span>
                      <span className="text-muted-foreground"> joined the waitlist</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
