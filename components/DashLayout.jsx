import Sidebar from './Sidebar';
import styles from './DashLayout.module.css';

export default function DashLayout({ role, children }) {
  return (
    <div className={styles.wrap}>
      <Sidebar role={role} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
