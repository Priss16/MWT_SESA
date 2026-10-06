import React from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodNotifications() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  const notifications = [
    { id: 1, title: 'Staff A submitted a substitution request.', time: '2 mins ago', read: false },
    { id: 2, title: `CS101 invigilation assignment updated for ${dept}.`, time: '1 hour ago', read: false },
    { id: 3, title: 'Principal approved a substitution request.', time: '2 days ago', read: true },
  ];
  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('notifications')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="card">
            <div className="page-title-row" style={{marginBottom: 20}}>
              <h3>Recent Notifications</h3>
              <button className="btn btn-ghost" style={{fontSize: 13}}>{t('markAllAsRead')}</button>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: n.read ? 'transparent' : 'var(--bg-muted, #f8fafc)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</span>
                  <span className="muted text-sm">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
