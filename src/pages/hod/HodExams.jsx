import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodExams() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  const [search, setSearch] = useState('');

  const exams = [
    { id: 1, subject: 'Core Engineering', code: `${dept}101`, datetime: '20 Sep 2026, 09:30 AM', halls: 2, students: 120, status: 'Published' },
    { id: 2, subject: 'Advanced Applications', code: `${dept}201`, datetime: '22 Sep 2026, 14:00 PM', halls: 3, students: 150, status: 'Draft' },
  ];

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('exams')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="card" style={{ marginBottom: 16 }}>
            <input className="input" placeholder="Search subject or code" value={search} onChange={e => setSearch(e.target.value)} style={{width: 300}} />
          </div>
          <div className="card">
            <table>
              <thead>
                <tr><th>{t('subject')}</th><th>Code</th><th>{t('dateTime')}</th><th>{t('halls')}</th><th>{t('students')}</th><th>{t('status')}</th></tr>
              </thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id}>
                    <td>{e.subject}</td><td>{e.code}</td><td>{e.datetime}</td><td>{e.halls}</td><td>{e.students}</td>
                    <td><span className={`badge ${e.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
