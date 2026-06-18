import React, { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
import { storeAPI } from '../api';
import { Spinner, StarRating, RatingPill, EmptyState } from '../components/UI';
import toast from 'react-hot-toast';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sort, setSort] = useState({ sortBy: 'name', sortOrder: 'ASC' });
  const [pendingRating, setPendingRating] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const fetchStores = useCallback(() => {
    setLoading(true);
    storeAPI.getStores({ ...filters, ...sort })
      .then(res => setStores(res.data.stores))
      .finally(() => setLoading(false));
  }, [filters, sort]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRatingChange = (storeId, value) => {
    setPendingRating(prev => ({ ...prev, [storeId]: value }));
  };

  const handleSubmitRating = async (storeId) => {
    const rating = pendingRating[storeId];
    if (!rating) return;
    setSubmitting(storeId);
    try {
      await storeAPI.submitRating(storeId, { rating });
      toast.success('Rating submitted!');
      setPendingRating(prev => { const n = { ...prev }; delete n[storeId]; return n; });
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(null);
    }
  };

  const setFilter = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  const toggleSort = (field) => {
    setSort(s => ({
      sortBy: field,
      sortOrder: s.sortBy === field && s.sortOrder === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <Layout title="Browse Stores">
      <div style={{ marginBottom: 20 }}>
        <div className="filter-bar">
          <input
            placeholder="Search by name..."
            value={filters.name}
            onChange={setFilter('name')}
          />
          <input
            placeholder="Search by address..."
            value={filters.address}
            onChange={setFilter('address')}
          />
          <select value={sort.sortBy} onChange={e => setSort({ sortBy: e.target.value, sortOrder: 'ASC' })}>
            <option value="name">Sort: Name</option>
            <option value="address">Sort: Address</option>
          </select>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => toggleSort(sort.sortBy)}
          >
            {sort.sortOrder === 'ASC' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : stores.length === 0 ? (
        <EmptyState message="No stores found" detail="Try a different search" />
      ) : (
        <div className="stores-grid">
          {stores.map(store => {
            const pending = pendingRating[store.id];
            const hasRating = store.userRating != null;

            return (
              <div key={store.id} className="store-card">
                <div className="store-card-header">
                  <div>
                    <div className="store-name">{store.name}</div>
                    <div className="store-address">{store.address}</div>
                  </div>
                  <RatingPill value={store.averageRating} />
                </div>

                <div className="store-meta">
                  <div className="store-rating-row">
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {store.totalRatings} {store.totalRatings === 1 ? 'review' : 'reviews'}
                    </span>
                    {hasRating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Your rating:</span>
                        <StarRating value={store.userRating} readOnly />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StarRating
                      value={pending || store.userRating}
                      onChange={(v) => handleRatingChange(store.id, v)}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSubmitRating(store.id)}
                      disabled={!pending || submitting === store.id}
                    >
                      {submitting === store.id ? '...' : hasRating ? 'Update' : 'Rate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
