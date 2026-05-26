'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashLayout from '@/components/DashLayout';
import styles from '../mgr-dormers.module.css';

const dormersData = [
  { dormer_id: 1, full_name: 'Juan dela Cruz', email: 'juan@example.com', phone: '0917-123-4567' },
  { dormer_id: 2, full_name: 'Ana Santos', email: 'ana@example.com', phone: '0917-234-5678' },
  { dormer_id: 3, full_name: 'Mark Reyes', email: 'mark@example.com', phone: '0917-345-6789' },
];

const bookingsData = [
  { dormer_id: 1, full_name: 'Juan dela Cruz', room_number: '101', status: 'pending', check_in: '2026-06-01', check_out: '2026-12-01' },
  { dormer_id: 2, full_name: 'Ana Santos', room_number: '204', status: 'approved', check_in: '2026-06-10', check_out: '2027-01-10' },
  { dormer_id: 3, full_name: 'Mark Reyes', room_number: '305', status: 'rejected', check_in: '2026-05-10', check_out: '2026-08-10' },
];

export default function DormerDetailPage() {
  const params = useParams();
  const idStr = params?.id || '';
  const id = parseInt(idStr, 10);

  let dormer = dormersData.find((d) => d.dormer_id === id);
  
  if (!dormer) {
    const bookingData = bookingsData.find((b) => b.dormer_id === id);
    if (bookingData) {
      dormer = {
        dormer_id: id,
        full_name: bookingData.full_name || 'Unknown',
        email: 'N/A',
        phone: 'N/A',
      };
    }
  }

  if (!dormer) {
    return (
      <DashLayout role="manager">
        <div className={styles.page}>
          <p>Dormer not found (ID: {id}).</p>
          <Link href="/manager/dormers" className={styles.link}>← Back to dormer roster</Link>
        </div>
      </DashLayout>
    );
  }

  const activeBooking = bookingsData.find((b) => b.dormer_id === id && b.status === 'approved');

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Dormer details</p>
          <h1 className={styles.title}>{dormer.full_name}</h1>
          <Link href="/manager/dormers" className={styles.link}>← Back to dormer roster</Link>
        </div>

        <div className={styles.card}>
          <p><strong>Email:</strong> {dormer.email}</p>
          <p><strong>Phone:</strong> {dormer.phone}</p>
          <p><strong>Program:</strong> N/A</p>
          <p><strong>Year Level:</strong> N/A</p>
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Current booking</h2>
            {activeBooking ? (
              <div>
                <p><strong>Room:</strong> {activeBooking.room_number}</p>
                <p><strong>Status:</strong> {activeBooking.status}</p>
                <p><strong>Check-in:</strong> {new Date(activeBooking.check_in).toLocaleDateString('en-PH')}</p>
                <p><strong>Check-out:</strong> {new Date(activeBooking.check_out).toLocaleDateString('en-PH')}</p>
              </div>
            ) : (
              <p>No currently approved room.</p>
            )}
          </div>
        </div>
      </div>
    </DashLayout>
  );
}
