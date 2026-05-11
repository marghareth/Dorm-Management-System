'use client';
import { useState } from 'react';
import styles from './BookingForm.module.css';

export default function BookingForm({ room, dormerId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    checkIn: '', checkOut: '', numMonths: 1, numOccupants: 1, specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dormerId, roomId: room.room_id,
          checkIn: form.checkIn, checkOut: form.checkOut,
          numMonths: parseInt(form.numMonths),
          numOccupants: parseInt(form.numOccupants),
          specialRequests: form.specialRequests,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      onSuccess && onSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.roomInfo}>
        <span className={styles.roomLabel}>Room {room.room_number} — {room.type}</span>
        <span className={styles.roomPrice}>₱{Number(room.price).toLocaleString()}/mo</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label}>Check-in date</label>
          <input className={styles.input} type="date" name="checkIn" value={form.checkIn} onChange={handle} required />
        </div>
        <div className={styles.group}>
          <label className={styles.label}>Check-out date</label>
          <input className={styles.input} type="date" name="checkOut" value={form.checkOut} onChange={handle} required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label className={styles.label}>Number of months</label>
          <input className={styles.input} type="number" name="numMonths" min="1" value={form.numMonths} onChange={handle} required />
        </div>
        <div className={styles.group}>
          <label className={styles.label}>Number of occupants</label>
          <input className={styles.input} type="number" name="numOccupants" min="1" max={room.capacity} value={form.numOccupants} onChange={handle} required />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Special requests</label>
        <textarea className={styles.textarea} name="specialRequests" value={form.specialRequests} onChange={handle} placeholder="Any preferences or things the manager should know…" rows={3} />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnSubmit} disabled={loading}>
          {loading ? 'Submitting…' : 'Submit booking request'}
        </button>
        <button type="button" className={styles.btnCancel} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
