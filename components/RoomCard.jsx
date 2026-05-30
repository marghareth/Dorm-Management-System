'use client';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import styles from './RoomCard.module.css';

export default function RoomCard({ room, onBook }) {
  const isAvailable = room.status === 'available';
  const [tooltip, setTooltip] = useState(null); // { name, description }

  return (
    <div className={styles.card}>

      {/* Thumbnail */}
      <div className={`${styles.thumb} ${styles['floor' + room.floor]}`}>
        <span className={styles.floorTag}>Floor {room.floor}</span>
        <span className={styles.typeTag}>{room.type}</span>
        <span className={styles.roomNumberBig}>{room.room_number}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>Room {room.room_number}</h3>

        <p className={styles.meta}>
          {room.capacity} occupant{room.capacity > 1 ? 's' : ''} max
          <span className={styles.metaDot} />
          {room.type}
        </p>

        {/* Amenity pills — click to see description */}
        {room.amenities && room.amenities.length > 0 && (
          <div className={styles.amenities}>
            {room.amenities.map((a) => {
              const name = typeof a === 'string' ? a : a.name;
              const desc = typeof a === 'string' ? '' : a.description;
              const isActive = tooltip?.name === name;
              return (
                <button
                  key={name}
                  type="button"
                  className={`${styles.pill} ${isActive ? styles.pillActive : ''}`}
                  onClick={() => setTooltip(isActive ? null : { name, description: desc })}
                  aria-expanded={isActive}
                >
                  {name}
                </button>
              );
            })}
          </div>
        )}

        {/* Amenity description popup */}
        {tooltip && (
          <div className={styles.amenityPopup}>
            <div className={styles.amenityPopupHeader}>
              <span className={styles.amenityPopupName}>{tooltip.name}</span>
              <button
                type="button"
                className={styles.amenityPopupClose}
                onClick={() => setTooltip(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className={styles.amenityPopupDesc}>
              {tooltip.description || 'No description available.'}
            </p>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>₱{Number(room.price).toLocaleString()}</span>
            <span className={styles.per}>/ month</span>
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