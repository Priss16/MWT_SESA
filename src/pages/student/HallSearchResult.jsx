import { Link, useLocation, Navigate } from 'react-router-dom';
import StudentNav from '../../components/StudentNav';
import { useSettings } from '../../context/SettingsContext';

export default function HallSearchResult() {
  const { t } = useSettings();
  const location = useLocation();
  const state = location.state;

  if (!state || !state.seating || !state.exam) {
    return <Navigate to="/student/search-hall" replace />;
  }

  const { seating, exam } = state;

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✅</div>
          <div>
            <p className="muted text-sm" style={{ fontWeight: 600 }}>SEAT FOUND</p>
            <h2 style={{ fontSize: 22 }}>{seating.student_name}</h2>
            <p className="muted text-sm">{seating.register_number} · {exam.subject_name} ({exam.subject_code})</p>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div><p className="muted text-sm">HALL</p><h3>{seating.building} · {seating.hall_name}</h3></div>
              <div><p className="muted text-sm">SEAT NUMBER</p><h3>{seating.seat_number}</h3></div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div><p className="muted text-sm">DATE & TIME</p><strong>{new Date(exam.exam_date).toLocaleDateString()} · {exam.start_time}</strong></div>
              <div><p className="muted text-sm">REPORT BY</p><strong>{new Date(new Date(exam.exam_date + 'T' + exam.start_time).getTime() - 30*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></div>
            </div>
            <div className="grid-2">
              <div><p className="muted text-sm">STATUS</p><span className="badge badge-success">{t('published')}</span></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Next Steps</h3>
            <Link to="/student/hall-slip" state={{ seating, exam }}><button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }}>View Hall Slip</button></Link>
            <Link to="/student/search-hall"><button className="btn btn-secondary" style={{ width: '100%' }}>Search Another Exam</button></Link>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <p className="muted text-sm">Carry your college ID card along with the hall slip on exam day.</p>
            <p className="muted text-sm" style={{ marginTop: 8 }}>Arrive at least 30 minutes before the scheduled start time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
