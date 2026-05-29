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
  const [user, setUser]       = useState(null);
  const [rooms, setRooms]     = useState([]);
  const [floor, setFloor]     = useState('all');
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetchRooms('all');
  }, [router]);

  const fetchRooms = (f) => {
    setLoading(true);
    const url = f === 'all' ? '/api/rooms' : `/api/rooms?floor=${f}`;
    fetch(url)
      .then(r => r.json())
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  };

  const handleFloor = (f) => { setFloor(f); fetchRooms(f); };

  const handleBook = (room) => setSelected(room);

  const handleSuccess = () => {
    setSelected(null);
    setSuccess(true);
    fetchRooms(floor);
    setTimeout(() => setSuccess(false), 3500);
  };

  if (!user) {
    return loading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading rooms…</div> : null;
  }

  if (loading) {
    return (
      <DashLayout role="dormer">
        <div className={styles.page}>
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading rooms…</p>
        </div>
      </DashLayout>
    );
  }

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
          <label className={styles.filterLabel}>
            Show:
            <select
              className={styles.floorSelect}
              value={floor}
              onChange={(e) => handleFloor(e.target.value)}
            >
              <option value="all">All floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
            </select>
          </label>
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
                userId={user.userId}
                onSuccess={handleSuccess}
                onCancel={() => setSelected(null)}
              />
        </Modal>
      )}
    </DashLayout>
  );
}
