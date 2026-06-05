'use client';

import { useState, useMemo, useRef } from 'react';
import { Users, Search, Download, Trash2, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WaitlistEntry {
  whatsapp_number: string;
  full_name: string;
  institution: string;
  school_code: string;
  department_code: string;
  level: string;
  semester: string;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  position: number;
  hardest_course: string | null;
  created_at: string;
}

export function WaitlistTable({ waitlist: initialWaitlist }: { waitlist: WaitlistEntry[] }) {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    if (!searchQuery) return waitlist;
    const q = searchQuery.toLowerCase();
    return waitlist.filter(
      (entry) =>
        entry.full_name?.toLowerCase().includes(q) ||
        entry.whatsapp_number?.includes(q) ||
        entry.referral_code?.toLowerCase().includes(q) ||
        entry.institution?.toLowerCase().includes(q)
    );
  }, [waitlist, searchQuery]);

  const handleDelete = async (whatsapp: string) => {
    if (!confirm('Are you sure you want to delete this signup? This action cannot be undone.')) return;
    
    setDeleting(whatsapp);
    try {
      const res = await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_number: whatsapp }),
      });

      if (res.ok) {
        setWaitlist(prev => prev.filter(e => e.whatsapp_number !== whatsapp));
        toast.success('Entry deleted successfully');
      } else {
        toast.error('Failed to delete entry');
      }
    } catch (err) {
      toast.error('An error occurred during deletion');
    } finally {
      setDeleting(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        
        const entries = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            const key = header.toLowerCase().replace(/ /g, '_');
            obj[key] = values[index];
          });
          
          // Map potential CSV header aliases to our schema
          return {
            whatsapp_number: obj.whatsapp_number || obj.whatsapp || obj.phone,
            full_name: obj.full_name || obj.name,
            institution: obj.institution || 'Unknown',
            school_code: obj.school_code || obj.school || obj.faculty || 'Unknown',
            department_code: obj.department_code || obj.department || 'Unknown',
            level: obj.level || '100',
            semester: obj.semester || '1st',
            referral_code: obj.referral_code || `IMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            referred_by: obj.referred_by || null,
            position: parseInt(obj.position) || 0,
            hardest_course: obj.hardest_course || null,
          };
        });

        const res = await fetch('/api/admin/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entries }),
        });

        if (res.ok) {
          toast.success(`Successfully imported ${entries.length} entries`);
          // Refresh the page or data to show new entries
          window.location.reload();
        } else {
          const err = await res.json();
          toast.error(`Import failed: ${err.error}`);
        }
      } catch (err) {
        toast.error('Failed to process CSV file');
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    const headers = ['Name', 'WhatsApp', 'Institution', 'School', 'Department', 'Level', 'Semester', 'Referral Code', 'Referred By', 'Hardest Course', 'Joined'];
    const rows = filteredData.map(e => [
      e.full_name,
      e.whatsapp_number,
      e.institution,
      e.school_code,
      e.department_code,
      e.level,
      e.semester,
      e.referral_code,
      e.referred_by || '',
      e.hardest_course || '',
      new Date(e.created_at).toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `waitlist_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="glass-strong rounded-xl p-6 border border-gold/10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold/10 rounded-xl">
            <Users className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Waitlist Management</h2>
            <p className="text-xs text-muted-foreground">Manage, delete, and import students.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 glass rounded-xl border-gold/20 text-sm focus:border-gold outline-none transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 glass rounded-xl border-gold/20 hover:bg-gold/10 text-gold text-sm font-medium transition-all"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Import CSV
            </button>
            <button 
              onClick={exportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 glass rounded-xl border-gold/20 hover:bg-gold/10 text-gold text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/20">
            <tr>
              <th className="text-left pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Student</th>
              <th className="text-left pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Academic Info</th>
              <th className="text-left pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">My Code</th>
              <th className="text-center pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Referrals</th>
              <th className="text-left pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Referred By</th>
              <th className="text-left pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Status</th>
              <th className="text-right pb-4 font-display uppercase tracking-widest text-[10px] text-muted-foreground font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredData.map((entry) => (
              <tr key={entry.whatsapp_number} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-gold transition-colors">{entry.full_name}</span>
                    <span className="text-xs font-mono text-muted-foreground mt-0.5">{entry.whatsapp_number}</span>
                  </div>
                </td>
                <td className="py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white/90">{entry.institution}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {entry.school_code} • {entry.department_code}
                    </span>
                  </div>
                </td>
                <td className="py-5">
                  <span className="text-xs font-mono text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/10 w-fit">
                    {entry.referral_code}
                  </span>
                </td>
                <td className="py-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-sm font-bold",
                      entry.referral_count > 0 ? "text-gold" : "text-white/20"
                    )}>
                      {entry.referral_count}
                    </span>
                  </div>
                </td>
                <td className="py-5">
                  {entry.referred_by ? (
                    <span className="text-xs font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10 w-fit">
                      {entry.referred_by}
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic opacity-30">Direct</span>
                  )}
                </td>
                <td className="py-5">
                  <div className="flex flex-col">
                    <span className="text-white font-display font-medium">#{entry.position}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="py-5 text-right">
                  <button
                    onClick={() => handleDelete(entry.whatsapp_number)}
                    disabled={deleting === entry.whatsapp_number}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Delete Signup"
                  >
                    {deleting === entry.whatsapp_number ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <Search className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-medium text-white/40">No matching signups found</p>
            <p className="text-xs mt-1">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
        <p className="text-xs text-muted-foreground">
          Showing <span className="text-white font-medium">{filteredData.length}</span> of <span className="text-white font-medium">{waitlist.length}</span> university signups
        </p>
        <div className="flex gap-1.5">
          {/* Pagination could go here if needed later */}
        </div>
      </div>
    </div>
  );
}
