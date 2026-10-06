export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <strong>SESA</strong>
          <p style={{ fontSize: 12, opacity: 0.7, margin: '4px 0 0' }}>National Engineering College, Kovilpatti</p>
        </div>
        <div>
          <a href="/about">About</a>
          <a href="/features">Features</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
        </div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>© 2026 Examination Cell</div>
      </div>
    </footer>
  );
}
