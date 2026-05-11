'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './bookings.module.css';

export default function BookingsPage() {
  const router = useRouter();
  const mockUser = { fullName: 'Juan dela Cruz', dormerId: 1, role: 'dormer', email: 'juan@example.com' };
  const mockBookings = [
    { booking_id: 1, room_number: '101', type: 'Single', floor: 1, status: 'approved', check_in: '2026-06-01' },
    { booking_id: 2, room_number: '204', type: 'Double', floor: 2, status: 'pending', check_in: '2026-07-15' },
    { booking_id: 3, room_number: '105', type: 'Single', floor: 1, status: 'rejected', check_in: '2026-05-10' },
  ];
  const [user, setUser]         = useState(mockUser);
  const [bookings, setBookings] = useState(mockBookings);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');

  // useEffect(() => {
  //   const token  = localStorage.getItem('token');
  //   const stored = localStorage.getItem('user');
  //   if (!token || !stored) { router.push('/login'); return; }
  //   const u = JSON.parse(stored);
  //   setUser(u);
  //   fetch(`/api/bookings?dormer_id=${u.dormerId}`)
  //     .then(r => r.json()).then(d => { setBookings(d); setLoading(false); });
  // }, []);

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

  if (!user) return null;

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
