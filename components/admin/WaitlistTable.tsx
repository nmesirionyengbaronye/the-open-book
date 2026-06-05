'use client';

import { useState, useMemo } from 'react';
import { Users, Search, Download } from 'lucide-react';

interface WaitlistEntry {
  whatsapp_number: string;
  full_name: string;
  institution: string;
  referral_code: string;
  referred_by: string | null;
  hardest_course: string | null;
  created_at: string;
}

export function WaitlistTable({ waitlist }: { waitlist: WaitlistEntry[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return waitlist;
    const q = searchQuery.toLowerCase();
    return waitlist.filter(
      (entry) =>
        entry.full_name?.toLowerCase().includes(q) ||
        entry.whatsapp_number?.includes(q) ||
        entry.referral_code?.toLowerCase().includes(q)
    );
  }, [waitlist, searchQuery]);

  const exportCSV = () => {
    const headers = ['Name', 'WhatsApp', 'Institution', 'Referral Code', 'Referred By', 'Hardest Course', 'Joined'];
    const rows = filteredData.map(e => [
      e.full_name,
      e.whatsapp_number,
      e.institution,
      e.referral_code,
      e.referred_by || '',
      e.hardest_course || '',
      new Date(e.created_at).toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `waitlist_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="glass-strong rounded-xl p-6 border border-gold/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-display text-xl flex items-center gap-2">
          <Users className="w-5 h-5 text-gold" />
          Waitlist Management
        </h2>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass rounded-lg border-gold/20 text-sm focus:border-gold outline-none transition-colors"
            />
          </div>
          <button 
            onClick={exportCSV}
            className="p-2 glass rounded-lg border-gold/20 hover:bg-gold/10 text-gold transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/20">
            <tr>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">#</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">Name</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">Institution</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">WhatsApp</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">Code</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">Hardest Course</th>
              <th className="text-left pb-4 font-display uppercase tracking-wider text-[10px] text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.map((entry, i) => (
              <tr key={entry.whatsapp_number} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 text-gold font-display">{i + 1}</td>
                <td className="py-4 font-medium">{entry.full_name}</td>
                <td className="py-4 text-muted-foreground">{entry.institution}</td>
                <td className="py-4 font-mono text-xs">{entry.whatsapp_number}</td>
                <td className="py-4 font-mono text-gold text-xs">{entry.referral_code}</td>
                <td className="py-4 text-xs italic">{entry.hardest_course || '—'}</td>
                <td className="py-4 text-muted-foreground text-xs">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No entries match your search.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Showing {filteredData.length} of {waitlist.length} total entries
      </p>
    </div>
  );
}
