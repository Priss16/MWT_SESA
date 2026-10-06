import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import api from '../../services/api';

export default function AssignInvigilators() {
  const { t } = useSettings();
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [halls, setHalls] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // load exams and staff
  useEffect(() => {
    const init = async () => {
      try {
        const [examsRes, staffRes] = await Promise.all([
          api.get('/exams'),
          api.get('/staff')
        ]);
        
        const examsData = examsRes.data;
        const staffData = staffRes.data;

        if (examsData.success) {
          const normalizedExams = examsData.data.map(e => ({
            id: e.id,
            subject: e.subject_name || e.subject || e.name || 'Unknown',
            code: e.subject_code || e.code || 'UNK',
            date: e.exam_date || e.date
          }));
          setExams(normalizedExams);
        }
        if (staffData.success) {
          setStaffList(staffData.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  // load halls for selected exam
  const loadExamHalls = useCallback(async (examId) => {
    if (!examId) {
      setHalls([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/invigilations/exam/${examId}`);
      if (res.data.success) {
        setHalls(res.data.data);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError(err.message || 'Error loading halls');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExamChange = (e) => {
    const id = e.target.value;
    setSelectedExamId(id);
    loadExamHalls(id);
  };

  const handleAssign = async (hallId, slot, staffId) => {
    if (!staffId) return; // Ignore un-selection
    try {
      const res = await api.post('/invigilations/assign', {
        exam_id: Number(selectedExamId),
        hall_id: Number(hallId),
        staff_id: Number(staffId),
        assignment_slot: slot
      });
      if (!res.data.success) throw new Error(res.data.message || 'Failed to assign');
      
      // Reload halls to reflect new assignment
      loadExamHalls(selectedExamId);
    } catch (err) {
      alert(err.message || 'Error assigning');
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('assignInvigilators')} subtitle="Assign staff to halls" />
        <div className="page-body">
          <div className="page-title-row">
            <select className="input" style={{maxWidth: 400}} value={selectedExamId} onChange={handleExamChange}>
              <option value="">Select an Exam...</option>
              {exams.map(e => (
                <option key={e.id} value={e.id}>{e.subject} ({e.code})</option>
              ))}
            </select>
          </div>
          
          {error && <p className="field-error" style={{marginBottom: 16}}>{error}</p>}
          
          {selectedExamId && (
            <div className="card">
              {loading ? <p className="muted" style={{padding: 20}}>Loading...</p> : (
                <table>
                  <thead>
                    <tr>
                      <th>{t('hall')}</th>
                      <th>Invigilator 1</th>
                      <th>Invigilator 2</th>
                      <th>{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {halls.map(hall => {
                      const inv1 = hall.invigilators.find(i => i.slot === 1);
                      const inv2 = hall.invigilators.find(i => i.slot === 2);
                      return (
                        <tr key={hall.hall_id}>
                          <td>{hall.hall_number}</td>
                          <td>
                            {inv1 ? (
                              <span>{inv1.staff_name}</span>
                            ) : (
                              <select className="input" style={{ maxWidth: 220 }} onChange={e => handleAssign(hall.hall_id, 1, e.target.value)} defaultValue="">
                                <option value="">Select staff ▾</option>
                                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                            )}
                          </td>
                          <td>
                            {inv2 ? (
                              <span>{inv2.staff_name}</span>
                            ) : (
                              <select className="input" style={{ maxWidth: 220 }} onChange={e => handleAssign(hall.hall_id, 2, e.target.value)} defaultValue="">
                                <option value="">Select staff ▾</option>
                                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                            )}
                          </td>
                          <td>
                            <span className={'badge ' + (hall.complete ? 'badge-success' : 'badge-warning')}>
                              {hall.complete ? 'Complete' : 'Incomplete'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {halls.length === 0 && <tr><td colSpan="4" className="muted" style={{textAlign: 'center', padding: 20}}>No halls associated with this exam yet. Generate seating first.</td></tr>}
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
