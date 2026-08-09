import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { AdminShortcutsBridge } from '@/components/admin/AdminShortcutsBridge';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <AdminNavbar />
      <AdminShortcutsBridge />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}