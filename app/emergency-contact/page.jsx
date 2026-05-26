"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../register/register.module.css';

export default function EmergencyContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!u || !token) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(u);
    // Pre-fill phone if available
    setForm(f => ({ ...f, phone: user.phone || '' }));
  }, [router]);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      if (!u) throw new Error('User not found');

      const body = {
        phone: u.phone || form.phone || null,
        emergencyContactName: form.name || null,
        emergencyContactPhone: form.phone || null,
        emergencyContactRelationship: form.relationship || null,
      };

      const res = await fetch(`/api/dormers/${u.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setLoading(false);
      if (res.ok) {
        setMsg('Emergency contact saved. Redirecting…');
        // update stored user in case phone changed
        localStorage.setItem('user', JSON.stringify({ ...u, phone: body.phone }));
        setTimeout(() => router.push('/dashboard'), 1200);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.message || 'Failed to save emergency contact');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.heading}>Emergency Contact</h1>
        <p className={styles.subtext}>Please provide an emergency contact to complete your account.</p>

        {msg && <div className={styles.success}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Name</label>
            <input name="name" className={styles.input} value={form.name} onChange={handle} placeholder="Juan Dela Cruz" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Phone</label>
            <input name="phone" className={styles.input} value={form.phone} onChange={handle} placeholder="09XX-XXX-XXXX" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Relationship</label>
            <input name="relationship" className={styles.input} value={form.relationship} onChange={handle} placeholder="e.g. Parent" />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Saving…' : 'Save emergency contact'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
