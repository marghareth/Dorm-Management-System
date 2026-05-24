'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Home, Calendar, User, ClipboardList, Lightbulb, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Sidebar.module.css';

const DORMER_LINKS = [
  { href: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/rooms',      label: 'Browse Rooms', icon: Home },
  { href: '/bookings',   label: 'My Bookings',  icon: Calendar },
  { href: '/profile',    label: 'My Profile',   icon: User },
];

const MANAGER_LINKS = [
  { href: '/manager/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manager/bookings',   label: 'Bookings',  icon: ClipboardList },
  { href: '/manager/rooms',      label: 'Rooms',     icon: Home },
  { href: '/manager/amenities',  label: 'Amenities', icon: Lightbulb },
  { href: '/manager/dormers',    label: 'Dormers',   icon: Users },
];

export default function Sidebar({ role = 'dormer', isCollapsed = false, onToggleCollapse }) {
  const pathname = usePathname();
  const router   = useRouter();
  const links    = role === 'manager' ? MANAGER_LINKS : DORMER_LINKS;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        {!isCollapsed && <div className={styles.logo}>
          xanelle<span className={styles.accent}>dorms</span>
        </div>}
        <button
          className={styles.toggleBtn}
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {links.map((l) => {
          const IconComponent = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.link} ${pathname === l.href ? styles.active : ''}`}
              title={isCollapsed ? l.label : ''}
            >
              <IconComponent size={20} className={styles.icon} />
              {!isCollapsed && <span className={styles.label}>{l.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button 
          onClick={handleLogout} 
          className={styles.logoutBtn}
          title={isCollapsed ? 'Log out' : ''}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}
