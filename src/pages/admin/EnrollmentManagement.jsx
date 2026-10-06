import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EnrollmentManagement() {
  const { t } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  
  const [examData, setExamData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const token = window.localStorage.getItem('sesa_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadExams();
  }, [token, navigate]);

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/exams', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      if (data.success) {
        setExams(data.data);
      }
    } catch (err) {
      setErrorMessage('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = useCallback(async (examId) => {
    if (!examId) {
      setExamData(null);
      setStudents([]);
      return;
    }
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      const res = await fetch(`http://localhost:5000/api/exam-enrollments?exam_id=${examId}`, {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load enrollments');
      
      if (data.success) {
        setExamData(data.exam);
        setStudents(data.data);
        setSelectedStudents(new Set());
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadEnrollments(selectedExamId);
  }, [selectedExamId, loadEnrollments]);

  const handleCheckboxChange = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkEnroll = async () => {
    if (selectedStudents.size === 0) return;
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await fetch('http://localhost:5000/api/exam-enrollments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({
          exam_id: selectedExamId,
          student_ids: Array.from(selectedStudents)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bulk enroll failed');
      setSuccessMessage(`Successfully enrolled ${data.data.enrolled} students.`);
      loadEnrollments(selectedExamId);
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  const handleRemoveEnrollment = async (studentId) => {
    if (!window.confirm('Are you sure you want to remove this enrollment?')) return;
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await fetch(`http://localhost:5000/api/exam-enrollments?exam_id=${selectedExamId}&student_id=${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Remove failed');
      setSuccessMessage('Enrollment removed successfully.');
      loadEnrollments(selectedExamId);
    } catch (err) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(s => 
      s.register_number.toLowerCase().includes(term) || 
      s.student_name.toLowerCase().includes(term)
    );
  }, [students, search]);

  const enrolledCount = students.filter(s => s.is_enrolled).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('enrollmentManagement') || "Enrollment Management"} subtitle="Admin / Enrollments" />

        <div className="page-body">
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>Select Exam</h3>
            <select className="input" value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)}>
              <option value="">-- Select Exam --</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.subject_name} ({e.subject_code}) - {formatDate(e.exam_date)}</option>
              ))}
            </select>
          </div>

          {examData && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 40 }}>
                <div>
                  <p className="muted text-sm">Subject</p>
                  <h4>{examData.subject_name}</h4>
                </div>
                <div>
                  <p className="muted text-sm">Department</p>
                  <h4>{examData.department_name}</h4>
                </div>
                <div>
                  <p className="muted text-sm">Exam Date</p>
                  <h4>{formatDate(examData.exam_date)}</h4>
                </div>
                <div>
                  <p className="muted text-sm">Status</p>
                  <h4>{examData.status}</h4>
                </div>
              </div>
            </div>
          )}

          {errorMessage && <p className="field-error" style={{ marginBottom: 16 }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'var(--success)', marginBottom: 16 }}>{successMessage}</p>}

          {examData && (
            <div className="card">
              <div className="page-title-row">
                <input 
                  className="input" 
                  placeholder={t('searchStudents') || "Search Register No or Name..."} 
                  style={{ maxWidth: 300 }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <span className="muted text-sm">Eligible: {students.length} | Enrolled: {enrolledCount}</span>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleBulkEnroll} 
                    disabled={selectedStudents.size === 0 || loading || examData.status === 'cancelled'}
                  >
                    Enroll Selected ({selectedStudents.size})
                  </button>
                </div>
              </div>

              {loading ? (
                <p style={{ padding: 20 }}>Loading students...</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Register No</th>
                      <th>Name</th>
                      <th>Dept</th>
                      <th>Year/Sem</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.student_id}>
                        <td>
                          {!student.is_enrolled && (
                            <input 
                              type="checkbox"
                              checked={selectedStudents.has(student.student_id)}
                              onChange={() => handleCheckboxChange(student.student_id)}
                            />
                          )}
                        </td>
                        <td>{student.register_number}</td>
                        <td>{student.student_name}</td>
                        <td>{student.department_code}</td>
                        <td>{student.year} / {student.semester}</td>
                        <td>
                          {student.is_enrolled ? (
                            <span className="badge badge-success">Enrolled</span>
                          ) : (
                            <span className="badge badge-muted">Not Enrolled</span>
                          )}
                        </td>
                        <td>
                          {student.is_enrolled && (
                            <button 
                              className="btn btn-ghost" 
                              style={{ color: 'var(--error)' }}
                              onClick={() => handleRemoveEnrollment(student.student_id)}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 20 }}>No students found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
