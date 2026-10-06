import { useParams } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';

export default function StaffDetails() {
  const { t } = useSettings();
  const { id } = useParams();
  const { staff: allStaff } = useData();
  const staff = allStaff.find((s) => String(s.id) === id) || allStaff[0];
  const initials = staff.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('staffDetails')} subtitle={`${t('staff')} / ${staff.name}`} />
        <div className="page-body">
          <div className="card" style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>{initials}</div>
            <div>
              <h2 style={{ fontSize: 20 }}>{staff.name}</h2>
              <p className="muted text-sm">{staff.staffId} · {staff.dept} · {staff.designation}</p>
              <span className="badge badge-success">{staff.status}</span>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Invigilation Duties</h3>
            <table>
              <thead><tr><th>{t('subject')}</th><th>{t('date')}</th><th>{t('hall')}</th><th>Role</th><th>{t('status')}</th></tr></thead>
              <tbody>
                <tr><td>Data Structures (CS301)</td><td>25 Jul 2026</td><td>Hall 104</td><td>Invigilator</td><td><span className="badge badge-success">{t('published')}</span></td></tr>
                <tr><td>Digital Electronics (EC302)</td><td>27 Jul 2026</td><td>Hall 210</td><td>Invigilator</td><td><span className="badge badge-success">{t('published')}</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
