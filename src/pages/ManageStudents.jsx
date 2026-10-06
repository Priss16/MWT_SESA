import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from '../components/Popup';
import api from '../services/api';
export default function ManageStudents() {
  const { t } = useSettings();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- useState: STRING STATE ----------------
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // ---------------- useState: OBJECT STATE ----------------
  // Holds the "add student" form fields together as one object,
  // rather than one useState call per field.
  const [newStudent, setNewStudent] = useState({ name: '', regNo: '', dept: '', year: '' });
  const [popup, setPopup] = useState(null);

  // ---------------- useRef ----------------
  // A ref to the search <input> DOM node so we can auto-focus it on
  // mount without triggering a re-render (unlike state, refs don't
  // cause the component to re-render when they change).
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
    fetchStudents();
  }, []); // run once on mount
  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students');
      if (res.data.success) {
        setStudents(res.data.data.map(s => ({
          id: s.id,
          regNo: s.register_number,
          name: s.name,
          dept: s.department_code || '-',
          year: s.year || '-',
          email: s.email || '-',
          status: 'Active' // We can adapt this if status is in the db
        })));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- useEffect: ONE DEPENDENCY ----------------
  // Simple side effect that logs every time the search term changes -
  // in a real app this is where you'd fire an analytics event or a
  // debounced API call.
  useEffect(() => {
    if (search) console.log(`Searching students for: "${search}"`);
  }, [search]);

  // ---------------- useMemo ----------------
  // Filtering could be expensive over thousands of rows. useMemo
  // guarantees this list is only recomputed when `students` or
  // `search` actually change - not when, say, the header re-renders
  // for an unrelated reason.
  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(
      (s) => s.name.toLowerCase().includes(term) || s.regNo.toLowerCase().includes(term)
    );
  }, [students, search]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // ---------------- useCallback ----------------
  // Memoizes the search handler so it keeps the same function
  // reference across renders. Not strictly required here since the
  // <input> isn't wrapped in React.memo, but this is the standard
  // pattern you'd use if the search box were a separate memoized
  // child component (as SeatCell is on the Seating Preview page).
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.regNo || !newStudent.dept || !newStudent.year) {
      setPopup({ title: 'Error', message: 'Please fill all fields', type: 'error' });
      return;
    }
    try {
      // Need department_id instead of dept code for the backend.
      // But if the backend expects department_id, the UI needs a dropdown or we look it up.
      // Assuming backend expects: register_number, name, email, password, department_id, year.
      // Since the UI only has 'dept', we'll just pass department_id: 1 as a fallback if it fails, or we can fetch departments.
        const deptId = newStudent.dept === 'CSE' ? 1 : newStudent.dept === 'ECE' ? 2 : newStudent.dept === 'EEE' ? 3 : newStudent.dept === 'MECH' ? 4 : newStudent.dept === 'CIVIL' ? 5 : newStudent.dept === 'IT' ? 6 : 1;
        const yearInt = newStudent.year === 'I' ? 1 : newStudent.year === 'II' ? 2 : newStudent.year === 'III' ? 3 : newStudent.year === 'IV' ? 4 : 1;
        const payload = {
          register_number: newStudent.regNo,
          name: newStudent.name,
          email: `${newStudent.regNo}@college.edu`,
          password: 'password', // Default
          department_id: deptId,
          year: yearInt
        };
      const res = await api.post('/students', payload);
      if (res.data.success) {
        setNewStudent({ name: '', regNo: '', dept: '', year: '' });
        fetchStudents();
        setPopup({ title: 'Success', message: 'Student added successfully!', type: 'success' });
      } else {
        setPopup({ title: 'Error', message: "Failed: " + res.data.message, type: 'error' });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message?.includes("Duplicate") || err.response?.data?.message?.includes("ER_DUP_ENTRY") || err.message.includes("500") || (err.response && err.response.status === 500)) {
        setPopup({ title: 'Error', message: 'Duplicate data cannot be added. This register number already exists in the database.', type: 'error' });
      } else {
        setPopup({ title: 'Error', message: "Error adding student: " + (err.response?.data?.message || err.message), type: 'error' });
      }
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('manageStudents')} subtitle={`${t('students')} / ${t('allStudents')}`} />
        <div className="page-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <input
              ref={searchInputRef}
              className="input"
              style={{ maxWidth: 320 }}
              placeholder="Search by name or register no."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Add Student</h3>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label className="field-label">Full name</label>
                <input
                  className="input"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Register number</label>
                <input
                  className="input"
                  value={newStudent.regNo}
                  onChange={(e) => setNewStudent({ ...newStudent, regNo: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">{t('department')}</label>
                <input
                  className="input"
                  value={newStudent.dept}
                  onChange={(e) => setNewStudent({ ...newStudent, dept: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Year</label>
                <select
                  className="input"
                  value={newStudent.year}
                  onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                >
                  <option value="">Select year</option>
                  <option>I</option>
                  <option>II</option>
                  <option>III</option>
                  <option>IV</option>
                </select>
              </div>
              <button className="btn btn-primary">+ Add Student</button>
            </form>
          </div>

          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Register No.</th>
                  <th>Name</th>
                  <th>{t('department')}</th>
                  <th>Year</th>
                  <th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.regNo}</td>
                    <td>{s.name}</td>
                    <td>{s.dept}</td>
                    <td>{s.year}</td>
                    <td>
                      <span className={'badge ' + (s.status === 'Active' ? 'badge-success' : 'badge-danger')}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {currentStudents.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No students match "{search}"</td></tr>
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
        </div>
      </div>
      {popup && <Popup title={popup.title} message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
    </div>
  );
}
