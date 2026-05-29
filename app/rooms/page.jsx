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
  const [user,     setUser]     = useState(null);
  const [rooms,    setRooms]    = useState([]);
  const [floor,    setFloor]    = useState('all');
  const [selected, setSelected] = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
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

  // ─── Derived stats ────────────────────────────────────────────────────────
  const available   = rooms.filter(r => r.status === 'available').length;
  const occupied    = rooms.filter(r => r.status === 'occupied').length;
  const maintenance = rooms.filter(r => r.status === 'under maintenance').length;

  // ─── Guards ───────────────────────────────────────────────────────────────
  if (!user) {
    return loading
      ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading rooms…</div>
      : null;
  }

  if (loading) {
    return (
      <DashLayout role="dormer">
        <div className={styles.page}>
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--olive)' }}>
            Loading rooms…
          </p>
        </div>
      </DashLayout>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <DashLayout role="dormer">
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Browse</p>
          <h1 className={styles.title}>Available rooms</h1>
        </div>

        {/* Success banner */}
        {success && (
          <div className={styles.successBanner}>
            Booking request submitted! The manager will review it shortly.
          </div>
        )}

        {/* Filters */}
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

        {/* Stats bar */}
        {rooms.length > 0 && (
          <div className={styles.statsBar}>
            {available > 0 && (
              <div className={styles.statItem}>
                <span className={`${styles.statCount} ${styles.statCountAvailable}`}>
                  {available}
                </span>
                <span className={styles.statLabel}>available</span>
              </div>
            )}
            {available > 0 && (occupied > 0 || maintenance > 0) && (
              <span className={styles.statDivider} />
            )}
            {occupied > 0 && (
              <div className={styles.statItem}>
                <span className={`${styles.statCount} ${styles.statCountOccupied}`}>
                  {occupied}
                </span>
                <span className={styles.statLabel}>occupied</span>
              </div>
            )}
            {occupied > 0 && maintenance > 0 && (
              <span className={styles.statDivider} />
            )}
            {maintenance > 0 && (
              <div className={styles.statItem}>
                <span className={`${styles.statCount} ${styles.statCountMaintenance}`}>
                  {maintenance}
                </span>
                <span className={styles.statLabel}>maintenance</span>
              </div>
            )}
          </div>
        )}

        {/* Grid */}
        {rooms.length === 0
          ? <p className={styles.empty}>No rooms found.</p>
          : (
            <div className={styles.grid}>
              {rooms.map(r => (
                <RoomCard key={r.room_id} room={r} onBook={handleBook} />
              ))}
            </div>
          )
        }
      </div>

      {/* Booking modal */}
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