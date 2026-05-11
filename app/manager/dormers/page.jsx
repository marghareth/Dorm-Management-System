'use client';
import Link from 'next/link';
import DashLayout from '@/components/DashLayout';
import styles from './mgr-dormers.module.css';

const dormers = [
  { dormer_id: 1, full_name: 'Juan dela Cruz', email: 'juan@example.com', program: 'BS Computer Science', year_level: '2nd Year', phone: '0917-123-4567' },
  { dormer_id: 2, full_name: 'Ana Santos', email: 'ana@example.com', program: 'BS Nursing', year_level: '3rd Year', phone: '0917-234-5678' },
  { dormer_id: 3, full_name: 'Mark Reyes', email: 'mark@example.com', program: 'BS Business Administration', year_level: '1st Year', phone: '0917-345-6789' },
];

const activeBookings = [
  { dormer_id: 2, room_number: '204', status: 'approved' },
  { dormer_id: 3, room_number: '305', status: 'rejected' },
];

export default function ManagerDormers() {
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
                <th>Program</th>
                <th>Year</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dormers.map((d) => {
                const booking = activeBookings.find((b) => b.dormer_id === d.dormer_id && b.status === 'approved');
                return (
                  <tr key={d.dormer_id}>
                    <td>
                      <Link href={`/manager/dormers/${d.dormer_id}`} className={styles.link}>
                        {d.full_name}
                      </Link>
                    </td>
                    <td>{d.program}</td>
                    <td>{d.year_level}</td>
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
