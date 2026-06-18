import React, { useState } from 'react';
import Layout from '../components/Layout';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const validatePassword = (pw) => {
  if (pw.length < 8 || pw.length > 16) return 'Password must be 8–16 characters';
  if (!/[A-Z]/.test(pw)) return 'Must contain at least one uppercase letter';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return 'Must contain at least one special character';
  return null;
};

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    const pwError = validatePassword(form.newPassword);
    if (pwError) errs.newPassword = pwError;
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.currentPassword) errs.currentPassword = 'Required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Update Password">
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-header"><h2>Change Password</h2></div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={set('currentPassword')}
                className={errors.currentPassword ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.currentPassword && <div className="field-error">{errors.currentPassword}</div>}
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={set('newPassword')}
                className={errors.newPassword ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.newPassword && <div className="field-error">{errors.newPassword}</div>}
              <div className="hint">8–16 characters, at least 1 uppercase letter and 1 special character</div>
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
