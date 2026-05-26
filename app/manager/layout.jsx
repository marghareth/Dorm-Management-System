'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerLayout({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'manager') { router.push('/dashboard'); return; }
    setOk(true);
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
