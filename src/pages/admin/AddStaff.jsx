import { useState, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { defaultStaffPassword } from '../../data/accounts';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, isEmailJsConfigured } from '../../config/emailjs';
import emailjs from '@emailjs/browser';
import api from '../../services/api';

export default function AddStaff() {
  const { t } = useSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', staffId: '', email: '', dept: '', designation: '' });

  // ---------------- useState: OBJECT STATE (nullable) ----------------
  // Set right after a successful save so we can show the admin the new
  // staff member's login credentials - without this, there'd be no way
  // to actually tell them how to sign in.
  const [savedStaff, setSavedStaff] = useState(null);
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  // ---------------- useCallback ----------------
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.post('/staff', {
        staff_id: form.staffId,
        name: form.name,
        department_id: form.dept === 'CSE' ? 1 : form.dept === 'ECE' ? 2 : form.dept === 'EEE' ? 3 : form.dept === 'MECH' ? 4 : form.dept === 'CIVIL' ? 5 : form.dept === 'IT' ? 6 : 1,
        designation: form.designation,
        email: form.email,
        password: 'password'
      });
      if (!res.data.success) {
        alert("Failed to add staff");
        setSaving(false);
        return;
      }
    } catch (err) {
      alert("Error: " + err.message);
      setSaving(false);
      return;
    }

    // Real login validation (see src/utils/accountStore.js) derives
    // every staff account from this directory, so saving above already
    // made this a working login - a default password based on their
    // Staff ID, standing in for what a real system would generate and
    // email automatically.
    const tempPassword = defaultStaffPassword(form.staffId);
    let emailed = false;
    if (isEmailJsConfigured) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: form.email,
            reset_link: `${window.location.origin}/login/staff`,
            temp_password: tempPassword,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
        emailed = true;
      } catch (err) {
        console.error('EmailJS send failed:', err);
      }
    }

    setSaving(false);
    setSavedStaff({ ...form, tempPassword, emailed });
  }, [form]);

  if (savedStaff) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Header title={t('addStaff')} subtitle={`${t('staff')} / ${t('addStaff')}`} />
          <div className="page-body">
            <div className="card callout-light" style={{ background: '#ECFDF5', border: 'none', maxWidth: 640 }}>
              <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>
                {savedStaff.name} has been added.
              </p>
              <p className="text-sm" style={{ marginBottom: 14 }}>
                {savedStaff.emailed
                  ? `Their login details have also been emailed to ${savedStaff.email}, but here they are so you can hand them over right away:`
                  : 'Share these login details with them directly (email isn\u2019t configured yet - see src/config/emailjs.js to send this automatically):'}
              </p>
              <div className="card" style={{ background: '#F8FAFC', marginBottom: 16 }}>
                <p className="text-sm"><strong>Staff ID:</strong> {savedStaff.staffId}</p>
                <p className="text-sm"><strong>Temporary password:</strong> {savedStaff.tempPassword}</p>
              </div>
              <p className="text-sm" style={{ marginBottom: 16, color: 'var(--warning)', fontWeight: 500 }}>
                They must change this password after their first login - send them straight to
                Settings once they sign in.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => { setSavedStaff(null); setForm({ name: '', staffId: '', email: '', dept: '', designation: '' }); }}>
                  Add Another
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/admin/staff')}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('addStaff')} subtitle={`${t('staff')} / ${t('addStaff')}`} />
        <div className="page-body">
          <form className="card" style={{ maxWidth: 900 }} onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 18 }}>Personal Details</h3>
            <div className="grid-3" style={{ marginBottom: 18 }}>
              <div><label className="field-label">Full Name *</label><input className="input" required value={form.name} onChange={update('name')} placeholder="e.g. Dr. K. Meenakshi" /></div>
              <div><label className="field-label">Staff ID *</label><input className="input" required value={form.staffId} onChange={update('staffId')} placeholder="STF-1042" /></div>
              <div><label className="field-label">Email *</label><input className="input" type="email" required value={form.email} onChange={update('email')} placeholder="staff@nec.edu.in" /></div>
            </div>
            <h3 style={{ margin: '24px 0 18px' }}>Employment Details</h3>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              <div>
                <label className="field-label">Department *</label>
                <select className="input" required value={form.dept} onChange={update('dept')}>
                  <option value="">Select department</option>
                  <option>CSE</option><option>ECE</option><option>EEE</option><option>MECH</option><option>CIVIL</option><option>IT</option>
                </select>
              </div>
              <div>
                <label className="field-label">Designation *</label>
                <select className="input" required value={form.designation} onChange={update('designation')}>
                  <option value="">Select designation</option>
                  <option>Professor</option><option>Assoc. Professor</option><option>Asst. Professor</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/staff')}>{t('cancel')}</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Staff'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
