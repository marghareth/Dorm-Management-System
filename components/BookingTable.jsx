'use client';
import Link from 'next/link';
import StatusBadge from './StatusBadge';
import styles from './BookingTable.module.css';

export default function BookingTable({ bookings, isManager, onApprove, onReject, onCancel }) {
  if (!bookings || bookings.length === 0) {
    return <p className={styles.empty}>No bookings found.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {isManager && <th>Dormer</th>}
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Months</th>
            <th>Occupants</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const dormerId = b.dormer_id || b.dormerId || b.user_id || b.userId;
            const dormerName = b.full_name || b.dormer_name || b.dormerName || 'Unknown';
            const checkIn = b.check_in || b.checkIn ? new Date(b.check_in || b.checkIn).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const checkOut = b.check_out || b.checkOut ? new Date(b.check_out || b.checkOut).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const months = b.num_months ?? b.numMonths ?? '—';
            const occupants = b.num_occupants ?? b.numOccupants ?? '—';

            return (
              <tr key={b.booking_id}>
                {isManager && (
                  <td>
                    <strong>
                      {dormerId ? (
                        <Link href={`/manager/dormers/${dormerId}`} className={styles.dormerLink}>
                          {dormerName}
                        </Link>
                      ) : (
                        dormerName
                      )}
                    </strong>
                  </td>
                )}
                <td>
                  <strong>Room {b.room_number}</strong>
                  <br />
                  <span className={styles.sub}>{b.type} · Floor {b.floor}</span>
                </td>
                <td>{checkIn}</td>
                <td>{checkOut}</td>
                <td>{months}</td>
                <td>{occupants}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                <div className={styles.actions}>
                  {isManager && b.status === 'pending' && (
                    <>
                      <button className={styles.btnApprove} onClick={() => onApprove(b.booking_id)}>Approve</button>
                      <button className={styles.btnReject}  onClick={() => onReject(b.booking_id)}>Reject</button>
                    </>
                  )}
                  {!isManager && b.status === 'pending' && (
                    <button className={styles.btnCancel} onClick={() => onCancel(b.booking_id)}>Cancel</button>
                  )}
                  {b.status !== 'pending' && <span className={styles.na}>—</span>}
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
} 
