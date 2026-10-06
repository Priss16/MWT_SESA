import { useState, useEffect } from 'react';
import StudentNav from '../../components/StudentNav';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function ExamSchedule() {
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

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <p className="muted text-sm" style={{ fontWeight: 600 }}>SEMESTER V · 2025-2026</p>
        <h2 style={{ fontSize: 26, margin: '8px 0 24px' }}>Exam Schedule</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Semester V Timetable</h3>
            {exams.length === 0 ? (
              <p className="muted">No upcoming exams.</p>
            ) : (
              <table>
                <thead><tr><th>{t('subject')}</th><th>{t('dateTime')}</th><th>Hall & Seat</th><th>{t('status')}</th></tr></thead>
                <tbody>
                  {exams.map((e) => {
                    const s = seating.find(seat => seat.exam_id === e.id);
                    return (
                      <tr key={e.id}>
                        <td>{e.subject_name} ({e.subject_code})</td>
                        <td>{new Date(e.exam_date).toLocaleDateString()} {e.start_time}</td>
                        <td>{s ? `${s.hall_name} · Seat ${s.seat_number}` : 'Not yet published'}</td>
                        <td><span className={'badge ' + (e.status === 'published' ? 'badge-success' : 'badge-warning')}>{e.status === 'published' ? t('published') : t('draft')}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
