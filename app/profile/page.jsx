'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const mockUser = { fullName: 'Juan dela Cruz', email: 'juan@example.com', userId: 1 };
  const [user, setUser]   = useState(mockUser);
  const [form, setForm]   = useState({ phone: '0917-123-4567', program: 'BS Computer Science', yearLevel: '2nd Year' });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const token  = localStorage.getItem('token');
  //   const stored = localStorage.getItem('user');
  //   if (!token || !stored) { router.push('/login'); return; }
  //   const u = JSON.parse(stored);
  //   setUser(u);
  //   fetch(`/api/dormers/${u.userId}`)
  //     .then(r => r.json())
  //     .then(d => setForm({ phone: d.phone || '', program: d.program || '', yearLevel: d.year_level || '' }));
  // }, []);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    const res = await fetch(`/api/dormers/${user.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) { setMsg('Profile updated successfully!'); setTimeout(() => setMsg(''), 3000); }
    else setError('Failed to update profile.');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    await fetch(`/api/dormers/${user.userId}`, { method: 'DELETE' });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <DashLayout role="dormer">
      <div className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Account</p>
          <h1 className={styles.title}>My profile</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.avatar}>
            <div className={styles.avatarCircle}>{user.fullName.charAt(0)}</div>
            <div>
              <div className={styles.name}>{user.fullName}</div>
              <div className={styles.email}>{user.email}</div>
            </div>
          </div>

          {msg   && <div className={styles.success}>{msg}</div>}
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.group}>
              <label className={styles.label}>Phone number</label>
              <input className={styles.input} name="phone" value={form.phone} onChange={handle} placeholder="09XX-XXX-XXXX" />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Program</label>
              <input className={styles.input} name="program" value={form.program} onChange={handle} placeholder="e.g. BS Computer Science" />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Year level</label>
              <select className={styles.input} name="yearLevel" value={form.yearLevel} onChange={handle}>
                <option value="">Select year level</option>
                {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.btnSave} disabled={loading}>
                {loading ? 'Saving…' : 'Save changes'}
              </button>
              <button type="button" className={styles.btnDelete} onClick={handleDelete}>
                Delete account
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashLayout>
  );
}
