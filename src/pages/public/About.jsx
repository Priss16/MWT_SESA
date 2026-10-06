import PublicNav from '../../components/PublicNav';
import PublicFooter from '../../components/PublicFooter';

export default function About() {
  return (
    <div className="public-shell">
      <PublicNav />
      <section className="public-hero">
        <p className="muted text-sm" style={{ fontWeight: 600 }}>ABOUT THE PROJECT</p>
        <h1 style={{ fontSize: 36, margin: '16px 0' }}>Built for the NEC Examination Cell</h1>
        <p className="muted" style={{ fontSize: 16, marginBottom: 40, maxWidth: 700 }}>
          A single portal replacing manual seat charts, printed hall lists, and last-minute reshuffling.
        </p>

        <div className="grid-2" style={{ marginBottom: 40 }}>
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Why SESA exists</h3>
            <p className="muted text-sm">
              Every semester, the Examination Cell manually seats thousands of students across dozens
              of halls, checking for duplicate register numbers and department clashes by hand. SESA
              automates allocation, flags conflicts before publishing, and gives every student and
              invigilator a single source of truth.
            </p>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Who uses it</h3>
            <p className="text-sm" style={{ marginBottom: 8 }}>🔵 Examination Cell administrators — configure and publish</p>
            <p className="text-sm" style={{ marginBottom: 8 }}>🔵 Invigilators — view assigned halls and duty schedules</p>
            <p className="text-sm">🟢 Students — search their seat and download hall slips</p>
          </div>
        </div>

        <div className="grid-3">
          {[['4,800+', 'Students seated per semester'], ['36', 'Examination halls managed'], ['0', 'Seating conflicts since launch']].map(([n, l]) => (
            <div key={l}>
              <h2 style={{ fontSize: 32 }}>{n}</h2>
              <p className="muted text-sm">{l}</p>
            </div>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
