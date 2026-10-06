import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Sidebar, { PRINCIPAL_LINK_KEYS } from '../../components/Sidebar';
import { getDemoInvigilation } from '../../utils/demoStore';
import { useSettings } from '../../context/SettingsContext';

export default function PrincipalInvigilation() {
  const { t } = useSettings();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    setData(getDemoInvigilation());
  }, []);

  return (
    <div className="app-shell">
      <Sidebar links={PRINCIPAL_LINK_KEYS} bottomLinks={[]} />
      <div className="main-content">
        <Header title={t('invigilation')} subtitle={t('allDepartments')} />
        <div className="page-body">
          <div className="card">
            <table>
              <thead>
                <tr><th>Exam</th><th>{t('subject')}</th><th>Dept</th><th>{t('date')}</th><th>{t('time')}</th><th>{t('hall')}</th><th>{t('staff')}</th><th>{t('status')}</th></tr>
              </thead>
              <tbody>
                {data.map(i => (
                  <tr key={i.id}>
                    <td>{i.exam}</td><td>{i.subject}</td><td>{i.department}</td><td>{i.date}</td><td>{i.time}</td><td>{i.hall}</td><td>{i.staffName}</td>
                    <td><span className="badge badge-primary">{i.status}</span></td>
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
