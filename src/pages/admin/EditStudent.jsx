import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { initialStudents } from '../../data/mockData';

export default function EditStudent() {
  const { t } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', regNo: '', email: '', dept: '', year: '' });

  // useEffect: ONE DEPENDENCY - re-loads the record whenever the :id
  // route param changes (e.g. navigating from one student's edit page
  // straight to another's via a link).
  useEffect(() => {
    const student = initialStudents.find((s) => String(s.id) === id) || initialStudents[0];
    setForm({ name: student.name, regNo: student.regNo, email: student.email, dept: student.dept, year: student.year });
  }, [id]);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('editStudent')} subtitle={`${t('students')} / ${form.name} / ${t('edit')}`} />
        <div className="page-body">
          <form className="card" style={{ maxWidth: 900 }} onSubmit={(e) => { e.preventDefault(); navigate('/admin/students'); }}>
            <div className="grid-3" style={{ marginBottom: 18 }}>
              <div>
                <label className="field-label">Full Name</label>
                <input className="input" value={form.name} onChange={update('name')} />
              </div>
              <div>
                <label className="field-label">{t('registerNumber')}</label>
                <input className="input" value={form.regNo} disabled />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input className="input" type="email" value={form.email} onChange={update('email')} />
              </div>
            </div>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              <div>
                <label className="field-label">{t('department')}</label>
                <input className="input" value={form.dept} onChange={update('dept')} />
              </div>
              <div>
                <label className="field-label">Year</label>
                <input className="input" value={form.year} onChange={update('year')} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Link to="/admin/students" className="btn btn-ghost" style={{ textDecoration: 'none' }}>{t('cancel')}</Link>
              <button className="btn btn-primary">{t('saveChanges')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
