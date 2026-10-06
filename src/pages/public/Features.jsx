import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';

const FEATURES = [
  ['🧮', 'Auto seating generator', 'Allocates every seat across halls, balancing departments automatically.'],
  ['✅', 'Conflict detection', 'Flags duplicate registers and department clashes before publishing.'],
  ['📱', 'QR hall slips', 'Students download a scannable, tamper-proof hall ticket instantly.'],
  ['🧑‍🏫', 'Invigilator assignment', 'Balances duty load and notifies staff of their assigned halls.'],
  ['✏️', 'Manual seat editor', 'Drag-and-adjust any seat before locking in the final layout.'],
  ['📊', 'Reports & analytics', 'Export hall and student reports as PDF or Excel with one click.'],
];

export default function Features() {
  return (
    <div className="public-shell">
      <PublicNav />
      <section className="public-hero">
        <p className="muted text-sm" style={{ fontWeight: 600 }}>FEATURES</p>
        <h1 style={{ fontSize: 36, margin: '16px 0' }}>Everything the exam cell needs</h1>
        <p className="muted" style={{ fontSize: 16, marginBottom: 40 }}>One workflow from student upload to published hall slip.</p>

        <div className="feature-grid">
          {FEATURES.map(([icon, title, body]) => (
            <div className="card" key={title}>
              <div className="icon-bubble">{icon}</div>
              <h3 style={{ marginBottom: 8, fontSize: 16 }}>{title}</h3>
              <p className="muted text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
