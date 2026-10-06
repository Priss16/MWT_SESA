import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalHalls() {
  const { t } = useSettings();
  const [search, setSearch] = useState('');
  
  const halls = [
    { id: 1, name: 'Lecture Hall 1', number: 'LH-1', building: 'Main Block', floor: '1st', capacity: 60, rowsCols: '6x10', dept: 'Shared', status: 'Available' },
    { id: 2, name: 'Seminar Hall', number: 'SH-1', building: 'CSE Block', floor: 'Ground', capacity: 100, rowsCols: '10x10', dept: 'CSE', status: 'Assigned', exam: 'CS101' },
    { id: 3, name: 'Drawing Hall', number: 'DH-1', building: 'Mech Block', floor: '2nd', capacity: 80, rowsCols: '8x10', dept: 'MECH', status: 'Available' },
  ];

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('halls')} subtitle="Institutional Hall Overview" />
        <div className="page-body">
          <div className="card" style={{ marginBottom: 16 }}>
            <input className="input" placeholder="Search halls" value={search} onChange={e => setSearch(e.target.value)} style={{width: 300}} />
          </div>
          <div className="feature-grid">
            {halls.map(h => (
              <div className="card" key={h.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{h.name}</h3>
                    <div className="muted text-sm">{h.number} • {h.dept}</div>
                  </div>
                  <span className={`badge ${h.status === 'Available' ? 'badge-success' : 'badge-primary'}`}>{h.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, marginBottom: 16 }}>
                  <div><span className="muted">Building:</span> {h.building}</div>
                  <div><span className="muted">Floor:</span> {h.floor}</div>
                  <div><span className="muted">Capacity:</span> {h.capacity}</div>
                  <div><span className="muted">Matrix:</span> {h.rowsCols}</div>
                </div>
                {h.exam && <div style={{ fontSize: 13, padding: 8, background: 'var(--bg-muted, #f1f5f9)', borderRadius: 4 }}>Assigned Exam: <strong>{h.exam}</strong></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
