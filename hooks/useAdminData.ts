'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface DashboardData {
  totalSignups: number;
  todaySignups: number;
  weekSignups: number;
  topReferrers: { referral_code: string; count: number }[];
  hardestCourses: { course: string; count: number }[];
  recentRecommendations: { full_name: string; recommendation: string; created_at: string }[];
  waitlist: any[];
}

export function useAdminData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check');
        const result = await res.json();
        if (mounted && !result.authenticated) {
          router.replace('/admin/login');
        } else if (mounted) {
          setIsAuthChecked(true);
        }
      } catch {
        if (mounted) router.replace('/admin/login');
      }
    };

    checkAuth();
    return () => { mounted = false; };
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

  return { data, loading, isAuthChecked };
}
