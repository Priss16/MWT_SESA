import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function AddStudent() {
  const { t } = useSettings();
  const navigate = useNavigate();
  // useState: OBJECT STATE holding the whole form together
  const [form, setForm] = useState({ name: '', regNo: '', email: '', dept: '', year: '', semester: '', section: '' });
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { default: api } = await import('../../services/api');
      const deptId = form.dept === 'CSE' ? 1 : form.dept === 'ECE' ? 2 : form.dept === 'EEE' ? 3 : form.dept === 'MECH' ? 4 : form.dept === 'CIVIL' ? 5 : form.dept === 'IT' ? 6 : 1;
      const res = await api.post('/students', {
        register_number: form.regNo,
        name: form.name,
        department_id: deptId,
        year: form.year === 'I' ? 1 : form.year === 'II' ? 2 : form.year === 'III' ? 3 : form.year === 'IV' ? 4 : 1,
        semester: form.semester === 'I' ? 1 : form.semester === 'II' ? 2 : form.semester === 'III' ? 3 : form.semester === 'IV' ? 4 : form.semester === 'V' ? 5 : form.semester === 'VI' ? 6 : form.semester === 'VII' ? 7 : form.semester === 'VIII' ? 8 : 1,
        email: form.email,
        password: 'password'
      });
      if (res.data.success) {
        navigate('/admin/students');
      } else {
        alert("Failed to add student");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('addStudent')} subtitle={`${t('students')} / ${t('addStudent')}`} />
        <div className="page-body">
          <form className="card" onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
            <h3 style={{ marginBottom: 18 }}>Personal Details</h3>
            <div className="grid-3" style={{ marginBottom: 18 }}>
              <div>
                <label className="field-label">Full Name *</label>
                <input className="input" required value={form.name} onChange={update('name')} placeholder="e.g. Aarthi Balasubramaniam" />
              </div>
              <div>
                <label className="field-label">Register Number *</label>
                <input className="input" required value={form.regNo} onChange={update('regNo')} placeholder="7124102CS101" />
              </div>
              <div>
                <label className="field-label">Email Address *</label>
                <input className="input" type="email" required value={form.email} onChange={update('email')} placeholder="student@nec.edu.in" />
              </div>
            </div>

            <h3 style={{ margin: '24px 0 18px' }}>Academic Details</h3>
            <div className="grid-3" style={{ marginBottom: 18 }}>
              <div>
                <label className="field-label">Department *</label>
                <select className="input" required value={form.dept} onChange={update('dept')}>
                  <option value="">Select department</option>
                  <option>CSE</option><option>ECE</option><option>EEE</option><option>MECH</option><option>CIVIL</option><option>IT</option>
                </select>
              </div>
              <div>
                <label className="field-label">Year *</label>
                <select className="input" required value={form.year} onChange={update('year')}>
                  <option value="">Select year</option>
                  {['I', 'II', 'III', 'IV'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Semester *</label>
                <select className="input" required value={form.semester} onChange={update('semester')}>
                  <option value="">Select semester</option>
                  {['I','II','III','IV','V','VI','VII','VIII'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Section</label>
                <input className="input" value={form.section} onChange={update('section')} placeholder="e.g. A" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/students')}>{t('cancel')}</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Student'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
