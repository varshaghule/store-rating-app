import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { adminAPI } from '../api';
import { Spinner } from '../components/UI';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Dashboard">
      {loading ? <Spinner /> : (
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            Platform overview — all time statistics
          </p>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.660.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="stat-label">Total Users</div>
              <div className="stat-value">{stats?.totalUsers ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon amber">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="stat-label">Total Stores</div>
              <div className="stat-value">{stats?.totalStores ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="stat-label">Total Ratings</div>
              <div className="stat-value">{stats?.totalRatings ?? 0}</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ color: 'var(--text-muted)', fontSize: 13.5 }}>
              <strong style={{ color: 'var(--text)' }}>Quick Actions</strong>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <a href="/admin/users" className="btn btn-outline">Manage Users</a>
                <a href="/admin/stores" className="btn btn-outline">Manage Stores</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
