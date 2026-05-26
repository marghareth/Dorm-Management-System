'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import BookingTable from '@/components/BookingTable';
import styles from './mgr-dashboard.module.css';

export default function ManagerDashboard() {
  const mockBookings = [
    { booking_id: 1, dormer_id: 1, full_name: 'Juan dela Cruz', room_number: '101', type: 'Single', floor: 1, status: 'pending', check_in: '2026-06-01', check_out: '2026-12-01', num_months: 6, num_occupants: 1 },
    { booking_id: 2, dormer_id: 2, full_name: 'Ana Santos', room_number: '204', type: 'Double', floor: 2, status: 'approved', check_in: '2026-06-10', check_out: '2027-01-10', num_months: 7, num_occupants: 2 },
    { booking_id: 3, dormer_id: 3, full_name: 'Mark Reyes', room_number: '105', type: 'Single', floor: 1, status: 'rejected', check_in: '2026-05-10', check_out: '2026-08-10', num_months: 3, num_occupants: 1 },
  ];
  const mockRooms = [
    { room_id: 101, room_number: '101', type: 'Single', floor: 1, capacity: 1, price: 4500, status: 'available' },
    { room_id: 204, room_number: '204', type: 'Double', floor: 2, capacity: 2, price: 7000, status: 'occupied' },
    { room_id: 305, room_number: '305', type: 'Single', floor: 3, capacity: 1, price: 4200, status: 'available' },
  ];
  const mockDormers = [
    { dormer_id: 1, full_name: 'Juan dela Cruz' },
    { dormer_id: 2, full_name: 'Ana Santos' },
    { dormer_id: 3, full_name: 'Mark Reyes' },
  ];
  const [bookings, setBookings] = useState(mockBookings);
  const [rooms, setRooms]       = useState(mockRooms);
  const [dormers, setDormers]   = useState(mockDormers);
  const [msg, setMsg]           = useState('');

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : mockBookings))
      .catch(() => setBookings(mockBookings));
    fetch('/api/rooms')
      .then(r => r.json())
      .then(data => setRooms(Array.isArray(data) ? data : mockRooms))
      .catch(() => setRooms(mockRooms));
    fetch('/api/dormers')
      .then(r => r.json())
      .then(data => setDormers(Array.isArray(data) ? data : mockDormers))
      .catch(() => setDormers(mockDormers));
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

  const bookingList = Array.isArray(bookings) ? bookings : mockBookings;
  const roomList = Array.isArray(rooms) ? rooms : mockRooms;
  const dormerList = Array.isArray(dormers) ? dormers : mockDormers;
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
