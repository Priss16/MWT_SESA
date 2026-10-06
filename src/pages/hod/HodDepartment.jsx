import React from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodDepartment() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  
  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('myDepartment')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Department Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 16 }}>
              <div><strong style={{ fontSize: 24 }}>12</strong><div className="muted">{t('subjects')}</div></div>
              <div><strong style={{ fontSize: 24 }}>240</strong><div className="muted">{t('students')}</div></div>
              <div><strong style={{ fontSize: 24 }}>25</strong><div className="muted">{t('staff')}</div></div>
              <div><strong style={{ fontSize: 24 }}>8</strong><div className="muted">{t('upcomingExams')}</div></div>
              <div><strong style={{ fontSize: 24 }}>4</strong><div className="muted">{t('halls')}</div></div>
              <div><strong style={{ fontSize: 24 }}>16</strong><div className="muted">Invigilation Duties</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
