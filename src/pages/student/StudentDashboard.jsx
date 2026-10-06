import { useCallback, useState, useEffect } from 'react';
import StudentNav from '../../components/StudentNav';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { generateHallSlipPdf } from '../../utils/generateHallSlipPdf';
import api from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useSettings();

  const [exams, setExams] = useState([]);
  const [seating, setSeating] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [examsRes, seatingRes] = await Promise.all([
          api.get('/exams/my'),
          api.get('/seating/my')
        ]);
        if (examsRes.data.success) {
          setExams(examsRes.data.data);
        }
        if (seatingRes.data.success) {
          setSeating(seatingRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const nextExam = exams.length > 0 ? exams[0] : null;
  const nextSeating = nextExam ? seating.find(s => s.exam_id === nextExam.id) : null;
  
  const handleDownload = useCallback(() => {
    if (!nextSeating) return;
    
    generateHallSlipPdf({
      studentName: nextSeating.student_name,
      regNo: nextSeating.register_number,
      department: nextSeating.department_name,
      semester: nextExam.semester,
      subject: `${nextExam.subject_name} (${nextExam.subject_code})`,
      dateTime: `${new Date(nextExam.exam_date).toLocaleDateString()} · ${nextExam.start_time}`,
      hall: `${nextSeating.building || ''} · ${nextSeating.hall_name}`,
      seat: nextSeating.seat_number,
    });
  }, [nextSeating, nextExam]);

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <p className="muted">{t('welcomeBack') || 'Welcome back,'}</p>
        <h2 style={{ fontSize: 26, marginBottom: 20 }}>{user?.name || t('student')}</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {nextExam && (
              <div className="card" style={{ borderColor: 'var(--secondary)', borderWidth: 1.5, marginBottom: 24 }}>
                <p className="muted text-sm" style={{ fontWeight: 600 }}>{t('yOURNEXTEXAM') || 'YOUR NEXT EXAM'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '8px 0' }}>{nextExam.subject_name} ({nextExam.subject_code})</h3>
                    <p className="muted text-sm">
                      {new Date(nextExam.exam_date).toLocaleDateString()} · {nextExam.start_time}
                      {nextSeating ? ` · ${nextSeating.building}, ${nextSeating.hall_name} · Seat ${nextSeating.seat_number}` : ''}
                    </p>
                    {nextSeating ? (
                      <span className="badge badge-success" style={{ marginTop: 8, display: 'inline-block' }}>{t('hallSlipReady') || 'Hall slip ready'}</span>
                    ) : (
                      <span className="badge badge-warning" style={{ marginTop: 8, display: 'inline-block' }}>Seating not generated</span>
                    )}
                  </div>
                  <button className="btn btn-primary" onClick={handleDownload} disabled={!nextSeating}>
                    {t('downloadSlip') || 'Download Slip'}
                  </button>
                </div>
              </div>
            )}

            <div className="stat-grid">
              <div className="card stat-card"><div className="stat-label">{t('upcomingExams') || 'Upcoming Exams'}</div><div className="stat-value">{exams.length}</div></div>
              <div className="card stat-card"><div className="stat-label">{t('hallSlipsReady') || 'Hall Slips Ready'}</div><div className="stat-value">{seating.length}</div></div>
              <div className="card stat-card"><div className="stat-label">{t('attendanceRate') || 'Attendance Rate'}</div><div className="stat-value">100%</div></div>
              <div className="card stat-card"><div className="stat-label">{t('unreadNotifications') || 'Unread Notifications'}</div><div className="stat-value">0</div></div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>{t('upcomingExams') || 'Upcoming Exams'}</h3>
              {exams.length === 0 ? (
                <p className="muted">No upcoming exams.</p>
              ) : (
                <table>
                  <thead><tr><th>{t('subject') || 'Subject'}</th><th>{t('dateTime') || 'Date & Time'}</th><th>{t('hallSeat') || 'Hall & Seat'}</th><th>{t('status') || 'Status'}</th></tr></thead>
                  <tbody>
                    {exams.map((e) => {
                      const s = seating.find(seat => seat.exam_id === e.id);
                      return (
                        <tr key={e.id}>
                          <td>{e.subject_name} ({e.subject_code})</td>
                          <td>{new Date(e.exam_date).toLocaleDateString()} {e.start_time}</td>
                          <td>{s ? `${s.hall_name} · Seat ${s.seat_number}` : t('seatingNotYetPublished') || 'Seating not yet published'}</td>
                          <td><span className={'badge ' + (e.status === 'published' ? 'badge-success' : 'badge-warning')}>{e.status === 'published' ? t('published') : t('draft')}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
