'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

const DORMER_LINKS = [
  { href: '/dashboard',  label: 'Dashboard'    },
  { href: '/rooms',      label: 'Browse Rooms' },
  { href: '/bookings',   label: 'My Bookings'  },
  { href: '/profile',    label: 'My Profile'   },
];

const MANAGER_LINKS = [
  { href: '/manager/dashboard',  label: 'Dashboard' },
  { href: '/manager/bookings',   label: 'Bookings'  },
  { href: '/manager/rooms',      label: 'Rooms'     },
  { href: '/manager/amenities',  label: 'Amenities' },
  { href: '/manager/dormers',    label: 'Dormers'   },
];

export default function Sidebar({ role = 'dormer' }) {
  const pathname = usePathname();
  const router   = useRouter();
  const links    = role === 'manager' ? MANAGER_LINKS : DORMER_LINKS;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        xanelle<span className={styles.accent}>dorms</span>
      </div>

      <nav className={styles.nav}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Log out
        </button>
      </div>
    </aside>
  );
}
