'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import RoomCard from '@/components/RoomCard';
import Modal from '@/components/Modal';
import BookingForm from '@/components/BookingForm';
import styles from './rooms.module.css';

export default function RoomsPage() {
  const router = useRouter();
  const mockUser = { fullName: 'Juan dela Cruz', dormerId: 1, role: 'dormer', email: 'juan@example.com' };
  const mockRooms = [
    { room_id: 101, room_number: '101', type: 'Single', floor: 1, price: 4500, status: 'available' },
    { room_id: 204, room_number: '204', type: 'Double', floor: 2, price: 7000, status: 'available' },
    { room_id: 302, room_number: '302', type: 'Single', floor: 3, price: 4200, status: 'available' },
  ];
  const [user, setUser]       = useState(mockUser);
  const [rooms, setRooms]     = useState(mockRooms);
  const [floor, setFloor]     = useState('all');
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   const token  = localStorage.getItem('token');
  //   const stored = localStorage.getItem('user');
  //   if (!token || !stored) { router.push('/login'); return; }
  //   setUser(JSON.parse(stored));
  //   fetchRooms('all');
  // }, []);

  const fetchRooms = (f) => {
    const url = f === 'all' ? '/api/rooms' : `/api/rooms?floor=${f}`;
    fetch(url).then(r => r.json()).then(setRooms);
  };

  const handleFloor = (f) => { setFloor(f); fetchRooms(f); };

  const handleBook = (room) => setSelected(room);

  const handleSuccess = () => {
    setSelected(null);
    setSuccess(true);
    fetchRooms(floor);
    setTimeout(() => setSuccess(false), 3500);
  };

  if (!user) return null;

  return (
    <DashLayout role="dormer">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Browse</p>
            <h1 className={styles.title}>Available rooms</h1>
          </div>
        </div>

        {success && (
          <div className={styles.successBanner}>
            Booking request submitted! The manager will review it shortly.
          </div>
        )}

        <div className={styles.filters}>
          {['all', '1', '2'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${floor === f ? styles.active : ''}`}
              onClick={() => handleFloor(f)}
            >
              {f === 'all' ? 'All floors' : `Floor ${f}`}
            </button>
          ))}
        </div>

        {rooms.length === 0
          ? <p className={styles.empty}>No rooms found.</p>
          : (
            <div className={styles.grid}>
              {rooms.map(r => <RoomCard key={r.room_id} room={r} onBook={handleBook} />)}
            </div>
          )
        }
      </div>

      {selected && (
        <Modal
          title="Book a room"
          subtitle="Fill in your details to submit a booking request"
          onClose={() => setSelected(null)}
        >
          <BookingForm
            room={selected}
            dormerId={user.dormerId}
            onSuccess={handleSuccess}
            onCancel={() => setSelected(null)}
          />
        </Modal>
      )}
    </DashLayout>
  );
}
