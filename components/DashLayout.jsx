'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import styles from './DashLayout.module.css';

export default function DashLayout({ role, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.wrap}>
      <Sidebar role={role} isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
