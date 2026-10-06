import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';

export default function Home() {
  return (
    <div className="public-shell">
      <PublicNav />
      <section className="public-hero grid-2">
        <div>
          <p className="muted text-sm" style={{ fontWeight: 600 }}>EXAMINATION CELL · NEC KOVILPATTI</p>
          <h1 style={{ fontSize: 40, margin: '16px 0' }}>Seating arrangements, without the spreadsheet chaos.</h1>
          <p className="muted" style={{ fontSize: 16, marginBottom: 28 }}>
            SESA auto-generates conflict-free exam seating, assigns invigilators, and gives every
            student a QR hall slip in seconds.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" style={{ padding: '14px 24px' }}>Get Started</button>
            <button className="btn btn-secondary" style={{ padding: '14px 24px' }}>See how it works</button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Hall 104 · Live Preview</h3>
          <div className="badge badge-success">0 conflicts detected</div>
        </div>
      </section>

      <section style={{ padding: '0 48px 80px' }}>
        <h2 style={{ marginBottom: 24 }}>How it works</h2>
        <div className="feature-grid">
          {[
            ['Step 1', 'Upload exam details', 'Departments, subjects and student lists in one import.'],
            ['Step 2', 'Auto-generate seating', 'Conflict-free allocation across every hall.'],
            ['Step 3', 'Publish & notify', 'Students get a QR hall slip instantly.'],
          ].map(([step, title, body]) => (
            <div className="card" key={step}>
              <p className="muted text-sm" style={{ fontWeight: 600 }}>{step}</p>
              <h3 style={{ margin: '10px 0' }}>{title}</h3>
              <p className="muted text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
