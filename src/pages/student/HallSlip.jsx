import { useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import StudentNav from '../../components/StudentNav';
import { generateHallSlipPdf } from '../../utils/generateHallSlipPdf';

export default function HallSlip() {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.seating || !state.exam) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const { seating, exam } = state;

  const handleDownload = useCallback(() => {
    generateHallSlipPdf({
      studentName: seating.student_name,
      regNo: seating.register_number,
      department: seating.department_name,
      semester: exam.semester,
      subject: `${exam.subject_name} (${exam.subject_code})`,
      dateTime: `${new Date(exam.exam_date).toLocaleDateString()} · ${exam.start_time}`,
      hall: `${seating.building || ''} · ${seating.hall_name}`,
      seat: seating.seat_number,
    });
  }, [seating, exam]);

  return (
    <div>
      <StudentNav />
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="card" style={{ width: 600, borderTop: '8px solid var(--primary)' }}>
          <p className="muted text-sm" style={{ fontWeight: 600 }}>EXAMINATION HALL TICKET</p>
          <h2 style={{ margin: '8px 0 4px' }}>National Engineering College, Kovilpatti</h2>
          <p className="muted text-sm" style={{ marginBottom: 20 }}>Semester Examinations</p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 20 }} />

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div><p className="muted text-sm">STUDENT NAME</p><strong>{seating.student_name}</strong></div>
            <div><p className="muted text-sm">REGISTER NUMBER</p><strong>{seating.register_number}</strong></div>
          </div>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div><p className="muted text-sm">DEPARTMENT</p><strong>{seating.department_name}</strong></div>
            <div><p className="muted text-sm">SEMESTER</p><strong>{exam.semester}</strong></div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: 20 }} />

          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div><p className="muted text-sm">SUBJECT</p><strong>{exam.subject_name} ({exam.subject_code})</strong></div>
            <div><p className="muted text-sm">DATE & TIME</p><strong>{new Date(exam.exam_date).toLocaleDateString()} · {exam.start_time}</strong></div>
          </div>
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div><p className="muted text-sm">EXAMINATION HALL</p><strong>{seating.building} · {seating.hall_name}</strong></div>
            <div><p className="muted text-sm">SEAT NUMBER</p><strong>{seating.seat_number}</strong></div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', marginBottom: 20 }} />

          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ width: 110, height: 110, background: 'repeating-linear-gradient(45deg, #1F2937 0 4px, #fff 4px 8px)', border: '1px solid var(--border)', borderRadius: 8 }} />
            <div>
              <p className="muted text-sm" style={{ fontWeight: 600 }}>VERIFICATION</p>
              <p className="text-sm">Scan at the hall entrance to confirm identity and seat.</p>
              <p className="muted text-sm" style={{ marginTop: 8 }}>Slip ID: SESA-{exam.subject_code}-{seating.register_number}</p>
            </div>
          </div>

          <p className="muted text-sm" style={{ fontWeight: 600, marginBottom: 6 }}>INSTRUCTIONS</p>
          <p className="muted text-sm">1. Carry this hall ticket and your college ID card at all times.</p>
          <p className="muted text-sm">2. Report to the hall 30 minutes before the scheduled time.</p>
          <p className="muted text-sm">3. Electronic devices are not permitted inside the hall.</p>
        </div>

        <button className="btn btn-primary" style={{ width: 600, marginTop: 20, padding: 14 }} onClick={handleDownload}>Download Hall Slip (PDF)</button>
      </div>
    </div>
  );
}
