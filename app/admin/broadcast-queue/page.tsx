'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';

type Broadcast = {
  id: number;
  message: string;
  scheduled_at: string;
  status: string;
  sent: number;
  failed: number;
};

export default function AdminBroadcastQueuePage() {
  const [queue, setQueue] = useState<Broadcast[]>([]);
  const [message, setMessage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/admin/broadcast-queue');
    if (res.ok) {
      const data = await res.json();
      setQueue(data.queue || []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const schedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/broadcast-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, scheduled_at: scheduledAt, timezone }),
    });
    setMessage('');
    setScheduledAt('');
    setLoading(false);
    load();
  };

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Broadcast Queue</h1>
      <p className="mt-1 text-sm text-white/60">Schedule Telegram broadcasts with timezone support.</p>

      <form onSubmit={schedule} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs text-white/60">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
            rows={4}
          />
        </div>
        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
        />
        <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Scheduling…' : 'Schedule broadcast'}
        </Button>
      </form>

      <div className="mt-8 space-y-3">
        {queue.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{item.message}</p>
                <p className="text-[11px] text-white/40">
                  {new Date(item.scheduled_at).toLocaleString()} • {item.status}
                </p>
              </div>
              <div className="text-right text-[11px] text-white/60">
                <div>Sent: {item.sent}</div>
                <div>Failed: {item.failed}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
