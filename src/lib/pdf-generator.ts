import jsPDF from 'jspdf';
import { Appointment, Prescription, TestReport, Invoice } from './types';

export function downloadAppointmentTicketPDF(apt: Appointment) {
  const doc = new jsPDF();

  // Header banner
  doc.setFillColor(13, 148, 136); // Teal #0D9488
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CAREPLUS MEDICAL CENTER', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Smart Healthcare & Diagnostic Center | Hotline: 10666 / 09666-700700', 14, 26);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL APPOINTMENT TICKET', 14, 46);

  // Ticket Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, 182, 100, 3, 3, 'FD');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(`Ticket No: ${apt.appointmentNo}`, 22, 64);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Booking Date: ${new Date(apt.createdAt).toLocaleDateString()}`, 130, 64);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(22, 70, 188, 70);

  // Details Grid
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Patient Name:', 22, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(apt.patientName, 60, 80);

  doc.setFont('helvetica', 'bold');
  doc.text('Phone Number:', 22, 90);
  doc.setFont('helvetica', 'normal');
  doc.text(apt.patientPhone, 60, 90);

  doc.setFont('helvetica', 'bold');
  doc.text('Assigned Doctor:', 22, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`${apt.doctorName} (${apt.doctorTitle})`, 60, 100);

  doc.setFont('helvetica', 'bold');
  doc.text('Department:', 22, 110);
  doc.setFont('helvetica', 'normal');
  doc.text(apt.departmentName, 60, 110);

  doc.setFont('helvetica', 'bold');
  doc.text('Date & Time Slot:', 22, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(`${apt.date} at ${apt.timeSlot}`, 60, 120);

  doc.setFont('helvetica', 'bold');
  doc.text('Consultation Fee:', 22, 130);
  doc.setFont('helvetica', 'normal');
  doc.text(`BDT ${apt.fee} (${apt.paymentStatus.toUpperCase()} via ${apt.paymentMethod || 'bKash'})`, 60, 130);

  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 22, 140);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text(apt.status.toUpperCase(), 60, 140);

  // Important Instructions
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Important Instructions:', 14, 164);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('1. Please arrive at least 15 minutes prior to your scheduled time slot.', 14, 172);
  doc.text('2. Bring your previous prescriptions and test reports if available.', 14, 178);
  doc.text('3. Show this appointment ticket at the reception desk for fast-track entry.', 14, 184);

  // Footer Signature Line
  doc.line(14, 260, 196, 260);
  doc.setFontSize(8);
  doc.text('CarePlus Smart Hospital Management System | Automatically Generated Official Document', 14, 266);

  doc.save(`CarePlus_Appointment_${apt.appointmentNo}.pdf`);
}

export function downloadPrescriptionPDF(pres: Prescription) {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(15, 118, 110); // Dark Teal
  doc.rect(0, 0, 210, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CAREPLUS MEDICAL CENTER', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('House 12, Road 5, Dhanmondi, Dhaka-1205 | Helpline: 10666', 14, 24);

  // Doctor Info Box (Top Right)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(pres.doctorName, 14, 44);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${pres.doctorQualifications} | BMDC Reg No: ${pres.doctorBmdcNo}`, 14, 50);

  doc.line(14, 54, 196, 54);

  // Patient Info Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 58, 182, 14, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Patient: ${pres.patientName}`, 18, 67);
  doc.text(`Age/Gender: ${pres.patientAge} Yrs / ${pres.patientGender}`, 90, 67);
  doc.text(`Date: ${pres.date}`, 155, 67);

  // Diagnosis
  let y = 80;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('DIAGNOSIS:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(pres.diagnosis, 45, y);

  y += 12;

  // Rx Symbol
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('Rx', 14, y);

  y += 8;

  // Medicines Table
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(15, 23, 42);
  doc.text('Medicine Name', 18, y + 6);
  doc.text('Dose (M-A-N)', 100, y + 6);
  doc.text('Timing', 140, y + 6);
  doc.text('Duration', 170, y + 6);

  y += 12;
  doc.setFont('helvetica', 'normal');
  pres.medicines.forEach((med, idx) => {
    doc.text(`${idx + 1}. ${med.name}`, 18, y);
    doc.text(med.dosage, 100, y);
    doc.text(med.timing, 140, y);
    doc.text(`${med.durationDays} Days`, 170, y);
    y += 8;
  });

  y += 6;
  doc.line(14, y, 196, y);
  y += 8;

  // Advised Tests
  if (pres.advisedTests.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text('ADVISED INVESTIGATIONS / TESTS:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    pres.advisedTests.forEach((test) => {
      doc.text(`• ${test}`, 18, y);
      y += 6;
    });
    y += 4;
  }

  // General Advice
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('SPECIAL ADVICE & INSTRUCTIONS:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(pres.generalAdvice, 18, y);

  if (pres.followUpDate) {
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Follow Up Date: ${pres.followUpDate}`, 14, y);
  }

  // Doctor Digital Signature Placeholder
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Doctor Digital Signature', 140, 255);
  doc.line(135, 250, 190, 250);
  doc.setFont('helvetica', 'normal');
  doc.text(pres.doctorName, 140, 260);

  doc.save(`CarePlus_Prescription_${pres.prescriptionNo}.pdf`);
}

export function downloadTestReportPDF(report: TestReport) {
  const doc = new jsPDF();

  // Banner
  doc.setFillColor(2, 132, 199); // Sky Blue #0284C7
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CAREPLUS CENTRAL DIAGNOSTIC LAB', 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Automated BioLab & Radiology Center | ISO 15189 Certified', 14, 26);

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`LABORATORY TEST REPORT: ${report.testName.toUpperCase()}`, 14, 46);

  // Info Grid
  doc.setFontSize(9);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, 52, 182, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(report.patientName, 45, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Uploaded By:', 18, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(report.uploadedBy, 45, 68);

  doc.setFont('helvetica', 'bold');
  doc.text('Report Date:', 120, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(report.uploadedAt, 145, 60);

  // Summary
  let y = 84;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('CLINICAL FINDINGS SUMMARY:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(report.summary, 14, y);

  y += 12;

  // Table Header
  doc.setFillColor(224, 242, 254);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Test Parameter', 18, y + 6);
  doc.text('Result Value', 85, y + 6);
  doc.text('Unit', 125, y + 6);
  doc.text('Reference Range', 155, y + 6);

  y += 12;
  report.metrics.forEach((m) => {
    doc.setFont('helvetica', 'bold');
    doc.text(m.parameter, 18, y);
    doc.setFont('helvetica', m.status === 'abnormal' ? 'bold' : 'normal');
    if (m.status === 'abnormal') doc.setTextColor(225, 29, 72); // Red for abnormal
    else doc.setTextColor(15, 23, 42);

    doc.text(`${m.value} ${m.status === 'abnormal' ? '(!)' : ''}`, 85, y);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(m.unit, 125, y);
    doc.text(m.referenceRange, 155, y);
    y += 8;
  });

  if (report.notes) {
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('LAB TECHNICIAN NOTES:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(report.notes, 14, y);
  }

  // Footer signature
  doc.line(14, 260, 196, 260);
  doc.setFontSize(8);
  doc.text('Electronically Verified by CarePlus Diagnostic Laboratory Information System (LIS)', 14, 266);

  doc.save(`CarePlus_Report_${report.testName.replace(/\s+/g, '_')}.pdf`);
}
