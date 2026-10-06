import Sidebar from '../../components/Sidebar';
import { useSettings } from '../../context/SettingsContext';
import Header from '../../components/Header';
import { halls } from '../../data/mockData';

export default function HallReport() {
  const { t } = useSettings();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('hallReport')} subtitle={`${t('reports')} / ${t('hallReport')}`} />
        <div className="page-body">
          <div className="page-title-row">
            <input className="input" style={{ maxWidth: 320 }} placeholder="Search by hall name" />
            <button className="btn btn-secondary">Export ▾</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>{t('hall')}</th><th>Block</th><th>Exams Held</th><th>Avg. Utilization</th><th>Last Used</th></tr></thead>
              <tbody>
                {halls.map((h, i) => (
                  <tr key={h.name}>
                    <td>{h.name}</td>
                    <td>{h.block}</td>
                    <td>{6 - i}</td>
                    <td>{92 - i * 4}%</td>
                    <td>25 Jul 2026</td>
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
