import { useCallback, useState, useEffect } from 'react';
import StudentNav from '../../components/StudentNav';
import { generateHallSlipPdf } from '../../utils/generateHallSlipPdf';
import api from '../../services/api';

export default function DownloadHallSlip() {
  const [exams, setExams] = useState([]);
  const [seating, setSeating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyRequested, setNotifyRequested] = useState({});

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

  const handleDownload = useCallback((seat, exam) => {
    if (!seat || !exam) return;
    generateHallSlipPdf({
      studentName: seat.student_name,
      regNo: seat.register_number,
      department: seat.department_name,
      semester: exam.semester,
      subject: `${exam.subject_name} (${exam.subject_code})`,
      dateTime: `${new Date(exam.exam_date).toLocaleDateString()} · ${exam.start_time}`,
      hall: `${seat.building || ''} · ${seat.hall_name}`,
      seat: seat.seat_number,
    });
  }, []);

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <p className="muted text-sm" style={{ fontWeight: 600 }}>HALL SLIPS</p>
        <h2 style={{ fontSize: 26, margin: '8px 0 20px' }}>Download Hall Slips</h2>

        {loading ? (
          <p>Loading...</p>
        ) : exams.length === 0 ? (
          <p className="muted">No upcoming exams.</p>
        ) : (
          exams.map((exam) => {
            const seat = seating.find(s => s.exam_id === exam.id);
            const isReady = !!seat && exam.status === 'published';
            const statusLabel = isReady ? 'Ready' : 'Not available yet';

            return (
              <div key={exam.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderLeft: `6px solid ${isReady ? 'var(--primary)' : 'var(--warning)'}`, opacity: isReady ? 1 : 0.7 }}>
                <div>
                  <h3 style={{ fontSize: 16 }}>{exam.subject_name} ({exam.subject_code})</h3>
                  <p className="muted text-sm">
                    {new Date(exam.exam_date).toLocaleDateString()} · {exam.start_time}
                    {seat ? ` · ${seat.building || ''} ${seat.hall_name} · Seat ${seat.seat_number}` : ''}
                  </p>
                  <span className={'badge ' + (isReady ? 'badge-success' : 'badge-warning')} style={{ marginTop: 6, display: 'inline-block' }}>{statusLabel}</span>
                </div>
                {isReady ? (
                  <button className="btn btn-primary" onClick={() => handleDownload(seat, exam)}>Download PDF</button>
                ) : (
                  <button
                    className="btn btn-ghost"
                    disabled={!!notifyRequested[exam.id]}
                    onClick={() => setNotifyRequested((prev) => ({ ...prev, [exam.id]: true }))}
                  >
                    {notifyRequested[exam.id] ? "We'll notify you" : 'Notify Me'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
