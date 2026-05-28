'use client';
import StatusBadge from './StatusBadge';
import styles from './RoomCard.module.css';

export default function RoomCard({ room, onBook }) {
  const isAvailable = room.status === 'available';

  return (
    <div className={styles.card}>
      <div className={`${styles.thumb} ${styles['floor' + room.floor]}`}>
        <span className={styles.imageLabel}>Image placeholder</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>Room {room.room_number} — {room.type}</h3>
        <p className={styles.meta}>Floor {room.floor} · {room.capacity} occupant{room.capacity > 1 ? 's' : ''} max</p>

        {room.amenities && room.amenities.length > 0 && (
          <div className={styles.amenities}>
            {room.amenities.map((a) => (
              <span key={a} className={styles.pill}>{a}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <div>
            <span className={styles.price}>₱{Number(room.price).toLocaleString()}</span>
            <span className={styles.per}> / month</span>
          </div>
          <div className={styles.actionRow}>
            <StatusBadge status={room.status} />
            {onBook && (
              <button
                className={styles.bookBtn}
                onClick={() => onBook(room)}
                disabled={!isAvailable}
              >
                {isAvailable ? 'Book now' : 'Not available'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
