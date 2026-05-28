'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import styles from './mgr-rooms.module.css';

const EMPTY = { roomNumber:'', type:'Single', floor:'1', capacity:'1', price:'', status:'available' };

export default function ManagerRooms() {
  const [rooms, setRooms]       = useState([]);
  const [modal, setModal]       = useState(null); // 'add' | 'edit'
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');

  const load = () => fetch('/api/rooms').then(r => r.json()).then(data => setRooms(Array.isArray(data) ? data : []));

  useEffect(() => { load(); }, []);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const flash = (m, isErr=false) => {
    isErr ? setError(m) : setMsg(m);
    setTimeout(() => isErr ? setError('') : setMsg(''), 3000);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomNumber:form.roomNumber, type:form.type, floor:parseInt(form.floor), capacity:parseInt(form.capacity), price:parseFloat(form.price), status:form.status }),
    });
    if (!res.ok) { flash((await res.json()).message, true); return; }
    setModal(null); setForm(EMPTY); load(); flash('Room added!');
  };

  const openEdit = (room) => {
    setEditId(room.room_id);
    setForm({ roomNumber:room.room_number, type:room.type, floor:String(room.floor), capacity:String(room.capacity), price:String(room.price), status:room.status });
    setModal('edit');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/rooms/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price:parseFloat(form.price), capacity:parseInt(form.capacity), status:form.status }),
    });
    setModal(null); load(); flash('Room updated!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
    load(); flash('Room deleted.');
  };

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Manage</p>
            <h1 className={styles.title}>Rooms</h1>
          </div>
          <button className={styles.btnAdd} onClick={() => { setForm(EMPTY); setModal('add'); }}>+ Add room</button>
        </div>

        {msg   && <div className={styles.success}>{msg}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.card}>
          <table className={styles.table}>
            <thead><tr><th>Room</th><th>Type</th><th>Floor</th><th>Capacity</th><th>Price/mo</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.room_id}>
                  <td><strong>{r.room_number}</strong></td>
                  <td>{r.type}</td>
                  <td>Floor {r.floor}</td>
                  <td>{r.capacity}</td>
                  <td>₱{Number(r.price).toLocaleString()}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.btnEdit} onClick={() => openEdit(r)}>Edit</button>
                      <button className={styles.btnDel} onClick={() => handleDelete(r.room_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'add' && (
        <Modal title="Add new room" subtitle="Enter the room details below" onClose={() => setModal(null)}>
          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.group}><label className={styles.label}>Room number</label><input className={styles.input} name="roomNumber" value={form.roomNumber} onChange={handle} placeholder="e.g. 205" required /></div>
              <div className={styles.group}><label className={styles.label}>Floor</label><select className={styles.input} name="floor" value={form.floor} onChange={handle}><option value="1">Floor 1</option><option value="2">Floor 2</option></select></div>
            </div>
            <div className={styles.row}>
              <div className={styles.group}><label className={styles.label}>Type</label><select className={styles.input} name="type" value={form.type} onChange={handle}><option>Single</option><option>Double</option></select></div>
              <div className={styles.group}><label className={styles.label}>Capacity</label><input className={styles.input} type="number" name="capacity" min="1" value={form.capacity} onChange={handle} required /></div>
            </div>
            <div className={styles.group}><label className={styles.label}>Price per month (₱)</label><input className={styles.input} type="number" name="price" value={form.price} onChange={handle} placeholder="4500" required /></div>
            <div className={styles.group}><label className={styles.label}>Status</label><select className={styles.input} name="status" value={form.status} onChange={handle}><option value="available">Available</option><option value="occupied">Occupied</option><option value="under maintenance">Under Maintenance</option></select></div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSubmit}>Add room</button>
              <button type="button" className={styles.btnCancel} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit room" subtitle="Update room details below" onClose={() => setModal(null)}>
          <form onSubmit={handleEdit} className={styles.form}>
            <div className={styles.group}><label className={styles.label}>Price per month (₱)</label><input className={styles.input} type="number" name="price" value={form.price} onChange={handle} required /></div>
            <div className={styles.group}><label className={styles.label}>Capacity</label><input className={styles.input} type="number" name="capacity" min="1" value={form.capacity} onChange={handle} required /></div>
            <div className={styles.group}><label className={styles.label}>Status</label><select className={styles.input} name="status" value={form.status} onChange={handle}><option value="available">Available</option><option value="occupied">Occupied</option><option value="under maintenance">Under Maintenance</option></select></div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSubmit}>Save changes</button>
              <button type="button" className={styles.btnCancel} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </DashLayout>
  );
}
