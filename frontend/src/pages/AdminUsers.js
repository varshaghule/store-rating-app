import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { adminAPI } from '../api';
import { Spinner, Badge, SortHeader, Modal, EmptyState, RatingPill } from '../components/UI';
import toast from 'react-hot-toast';

const ROLES = ['user', 'admin', 'store_owner'];

const validateUser = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) errors.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email required';
  if (form.address.length > 400) errors.address = 'Max 400 characters';
  if (form.password.length < 8 || form.password.length > 16) errors.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Needs one uppercase letter';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errors.password = 'Needs one special character';
  return errors;
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [showModal, setShowModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formErrors, setFormErrors] = useState({});

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers({ ...filters, ...sort })
      .then(res => setUsers(res.data.users))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    setSort(s => ({
      sortBy: field,
      sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleCreate = async () => {
    const errs = validateUser(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true);
    try {
      await adminAPI.createUser(form);
      toast.success('User created');
      setShowModal(false);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const viewDetail = async (id) => {
    const res = await adminAPI.getUserById(id);
    setDetailUser(res.data.user);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setFilter = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  return (
    <Layout title="Users">
      <div className="card">
        <div className="card-header">
          <h2>All Users</h2>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Add User
          </button>
        </div>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="filter-bar">
            <input placeholder="Filter by name..." value={filters.name} onChange={setFilter('name')} />
            <input placeholder="Filter by email..." value={filters.email} onChange={setFilter('email')} />
            <input placeholder="Filter by address..." value={filters.address} onChange={setFilter('address')} />
            <select value={filters.role} onChange={setFilter('role')}>
              <option value="">All roles</option>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>
        {loading ? <Spinner /> : (
          <div className="table-wrapper">
            {users.length === 0 ? <EmptyState message="No users found" /> : (
              <table>
                <thead>
                  <tr>
                    <SortHeader label="Name" field="name" {...sort} onSort={handleSort} />
                    <SortHeader label="Email" field="email" {...sort} onSort={handleSort} />
                    <SortHeader label="Address" field="address" {...sort} onSort={handleSort} />
                    <SortHeader label="Role" field="role" {...sort} onSort={handleSort} />
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                      <td><Badge role={u.role} /></td>
                      <td>
                        <button className="btn btn-outline btn-sm" onClick={() => viewDetail(u.id)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add New User" onClose={() => { setShowModal(false); setFormErrors({}); }} onSubmit={handleCreate} loading={saving}>
          <div className="form-group">
            <label>Full Name</label>
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
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} className={formErrors.password ? 'error' : ''} placeholder="8–16 chars, 1 uppercase, 1 special" />
            {formErrors.password && <div className="field-error">{formErrors.password}</div>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea rows={2} value={form.address} onChange={set('address')} className={formErrors.address ? 'error' : ''} placeholder="Max 400 characters" />
            {formErrors.address && <div className="field-error">{formErrors.address}</div>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={form.role} onChange={set('role')}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {detailUser && (
        <Modal title="User Details" onClose={() => setDetailUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['Name', detailUser.name],
              ['Email', detailUser.email],
              ['Address', detailUser.address],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 14 }}>{value || '—'}</div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Role</div>
              <Badge role={detailUser.role} />
            </div>
            {detailUser.role === 'store_owner' && (
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>Store Rating</div>
                <RatingPill value={detailUser.storeAverageRating} />
              </div>
            )}
          </div>
        </Modal>
      )}
    </Layout>
  );
}
