import Sidebar from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import Header from '../../components/Header';
import { departments } from '../../data/mockData';

export default function StudentReport() {
  const { t } = useSettings();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('studentReport')} subtitle={`${t('reports')} / ${t('studentReport')}`} />
        <div className="page-body">
          <div className="page-title-row">
            <input className="input" style={{ maxWidth: 320 }} placeholder="Search by department" />
            <button className="btn btn-secondary">Export ▾</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>{t('department')}</th><th>{t('students')}</th><th>Exams Appeared</th><th>Attendance Rate</th></tr></thead>
              <tbody>
                {departments.map((d, i) => (
                  <tr key={d.code}>
                    <td>{d.name}</td>
                    <td>{d.students.toLocaleString()}</td>
                    <td>{6 - i}</td>
                    <td>{(99 - i * 0.4).toFixed(1)}%</td>
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
