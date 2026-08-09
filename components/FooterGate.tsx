'use client';

import { usePathname } from 'next/navigation';
import Footer02 from '@/components/originkit/footer-02';

export default function FooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Footer02 />;
}
