"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    fetch('/api/rooms')
      .then(r => r.json())
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(() => setRooms([]))
      .finally(() => setLoadingRooms(false));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    const form = e.target;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.value,
          middleName: form.middleName.value,
          lastName: form.lastName.value,
          email: form.email.value,
          password,
          phone: form.phone.value,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setRegisterError(data.message || 'Registration failed'); return; }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, phone: form.phone.value }));
      router.push('/emergency-contact');
    } catch {
      setRegisterError('An error occurred. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>NOW ACCEPTING RESIDENTS</p>
            <h1 className={styles.heroHeading}>
              Your home<br />away from<br />
              <em className={styles.heroItalic}>home.</em>
            </h1>
            <p className={styles.heroSub}>
              Comfortable, affordable dorm living in a well-managed space.
              Browse available rooms and register today.
            </p>
            <div className={styles.heroActions}>
              <a href="/register" className={styles.btnPrimary}>Register</a>
              <a href="#rooms" className={styles.btnSecondary}>View rooms</a>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className={styles.services}>
          <div className={styles.sectionInner}>
            <p className={styles.eyebrowLight}>WHY CHOOSE US</p>
            <h2 className={styles.serviceHeading}>
              Everything you need<br />is here
            </h2>
            <p className={styles.serviceSub}>
              We keep things simple — clean rooms, fair pricing, and a manager who actually responds.
            </p>
            <div className={styles.cards}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Managed boarding</h3>
                <p className={styles.cardText}>
                  All rooms are handled by a single dedicated manager, so nothing falls through the cracks.
                </p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Easy booking</h3>
                <p className={styles.cardText}>
                  Browse rooms, submit your request, and get notified once your booking is approved.
                </p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>Quick registration</h3>
                <p className={styles.cardText}>
                  Create your account easily and start booking rooms right away. Our manager will guide you through the process.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROOMS ── */}
        <section id="rooms" className={styles.rooms}>
          <div className={styles.sectionInner}>
            <div className={styles.roomsHeader}>
              <div>
                <p className={styles.eyebrow}>BROWSE ROOMS</p>
                <h2 className={styles.roomsHeading}>Current availability</h2>
              </div>
              <a href="/register" className={styles.btnOutline}>Register to book</a>
            </div>

            {loadingRooms ? (
              <p style={{ color: 'var(--olive)', textAlign: 'center', padding: '2rem' }}>Loading rooms…</p>
            ) : rooms.length === 0 ? (
              <p style={{ color: 'var(--olive)', textAlign: 'center', padding: '2rem' }}>No rooms available at the moment.</p>
            ) : (
              <div className={styles.roomGrid}>
                {rooms.map(room => (
                  <div key={room.room_id} className={styles.roomCard}>
                    <div className={`${styles.roomImagePlaceholder} ${styles['floor' + room.floor] || ''}`} />
                    <div className={styles.roomInfo}>
                      <h3 className={styles.roomTitle}>Room {room.room_number} — {room.type}</h3>
                      <p className={styles.roomDetails}>Floor {room.floor} · {room.capacity} occupant{room.capacity > 1 ? 's' : ''} max</p>

                      {room.amenities && room.amenities.length > 0 && (
                        <div className={styles.amenityList}>
                          {room.amenities.map(a => (
                            <span key={a} className={styles.amenityPill}>{a}</span>
                          ))}
                        </div>
                      )}

                      <div className={styles.priceSection}>
                        <p className={styles.roomPrice}>₱{Number(room.price).toLocaleString()}</p>
                        <p className={styles.roomDuration}>/ month</p>
                      </div>

                      <div className={styles.roomCardFooter}>
                        <span className={room.status === 'available' ? styles.roomBadge : styles.roomBadgeOccupied}>
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                        </span>
                        {room.status === 'available' && (
                          <a href="/register" className={styles.bookBtn}>Book now</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── REGISTRATION ── */}
        <section id="register" className={styles.waitlist}>
          <div className={styles.waitlistInner}>
            <p className={styles.eyebrowGold}>GET STARTED</p>
            <h2 className={styles.waitlistHeading}>Register</h2>
            <p className={styles.waitlistSub}>
              Create your account below. You'll be able to browse rooms, submit bookings,
              and manage your profile directly.
            </p>
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.formRow} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>FIRST NAME</label>
                  <input className={styles.input} type="text" name="firstName" placeholder="Maria" required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>MIDDLE NAME</label>
                  <input className={styles.input} type="text" name="middleName" placeholder="Cruz" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>LAST NAME</label>
                  <input className={styles.input} type="text" name="lastName" placeholder="Santos" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>EMAIL</label>
                  <input className={styles.input} type="email" name="email" placeholder="your@email.com" required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CONTACT NUMBER</label>
                  <input className={styles.input} type="tel" name="phone" placeholder="09XX-XXX-XXXX" required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>PASSWORD</label>
                  <input className={styles.input} type="password" name="password" placeholder="••••••••" required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CONFIRM PASSWORD</label>
                  <input className={styles.input} type="password" name="confirmPassword" placeholder="••••••••" required />
                </div>
              </div>
              {registerError && <p style={{ color: '#842029', fontSize: '0.88rem', margin: 0 }}>{registerError}</p>}
              <button type="submit" className={styles.submitBtn} disabled={registerLoading}>
                {registerLoading ? 'Creating Account...' : 'Create Account →'}
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>xanelle<span className={styles.footerLogoAccent}>dorms</span></span>
            <p className={styles.footerTagline}>Your home away from home.</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Navigate</p>
              <a href="#services" className={styles.footerLink}>Services</a>
              <a href="#rooms" className={styles.footerLink}>Rooms</a>
              <a href="/register" className={styles.footerLink}>Register</a>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Account</p>
              <a href="/login" className={styles.footerLink}>Sign in</a>
              <a href="/register" className={styles.footerLink}>Register</a>
              <a href="/dashboard" className={styles.footerLink}>Dashboard</a>
            </div>
            <div className={styles.footerCol}>
              <p className={styles.footerColTitle}>Contact</p>
              <p className={styles.footerText}>xanelledorms@email.com</p>
              <p className={styles.footerText}>09XX-XXX-XXXX</p>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Xanelle Dorms. All rights reserved. Built for CMSC 127.</p>
        </div>
      </footer>
    </>
  );
}