'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './bookings.module.css';

export default function BookingsPage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setLoading(true);
    fetch(`/api/bookings?user_id=${u.userId}`)
      .then(r => r.json()).then(d => { setBookings(Array.isArray(d) ? d.map(row => ({ ...row, full_name: row.fname ? `${row.fname}${row.mname ? ' ' + row.mname : ''} ${row.lname}` : undefined, dormer_id: row.user_id })) : []); setLoading(false); })
      .catch(() => { setBookings([]); setLoading(false); });
  }, [router]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', dormerId: user.dormerId }),
    });
    setBookings(b => b.map(x => x.booking_id === id ? { ...x, status: 'rejected' } : x));
    setMsg('Booking cancelled.');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!user) {
    return loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings…</div> : null;
  }

  return (
    <DashLayout role="dormer">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>My bookings</p>
          <h1 className={styles.title}>Booking history</h1>
        </div>

        {msg && <div className={styles.toast}>{msg}</div>}

        <div className={styles.card}>
          {loading
            ? <p className={styles.loading}>Loading bookings…</p>
            : <BookingTable bookings={bookings} isManager={false} onCancel={handleCancel} />
          }
        </div>
      </div>
    </DashLayout>
  );
}
