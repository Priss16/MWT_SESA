import { useState } from 'react';
import StudentNav from '../../components/StudentNav';
import Toggle from '../../components/Toggle';
import { useSettings } from '../../context/SettingsContext';

export default function StudentSettings() {
  const { t, fontSize, setFontSize } = useSettings();
  const [prefs, setPrefs] = useState({ examReminders: true, hallSlipAlerts: true, smsReminders: false });

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <StudentNav />
      <div className="page-body">
        <h2 style={{ fontSize: 26, marginBottom: 20 }}>{t('settings')}</h2>

        <div className="card" style={{ marginBottom: 16, maxWidth: 700 }}>
          <h3 style={{ marginBottom: 16 }}>{t('fontSize')}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['sm', 'md', 'lg'].map((s) => (
              <button key={s} className={'btn ' + (fontSize === s ? 'btn-primary' : 'btn-ghost')} onClick={() => setFontSize(s)}>
                {s === 'sm' ? t('small') : s === 'md' ? t('medium') : t('large')}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ maxWidth: 700, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>{t('notifications')}</h3>
          {[
            ['examReminders', 'Exam reminders', 'Remind me 24 hours before each exam'],
            ['hallSlipAlerts', 'Hall slip alerts', 'Notify me the moment a hall slip is ready to download'],
            ['smsReminders', 'SMS reminders', 'Text me exam reminders in addition to email'],
          ].map(([key, title, desc]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 14 }}>{title}</p>
                <p className="muted text-sm">{desc}</p>
              </div>
              <Toggle on={prefs[key]} onClick={() => toggle(key)} />
            </div>
          ))}
        </div>

        <div className="card" style={{ maxWidth: 700 }}>
          <h3 style={{ marginBottom: 8 }}>Data &amp; Privacy</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontWeight: 500, fontSize: 14 }}>Download my data</p>
              <p className="muted text-sm">Get a copy of your exam schedule, hall slips, and seating history</p>
            </div>
            <button className="btn btn-ghost">Request Export</button>
          </div>
        </div>
      </div>
    </div>
  );
}
