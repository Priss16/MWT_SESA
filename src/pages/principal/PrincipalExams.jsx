import React, { useState } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { DEMO_DEPARTMENTS } from '../../utils/demoStore';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalExams() {
  const { t } = useSettings();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const exams = [
    { id: 1, subject: 'Programming', code: 'CS101', dept: 'CSE', datetime: '20 Sep 2026, 09:30 AM', halls: 2, students: 120, status: 'Published', seating: 'Completed' },
    { id: 2, subject: 'Digital Logic', code: 'EC101', dept: 'ECE', datetime: '22 Sep 2026, 14:00 PM', halls: 3, students: 150, status: 'Draft', seating: 'Pending' },
    { id: 3, subject: 'Thermodynamics', code: 'ME201', dept: 'MECH', datetime: '24 Sep 2026, 09:30 AM', halls: 4, students: 200, status: 'Published', seating: 'Completed' }
  ];

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('exams')} subtitle={t('allDepartments')} />
        <div className="page-body">
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input className="input" placeholder="Search subject or code" value={search} onChange={e => setSearch(e.target.value)} style={{flex: 1, minWidth: 200}} />
              <select className="input" value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={{width: 150}}>
                <option value="">All Depts</option>
                {DEMO_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{width: 150}}>
                <option value="">All Statuses</option>
                <option value="Published">{t('published')}</option>
                <option value="Draft">{t('draft')}</option>
              </select>
            </div>
          </div>
          <div className="card">
            <table>
              <thead>
                <tr><th>{t('subject')}</th><th>Code</th><th>Dept</th><th>{t('dateTime')}</th><th>{t('halls')}</th><th>{t('students')}</th><th>{t('status')}</th><th>Seating Status</th></tr>
              </thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e.id}>
                    <td>{e.subject}</td><td>{e.code}</td><td>{e.dept}</td><td>{e.datetime}</td><td>{e.halls}</td><td>{e.students}</td>
                    <td><span className={`badge ${e.status === 'Published' ? 'badge-success' : 'badge-warning'}`}>{e.status}</span></td>
                    <td><span className={`badge ${e.seating === 'Completed' ? 'badge-success' : 'badge-muted'}`}>{e.seating}</span></td>
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
