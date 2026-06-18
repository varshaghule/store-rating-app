import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { adminAPI } from '../api';
import { Spinner, SortHeader, Modal, EmptyState, RatingPill } from '../components/UI';
import toast from 'react-hot-toast';

const validateStore = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) errors.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required';
  if (form.address.length > 400) errors.address = 'Max 400 characters';
  return errors;
};

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});

  const fetchStores = useCallback(() => {
    setLoading(true);
    adminAPI.getStores({ ...filters, ...sort })
      .then(res => setStores(res.data.stores))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    setSort(s => ({
      sortBy: field,
      sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleCreate = async () => {
    const errs = validateStore(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await adminAPI.createStore({ ...form, ownerId: form.ownerId || undefined });
      toast.success('Store created');
      setShowModal(false);
      setForm({ name: '', email: '', address: '', ownerId: '' });
      setFormErrors({});
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setFilter = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  return (
    <Layout title="Stores">
      <div className="card">
        <div className="card-header">
          <h2>All Stores</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Add Store
          </button>
        </div>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="filter-bar">
            <input placeholder="Filter by name..." value={filters.name} onChange={setFilter('name')} />
            <input placeholder="Filter by email..." value={filters.email} onChange={setFilter('email')} />
            <input placeholder="Filter by address..." value={filters.address} onChange={setFilter('address')} />
          </div>
        </div>
        {loading ? <Spinner /> : (
          <div className="table-wrapper">
            {stores.length === 0 ? <EmptyState message="No stores found" /> : (
              <table>
                <thead>
                  <tr>
                    <SortHeader label="Name" field="name" {...sort} onSort={handleSort} />
                    <SortHeader label="Email" field="email" {...sort} onSort={handleSort} />
                    <SortHeader label="Address" field="address" {...sort} onSort={handleSort} />
                    <th>Rating</th>
                    <th>Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.email}</td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                      <td><RatingPill value={s.averageRating} /></td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.totalRatings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add New Store" onClose={() => { setShowModal(false); setFormErrors({}); }} onSubmit={handleCreate} loading={saving}>
          <div className="form-group">
            <label>Store Name</label>
            <input type="text" value={form.name} onChange={set('name')} className={formErrors.name ? 'error' : ''} placeholder="20–60 characters" />
            {formErrors.name && <div className="field-error">{formErrors.name}</div>}
            <div className="hint">{form.name.length}/60</div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} className={formErrors.email ? 'error' : ''} />
            {formErrors.email && <div className="field-error">{formErrors.email}</div>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea rows={2} value={form.address} onChange={set('address')} className={formErrors.address ? 'error' : ''} placeholder="Max 400 characters" />
            {formErrors.address && <div className="field-error">{formErrors.address}</div>}
          </div>
          <div className="form-group">
            <label>Owner ID <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(optional, must be a store_owner user)</span></label>
            <input type="number" value={form.ownerId} onChange={set('ownerId')} placeholder="User ID" />
          </div>
        </Modal>
      )}
    </Layout>
  );
}
