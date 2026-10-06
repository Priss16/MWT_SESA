import { useState } from 'react';
import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';
import { useSettings } from '../../context/SettingsContext';

export default function Contact() {
  const { t } = useSettings();
  const [form, setForm] = useState({ name: '', regNo: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="public-shell">
      <PublicNav />
      <section className="public-hero">
        <p className="muted text-sm" style={{ fontWeight: 600 }}>CONTACT</p>
        <h1 style={{ fontSize: 36, margin: '16px 0' }}>Get in touch with the Exam Cell</h1>
        <p className="muted" style={{ fontSize: 16, marginBottom: 40 }}>
          Questions about hall slips, schedules, or access? We're happy to help.
        </p>

        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Examination Cell</h3>
            <p className="text-sm" style={{ marginBottom: 8 }}>📧 exams@nec.edu.in</p>
            <p className="text-sm" style={{ marginBottom: 8 }}>📞 +91 04632 - 222 000</p>
            <p className="text-sm" style={{ marginBottom: 16 }}>🕒 Mon–Sat, 9:00 AM – 5:00 PM</p>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
            <p className="text-sm" style={{ fontWeight: 600 }}>Address</p>
            <p className="muted text-sm">National Engineering College, K.R. Nagar, Kovilpatti, Thoothukudi District, Tamil Nadu 628503</p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Send a message</h3>
            {submitted ? (
              <p style={{ color: 'var(--success)' }}>Thanks! Your message has been sent to the Examination Cell.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid-2" style={{ marginBottom: 14 }}>
                  <div>
                    <label className="field-label">Full name</label>
                    <input className="input" value={form.name} onChange={handleChange('name')} required />
                  </div>
                  <div>
                    <label className="field-label">Register no. / Staff ID</label>
                    <input className="input" value={form.regNo} onChange={handleChange('regNo')} />
                  </div>
                </div>
                <label className="field-label">Email address</label>
                <input className="input" type="email" value={form.email} onChange={handleChange('email')} required style={{ marginBottom: 14 }} />
                <label className="field-label">{t('subject')}</label>
                <input className="input" value={form.subject} onChange={handleChange('subject')} style={{ marginBottom: 14 }} />
                <label className="field-label">Message</label>
                <textarea className="input" rows={4} value={form.message} onChange={handleChange('message')} style={{ marginBottom: 16, resize: 'vertical' }} required />
                <button className="btn btn-primary">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
