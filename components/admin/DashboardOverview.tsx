'use client';

import { motion } from 'framer-motion';
import { Users, Clock, Calendar, BookOpen, UserPlus, TrendingUp, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';

interface DashboardData {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
  topReferrers: { referral_code: string; count: number }[];
  topReferrerDetails: { referral_code: string; name: string; count: number }[];
  totalReferrers: number;
  totalReferrals: number;
  viralCoefficient: number;
  referralConversionRate: number;
  hardestCourses: { course: string; count: number }[];
}

function StatCard({ icon: Icon, label, value, color = "gold" }: { icon: any, label: string, value: number | string, color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 border border-gold/10"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 uppercase tracking-wider">
        <Icon className={`w-4 h-4 text-${color}`} />
        {label}
      </div>
      <div className="font-display text-4xl text-white">{typeof value === 'number' ? value.toLocaleString() : value}</div>
    </motion.div>
  );
}

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#C5A059'];

export function DashboardOverview({ data }: { data: DashboardData }) {
  const courseData = data.hardestCourses.slice(0, 5);
  const referrerData = data.topReferrers.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Signups" value={data.totalSignups} />
        <StatCard icon={Clock} label="Today" value={data.todaySignups} />
        <StatCard icon={Calendar} label="This Week" value={data.weekSignups} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserPlus} label="Total Referrers" value={data.totalReferrers} />
        <StatCard icon={TrendingUp} label="Total Referrals" value={data.totalReferrals} />
        <StatCard icon={Activity} label="Viral Coefficient" value={data.viralCoefficient} />
        <StatCard icon={BookOpen} label="Referral Conversion" value={`${data.referralConversionRate}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hardest Courses Chart */}
        <div className="glass-strong rounded-xl p-6 border border-gold/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold" />
              Hardest Courses
            </h2>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="course" 
                  type="category" 
                  tick={{ fill: '#888', fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #D4AF3740', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[0, 4, 4, 0]}>
                  {courseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="glass-strong rounded-xl p-6 border border-gold/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold" />
              Top Referrers
            </h2>
          </div>
          <div className="space-y-3">
            {data.topReferrerDetails.map((r, i) => (
              <div key={r.referral_code} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs ${
                    i === 0 ? 'bg-gold text-background' : i === 1 ? 'bg-zinc-300 text-background' : i === 2 ? 'bg-amber-700 text-background' : 'bg-white/5 text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{r.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{r.referral_code}</div>
                  </div>
                </div>
                <div className="text-gold font-semibold">{r.count}</div>
              </div>
            ))}
            {data.topReferrerDetails.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No referrals yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
