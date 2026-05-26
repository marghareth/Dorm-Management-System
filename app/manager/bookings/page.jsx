'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './mgr-bookings.module.css';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState([
    { booking_id: 1, dormer_id: 1, full_name: 'Juan dela Cruz', room_number: '101', type: 'Single', floor: 1, status: 'pending', check_in: '2026-06-01', check_out: '2026-12-01', num_months: 6, num_occupants: 1 },
    { booking_id: 2, dormer_id: 2, full_name: 'Ana Santos', room_number: '204', type: 'Double', floor: 2, status: 'approved', check_in: '2026-06-10', check_out: '2027-01-10', num_months: 7, num_occupants: 2 },
    { booking_id: 3, dormer_id: 3, full_name: 'Mark Reyes', room_number: '305', type: 'Single', floor: 3, status: 'rejected', check_in: '2026-05-10', check_out: '2026-08-10', num_months: 3, num_occupants: 1 },
  ]);
  const [filter, setFilter]     = useState('all');
  const [msg, setMsg]           = useState('');

  // useEffect(() => {
  //   fetch('/api/bookings').then(r => r.json()).then(setBookings);
  // }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBookings(b => b.map(x => x.booking_id === id ? { ...x, status } : x));
    setMsg(`Booking ${status}.`);
    setTimeout(() => setMsg(''), 3000);
  };

  const bookingList = Array.isArray(bookings) ? bookings : [];
  const filtered = filter === 'all' ? bookingList : bookingList.filter(b => b.status === filter);

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Manage</p>
          <h1 className={styles.title}>All bookings</h1>
        </div>

        {msg && <div className={styles.toast}>{msg}</div>}

        <div className={styles.filters}>
          {['all','pending','approved','rejected'].map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter===f ? styles.active:''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.card}>
          <BookingTable
            bookings={filtered}
            isManager
            onApprove={id => updateStatus(id, 'approved')}
            onReject={id => updateStatus(id, 'rejected')}
          />
        </div>
      </div>
    </DashLayout>
  );
}
