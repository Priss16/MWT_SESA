import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar, { STAFF_LINK_KEYS, STAFF_BOTTOM_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function StaffNotifications() {
  const { t } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          // Mark all as read
          const unreadIds = (res.data.notifications || []).filter(n => !n.is_read).map(n => n.id);
          if (unreadIds.length > 0) {
            await api.post('/notifications/all/read');
          }
        }
      } catch (err) {
        console.error('Error loading notifications', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotifications();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar links={STAFF_LINK_KEYS} bottomLinks={STAFF_BOTTOM_LINK_KEYS} />
      <div className="main-content">
        <Header title={t('notifications')} subtitle="Alerts & Updates" />
        <div className="page-body">
          <div className="card">
            {loading ? (
              <p className="muted" style={{ padding: 16 }}>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="muted" style={{ padding: 16 }}>No new notifications.</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: n.is_read ? 'transparent' : 'var(--bg-muted, #f8fafc)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: n.is_read ? 400 : 600 }}>{n.message}</span>
                    <span className="muted text-sm">{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

