'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashLayout from '@/components/DashLayout';
import styles from './mgr-dormers.module.css';

export default function ManagerDormers() {
  const [dormers, setDormers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/dormers')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return setDormers([]);
        setDormers(data.map(d => ({
          ...d,
          full_name: d.mname ? `${d.fname} ${d.mname} ${d.lname}` : `${d.fname} ${d.lname}`,
        })));
      })
      .catch(() => setDormers([]));

    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'approved');

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Dormers</p>
          <h1 className={styles.title}>Dormer roster</h1>
        </div>

        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
            </thead>
            <tbody>
              {dormers.map((d) => {
                const booking = activeBookings.find((b) => b.user_id === d.user_id && b.status === 'approved');
                return (
                  <tr key={d.user_id}>
                    <td>
                      <Link href={`/manager/dormers/${d.user_id}`} className={styles.link}>
                        {d.full_name}
                      </Link>
                    </td>
                    <td>{d.phone}</td>
                    <td>{booking ? `Room ${booking.room_number} · Occupied` : 'No active room'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashLayout>
  );
}
