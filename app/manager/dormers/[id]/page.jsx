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

        <div className={styles.detailsGrid}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.detailsSection}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{dormer.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone</span>
                <span className={styles.detailValue}>{dormer.phone || '—'}</span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Emergency Contact</h2>
            <div className={styles.detailsSection}>
              {dormer.emergency_contacts && dormer.emergency_contacts.length > 0 ? (
                <>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Name</span>
                    <span className={styles.detailValue}>{dormer.emergency_contacts[0].contact_name || '—'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Phone</span>
                    <span className={styles.detailValue}>{dormer.emergency_contacts[0].contact_phone || '—'}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Relationship</span>
                    <span className={styles.detailValue}>{dormer.emergency_contacts[0].relationship || '—'}</span>
                  </div>
                </>
              ) : (
                <p className={styles.empty}>No emergency contact on file.</p>
              )}
            </div>
          </div>
        </div>

        {activeBooking && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Current Booking</h2>
            <div className={styles.bookingInfo}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Room</span>
                <span className={styles.detailValue}>{activeBooking.room_number}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Room Type</span>
                <span className={styles.detailValue}>{activeBooking.type || '—'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Floor</span>
                <span className={styles.detailValue}>{activeBooking.floor || '—'}</span>
              </div>
              {activeBooking.check_in && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Check-in</span>
                  <span className={styles.detailValue}>{new Date(activeBooking.check_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              {activeBooking.check_out && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Check-out</span>
                  <span className={styles.detailValue}>{new Date(activeBooking.check_out).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Duration</span>
                <span className={styles.detailValue}>{activeBooking.num_months} month{activeBooking.num_months > 1 ? 's' : ''}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Occupants</span>
                <span className={styles.detailValue}>{activeBooking.num_occupants}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
