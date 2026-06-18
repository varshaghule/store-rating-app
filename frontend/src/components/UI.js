import React from 'react';

export const Spinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <span>Loading...</span>
  </div>
);

export const Badge = ({ role }) => (
  <span className={`badge badge-${role}`}>{role?.replace('_', ' ')}</span>
);

export const StarRating = ({ value, onChange, readOnly = false }) => {
  const [hovered, setHovered] = React.useState(0);
  const display = hovered || value || 0;

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`star ${n <= display ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readOnly && onChange && onChange(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          viewBox="0 0 20 20"
          fill={n <= display ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const RatingPill = ({ value }) => {
  if (!value) return <span style={{ color: 'var(--text-light)', fontSize: 12 }}>No ratings</span>;
  return (
    <span className="rating-pill">
      ⭐ {value}
    </span>
  );
};

export const SortHeader = ({ label, field, sortBy, sortOrder, onSort }) => (
  <th onClick={() => onSort(field)}>
    {label}
    {sortBy === field ? (
      <span className="sort-icon">{sortOrder === 'ASC' ? ' ↑' : ' ↓'}</span>
    ) : (
      <span className="sort-icon"> ↕</span>
    )}
  </th>
);

export const Modal = ({ title, onClose, onSubmit, children, submitLabel = 'Save', loading }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <h3>{title}</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-muted)' }}
        >×</button>
      </div>
      <div className="modal-body">{children}</div>
      {onSubmit && (
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
            {loading ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}
    </div>
  </div>
);

export const EmptyState = ({ message = 'No records found', detail }) => (
  <div className="empty-state">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <h3>{message}</h3>
    {detail && <p>{detail}</p>}
  </div>
);
