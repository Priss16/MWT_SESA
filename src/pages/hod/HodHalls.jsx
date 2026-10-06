import React from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodHalls() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  
  const halls = [
    { id: 1, name: `${dept} Seminar Hall`, building: `${dept} Block`, floor: 'Ground', capacity: 100, rowsCols: '10x10', status: 'Available' },
    { id: 2, name: `${dept} Lab A`, building: `${dept} Block`, floor: '1st', capacity: 40, rowsCols: '4x10', status: 'Available' },
  ];

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('halls')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="feature-grid">
            {halls.map(h => (
              <div className="card" key={h.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18 }}>{h.name}</h3>
                  <span className={`badge ${h.status === 'Available' ? 'badge-success' : 'badge-primary'}`}>{h.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                  <div><span className="muted">Building:</span> {h.building}</div>
                  <div><span className="muted">Floor:</span> {h.floor}</div>
                  <div><span className="muted">Capacity:</span> {h.capacity}</div>
                  <div><span className="muted">Matrix:</span> {h.rowsCols}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
