'use client';
import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import Modal from '@/components/Modal';
import styles from './mgr-amenities.module.css';

export default function ManagerAmenities() {
  const [amenities, setAmenities] = useState([]);
  const [rooms, setRooms]         = useState([]);
  const [modal, setModal]         = useState(null);
  const [name, setName]           = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId]       = useState(null);
  const [assign, setAssign]       = useState({ roomId: '', amenityId: '' });
  const [msg, setMsg]             = useState('');

  const loadAll = () => {
    fetch('/api/amenities').then(r => r.json()).then(setAmenities);
    fetch('/api/rooms').then(r => r.json()).then(setRooms);
  };

  useEffect(() => { loadAll(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/amenities', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, description }) });
    setModal(null); setName(''); setDescription(''); loadAll(); flash('Amenity added!');
  };

  const openEdit = (a) => { setEditId(a.amenity_id); setName(a.name); setDescription(a.description || ''); setModal('edit'); };

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/amenities/${editId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name, description }) });
    setModal(null); setName(''); setDescription(''); loadAll(); flash('Amenity updated!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this amenity?')) return;
    await fetch(`/api/amenities/${id}`, { method:'DELETE' });
    loadAll(); flash('Amenity deleted.');
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    await fetch('/api/room-amenity', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ roomId: parseInt(assign.roomId), amenityId: parseInt(assign.amenityId) }) });
    setAssign({ roomId:'', amenityId:'' }); loadAll(); flash('Amenity assigned to room!');
  };

  return (
    <DashLayout role="manager">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Manage</p>
            <h1 className={styles.title}>Amenities</h1>
          </div>
          <button className={styles.btnAdd} onClick={() => { setName(''); setDescription(''); setModal('add'); }}>+ Add amenity</button>
        </div>

        {msg && <div className={styles.success}>{msg}</div>}

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Amenity list</h2>
            <table className={styles.table}>
              <thead><tr><th>Name</th><th>Actions</th></tr></thead>
              <tbody>
                {amenities.map(a => (
                  <tr key={a.amenity_id}>
                    <td>{a.name}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => openEdit(a)}>Edit</button>
                        <button className={styles.btnDel} onClick={() => handleDelete(a.amenity_id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Assign amenity to room</h2>
            <form onSubmit={handleAssign} className={styles.form}>
              <div className={styles.group}>
                <label className={styles.label}>Select room</label>
                <select className={styles.input} value={assign.roomId} onChange={e => setAssign(p => ({ ...p, roomId: e.target.value }))} required>
                  <option value="">Choose a room…</option>
                  {rooms.map(r => <option key={r.room_id} value={r.room_id}>Room {r.room_number} ({r.type})</option>)}
                </select>
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Select amenity</label>
                <select className={styles.input} value={assign.amenityId} onChange={e => setAssign(p => ({ ...p, amenityId: e.target.value }))} required>
                  <option value="">Choose an amenity…</option>
                  {amenities.map(a => <option key={a.amenity_id} value={a.amenity_id}>{a.name}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.btnSubmit}>Assign →</button>
            </form>

            {assign.roomId && (
              <div className={styles.roomAmenities}>
                <p className={styles.label}>Current amenities for Room {rooms.find(r => r.room_id === parseInt(assign.roomId))?.room_number}</p>
                <div className={styles.pills}>
                  {(rooms.find(r => r.room_id === parseInt(assign.roomId))?.amenities || []).map(a => (
                    <span key={a} className={styles.pill}>{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal === 'add' && (
        <Modal title="Add amenity" subtitle="Add a new amenity to the system" onClose={() => setModal(null)}>
          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.group}>
              <label className={styles.label}>Amenity name</label>
              <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Study Desk, Refrigerator…" required />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.input} value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows={3} />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSubmit}>Add amenity</button>
              <button type="button" className={styles.btnCancel} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit amenity" onClose={() => setModal(null)}>
          <form onSubmit={handleEdit} className={styles.form}>
            <div className={styles.group}>
              <label className={styles.label}>Amenity name</label>
              <input className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.input} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
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
