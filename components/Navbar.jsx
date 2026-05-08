'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          xanelle<span className={styles.logoAccent}>dorms</span>
        </Link>
        <div className={styles.links}>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#rooms" className={styles.navLink}>Rooms</a>
        </div>
        <Link href="/login" className={styles.signIn}>Sign in</Link>
      </div>
    </nav>
  );
}