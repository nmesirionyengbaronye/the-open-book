'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';

type WebhookLog = {
  id: number;
  chat_id: string;
  status: string;
  error_message: string | null;
  created_at: string;
};

export default function AdminWebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  useEffect(() => {
    fetch('/api/admin/webhook-logs')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setLogs(data.logs || []);
      });
  }, []);

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Telegram Webhook Logs</h1>
      <p className="mt-1 text-sm text-white/60">Recent delivery attempts for broadcasts.</p>

      <div className="mt-6 space-y-3">
        {logs.map((log) => (
          <Card key={log.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white">Chat: {log.chat_id}</p>
                <p className="text-[11px] text-white/40">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  log.status === 'sent'
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {log.status}
              </span>
            </div>
            {log.error_message && (
              <p className="mt-2 text-[11px] text-red-300">{log.error_message}</p>
            )}
          </Card>
        ))}
        {logs.length === 0 && (
          <p className="text-sm text-white/40">No webhook logs yet.</p>
        )}
      </div>
    </div>
  );
}
