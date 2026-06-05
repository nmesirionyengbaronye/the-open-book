'use client';

import { motion } from 'framer-motion';
import { Users, Clock, Calendar, BookOpen, UserPlus, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';

interface DashboardData {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
  topReferrers: { referral_code: string; count: number }[];
  hardestCourses: { course: string; count: number }[];
}

function StatCard({ icon: Icon, label, value, color = "gold" }: { icon: any, label: string, value: number, color?: string }) {
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
      <div className="font-display text-4xl text-white">{value.toLocaleString()}</div>
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

        {/* Top Referrers Pie */}
        <div className="glass-strong rounded-xl p-6 border border-gold/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold" />
              Referral Distribution
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referrerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="referral_code"
                >
                  {referrerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #D4AF3740', borderRadius: '8px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {referrerData.map((r, i) => (
              <div key={r.referral_code} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="font-mono">{r.referral_code}</span>
                <span className="text-white ml-auto">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
