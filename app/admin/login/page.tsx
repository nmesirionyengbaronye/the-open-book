'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      if (data.authenticated) {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <span className="text-[#D4AF37] font-bold text-xl">🔐</span>
          </div>
          <h2 className="text-3xl font-heading text-[#D4AF37] mb-4">
            Admin Login
          </h2>
          <p className="text-lg text-gray-300">
            Access the Uni UI administrative dashboard
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className={`w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                error && !username ? 'border-[#EF4444]' : ''
              }`}
              disabled={isLoading}
            />
            {error && !username && (
              <p className="text-xs text-red-500 mt-1">Username is required</p>
            )}
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full px-4 py-3 bg-[#13131A] border border-[#D4AF37]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                error && !password ? 'border-[#EF4444]' : ''
              }`}
              disabled={isLoading}
            />
            {error && !password && (
              <p className="text-xs text-red-500 mt-1">Password is required</p>
            )}
          </div>
          
          {error && (
            <div className="bg-[#EF4444]/20 rounded-lg border border-[#EF4444]/30 p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 flex-shrink-0 bg-[#EF4444] rounded-full"></div>
                <span className="text-red-500">{error}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                setUsername('');
                setPassword('');
                setError('');
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-[#13131A] text-[#D4AF37] font-medium rounded-lg hover:bg-[#13131A]/50 transition-colors"
            >
              Clear
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-1/2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors disabled:opacity-50`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Demo credentials: <span className="text-[#D4AF37]">admin</span> / <span className="text-[#D4AF37]">password123</span>
          </p>
          <p>
            Note: In production, set ADMIN_USERNAME and ADMIN_PASSWORD in .env.local
          </p>
        </div>
      </div>
    </div>
  );
}