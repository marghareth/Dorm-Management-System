'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import StatusBadge from '@/components/StatusBadge';
import styles from './dashboard.module.css';

export default function DormerDashboard() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms]       = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token  = localStorage.getItem('token');
    if (!token || !stored) {
      router.push('/login');
      return;
    }

    const u = JSON.parse(stored);
    if (u.role === 'manager') {
      router.push('/manager/dashboard');
      return;
    }

    setUser(u);

    fetch(`/api/bookings?user_id=${u.userId}`)
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d) ? d.map(row => ({ ...row, full_name: row.fname ? `${row.fname}${row.mname ? ' ' + row.mname : ''} ${row.lname}` : undefined, dormer_id: row.user_id })) : []))
      .catch(() => setBookings([]));
    fetch('/api/rooms')
      .then(r => r.json())
      .then(d => setRooms(Array.isArray(d) ? d.filter(r => r.status === 'available') : []))
      .catch(() => setRooms([]));
  }, [router]);

  if (!user) return null;

  const bookingList = Array.isArray(bookings) ? bookings : [];
  const roomList = Array.isArray(rooms) ? rooms : [];
  const active   = bookingList.find(b => b.status === 'approved');
  const pending  = bookingList.filter(b => b.status === 'pending').length;

  return (
    <DashLayout role="dormer">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Good day</p>
          <h1 className={styles.title}>Welcome back, {user.fullName.split(' ')[0]} 👋</h1>
        </div>

        <div className={styles.stats}>
          {[
            { label: 'Total bookings',     value: bookingList.length },
            { label: 'Pending requests',   value: pending },
            { label: 'Available rooms',    value: roomList.length },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statNum}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {active && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Current booking</h2>
            <div className={styles.activeBooking}>
              <div>
                <div className={styles.bookingRoom}>Room {active.room_number} — {active.type}</div>
                <div className={styles.bookingMeta}>
                  Floor {active.floor} · Check-in: {new Date(active.check_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} · {active.num_months} month{active.num_months > 1 ? 's' : ''} · {active.num_occupants} occupant{active.num_occupants > 1 ? 's' : ''}
                </div>
              </div>
              <StatusBadge status="approved" />
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Recent bookings</h2>
            <a href="/bookings" className={styles.viewAll}>View all</a>
          </div>
          {bookingList.length === 0
            ? <p className={styles.empty}>You have no bookings yet. <a href="/rooms" className={styles.link}>Browse rooms →</a></p>
            : bookingList.slice(0, 3).map(b => (
              <div key={b.booking_id} className={styles.bookingRow}>
                <div>
                  <strong>Room {b.room_number}</strong>
                  <span className={styles.bookingMeta}> · {new Date(b.check_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))
          }
        </div>
      </div>
    </DashLayout>
  );
}
