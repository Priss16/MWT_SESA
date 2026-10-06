import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function HallPlan() {
  const { t } = useSettings();
  
  const [departments, setDepartments] = useState([]);
  const [halls, setHalls] = useState([]);
  const [exams, setExams] = useState([]);
  const [staff, setStaff] = useState([]);
  
  const [selectedDeptId, setSelectedDeptId] = useState('');
  
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  
  const [allocForm, setAllocForm] = useState({
    exam1_id: '',
    exam2_id: '',
    year: '3',
    dept1_code: '',
    start_reg1: '',
    end_reg1: '',
    dept2_code: '',
    start_reg2: '',
    end_reg2: '',
    invigilator1_id: '',
    invigilator2_id: ''
  });
  
  const [allocResult, setAllocResult] = useState(null);
  const [invigilations, setInvigilations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const hallsPerPage = 7;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [depRes, hallRes, examRes, staffRes, invigRes] = await Promise.all([
          api.get('/departments'),
          api.get('/halls'),
          api.get('/exams'),
          api.get('/staff'),
          api.get('/invigilations')
        ]);
        
        if (depRes.data.success) setDepartments(depRes.data.data);
        if (hallRes.data.success) setHalls(hallRes.data.data);
        if (examRes.data.success) setExams(examRes.data.data);
        if (staffRes.data.success) setStaff(staffRes.data.data);
        if (invigRes.data.success) setInvigilations(invigRes.data.data);
        
        if (depRes.data.data.length > 0) {
          setSelectedDeptId(String(depRes.data.data[0].id));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load initial data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedDeptCode = useMemo(() => {
    return departments.find(d => String(d.id) === selectedDeptId)?.code || '';
  }, [departments, selectedDeptId]);

  const displayedHalls = useMemo(() => {
    if (!selectedDeptCode) return [];
    return halls.filter(h => {
      if (!h.department_codes) return false;
      return h.department_codes.split(', ').includes(selectedDeptCode);
    });
  }, [halls, selectedDeptCode]);

  const indexOfLastHall = currentPage * hallsPerPage;
  const indexOfFirstHall = indexOfLastHall - hallsPerPage;
  const currentHalls = displayedHalls.slice(indexOfFirstHall, indexOfLastHall);
  const totalPages = Math.ceil(displayedHalls.length / hallsPerPage);

  const handleOpenAllocate = (hall) => {
    setSelectedHall(hall);
    setAllocForm({
      exam1_id: '',
      exam2_id: '',
      year: '3',
      dept1_code: selectedDeptCode,
      start_reg1: '',
      end_reg1: '',
      dept2_code: '',
      start_reg2: '',
      end_reg2: '',
      invigilator1_id: '',
      invigilator2_id: ''
    });
    setAllocResult(null);
    setAllocModalOpen(true);
  };
  
  const handleOpenView = async (hall) => {
    setSelectedHall(hall);
    setViewModalOpen(true);
    // Since we don't have a direct "get allocation by hall" endpoint, 
    // we instruct the user that the view result requires an active endpoint in a full system. 
    // We will simulate it by telling them the hall is allocated.
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        hall_id: selectedHall.id,
        exam1_id: allocForm.exam1_id,
        exam2_id: allocForm.exam2_id,
        year: allocForm.year,
        dept1_code: allocForm.dept1_code,
        start_reg1: allocForm.start_reg1,
        end_reg1: allocForm.end_reg1,
        dept2_code: allocForm.dept2_code,
        start_reg2: allocForm.start_reg2,
        end_reg2: allocForm.end_reg2,
        invigilator1_id: allocForm.invigilator1_id,
        invigilator2_id: allocForm.invigilator2_id
      };
      
      const res = await api.post('/seating/allocate-hall', payload);
      
      if (res.data.success) {
        setAllocResult(res.data.data);
        // update hall status in UI
        setHalls(prev => prev.map(h => h.id === selectedHall.id ? { ...h, status: 'unavailable' } : h));
        
        // Refetch invigilations so the dropdown marks them as (assigned) on next allocation
        const invigRes = await api.get('/invigilations');
        if (invigRes.data.success) setInvigilations(invigRes.data.data);
      } else {
        alert(res.data.message || 'Failed to allocate hall');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Error allocating hall');
    }
  };

  if (loading) return <div className="app-shell"><Sidebar /><div className="main-content">Loading...</div></div>;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title="Hall Plan" subtitle="Manage specific hall allocations" />
        
        <div className="page-body" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          
          <div style={{ flex: allocModalOpen || allocResult ? '1 1 50%' : '1 1 100%', transition: 'all 0.3s ease' }}>
            {error && <p className="field-error">{error}</p>}
            
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>HALL PLAN</h2>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            {departments.map(d => (
              <button 
                key={d.id} 
                className={`btn ${String(d.id) === selectedDeptId ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setSelectedDeptId(String(d.id)); setCurrentPage(1); }}
              >
                [{d.code}]
              </button>
            ))}
          </div>
          
          {selectedDeptCode && (
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>{selectedDeptCode} HALLS</h3>
              <table>
                <thead>
                  <tr>
                    <th>Hall</th>
                    <th>Capacity</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHalls.map(hall => (
                    <tr key={hall.id}>
                      <td>{hall.hall_number}</td>
                      <td>{hall.capacity}</td>
                      <td>
                        <span className={`badge ${hall.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                          {hall.status ? hall.status.toUpperCase() : 'UNKNOWN'}
                        </span>
                      </td>
                      <td>
                        {hall.status === 'available' ? (
                          <button className="btn btn-primary btn-sm" onClick={() => handleOpenAllocate(hall)}>Allocate</button>
                        ) : (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleOpenView(hall)}>View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {currentHalls.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No halls found for this department.</td></tr>
                  )}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button 
                    className="btn btn-ghost" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm muted">Page {currentPage} of {totalPages}</span>
                  <button 
                    className="btn btn-ghost" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          </div>
          
          {/* ALLOCATION / VIEW PANEL (SIDE-BY-SIDE) */}
          {(allocModalOpen || allocResult || viewModalOpen) && (
            <div className="card" style={{ flex: '1 1 50%', position: 'sticky', top: 20, maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}>
              
              {allocModalOpen && !allocResult && (
                <>
                  <h2 style={{ marginBottom: 16 }}>ALLOCATE HALL — {selectedHall?.hall_number}</h2>
                  <p className="muted" style={{ marginBottom: 16 }}>Capacity: {selectedHall?.capacity}</p>
                  
                  <form onSubmit={handleAllocate} style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    <div className="form-group">
                      <label>Select Exam (Dept 1)</label>
                      <select className="input" value={allocForm.exam1_id} onChange={e => setAllocForm({...allocForm, exam1_id: e.target.value})} required>
                        <option value="">Select Exam 1</option>
                        {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.subject_name || ex.name || ex.subject_code} - {new Date(ex.exam_date || ex.date).toLocaleDateString()}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Select Exam (Dept 2)</label>
                      <select className="input" value={allocForm.exam2_id} onChange={e => setAllocForm({...allocForm, exam2_id: e.target.value})} required>
                        <option value="">Select Exam 2</option>
                        {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.subject_name || ex.name || ex.subject_code} - {new Date(ex.exam_date || ex.date).toLocaleDateString()}</option>)}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Select Year</label>
                      <select className="input" value={allocForm.year} onChange={e => setAllocForm({...allocForm, year: e.target.value})} required>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                      </select>
                    </div>
                    
                    <div style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div className="form-group">
                        <label>Department 1</label>
                        <select className="input" value={allocForm.dept1_code} onChange={e => setAllocForm({...allocForm, dept1_code: e.target.value})} required>
                          <option value="">Select Dept 1</option>
                          {departments.map(d => <option key={d.id} value={d.code}>{d.code}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Start Reg. No</label>
                          <input type="text" className="input" value={allocForm.start_reg1} onChange={e => setAllocForm({...allocForm, start_reg1: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>End Reg. No</label>
                          <input type="text" className="input" value={allocForm.end_reg1} onChange={e => setAllocForm({...allocForm, end_reg1: e.target.value})} required />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div className="form-group">
                        <label>Department 2</label>
                        <select className="input" value={allocForm.dept2_code} onChange={e => setAllocForm({...allocForm, dept2_code: e.target.value})} required>
                          <option value="">Select Dept 2</option>
                          {departments.map(d => <option key={d.id} value={d.code}>{d.code}</option>)}
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>Start Reg. No</label>
                          <input type="text" className="input" value={allocForm.start_reg2} onChange={e => setAllocForm({...allocForm, start_reg2: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>End Reg. No</label>
                          <input type="text" className="input" value={allocForm.end_reg2} onChange={e => setAllocForm({...allocForm, end_reg2: e.target.value})} required />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <label>Invigilator 1</label>
                        <select className="input" value={allocForm.invigilator1_id} onChange={e => setAllocForm({...allocForm, invigilator1_id: e.target.value})} required>
                          <option value="">Select Staff 1</option>
                          {staff.map(s => {
                            const isAssigned = invigilations.some(inv => inv.staff_id === s.id && (String(inv.exam_id) === String(allocForm.exam1_id) || String(inv.exam_id) === String(allocForm.exam2_id)));
                            return (
                              <option key={s.id} value={s.id} disabled={isAssigned}>
                                {s.name} ({s.department_code}){isAssigned ? ' (assigned)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>Invigilator 2</label>
                        <select className="input" value={allocForm.invigilator2_id} onChange={e => setAllocForm({...allocForm, invigilator2_id: e.target.value})} required>
                          <option value="">Select Staff 2</option>
                          {staff.map(s => {
                            const isAssigned = invigilations.some(inv => inv.staff_id === s.id && (String(inv.exam_id) === String(allocForm.exam1_id) || String(inv.exam_id) === String(allocForm.exam2_id)));
                            return (
                              <option key={s.id} value={s.id} disabled={isAssigned}>
                                {s.name} ({s.department_code}){isAssigned ? ' (assigned)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 'auto', paddingTop: 20 }}>
                      <button type="button" className="btn btn-ghost" onClick={() => { setAllocModalOpen(false); setAllocResult(null); }}>Cancel</button>
                      <button type="submit" className="btn btn-primary">FINALIZE HALL ALLOCATION</button>
                    </div>
                  </form>
                </>
              )}

              {/* FINAL RESULT VIEW */}
              {allocResult && allocModalOpen && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ textAlign: 'center', marginBottom: 20 }}>FINAL HALL ALLOCATION</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    <div>
                      <p><strong>Hall:</strong> {allocResult.hall}</p>
                      <p><strong>Hall Capacity:</strong> {allocResult.capacity}</p>
                    </div>
                    <div>
                      <p><strong>Status:</strong> <span className="badge badge-success">HALL ALLOCATED</span></p>
                      <p><strong>Allocated Students:</strong> {allocResult.students.length}</p>
                    </div>
                  </div>
                  
                  <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 12 }}>SEATING</h3>
                  <table style={{ marginBottom: 24 }}>
                    <thead>
                      <tr>
                        <th>Seat</th>
                        <th>Student</th>
                        <th>Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocResult.students.map(s => (
                        <tr key={s.id}>
                          <td>{allocResult.hall}-R{s.seat_row}-C{s.seat_column}</td>
                          <td>{s.student_name} ({s.register_number})</td>
                          <td>{s.dept_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8, marginBottom: 12 }}>INVIGILATORS</h3>
                  {allocResult.invigilators.map((inv, idx) => (
                    <div key={idx} style={{ marginBottom: 12 }}>
                      <p><strong>{idx + 1}. {inv.name}</strong></p>
                      <p className="muted">Department: {inv.department_code}</p>
                    </div>
                  ))}
                  
                  <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <button className="btn btn-primary" onClick={() => { setAllocModalOpen(false); setAllocResult(null); }}>Close</button>
                  </div>
                </div>
              )}

              {/* VIEW MODAL (PLACEHOLDER) */}
              {viewModalOpen && (
                <div>
                  <h2 style={{ marginBottom: 16 }}>Allocated Hall</h2>
                  <p>This hall has been allocated. Please select 'Allocate' on an available hall to see the new workflow, or implement a specific 'View Allocation' backend endpoint to fetch historical seating for this hall.</p>
                  <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <button className="btn btn-primary" onClick={() => setViewModalOpen(false)}>Close</button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}