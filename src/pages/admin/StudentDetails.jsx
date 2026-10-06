import { useParams, Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { initialStudents } from '../../data/mockData';

export default function StudentDetails() {
  const { t } = useSettings();
  const { id } = useParams();
  const student = initialStudents.find((s) => String(s.id) === id) || initialStudents[0];
  const initials = student.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('studentDetails')} subtitle={`${t('students')} / ${student.name}`} />
        <div className="page-body">
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>{initials}</div>
              <div>
                <h2 style={{ fontSize: 20 }}>{student.name}</h2>
                <p className="muted text-sm">{student.regNo} · {student.dept} · Year {student.year}</p>
                <span className={'badge ' + (student.status === 'Active' ? 'badge-success' : 'badge-danger')}>{student.status}</span>
              </div>
            </div>
            <Link to={`/admin/students/${student.id}/edit`} className="btn btn-secondary" style={{ height: 40, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>{t('edit')}</Link>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Exam History</h3>
            <table>
              <thead><tr><th>{t('subject')}</th><th>{t('date')}</th><th>{t('hall')}</th><th>{t('seat')}</th><th>{t('status')}</th></tr></thead>
              <tbody>
                <tr><td>Data Structures (CS301)</td><td>25 Jul 2026</td><td>Hall 104</td><td>B7</td><td><span className="badge badge-success">{t('published')}</span></td></tr>
                <tr><td>Digital Electronics (EC302)</td><td>27 Jul 2026</td><td>Hall 210</td><td>D3</td><td><span className="badge badge-success">{t('published')}</span></td></tr>
                <tr><td>Thermodynamics (ME303)</td><td>29 Jul 2026</td><td>Hall 108</td><td>A2</td><td><span className="badge badge-success">{t('published')}</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
