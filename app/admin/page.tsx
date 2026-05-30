'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/ui/skeleton";
import { Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/check")
      .then(r => r.json())
      .then(check => {
        if (!check.authenticated) router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    if (checking) return;
    fetch("/api/admin/dashboard-data")
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [checking]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  if (checking || loading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg glass border-gold/40 hover:bg-gold/10 text-sm">
          Logout
        </button>
      </div>
      
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Total" value={data?.total || 0} />
        <StatCard icon={TrendingUp} label="Top Referrers" value={data?.topReferrers?.length || 0} />
        <StatCard icon={TrendingUp} label="Recent" value={data?.entries?.length || 0} />
      </div>

      <div className="glass-strong rounded-xl p-6">
        <h2 className="font-display text-xl mb-4">Waitlist Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gold/20">
              <tr>
                <th className="text-left pb-2">Name</th>
                <th className="text-left pb-2">Institution</th>
                <th className="text-left pb-2">Phone</th>
                <th className="text-left pb-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {data?.entries?.map((e: any) => (
                <tr key={e.whatsapp_number} className="border-b border-white/5 last:border-0">
                  <td className="py-2">{e.full_name}</td>
                  <td className="py-2">{e.institution}</td>
                  <td className="py-2 font-mono">{e.whatsapp_number}</td>
                  <td className="py-2">#{e.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="w-4 h-4 text-gold" />
        {label}
      </div>
      <div className="mt-2 font-display text-3xl text-gold">{value}</div>
    </div>
  );
}