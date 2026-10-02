'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  UserPlus,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { csrfHeaders } from '@/lib/csrf';
import {
  CREATOR_STATUSES,
  CREATOR_TIERS,
  STATUS_META,
  TIER_META,
  CONTENT_TYPES,
  type CreatorStatus,
  type CreatorTier,
} from '@/lib/creators';
import { cn } from '@/lib/utils';

interface Creator {
  id: string;
  full_name: string;
  whatsapp_number: string | null;
  email: string | null;
  institution: string | null;
  level: string | null;
  department: string | null;
  tiktok_handle: string | null;
  instagram_handle: string | null;
  tiktok_followers: number | null;
  instagram_followers: number | null;
  avg_views: number | null;
  content_types: string[];
  why_join: string;
  how_promote: string;
  promoted_before: boolean;
  promoted_before_detail: string | null;
  referred_by: string | null;
  referral_code: string | null;
  status: CreatorStatus;
  tier: CreatorTier;
  campaign: string | null;
  notes: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  byStatus: Record<string, number>;
  byTier: Record<string, number>;
  referred: number;
}

const selectCls =
  'bg-background/60 border border-gold/20 rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold';

export function CreatorsTable() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch('/api/admin/creators');
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error || 'Failed to load creators');
        return;
      }
      setCreators(data.creators ?? []);
      setStats(data.stats ?? null);
    } catch {
      setLoadError('Network error while loading creators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return creators.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
      if (!q) return true;
      return [c.full_name, c.tiktok_handle, c.instagram_handle, c.institution, c.email, c.referral_code]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [creators, query, statusFilter, tierFilter]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    // Optimistic: status and tier are single-select controls, so flipping them
    // back on failure is worse than a brief flicker on success.
    const snapshot = creators;
    setCreators((prev) => prev.map((c) => (c.id === id ? { ...c, ...body } : c)));
    try {
      const res = await fetch('/api/admin/creators', {
        method: 'PATCH',
        headers: csrfHeaders(),
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Update failed');
      }
      const data = await res.json();
      setCreators((prev) => prev.map((c) => (c.id === id ? data.creator : c)));
    } catch (e) {
      setCreators(snapshot);
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-destructive">{loadError}</p>
            <button
              onClick={load}
              className="mt-3 inline-flex items-center gap-2 text-xs text-gold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && <Funnel stats={stats} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, handle, school, email, code…"
            className="w-full bg-background/60 border border-gold/20 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectCls}
          >
            <option value="all">All statuses</option>
            {CREATOR_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className={selectCls}>
            <option value="all">All tiers</option>
            {CREATOR_TIERS.map((t) => (
              <option key={t} value={t}>
                {TIER_META[t].emoji} {TIER_META[t].label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold text-background text-xs font-semibold gold-glow-hover"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {showAdd && (
        <AddOutreachForm
          onCancel={() => setShowAdd(false)}
          onAdded={(c) => {
            setCreators((prev) => [c, ...prev]);
            setShowAdd(false);
            load();
          }}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {creators.length}
        {statusFilter !== 'all' && ` · ${STATUS_META[statusFilter as CreatorStatus].label}`}
        {tierFilter !== 'all' && ` · ${TIER_META[tierFilter as CreatorTier].label}`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 p-10 text-center text-sm text-muted-foreground">
          No creators match. Add rows with <span className="text-gold">Add</span> as you find them on
          TikTok, or wait for applications to land.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CreatorRow
              key={c.id}
              creator={c}
              expanded={expanded === c.id}
              onToggle={() => setExpanded((prev) => (prev === c.id ? null : c.id))}
              onPatch={patch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Funnel({ stats }: { stats: Stats }) {
  // The stages that represent real progress toward an active creator.
  const funnel = ['discovered', 'dm_sent', 'replied', 'applied', 'approved', 'whatsapp'] as const;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {funnel.map((s) => (
        <div key={s} className="glass rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {STATUS_META[s].label}
          </div>
          <div className="mt-1 text-2xl font-display font-bold text-gold">{stats.byStatus[s] ?? 0}</div>
        </div>
      ))}
      <div className="glass rounded-xl p-4 sm:col-span-2 lg:col-span-1 border-gold/30">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold" /> Referred in
        </div>
        <div className="mt-1 text-2xl font-display font-bold text-gold">{stats.referred}</div>
      </div>
    </div>
  );
}

function CreatorRow({
  creator,
  expanded,
  onToggle,
  onPatch,
}: {
  creator: Creator;
  expanded: boolean;
  onToggle: () => void;
  onPatch: (id: string, body: Record<string, unknown>) => void;
}) {
  const [notes, setNotes] = useState(creator.notes ?? '');
  const [campaign, setCampaign] = useState(creator.campaign ?? '');
  const notesDirty = notes !== (creator.notes ?? '');
  const campaignDirty = campaign !== (creator.campaign ?? '');

  // Adopt server-side changes made elsewhere (a different tab, a reload)
  // without stomping on an in-progress edit.
  useEffect(() => {
    if (!notesDirty) setNotes(creator.notes ?? '');
  }, [creator.notes]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!campaignDirty) setCampaign(creator.campaign ?? '');
  }, [creator.campaign]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl border border-gold/15 bg-background/40 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm truncate">{creator.full_name}</span>
            {creator.referred_by && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">
                via {creator.referred_by}
              </span>
            )}
            {creator.referral_code && (
              <span className="text-[10px] font-mono text-muted-foreground">{creator.referral_code}</span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground truncate">
            {creator.tiktok_handle ? `@${creator.tiktok_handle}` : 'no handle'}
            {creator.institution ? ` · ${creator.institution}` : ''}
            {creator.tiktok_followers != null ? ` · ${formatNum(creator.tiktok_followers)} followers` : ''}
            {creator.avg_views != null ? ` · ${formatNum(creator.avg_views)} avg views` : ''}
          </div>
        </div>
        <select
          value={creator.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onPatch(creator.id, { status: e.target.value })}
          className={cn(selectCls, STATUS_META[creator.status]?.tone)}
        >
          {CREATOR_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
        <select
          value={creator.tier}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onPatch(creator.id, { tier: e.target.value })}
          className={selectCls}
        >
          {CREATOR_TIERS.map((t) => (
            <option key={t} value={t}>
              {TIER_META[t].emoji} {TIER_META[t].label}
            </option>
          ))}
        </select>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Detail k="WhatsApp" v={creator.whatsapp_number ?? '— not applied yet'} mono />
            <Detail k="Email" v={creator.email ?? '— not applied yet'} />
            <Detail k="Level / Dept" v={[creator.level, creator.department].filter(Boolean).join(' · ') || '—'} />
            <Detail
              k="Instagram"
              v={
                creator.instagram_handle
                  ? `@${creator.instagram_handle}${
                      creator.instagram_followers != null ? ` · ${formatNum(creator.instagram_followers)}` : ''
                    }`
                  : '—'
              }
            />
            <Detail k="Content types" v={creator.content_types?.join(', ') || '—'} />
            <Detail
              k="Promoted before"
              v={creator.promoted_before ? creator.promoted_before_detail || 'Yes' : 'No'}
            />
          </div>

          {creator.why_join && <LongText label="Why they applied" value={creator.why_join} />}
          {creator.how_promote && <LongText label="How they'd promote" value={creator.how_promote} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Campaign sent
              </span>
              <input
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. Launch week / exam season"
                className="w-full bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Notes</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Engagement, campus, referral potential"
                className="w-full bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-gold"
              />
            </label>
          </div>
          {(notesDirty || campaignDirty) && (
            <button
              onClick={() =>
                onPatch(creator.id, {
                  ...(notesDirty ? { notes } : {}),
                  ...(campaignDirty ? { campaign } : {}),
                })
              }
              className="px-3 py-1.5 rounded-lg bg-gold text-background text-xs font-semibold gold-glow-hover"
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AddOutreachForm({
  onCancel,
  onAdded,
}: {
  onCancel: () => void;
  onAdded: (c: Creator) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    full_name: '',
    tiktok_handle: '',
    tiktok_followers: '',
    avg_views: '',
    institution: '',
    notes: '',
    status: 'discovered' as CreatorStatus,
  });

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: csrfHeaders(),
        body: JSON.stringify({
          full_name: f.full_name.trim(),
          tiktok_handle: f.tiktok_handle.trim(),
          tiktok_followers: f.tiktok_followers === '' ? undefined : Number(f.tiktok_followers),
          avg_views: f.avg_views === '' ? undefined : Number(f.avg_views),
          institution: f.institution.trim(),
          notes: f.notes.trim(),
          status: f.status,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || 'Could not add creator');
        return;
      }
      toast.success('Creator added');
      onAdded(data.creator);
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold';

  return (
    <div className="rounded-xl border border-gold/30 bg-background/50 p-4 space-y-3">
      <p className="text-xs text-muted-foreground">
        For creators you found on TikTok before they applied. Only a name is required — fill the rest in as you
        qualify them.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={f.full_name}
          onChange={(e) => setF({ ...f, full_name: e.target.value })}
          placeholder="Name *"
          className={input}
        />
        <input
          value={f.tiktok_handle}
          onChange={(e) => setF({ ...f, tiktok_handle: e.target.value })}
          placeholder="@handle"
          className={input}
        />
        <input
          value={f.institution}
          onChange={(e) => setF({ ...f, institution: e.target.value })}
          placeholder="University"
          className={input}
        />
        <input
          value={f.tiktok_followers}
          onChange={(e) => setF({ ...f, tiktok_followers: e.target.value })}
          placeholder="Followers"
          inputMode="numeric"
          className={input}
        />
        <input
          value={f.avg_views}
          onChange={(e) => setF({ ...f, avg_views: e.target.value })}
          placeholder="Avg views"
          inputMode="numeric"
          className={input}
        />
        <select
          value={f.status}
          onChange={(e) => setF({ ...f, status: e.target.value as CreatorStatus })}
          className={input}
        >
          {CREATOR_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>
      <input
        value={f.notes}
        onChange={(e) => setF({ ...f, notes: e.target.value })}
        placeholder="Notes — engagement, content type, campus, referral potential"
        className={input}
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={saving || f.full_name.trim().length === 0}
          className="px-4 py-2 rounded-lg bg-gold text-background text-xs font-semibold disabled:opacity-40 gold-glow-hover"
        >
          {saving ? 'Saving…' : 'Add creator'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-gold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Detail({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={cn('mt-0.5 text-xs break-words', mono && 'font-mono')}>{v}</div>
    </div>
  );
}

function LongText({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

/** Re-exported so the page can document the option set without a second import. */
export const CREATOR_CONTENT_TYPES = CONTENT_TYPES;
