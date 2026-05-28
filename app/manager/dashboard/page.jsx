'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './mgr-dashboard.module.css';

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [dormers, setDormers]   = useState([]);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
    fetch('/api/rooms')
      .then(r => r.json())
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(() => setRooms([]));
    fetch('/api/dormers')
      .then(r => r.json())
      .then(data => setDormers(Array.isArray(data) ? data : []))
      .catch(() => setDormers([]));
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

  const bookingList = bookings;
  const roomList = rooms;
  const dormerList = dormers;
  const pending   = bookingList.filter(b => b.status === 'pending');
  const available = roomList.filter(r => r.status === 'available').length;
  const occupied  = roomList.filter(r => r.status === 'occupied').length;

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Overview</p>
          <h1 className={styles.title}>Manager dashboard</h1>
        </div>

        <div className={styles.stats}>
          {[
            { label: 'Pending requests', value: pending.length,   color: '#7a5500' },
            { label: 'Available rooms',  value: available,         color: '#2d6a4f' },
            { label: 'Occupied rooms',   value: occupied,          color: '#842029' },
            { label: 'Total dormers',    value: dormerList.length, color: 'var(--dark-brown)' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statNum} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {msg && <div className={styles.toast}>{msg}</div>}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending booking requests</h2>
          <BookingTable
            bookings={pending}
            isManager
            onApprove={id => updateStatus(id, 'approved')}
            onReject={id => updateStatus(id, 'rejected')}
          />
        </div>
      </div>
    </DashLayout>
  );
}
