import { useState, useEffect } from 'react';
import StudentNav from '../../components/StudentNav';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function StudentNotifications() {
  const { t } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error("Error loading notifications", error);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  async function markAllAsRead() {
    try {
      const res = await api.post('/notifications/all/read');
      if (res.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      }
    } catch (error) {
      console.error("Error marking as read", error);
    }
  }

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <div className="page-title-row">
          <h2 style={{ fontSize: 26 }}>{t('notifications')}</h2>
          <button className="btn btn-ghost" onClick={markAllAsRead}>{t('markAllAsRead')}</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="card"><p className="muted text-sm">No notifications yet.</p></div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="card" style={{ marginBottom: 12, borderColor: n.is_read ? 'var(--border)' : 'var(--secondary)', opacity: n.is_read ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 15 }}>{n.title}</strong>
              </div>
              <p className="muted text-sm" style={{ margin: '8px 0' }}>{n.message}</p>
              <span className="muted text-sm">{new Date(n.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
