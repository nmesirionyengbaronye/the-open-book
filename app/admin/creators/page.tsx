import { CreatorsTable } from '@/components/admin/CreatorsTable';

export default function AdminCreatorsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Creator Program</h1>
        <p className="text-muted-foreground">
          Applications from <span className="text-gold">/creators</span> and the outreach pipeline, in one
          place. Change a status to record progress; the timestamp is set automatically.
        </p>
      </div>
      <CreatorsTable />
    </div>
  );
}
