import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNav from '../../components/StudentNav';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SearchHall() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await api.get('/exams/my');
        if (res.data.success) {
          setExams(res.data.data);
          if (res.data.data.length > 0) {
            setExamId(res.data.data[0].id.toString());
          }
        }
      } catch (err) {
        console.error("Error loading exams", err);
      }
    }
    loadExams();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.get(`/seating/my?exam_id=${examId}`);
      if (res.data.success && res.data.data.length > 0) {
        const seating = res.data.data[0];
        const exam = exams.find(ex => ex.id.toString() === examId);
        navigate('/student/search-hall/result', { state: { seating, exam } });
      } else {
        setError("No seating published yet for this exam.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error searching hall.");
    }
  }

  return (
    <div>
      <StudentNav />
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
        <p className="muted text-sm" style={{ fontWeight: 600 }}>FIND YOUR SEAT</p>
        <h1 style={{ fontSize: 28, margin: '12px 0' }}>Search Your Examination Hall</h1>
        <p className="muted" style={{ marginBottom: 32, textAlign: 'center' }}>
          Select an exam to find your hall and seat.
        </p>

        <form className="card" style={{ width: 480 }} onSubmit={handleSubmit}>
          <label className="field-label">Register Number</label>
          <input className="input" disabled value={user?.id || ''} style={{ marginBottom: 20 }} />

          <label className="field-label">Select Exam *</label>
          <select className="input" required value={examId} onChange={(e) => setExamId(e.target.value)} style={{ marginBottom: 24 }}>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.subject_name} ({ex.subject_code})</option>
            ))}
          </select>

          {error && <p className="field-error" style={{ marginBottom: 12 }}>{error}</p>}

          <button className="btn btn-primary" style={{ width: '100%', padding: 14 }}>Find My Hall</button>
        </form>

        <p className="muted text-sm" style={{ marginTop: 24 }}>
          Can't find your register number? Contact the Examination Cell at exams@nec.edu.in
        </p>
      </div>
    </div>
  );
}
