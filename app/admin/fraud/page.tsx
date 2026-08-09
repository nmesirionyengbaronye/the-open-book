'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

type FraudFlag = {
  user_id: string;
  referral_code: string;
  device_count: number;
  ip_count: number;
  phone_count: number;
};

export default function AdminFraudPage() {
  const [flags, setFlags] = useState<FraudFlag[]>([]);

  useEffect(() => {
    fetch('/api/admin/fraud')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setFlags(data.flags || []);
      });
  }, []);

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Fraud Detection</h1>
      <p className="mt-1 text-sm text-white/60">Accounts with suspicious referral patterns.</p>

      <div className="mt-6 space-y-3">
        {flags.map((flag) => (
          <Card key={flag.user_id} className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm font-medium text-white">{flag.referral_code}</p>
                <p className="text-[11px] text-white/60">
                  Devices: {flag.device_count} • IPs: {flag.ip_count} • Phones: {flag.phone_count}
                </p>
              </div>
            </div>
          </Card>
        ))}
        {flags.length === 0 && (
          <p className="text-sm text-white/40">No fraud flags detected.</p>
        )}
      </div>
    </div>
  );
}
