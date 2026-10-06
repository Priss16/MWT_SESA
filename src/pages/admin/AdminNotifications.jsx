import { useMemo, useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import api from '../../services/api';

export default function AdminNotifications() {
  const { t } = useSettings();
  const [dbNotifications, setDbNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setDbNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function markAllRead() {
    try {
      await api.post('/notifications/all/read');
      setDbNotifications(dbNotifications.map(n => ({ ...n, is_read: 1 })));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('notifications')} subtitle={t('notifications')} />
        <div className="page-body">
          <div className="page-title-row">
            <span className="text-sm muted">{dbNotifications.filter((n) => !n.is_read).length} unread</span>
            <button className="btn btn-ghost" onClick={markAllRead}>{t('markAllAsRead')}</button>
          </div>
          {dbNotifications.map((n) => (
            <div
              key={n.id}
              className="card"
              style={{ marginBottom: 12, borderColor: !n.is_read ? 'var(--secondary)' : 'var(--border)', opacity: !n.is_read ? 1 : 0.7 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 15 }}>{n.title}</strong>
              </div>
              <p className="muted text-sm" style={{ margin: '8px 0' }}>{n.message}</p>
              <span className="muted text-sm">{new Date(n.created_at).toLocaleString()}</span>
            </div>
          ))}
          {dbNotifications.length === 0 && <div className="card"><p className="muted text-sm">No notifications yet.</p></div>}
        </div>
      </div>
    </div>
  );
}
