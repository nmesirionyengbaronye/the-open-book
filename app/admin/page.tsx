'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Check authentication on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        setAuthenticated(data.authenticated);
        
        if (!data.authenticated) {
          router.push('/admin/login');
          return;
        }
        
        // Fetch dashboard data
        fetchDashboardData();
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const res = await fetch('/api/admin/dashboard-data');
      
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard data error:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSortClick = (label: string) => {
    let direction = 'asc';
    if (sortConfig.key === label && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: label, direction });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort waitlist data
  const sortedWaitlist = () => {
    if (!dashboardData?.waitlist) return [];
    
    return [...dashboardData.waitlist].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });
  };

  // Filter waitlist based on search term
  const filteredWaitlist = () => {
    if (!searchTerm) return sortedWaitlist();
    
    const searchLower = searchTerm.toLowerCase();
    return sortedWaitlist().filter((entry) => {
      return (
        entry.full_name.toLowerCase().includes(searchLower) ||
        entry.whatsapp_number.toLowerCase().includes(searchLower) ||
        entry.referral_code.toLowerCase().includes(searchLower) ||
        (entry.institution || '').toLowerCase().includes(searchLower) ||
        (entry.school_code || '').toLowerCase().includes(searchLower) ||
        (entry.department_code || '').toLowerCase().includes(searchLower)
      );
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#D4AF37]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-[#D4AF37]/50 border-t-[#D4AF37]"></div>
          <p className="text-[#D4AF37]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="h-16 w-16 mx-auto mb-4 bg-[#EF4444]/20 rounded-full flex items-center justify-center">
            <span className="text-red-400 font-bold text-xl">Warning</span>
          </div>
          <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
            Dashboard Error
          </h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#FFD700] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    totalSignups,
    todaySignups,
    weekSignups,
    topReferrers,
    hardestCourses,
    recentRecommendations,
    waitlist: fullWaitlist
  } = dashboardData || {};

  // Apply search filter
  const waitlist = filteredWaitlist();

  return (
    <>
      <nav className="bg-[#13131A]/80 backdrop-blur-sm border-b border-[#D4AF37]/20 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <a href="/admin" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-xl font-heading text-[#D4AF37]">Uni UI Admin</span>
                </a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50">
                    Dashboard
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-[#13131A]/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-16 min-h-[calc(100vh-160px)]">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading text-[#D4AF37]">
                Admin Dashboard
              </h1>
              <p className="text-gray-400">
                Manage and monitor the Uni UI waitlist community
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search waitlist..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-64 px-4 py-2 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#13131A] text-[#D4AF37] font-medium rounded-lg hover:bg-[#13131A]/50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[#13131A] p-6 rounded-xl border border-[#D4AF37]/20">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-xl">Group</span>
                </div>
              </div>
              <h3 className="font-heading text-lg mb-3">Total Signups</h3>
              <p className="text-3xl font-bold text-center text-[#D4AF37]">
                {totalSignups || 0}
              </p>
              <p className="text-xs text-gray-400 text-center">
                Engineering students registered
              </p>
            </div>
            
            <div className="bg-[#13131A] p-6 rounded-xl border border-[#D4AF37]/20">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-xl">Calendar</span>
                </div>
              </div>
              <h3 className="font-heading text-lg mb-3">Today</h3>
              <p className="text-3xl font-bold text-center text-[#D4AF37]">
                {todaySignups || 0}
              </p>
              <p className="text-xs text-gray-400 text-center">
                New signups today
              </p>
            </div>
            
            <div className="bg-[#13131A] p-6 rounded-xl border border-[#D4AF37]/20">
              <div className="flex items-center justify-center mb-3">
                <div className="h-10 w-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#D4AF37] font-bold text-xl">Week</span>
                </div>
              </div>
              <h3 className="font-heading text-lg mb-3">This Week</h3>
              <p className="text-3xl font-bold text-center text-[#D4AF37]">
                {weekSignups || 0}
              </p>
              <p className="text-xs text-gray-400 text-center">
                New signups this week
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Hardest Courses Ranking
            </h2>
            {hardestCourses && hardestCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Students Struggling
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rank Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hardestCourses.map((course: any, index: number) => (
                      <tr key={course.course} className={`border-t border-[#D4AF37]/20 ${index % 2 === 1 ? 'bg-[#13131A]/20' : ''}`}>
                        <td className="px-4 py-3">{course.course}</td>
                        <td className="px-4 py-3">{course.count}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs text-gray-400">
                            #{index + 1}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No course difficulty data available yet
                </p>
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Top Referrers Leaderboard
            </h2>
            {topReferrers && topReferrers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Referral Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Referrals
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Bonus Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReferrers.map((referrer: any, index: number) => (
                      <tr key={referrer.referral_code} className={`border-t border-[#D4AF37]/20 ${index % 2 === 1 ? 'bg-[#13131A]/20' : ''}`}>
                        <td className="px-4 py-3 text-center">
                          <span className={`
                            ${index === 0 ? 'text-[#FFD700] font-bold' : 
                              index === 1 ? 'text-[#C0C0C0]' : 
                              index === 2 ? 'text-[#CD7F32]' : 
                              'text-gray-400'}
                          `}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                              <span className="text-[#D4AF37] font-bold">Key</span>
                            </div>
                            <span className="font-medium text-white">{referrer.referral_code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-2xl font-bold text-[#D4AF37]">
                            {referrer.count}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {referrer.count >= 10 && (
                            <span className="text-[#D4AF37] font-bold">Elite</span>
                          )}
                          {referrer.count >= 5 && referrer.count < 10 && (
                            <span className="text-[#D4AF37] font-bold">Star</span>
                          )}
                          {referrer.count < 5 && (
                            <span className="text-gray-400">Keep going!</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No referral data available yet
                </p>
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Recent Recommendations & Feedback
            </h2>
            {recentRecommendations && recentRecommendations.length > 0 ? (
              <div className="h-96 overflow-y-auto border border-[#D4AF37]/20 rounded-lg p-4">
                {recentRecommendations.map((rec: any) => (
                  <div key={rec.full_name + rec.created_at} className="mb-4 pb-3 border-b border-[#D4AF37]/20 last:mb-0 last:pb-0 last:border-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-white">{rec.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(rec.created_at)}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-gray-400">Feedback</span>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">
                      "{rec.recommendation}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  No recommendations or feedback submitted yet
                </p>
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-2xl font-heading text-[#D4AF37] mb-4">
              Complete Waitlist ({waitlist.length} entries)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Institution
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Dept
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Referral
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Referred By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Hardest Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Recommendation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.length > 0 ? (
                    waitlist.map((entry: any, index: number) => (
                      <tr key={entry.id} className={`border-t border-[#D4AF37]/20 hover:bg-[#13131A]/30 transition-colors duration-200`}>
                        <td className="px-4 py-3 text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          {entry.full_name}
                        </td>
                        <td className="px-4 py-3">
                          {entry.whatsapp_number}
                        </td>
                        <td className="px-4 py-3">
                          {entry.institution || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {entry.school_code || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {entry.department_code || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.level}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.semester || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {entry.referral_code}
                        </td>
                        <td className="px-4 py-3">
                          {entry.referred_by || '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.position}
                        </td>
                        <td className="px-4 py-3">
                          {entry.hardest_course || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {entry.recommendation || '-'}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(entry.created_at)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={13} className="py-6 text-center text-gray-400">
                        No waitlist entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}