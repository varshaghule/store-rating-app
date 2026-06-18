import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60)
    errors.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email';
  if (form.address.length > 400)
    errors.address = 'Address must not exceed 400 characters';
  if (form.password.length < 8 || form.password.length > 16)
    errors.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(form.password))
    errors.password = 'Password needs at least one uppercase letter';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
    errors.password = 'Password needs at least one special character';
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  return errors;
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, address: form.address, password: form.password });
      toast.success('Account created!');
      navigate('/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <h1>⭐ RateStore</h1>
          <p>Create your account</p>
        </div>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name (20–60 characters)"
              value={form.name}
              onChange={set('name')}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
            <div className="hint">{form.name.length}/60 characters</div>
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              rows={2}
              placeholder="Your full address (max 400 characters)"
              value={form.address}
              onChange={set('address')}
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
              <div className="hint">8–16 chars, 1 uppercase, 1 special</div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
