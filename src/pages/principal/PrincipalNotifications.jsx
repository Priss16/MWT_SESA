import React from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalNotifications() {
  const { t } = useSettings();
  const notifications = [
    { id: 1, title: 'New HOD-approved substitution request from CSE.', time: '10 mins ago', read: false },
    { id: 2, title: 'Exam CS101 is scheduled tomorrow.', time: '2 hours ago', read: false },
    { id: 3, title: 'New examination assignment published for ECE.', time: '1 day ago', read: true },
  ];
  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('notifications')} subtitle="Alerts & Updates" />
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
