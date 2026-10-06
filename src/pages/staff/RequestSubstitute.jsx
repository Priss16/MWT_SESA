import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

export default function RequestSubstitute() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const invigilationId = queryParams.get('invigilation_id');
  const examName = queryParams.get('exam');

  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load staff to pick a replacement
    const loadStaff = async () => {
      try {
        const res = await api.get('/staff');
        if (res.data.success) {
          setStaffList(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invigilationId) {
      setError('No invigilation selected');
      return;
    }
    if (!selectedStaff || !reason) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/invigilation-substitutions', {
        invigilation_id: Number(invigilationId),
        replacement_staff_id: Number(selectedStaff),
        reason
      });
      if (res.data.success) {
        navigate('/staff/substitution-requests');
      } else {
        setError(res.data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('requestSubstitute')} subtitle={examName || "New Request"} />
        <div className="page-body">
          <div className="card" style={{ maxWidth: 600 }}>
            {error && <p className="field-error" style={{marginBottom: 16}}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Replacement Staff</label>
                <select className="input" value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
                  <option value="">Select replacement...</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.staff_id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reason for substitution</label>
                <textarea 
                  className="input" 
                  rows="4" 
                  value={reason} 
                  onChange={e => setReason(e.target.value)}
                  placeholder="Explain why you need a substitute..."
                />
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
