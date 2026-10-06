import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar, { HOD_LINK_KEYS } from '../../components/Sidebar';
import { getDemoInvigilation } from '../../utils/demoStore';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function HodInvigilation() {
  const { t } = useSettings();
  const { user } = useAuth();
  const dept = user?.dept || 'Unknown';
  const [data, setData] = useState([]);
  
  useEffect(() => {
    setData(getDemoInvigilation().filter(d => d.department === dept));
  }, [dept]);

  return (
    <div className="app-shell">
      <Sidebar links={HOD_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('invigilation')} subtitle={`Department of ${dept}`} />
        <div className="page-body">
          <div className="card">
            <table>
              <thead>
                <tr><th>Exam</th><th>{t('subject')}</th><th>{t('date')}</th><th>{t('time')}</th><th>{t('hall')}</th><th>{t('staff')}</th><th>{t('status')}</th></tr>
              </thead>
              <tbody>
                {data.map(i => (
                  <tr key={i.id}>
                    <td>{i.exam}</td><td>{i.subject}</td><td>{i.date}</td><td>{i.time}</td><td>{i.hall}</td><td>{i.staffName}</td>
                    <td><span className="badge badge-primary">{i.status}</span></td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="7" className="muted" style={{textAlign: 'center', padding: 20}}>No assignments.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
