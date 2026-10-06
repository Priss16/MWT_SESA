import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a real PDF hall ticket for the given exam
 * details. Used by both HallSlip.jsx (single ticket view) and
 * DownloadHallSlip.jsx (list of tickets), so the layout only lives
 * in one place.
 */
export function generateHallSlipPdf({
  studentName = 'Priss S.',
  regNo = '7124102CS117',
  department = 'Computer Science & Engineering',
  semester = 'V',
  subject = 'Data Structures (CS301)',
  dateTime = '25 Jul 2026 · 10:00 AM',
  hall = 'Block A · Hall 104',
  seat = 'B7',
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const primary = '#1E3A8A';
  const muted = '#6B7280';
  const marginX = 56;
  let y = 64;

  // Top ribbon
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 595, 8, 'F');

  doc.setTextColor(muted);
  doc.setFontSize(10);
  doc.text('EXAMINATION HALL TICKET', marginX, y);

  y += 24;
  doc.setTextColor('#1F2937');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('National Engineering College, Kovilpatti', marginX, y);

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(muted);
  doc.text('Semester Examinations · July 2026', marginX, y);

  y += 28;
  doc.setDrawColor(229, 231, 235);
  doc.line(marginX, y, 595 - marginX, y);
  y += 28;

  function row(label1, value1, label2, value2) {
    doc.setFontSize(9);
    doc.setTextColor(muted);
    doc.text(label1, marginX, y);
    doc.text(label2, marginX + 260, y);
    y += 16;
    doc.setFontSize(12);
    doc.setTextColor('#1F2937');
    doc.setFont('helvetica', 'bold');
    doc.text(String(value1), marginX, y);
    doc.text(String(value2), marginX + 260, y);
    doc.setFont('helvetica', 'normal');
    y += 26;
  }

  row('STUDENT NAME', studentName, 'REGISTER NUMBER', regNo);
  row('DEPARTMENT', department, 'SEMESTER', semester);

  doc.setDrawColor(229, 231, 235);
  doc.line(marginX, y, 595 - marginX, y);
  y += 28;

  row('SUBJECT', subject, 'DATE & TIME', dateTime);
  row('EXAMINATION HALL', hall, 'SEAT NUMBER', seat);

  y += 12;
  doc.setDrawColor(229, 231, 235);
  doc.setLineDashPattern([3, 3], 0);
  doc.line(marginX, y, 595 - marginX, y);
  doc.setLineDashPattern([], 0);
  y += 32;

  doc.setFontSize(9);
  doc.setTextColor(muted);
  doc.text('INSTRUCTIONS', marginX, y);
  y += 16;
  doc.setFontSize(10);
  doc.text('1. Carry this hall ticket and your college ID card at all times.', marginX, y);
  y += 16;
  doc.text('2. Report to the hall 30 minutes before the scheduled time.', marginX, y);
  y += 16;
  doc.text('3. Electronic devices are not permitted inside the hall.', marginX, y);

  y += 30;
  doc.setFontSize(9);
  doc.text(`Slip ID: SESA-${subject.match(/\(([^)]+)\)/)?.[1] || 'EXAM'}-${regNo}`, marginX, y);

  const safeSubject = subject.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  doc.save(`hall-slip-${safeSubject}.pdf`);
}
