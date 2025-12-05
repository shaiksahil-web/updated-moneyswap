import React, { useState, useEffect } from 'react';
import api from '../api';
import './RequestsPage.css';

const RequestsPage = ({ user }) => {
  const [mode, setMode] = useState('create'); // 'create' | 'list'
  const [type, setType] = useState('NEED_CASH');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (mode === 'list') {
      handleLoadRequests();
    }
  }, [mode, type]);

  const handleCreate = async () => {
    try {
      setLoading(true);
      setStatus('');
      setError('');
      await api.post('/api/requests', {
        userId: user.userId,
        type,
        amount: Number(amount),
        location
      });
      setStatus('Request created successfully!');
      setAmount('');
      setLocation('');
      setTimeout(() => setStatus(''), 3000);
    } catch {
      setError('Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRequests = async () => {
    try {
      setLoading(true);
      setStatus('');
      setError('');
      const res = await api.get('/api/requests', {
        params: { type }
      });
      setRequests(res.data.requests || []);
    } catch {
      setError('Failed to load requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (requestType) => {
    return requestType === 'NEED_CASH' ? '💵' : '🏦';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      OPEN: { class: 'status-open', label: 'Open' },
      MATCHED: { class: 'status-matched', label: 'Matched' },
      COMPLETED: { class: 'status-completed', label: 'Completed' },
      CANCELLED: { class: 'status-cancelled', label: 'Cancelled' }
    };
    return statusMap[status] || { class: 'status-open', label: status };
  };

  return (
    <div className="requests-container">
      <div className="requests-card">
        <div className="requests-header">
          <h2 className="requests-title">💸 Cash Requests</h2>
          <div className="mode-toggle">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`toggle-btn ${mode === 'create' ? 'active' : ''}`}
            >
              ➕ Create
            </button>
            <button
              type="button"
              onClick={() => setMode('list')}
              className={`toggle-btn ${mode === 'list' ? 'active' : ''}`}
            >
              📋 Browse
            </button>
          </div>
        </div>

        <div className="type-selector">
          <label htmlFor="type">Request Type</label>
          <div className="type-buttons">
            <button
              type="button"
              onClick={() => setType('NEED_CASH')}
              className={`type-btn ${type === 'NEED_CASH' ? 'active need-cash' : ''}`}
            >
              <span className="type-icon">💵</span>
              <span className="type-label">Need Cash</span>
              <span className="type-desc">I have digital, need physical cash</span>
            </button>
            <button
              type="button"
              onClick={() => setType('HAVE_CASH')}
              className={`type-btn ${type === 'HAVE_CASH' ? 'active have-cash' : ''}`}
            >
              <span className="type-icon">🏦</span>
              <span className="type-label">Have Cash</span>
              <span className="type-desc">I have physical cash, need digital</span>
            </button>
          </div>
        </div>

        {mode === 'create' && (
          <div className="create-form">
            <div className="input-group">
              <label htmlFor="amount">Amount (₹)</label>
              <div className="amount-input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input-field amount-input"
                  min="0"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="location">Location</label>
              <div className="location-input-wrapper">
                <span className="location-icon">📍</span>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Connaught Place, Delhi"
                  className="input-field location-input"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading || !amount || !location}
              className="btn btn-primary btn-large"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <span>✓</span> Create Request
                </>
              )}
            </button>
          </div>
        )}

        {mode === 'list' && (
          <div className="requests-list">
            {loading && (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Loading requests...</p>
              </div>
            )}

            {!loading && requests.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No Requests Found</h3>
                <p>There are no {type === 'NEED_CASH' ? 'need cash' : 'have cash'} requests at the moment.</p>
              </div>
            )}

            {!loading && requests.length > 0 && (
              <div className="requests-grid">
                {requests.map((r) => (
                  <div key={r.requestId} className="request-card">
                    <div className="request-header-row">
                      <div className="request-type-badge">
                        <span className="request-icon">{getTypeIcon(r.type)}</span>
                        <span>{r.type === 'NEED_CASH' ? 'Needs Cash' : 'Has Cash'}</span>
                      </div>
                      <span className={`status-badge ${getStatusBadge(r.status).class}`}>
                        {getStatusBadge(r.status).label}
                      </span>
                    </div>

                    <div className="request-amount">
                      ₹{r.amount.toLocaleString('en-IN')}
                    </div>

                    <div className="request-details">
                      <div className="detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{r.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">👤</span>
                        <span className="detail-text">User ID: {r.userId.substring(0, 8)}...</span>
                      </div>
                    </div>

                    {r.status === 'OPEN' && r.userId !== user.userId && (
                      <button className="btn btn-secondary btn-small">
                        💬 Contact
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {status && (
          <div className="success-message">
            <span className="success-icon">✓</span> {status}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;
