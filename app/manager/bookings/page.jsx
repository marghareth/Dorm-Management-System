'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './mgr-bookings.module.css';

export default function ManagerBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, []);

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
