'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashLayout from '@/components/DashLayout';
import styles from './profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]   = useState(null);
  const [form, setForm]   = useState({ phone: '', emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '' });
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetch(`/api/dormers/${u.userId}`)
      .then(r => r.json())
      .then(d => {
        const contact = d.emergency_contacts?.[0] || {};
        setForm({
          phone: d.phone || u.phone || '',
          emergencyContactName: contact.contact_name || '',
          emergencyContactPhone: contact.contact_phone || '',
          emergencyContactRelationship: contact.relationship || '',
        });
      });
  }, [router]);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');

    const userUpdate = fetch(`/api/dormers/${user.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone }),
    });

    const contactUpdate = fetch(`/api/emergency-contact/${user.userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactName: form.emergencyContactName,
        contactPhone: form.emergencyContactPhone,
        relationship: form.emergencyContactRelationship,
      }),
    });

    const [userRes, contactRes] = await Promise.all([userUpdate, contactUpdate]);
    const [userData, contactData] = await Promise.all([
      userRes.json().catch(() => ({})),
      contactRes.json().catch(() => ({})),
    ]);
    setLoading(false);

    if (userRes.ok && contactRes.ok) {
      setMsg('Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify({ ...user, phone: form.phone }));
      setTimeout(() => setMsg(''), 3000);
      return;
    }

    const errors = [];
    if (!userRes.ok) errors.push(userData.message || 'profile info');
    if (!contactRes.ok) errors.push(contactData.message || 'emergency contact');
    setError(`Failed to save: ${errors.join(' and ')}.`);
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
          {msg   && <div className={styles.success}>{msg}</div>}
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionTitle}>Dormer information</p>
                <p className={styles.sectionSubtitle}>Your account details and contact number.</p>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Full name</span>
                <span className={styles.detailValue}>{user.fullName}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{user.email}</span>
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Phone number</label>
                <input className={styles.input} name="phone" value={form.phone} onChange={handle} placeholder="09XX-XXX-XXXX" />
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <p className={styles.sectionTitle}>Emergency contact</p>
                <p className={styles.sectionSubtitle}>Keep a trusted contact on file for safety.</p>
              </div>

              <div className={styles.group}>
                <label className={styles.label}>Contact name</label>
                <input
                  className={styles.input}
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handle}
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Contact phone</label>
                <input
                  className={styles.input}
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handle}
                  placeholder="09XX-XXX-XXXX"
                />
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Relationship</label>
                <input
                  className={styles.input}
                  name="emergencyContactRelationship"
                  value={form.emergencyContactRelationship}
                  onChange={handle}
                  placeholder="e.g. Parent"
                />
              </div>
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
