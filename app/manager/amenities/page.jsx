'use client';

import { useEffect, useState } from 'react';
import DashLayout from '@/components/DashLayout';
import Modal from '@/components/Modal';
import styles from './mgr-amenities.module.css';

export default function ManagerAmenities() {

  // ─── State ────────────────────────────────────────────────────────────────
  const [amenities,          setAmenities]          = useState([]);
  const [rooms,              setRooms]              = useState([]);
  const [modal,              setModal]              = useState(null);
  const [name,               setName]               = useState('');
  const [description,        setDescription]        = useState('');
  const [editId,             setEditId]             = useState(null);
  const [assign,             setAssign]             = useState({ roomId: '' });
  const [selectedAmenityIds, setSelectedAmenityIds] = useState([]);
  const [unassignIds,        setUnassignIds]        = useState([]);
  const [activeTab,          setActiveTab]          = useState('assign');
  const [msg,                setMsg]                = useState('');

  // ─── Data loading ─────────────────────────────────────────────────────────
  const loadAll = () => {
    fetch('/api/amenities').then(r => r.json()).then(setAmenities);
    fetch('/api/rooms').then(r => r.json()).then(setRooms);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 3000);
  };

  const currentRoom         = rooms.find(r => r.room_id === parseInt(assign.roomId));
  const currentAmenityNames = currentRoom?.amenities || [];

  // Map amenity name → amenity_id for unassign lookups
  const amenityByName = Object.fromEntries(amenities.map(a => [a.name, a.amenity_id]));

  // ─── Amenity CRUD ─────────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch('/api/amenities', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, description }),
    });
    setModal(null);
    setName('');
    setDescription('');
    loadAll();
    flash('Amenity added!');
  };

  const openEdit = (a) => {
    setEditId(a.amenity_id);
    setName(a.name);
    setDescription(a.description || '');
    setModal('edit');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`/api/amenities/${editId}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, description }),
    });
    setModal(null);
    setName('');
    setDescription('');
    loadAll();
    flash('Amenity updated!');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this amenity?')) return;
    await fetch(`/api/amenities/${id}`, { method: 'DELETE' });
    loadAll();
    flash('Amenity deleted.');
  };

  // ─── Assign ───────────────────────────────────────────────────────────────
  const toggleAmenity = (id) => {
    setSelectedAmenityIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assign.roomId || selectedAmenityIds.length === 0) return;

    await Promise.all(
      selectedAmenityIds.map(amenityId =>
        fetch('/api/room-amenity', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            roomId:    parseInt(assign.roomId),
            amenityId: parseInt(amenityId),
          }),
        })
      )
    );

    const count = selectedAmenityIds.length;
    setSelectedAmenityIds([]);
    loadAll();
    flash(`${count} amenit${count > 1 ? 'ies' : 'y'} assigned!`);
  };

  // ─── Unassign ─────────────────────────────────────────────────────────────
  const toggleUnassign = (id) => {
    setUnassignIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleUnassign = async (e) => {
    e.preventDefault();
    if (!assign.roomId || unassignIds.length === 0) return;

    await Promise.all(
      unassignIds.map(amenityId =>
        fetch('/api/room-amenity', {
          method:  'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            roomId:    parseInt(assign.roomId),
            amenityId: parseInt(amenityId),
          }),
        })
      )
    );

    const count = unassignIds.length;
    setUnassignIds([]);
    loadAll();
    flash(`${count} amenit${count > 1 ? 'ies' : 'y'} removed from room!`);
  };

  // ─── Room change ──────────────────────────────────────────────────────────
  const handleRoomChange = (e) => {
    setAssign({ roomId: e.target.value });
    setSelectedAmenityIds([]);
    setUnassignIds([]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <DashLayout role="manager">
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Manage</p>
            <h1 className={styles.title}>Amenities</h1>
          </div>
          <button
            className={styles.btnAdd}
            onClick={() => { setName(''); setDescription(''); setModal('add'); }}
          >
            + Add amenity
          </button>
        </div>

        {/* Flash message */}
        {msg && <div className={styles.success}>{msg}</div>}

        <div className={styles.grid}>

          {/* ── Amenity list ── */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Amenity list</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {amenities.map(a => (
                  <tr key={a.amenity_id}>
                    <td>{a.name}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.btnEdit} onClick={() => openEdit(a)}>
                          Edit
                        </button>
                        <button className={styles.btnDel} onClick={() => handleDelete(a.amenity_id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Assign / Unassign amenities ── */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Manage room amenities</h2>

            {/* Room selector */}
            <div className={styles.group} style={{ marginBottom: '1rem' }}>
              <label className={styles.label}>Select room</label>
              <select
                className={styles.input}
                value={assign.roomId}
                onChange={handleRoomChange}
                required
              >
                <option value="">Choose a room…</option>
                {rooms.map(r => (
                  <option key={r.room_id} value={r.room_id}>
                    Room {r.room_number} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                type="button"
                className={`${styles.tab} ${activeTab === 'assign' ? styles.tabActive : ''}`}
                onClick={() => { setActiveTab('assign'); setSelectedAmenityIds([]); }}
              >
                Assign
              </button>
              <button
                type="button"
                className={`${styles.tab} ${activeTab === 'unassign' ? styles.tabActive : ''}`}
                onClick={() => { setActiveTab('unassign'); setUnassignIds([]); }}
              >
                Unassign
              </button>
            </div>

            {/* ── Assign tab ── */}
            {activeTab === 'assign' && (
              <form onSubmit={handleAssign} className={styles.form}>
                <div className={styles.group}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Select amenities to add</label>
                    {selectedAmenityIds.length > 0 && (
                      <span className={styles.badge}>{selectedAmenityIds.length} selected</span>
                    )}
                  </div>

                  <div className={styles.checkList}>
                    {amenities.length === 0 && (
                      <p className={styles.emptyNote}>No amenities yet. Add some first.</p>
                    )}
                    {amenities.map(a => {
                      const checked         = selectedAmenityIds.includes(a.amenity_id);
                      const alreadyAssigned = currentAmenityNames.includes(a.name);
                      return (
                        <label
                          key={a.amenity_id}
                          className={[
                            styles.checkItem,
                            checked         ? styles.checkItemActive   : '',
                            alreadyAssigned ? styles.checkItemAssigned : '',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            className={styles.checkBox}
                            checked={checked}
                            disabled={alreadyAssigned}
                            onChange={() => toggleAmenity(a.amenity_id)}
                          />
                          <span className={styles.checkLabel}>{a.name}</span>
                          {alreadyAssigned && (
                            <span className={styles.assignedTag}>assigned</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={!assign.roomId || selectedAmenityIds.length === 0}
                >
                  Assign{selectedAmenityIds.length > 0 ? ` (${selectedAmenityIds.length})` : ''} →
                </button>
              </form>
            )}

            {/* ── Unassign tab ── */}
            {activeTab === 'unassign' && (
              <form onSubmit={handleUnassign} className={styles.form}>
                <div className={styles.group}>
                  <div className={styles.labelRow}>
                    <label className={styles.label}>Select amenities to remove</label>
                    {unassignIds.length > 0 && (
                      <span className={styles.badgeDanger}>{unassignIds.length} selected</span>
                    )}
                  </div>

                  <div className={styles.checkList}>
                    {!assign.roomId && (
                      <p className={styles.emptyNote}>Select a room first.</p>
                    )}
                    {assign.roomId && currentAmenityNames.length === 0 && (
                      <p className={styles.emptyNote}>This room has no amenities assigned.</p>
                    )}
                    {assign.roomId && currentAmenityNames.map(amenityName => {
                      const amenityId = amenityByName[amenityName];
                      const checked   = unassignIds.includes(amenityId);
                      return (
                        <label
                          key={amenityName}
                          className={[
                            styles.checkItem,
                            checked ? styles.checkItemDanger : '',
                          ].join(' ')}
                        >
                          <input
                            type="checkbox"
                            className={styles.checkBox}
                            checked={checked}
                            onChange={() => toggleUnassign(amenityId)}
                          />
                          <span className={styles.checkLabel}>{amenityName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.btnDanger}
                  disabled={!assign.roomId || unassignIds.length === 0}
                >
                  Remove{unassignIds.length > 0 ? ` (${unassignIds.length})` : ''} →
                </button>
              </form>
            )}

          </div>
        </div>
      </div>

      {/* ── Add modal ── */}
      {modal === 'add' && (
        <Modal
          title="Add amenity"
          subtitle="Add a new amenity to the system"
          onClose={() => setModal(null)}
        >
          <form onSubmit={handleAdd} className={styles.form}>
            <div className={styles.group}>
              <label className={styles.label}>Amenity name</label>
              <input
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Study Desk, Refrigerator…"
                required
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.btnSubmit}>Add amenity</button>
              <button type="button" className={styles.btnCancel} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit modal ── */}
      {modal === 'edit' && (
        <Modal title="Edit amenity" onClose={() => setModal(null)}>
          <form onSubmit={handleEdit} className={styles.form}>
            <div className={styles.group}>
              <label className={styles.label}>Amenity name</label>
              <input
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.input}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
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