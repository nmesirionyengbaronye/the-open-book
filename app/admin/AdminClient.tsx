'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Clock, Calendar, BookOpen, UserPlus, MessageSquare, Search, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardData {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
  topReferrers: { referral_code: string; count: number }[];
  hardestCourses: { course: string; count: number }[];
  recentRecommendations: { full_name: string; recommendation: string; created_at: string }[];
  waitlist: any[];
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  const animatedValue = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
        <Icon className="w-4 h-4 text-gold" />
        {label}
      </div>
      <div className="font-display text-4xl text-gold">{animatedValue.toLocaleString()}</div>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 animate-pulse">
      <div className="h-4 w-24 bg-white/10 rounded mb-4" />
      <div className="h-10 w-32 bg-white/10 rounded" />
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-strong rounded-xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-white/10 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check');
        const result = await res.json();
        if (mounted && !result.authenticated) {
          router.replace('/admin/login');
        }
        if (mounted) {
          setIsAuthChecked(true);
        }
      } catch {
        if (mounted) {
          router.replace('/admin/login');
        }
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!isAuthChecked) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard-data');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthChecked]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const filteredWaitlist = useMemo(() => {
    if (!data?.waitlist || !searchQuery) return data?.waitlist || [];
    const q = searchQuery.toLowerCase();
    return data.waitlist.filter(
      (entry) =>
        entry.full_name?.toLowerCase().includes(q) ||
        entry.whatsapp_number?.includes(q) ||
        entry.referral_code?.toLowerCase().includes(q) ||
        entry.referred_by?.toLowerCase().includes(q)
    );
  }, [data?.waitlist, searchQuery]);

  if (!isAuthChecked || loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-48 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <TableSkeleton />
          <TableSkeleton />
        </div>
        <TableSkeleton />
        <TableSkeleton rows={10} />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg glass border-gold/40 hover:bg-gold/10 text-sm flex items-center gap-2 w-fit"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Total Signups" value={data?.totalSignups || 0} />
        <StatCard icon={Clock} label="Today" value={data?.todaySignups || 0} />
        <StatCard icon={Calendar} label="This Week" value={data?.weekSignups || 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-strong rounded-xl p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            Hardest Courses
          </h2>
          {data?.hardestCourses && data.hardestCourses.length > 0 ? (
            <div className="space-y-3">
              {data.hardestCourses.map((course, i) => (
                <motion.div
                  key={course.course}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-display text-lg">{i + 1}</span>
                    <span className="text-sm">{course.course}</span>
                  </div>
                  <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-medium">
                    {course.count}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No course data available</p>
          )}
        </div>

        <div className="glass-strong rounded-xl p-6">
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gold" />
            Top Referrers
          </h2>
          {data?.topReferrers && data.topReferrers.length > 0 ? (
            <div className="space-y-3">
              {data.topReferrers.map((referrer, i) => (
                <motion.div
                  key={referrer.referral_code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 glass rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-display text-lg">{i + 1}</span>
                    <span className="text-sm font-mono">{referrer.referral_code}</span>
                  </div>
                  <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-medium">
                    {referrer.count} referrals
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No referrer data available</p>
          )}
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6 mb-8">
        <h2 className="font-display text-xl mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold" />
          Recent Recommendations
        </h2>
        {data?.recentRecommendations && data.recentRecommendations.length > 0 ? (
          <div className="space-y-4">
            {data.recentRecommendations.map((rec, i) => (
              <motion.div
                key={`${rec.full_name}-${rec.created_at}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 glass rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{rec.full_name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{rec.recommendation}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(rec.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No recommendations yet</p>
        )}
      </div>

      <div className="glass-strong rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="font-display text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Full Waitlist
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone, or referral code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-lg border-gold/20 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/20">
              <tr>
                <th className="text-left pb-2">#</th>
                <th className="text-left pb-2">Name</th>
                <th className="text-left pb-2">Institution</th>
                <th className="text-left pb-2">WhatsApp</th>
                <th className="text-left pb-2">Referral Code</th>
                <th className="text-left pb-2">Referred By</th>
                <th className="text-left pb-2">Hardest Course</th>
                <th className="text-left pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredWaitlist.length > 0 ? (
                filteredWaitlist.map((entry, i) => (
                  <tr key={entry.whatsapp_number} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gold font-display">{i + 1}</td>
                    <td className="py-3">{entry.full_name}</td>
                    <td className="py-3">{entry.institution}</td>
                    <td className="py-3 font-mono">{entry.whatsapp_number}</td>
                    <td className="py-3 font-mono text-gold">{entry.referral_code}</td>
                    <td className="py-3 font-mono text-muted-foreground">{entry.referred_by || '—'}</td>
                    <td className="py-3">{entry.hardest_course || '—'}</td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Showing {filteredWaitlist.length} of {data?.waitlist?.length ?? 0} entries
        </p>
      </div>
    </div>
  );
}