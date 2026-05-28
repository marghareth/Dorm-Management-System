'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashLayout from '@/components/DashLayout';
import styles from '../mgr-dormers.module.css';

export default function DormerDetailPage() {
  const params = useParams();
  const idStr = params?.id || '';
  const id = parseInt(idStr, 10);

  const [dormer, setDormer] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      fetch(`/api/dormers/${id}`).then((res) => res.json()),
      fetch(`/api/bookings?user_id=${id}`).then((res) => res.json()),
    ]).then(([dormerData, bookingsData]) => {
      if (dormerData && !dormerData.message) {
        setDormer({
          ...dormerData,
          full_name: dormerData.mname
            ? `${dormerData.fname} ${dormerData.mname} ${dormerData.lname}`
            : `${dormerData.fname} ${dormerData.lname}`,
        });
      } else {
        setDormer(null);
      }

      if (Array.isArray(bookingsData)) {
        const booking = bookingsData.find((b) => b.status === 'approved');
        setActiveBooking(booking || null);
      } else {
        setActiveBooking(null);
      }

      setLoading(false);
    }).catch(() => {
      setDormer(null);
      setActiveBooking(null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <DashLayout role="manager">
        <div className={styles.page}>
          <p>Loading dormer details…</p>
        </div>
      </DashLayout>
    );
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
          <p><strong>Phone:</strong> {dormer.phone || 'N/A'}</p>
          <p><strong>Program:</strong> N/A</p>
          <p><strong>Year Level:</strong> N/A</p>
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>Current booking</h2>
            {activeBooking ? (
              <div>
                <p><strong>Room:</strong> {activeBooking.room_number}</p>
                <p><strong>Status:</strong> {activeBooking.status}</p>
                {activeBooking.check_in && (
                  <p><strong>Check-in:</strong> {new Date(activeBooking.check_in).toLocaleDateString('en-PH')}</p>
                )}
                {activeBooking.check_out && (
                  <p><strong>Check-out:</strong> {new Date(activeBooking.check_out).toLocaleDateString('en-PH')}</p>
                )}
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
