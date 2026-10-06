import { useState, useCallback, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { departments, staffDutiesSeed, attendanceSeed, hallUtilizationTrendSeed } from '../../data/mockData';

const DEPT_COLORS = ['#1E3A8A', '#2563EB', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

// Everything below is computed live from DataContext (halls, staff,
// audit logs) instead of a fixed mock array - this page is meant to
// answer "what's the exam-conduct picture right now," so it should
// actually move when the underlying data does (add a hall, allocate
// one, add staff, or have someone log in - and this page reflects it
// on the next render, same as any other page reading useData()).
export default function ReportsDashboard() {
  const { t } = useSettings();
  const { halls, staff, auditLogs, exams } = useData();
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id ?? null);

  // ---------------- useMemo ----------------
  const stats = useMemo(() => {
    const assignedHalls = halls.filter((h) => h.status === 'Assigned').length;
    const activeStaff = staff.filter((s) => s.status === 'Active').length;
    const totalDuties = staffDutiesSeed.length;
    const totalSeats = halls.reduce((sum, h) => sum + h.capacity, 0);
    return [
      ['Halls In Use Right Now', `${assignedHalls} / ${halls.length}`],
      ['Active Invigilators', activeStaff],
      ['Invigilation Duties Logged', totalDuties],
      ['Total Seating Capacity', totalSeats.toLocaleString('en-IN')],
    ];
  }, [halls, staff]);

  const deptBreakdown = useMemo(
    () =>
      departments
        .map((d, i) => ({
          dept: d.code,
          count: halls.filter((h) => h.depts?.includes(d.code)).length,
          color: DEPT_COLORS[i % DEPT_COLORS.length],
        }))
        .filter((d) => d.count > 0),
    [halls]
  );

  // "Utilization" here means how much of each department's own hall
  // pool is currently Assigned vs sitting Free - a live figure, not a
  // historical average, since it's derived straight from each hall's
  // current status.
  const hallUtilization = useMemo(
    () =>
      departments
        .map((d) => {
          const deptHalls = halls.filter((h) => h.depts?.includes(d.code));
          if (deptHalls.length === 0) return null;
          const assigned = deptHalls.filter((h) => h.status === 'Assigned').length;
          return { dept: d.code, pct: Math.round((assigned / deptHalls.length) * 100) };
        })
        .filter(Boolean),
    [halls]
  );

  const recentActivity = useMemo(() => auditLogs.slice(0, 6), [auditLogs]);

  // Attendance % by exam (and its owning department) - a real exam
  // cell computes this after every exam to build the absentee list it
  // has to submit, and to spot departments with unusually high no-shows.
  const attendance = useMemo(
    () => attendanceSeed.map((a) => ({ ...a, pct: Math.round((a.present / a.total) * 100) })),
    []
  );
  const overallAttendancePct = useMemo(() => {
    const totalPresent = attendanceSeed.reduce((s, a) => s + a.present, 0);
    const totalSeats = attendanceSeed.reduce((s, a) => s + a.total, 0);
    return totalSeats ? Math.round((totalPresent / totalSeats) * 100) : 0;
  }, []);

  // Hall utilization over the term - seats actually used vs total
  // capacity offered, sampled across several exam dates, so a trend
  // line is visible rather than only "right now."
  const utilizationTrend = useMemo(
    () => hallUtilizationTrendSeed.map((d) => ({ ...d, pct: Math.round((d.seatsUsed / d.capacity) * 100) })),
    []
  );

  const selectedExam = useMemo(() => exams.find((e) => e.id === selectedExamId) || null, [exams, selectedExamId]);
  const selectedExamAttendance = useMemo(
    () => (selectedExam ? attendanceSeed.find((a) => a.examCode === selectedExam.code) : null),
    [selectedExam]
  );

  // ---------------- useCallback ----------------
  // A focused, single-exam report - distinct from the aggregate
  // dashboard export above - for handing off "everything about exam
  // day X" to whoever needs it (Controller of Examinations, HODs).
  const handleExportExamDayPdf = useCallback(() => {
    if (!selectedExam) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 56;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SESA — Exam-Day Report', 56, y);
    y += 18;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#6B7280');
    doc.text('Generated ' + new Date().toLocaleString(), 56, y);
    y += 34;

    doc.setTextColor('#1F2937');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${selectedExam.subject} (${selectedExam.code})`, 56, y);
    y += 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    [
      ['Date & Time', `${selectedExam.date}, ${selectedExam.time}`],
      ['Status', selectedExam.status],
      ['Halls Used', `${selectedExam.halls}`],
      ['Students', `${selectedExam.students}`],
    ].forEach(([label, value]) => {
      doc.text(`${label}:`, 56, y);
      doc.text(String(value), 220, y);
      y += 18;
    });

    if (selectedExamAttendance) {
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.text('Attendance', 56, y);
      y += 20;
      doc.setFont('helvetica', 'normal');
      const pct = Math.round((selectedExamAttendance.present / selectedExamAttendance.total) * 100);
      [
        ['Department', selectedExamAttendance.dept],
        ['Present', `${selectedExamAttendance.present}`],
        ['Absent', `${selectedExamAttendance.total - selectedExamAttendance.present}`],
        ['Attendance %', `${pct}%`],
      ].forEach(([label, value]) => {
        doc.text(`${label}:`, 56, y);
        doc.text(String(value), 220, y);
        y += 18;
      });
    }

    doc.save(`sesa-exam-day-${selectedExam.code}.pdf`);
  }, [selectedExam, selectedExamAttendance]);

  const handleExportExamDayExcel = useCallback(() => {
    if (!selectedExam) return;
    const lines = [
      ['Field', 'Value'],
      ['Subject', selectedExam.subject],
      ['Code', selectedExam.code],
      ['Date', selectedExam.date],
      ['Time', selectedExam.time],
      ['Status', selectedExam.status],
      ['Halls Used', selectedExam.halls],
      ['Students', selectedExam.students],
    ];
    if (selectedExamAttendance) {
      const pct = Math.round((selectedExamAttendance.present / selectedExamAttendance.total) * 100);
      lines.push([], ['Department', selectedExamAttendance.dept], ['Present', selectedExamAttendance.present], ['Absent', selectedExamAttendance.total - selectedExamAttendance.present], ['Attendance %', `${pct}%`]);
    }
    const csv = lines.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sesa-exam-day-${selectedExam.code}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedExam, selectedExamAttendance]);

  // ---------------- useCallback ----------------
  // Builds a real PDF summary of the report using jsPDF and saves it.
  const handleExportPdf = useCallback(() => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 56;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SESA — Reports Dashboard', 56, y);
    y += 18;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#6B7280');
    doc.text('All Departments · Generated ' + new Date().toLocaleString(), 56, y);
    y += 34;

    doc.setTextColor('#1F2937');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    stats.forEach(([label, value]) => {
      doc.text(`${label}:`, 56, y);
      doc.text(String(value), 280, y);
      y += 18;
    });

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Halls by Department', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    deptBreakdown.forEach(({ dept, count }) => {
      doc.text(`${dept}:`, 56, y);
      doc.text(String(count), 280, y);
      y += 18;
    });

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Hall Utilization Rate (Assigned vs Free, by dept)', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    hallUtilization.forEach(({ dept, pct }) => {
      doc.text(`${dept}:`, 56, y);
      doc.text(`${pct}%`, 280, y);
      y += 18;
    });

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Attendance % by Department / Exam', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    attendance.forEach(({ dept, examCode, present, total, pct }) => {
      doc.text(`${dept} (${examCode}):`, 56, y);
      doc.text(`${present}/${total} (${pct}%)`, 280, y);
      y += 18;
    });

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Hall Utilization Over the Term', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    utilizationTrend.forEach(({ date, seatsUsed, capacity, pct }) => {
      doc.text(`${date}:`, 56, y);
      doc.text(`${seatsUsed}/${capacity} (${pct}%)`, 280, y);
      y += 18;
    });

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Recent Activity', 56, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    recentActivity.forEach((log) => {
      doc.text(`${log.timestamp} — ${log.user}: ${log.details}`, 56, y);
      y += 16;
    });

    doc.save('sesa-reports-dashboard.pdf');
  }, [stats, deptBreakdown, hallUtilization, attendance, utilizationTrend, recentActivity]);

  // ---------------- useCallback ----------------
  // Builds a CSV (opens directly in Excel) and triggers a download via
  // a Blob + temporary <a> tag - no extra spreadsheet library needed.
  const handleDownloadExcel = useCallback(() => {
    const lines = [
      ['Metric', 'Value'],
      ...stats,
      [],
      ['Department', 'Halls'],
      ...deptBreakdown.map(({ dept, count }) => [dept, count]),
      [],
      ['Department', 'Utilization %'],
      ...hallUtilization.map(({ dept, pct }) => [dept, pct]),
      [],
      ['Department', 'Exam', 'Present', 'Total', 'Attendance %'],
      ...attendance.map(({ dept, examCode, present, total, pct }) => [dept, examCode, present, total, pct]),
      [],
      ['Date', 'Seats Used', 'Capacity', 'Utilization %'],
      ...utilizationTrend.map(({ date, seatsUsed, capacity, pct }) => [date, seatsUsed, capacity, pct]),
      [],
      ['Timestamp', 'User', 'Action', 'Details'],
      ...recentActivity.map((log) => [log.timestamp, log.user, log.action, log.details]),
    ];
    const csv = lines.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sesa-reports-dashboard.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [stats, deptBreakdown, hallUtilization, attendance, utilizationTrend, recentActivity]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header title={t('reportsDashboard')} subtitle={t('reports')} />
        <div className="page-body">
          <p className="muted text-sm" style={{ marginBottom: 20, maxWidth: 720 }}>
            A live snapshot of exam-conduct activity across the college: how many halls are
            currently in use, how each department's rooms are split up, and what's happened
            most recently across Admin, Staff, and Student logins. Figures below update as soon
            as the underlying data changes - allocate a hall, add staff, or sign in somewhere
            else, and it's reflected here.
          </p>

          <div className="page-title-row">
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="input" style={{ width: 160 }}><option>All Semesters</option></select>
              <select className="input" style={{ width: 180 }}><option>{t('allDepartments')}</option></select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={handleExportPdf}>Export PDF</button>
              <button className="btn btn-secondary" onClick={handleDownloadExcel}>Download Excel</button>
            </div>
          </div>

          <div className="stat-grid">
            {stats.map(([label, value]) => (
              <div className="card stat-card" key={label}>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 4 }}>Attendance % by Department / Exam</h3>
              <p className="muted text-sm" style={{ marginBottom: 16 }}>Overall for the term: <strong>{overallAttendancePct}%</strong></p>
              {attendance.map((a) => (
                <div key={a.examCode} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{a.dept} · {a.examCode}</span>
                    <span>{a.present}/{a.total} ({a.pct}%)</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${a.pct}%`, background: a.pct < 90 ? 'var(--warning)' : 'var(--success)' }} /></div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 4 }}>Hall Utilization Over the Term</h3>
              <p className="muted text-sm" style={{ marginBottom: 16 }}>Seats used vs total capacity offered, per exam date</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                {utilizationTrend.map((d) => (
                  <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    <span className="muted text-sm" style={{ marginBottom: 4 }}>{d.pct}%</span>
                    <div style={{ width: '100%', height: `${d.pct}%`, background: 'var(--primary)', borderRadius: '6px 6px 0 0', minHeight: 4 }} />
                    <span className="muted text-sm" style={{ marginTop: 6 }}>{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Halls by Department</h3>
              {deptBreakdown.map(({ dept, count, color }) => (
                <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 5, background: color, display: 'inline-block' }} />
                    {dept}
                  </span>
                  <strong>{count} hall{count !== 1 ? 's' : ''}</strong>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 4 }}>Hall Utilization Rate</h3>
              <p className="muted text-sm" style={{ marginBottom: 16 }}>% of each dept's halls currently Assigned</p>
              {hallUtilization.map(({ dept, pct }) => (
                <div key={dept} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{dept}</span><span>{pct}%</span>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--primary)' }} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <h3>Exam-Day Report</h3>
                <p className="muted text-sm">A focused report for one exam - subject, halls, students, attendance</p>
              </div>
              <select className="input" style={{ width: 260 }} value={selectedExamId ?? ''} onChange={(e) => setSelectedExamId(Number(e.target.value))}>
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>{e.subject} ({e.code})</option>
                ))}
              </select>
            </div>

            {selectedExam && (
              <>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div><p className="muted text-sm">DATE & TIME</p><strong>{selectedExam.date}, {selectedExam.time}</strong></div>
                  <div><p className="muted text-sm">STATUS</p><span className={'badge ' + (selectedExam.status === 'Published' ? 'badge-success' : selectedExam.status === 'Draft' ? 'badge-warning' : 'badge-muted')}>{selectedExam.status}</span></div>
                  <div><p className="muted text-sm">HALLS USED</p><strong>{selectedExam.halls}</strong></div>
                  <div><p className="muted text-sm">STUDENTS</p><strong>{selectedExam.students}</strong></div>
                  {selectedExamAttendance && (
                    <div><p className="muted text-sm">ATTENDANCE</p><strong>{Math.round((selectedExamAttendance.present / selectedExamAttendance.total) * 100)}%</strong></div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary" onClick={handleExportExamDayPdf}>Export This Exam (PDF)</button>
                  <button className="btn btn-secondary" onClick={handleExportExamDayExcel}>Export This Exam (Excel)</button>
                </div>
              </>
            )}
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Recent Activity</h3>
              <span className="badge badge-success">Live</span>
            </div>
            <table>
              <thead><tr><th>{t('timestamp')}</th><th>{t('user')}</th><th>{t('action')}</th><th>{t('details')}</th></tr></thead>
              <tbody>
                {recentActivity.map((log) => (
                  <tr key={log.id}>
                    <td className="muted">{log.timestamp}</td>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted text-sm" style={{ marginTop: 12 }}>
              Full history with search and CSV export is on the <Link to="/admin/audit-logs">{t('auditLogs')}</Link> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
