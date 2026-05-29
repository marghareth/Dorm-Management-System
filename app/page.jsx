"use client"

import Navbar from '@/components/Navbar';
import styles from './page.module.css';

export default function Home() {
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
            <div className={styles.roomGrid}>
              <div className={styles.roomCard}>
                <div className={styles.roomImagePlaceholder} />
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomTitle}>Room 101 — Single</h3>
                  <p className={styles.roomDetails}>Floor 1 · 1 occupant max</p>
                  <div className={styles.priceSection}>
                    <p className={styles.roomPrice}>₱4,500</p>
                    <p className={styles.roomDuration}>/ month</p>
                  </div>
                  <div className={styles.roomCardFooter}>
                    <span className={styles.roomBadge}>Available</span>
                    <a href="/bookings" className={styles.bookBtn}>Book now</a>
                  </div>
                </div>
              </div>
              <div className={styles.roomCard}>
                <div className={styles.roomImagePlaceholder} />
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomTitle}>Room 102 — Single</h3>
                  <p className={styles.roomDetails}>Floor 1 · 1 occupant max</p>
                  <div className={styles.priceSection}>
                    <p className={styles.roomPrice}>₱4,500</p>
                    <p className={styles.roomDuration}>/ month</p>
                  </div>
                  <span className={styles.roomBadgeOccupied}>Occupied</span>
                </div>
              </div>
              <div className={styles.roomCard}>
                <div className={styles.roomImagePlaceholder} />
                <div className={styles.roomInfo}>
                  <h3 className={styles.roomTitle}>Room 103 — Single</h3>
                  <p className={styles.roomDetails}>Floor 1 · 1 occupant max</p>
                  <div className={styles.priceSection}>
                    <p className={styles.roomPrice}>₱4,200</p>
                    <p className={styles.roomDuration}>/ month</p>
                  </div>
                  <div className={styles.roomCardFooter}>
                    <span className={styles.roomBadge}>Available</span>
                    <a href="/bookings" className={styles.bookBtn}>Book now</a>
                  </div>
                </div>
              </div>
            </div>
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
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>FIRST NAME</label>
                  <input className={styles.input} type="text" placeholder="Maria" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>LAST NAME</label>
                  <input className={styles.input} type="text" placeholder="Santos" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CONTACT NUMBER</label>
                  <input className={styles.input} type="text" placeholder="09XX-XXX-XXXX" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>PREFERRED ROOM TYPE</label>
                  <select className={styles.input}>
                    <option>No preference</option>
                    <option>Single Room</option>
                    <option>Double Room</option>
                    <option>Suite Room</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>PREFERRED CHECK-IN</label>
                  <input className={styles.input} type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>INTENDED STAY (MONTHS)</label>
                  <input className={styles.input} type="number" placeholder="6" min="1" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>ADDITIONAL NOTES</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Any preferences or things the manager should know…"
                  rows={4}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Create Account →
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