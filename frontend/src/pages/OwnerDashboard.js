import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { ownerAPI } from '../api';
import { Spinner, StarRating, EmptyState } from '../components/UI';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ownerAPI.getDashboard()
      .then(res => setData(res.data.store))
      .catch(err => setError(err.response?.data?.message || 'Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="My Store"><Spinner /></Layout>;

  if (error) return (
    <Layout title="My Store">
      <div className="alert alert-error">{error}</div>
    </Layout>
  );

  const ratings = data?.ratings || [];

  return (
    <Layout title="My Store">
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 500, marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon amber">⭐</div>
          <div className="stat-label">Average Rating</div>
          <div className="stat-value">{data.averageRating ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📝</div>
          <div className="stat-label">Total Reviews</div>
          <div className="stat-value">{data.totalRatings}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h2>{data.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{data.address}</p>
          </div>
        </div>
        <div className="table-wrapper">
          {ratings.length === 0 ? (
            <EmptyState message="No ratings yet" detail="Ratings from customers will appear here" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.user?.name}</strong></td>
                    <td>{r.user?.email}</td>
                    <td><StarRating value={r.rating} readOnly /></td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
