import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDailyPDF = (dateStr, presentStudents, studentsData, subjectTitle, professorName, subjectId) => {
  const doc = new jsPDF();

  // Header: Subject Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const title = subjectTitle || "Attendance Report";
  const titleWidth = doc.getTextWidth(title);
  const xTitle = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.text(title, xTitle, 25);

  // Custom Underline
  doc.setLineWidth(0.5);
  doc.line(xTitle, 27, xTitle + titleWidth, 27);
  doc.line(xTitle, 28, xTitle + titleWidth, 28); // double underline

  // Subheaders
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Professor: ${professorName || 'Unknown'}`, 20, 40);

  doc.setFont("helvetica", "normal");

  const d = new Date(dateStr);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayStr = days[d.getDay()];
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const formattedDateRight = `${weekdayStr}, ${dd}/${mm}/${yy}`;

  const dateStrWidth = doc.getTextWidth(formattedDateRight);
  doc.text(formattedDateRight, doc.internal.pageSize.width - 20 - dateStrWidth, 46);

  // Summary counts
  const totalSt = studentsData.length;
  const presSt = presentStudents.length;
  const absSt = totalSt - presSt;
  doc.setFont("helvetica", "bold");
  doc.text(`Total: ${totalSt}   Present: ${presSt}   Absent: ${absSt}`, 20, 48);

  // Horizontal line
  doc.setLineWidth(0.5);
  doc.line(15, 54, doc.internal.pageSize.width - 15, 54);

  // Title
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const suffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };
  const dayStr = d.getDate() + suffix(d.getDate());
  const monthStr = months[d.getMonth()];
  const fullYear = d.getFullYear();
  const attendanceTitle = `ATTENDANCE: ${weekdayStr}, ${dayStr} ${monthStr} ${fullYear}`;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const attTitleWidth = doc.getTextWidth(attendanceTitle);
  const xAtt = (doc.internal.pageSize.width - attTitleWidth) / 2;
  doc.text(attendanceTitle, xAtt, 69);

  // Table Data
  const tableData = [];
  let count = 1;
  studentsData.forEach(student => {
    if (presentStudents.includes(student.mis)) {
      tableData.push([count, student.mis, student.name]);
      count++;
    }
  });

  autoTable(doc, {
    startY: 79,
    head: [['Sr. No.', 'MIS', 'Name']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'normal',
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
      fontSize: 14
    },
    bodyStyles: {
      lineWidth: 0.5,
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0],
      fontSize: 12
    },
    columnStyles: {
      0: { halign: 'center' }
    },
    margin: { left: 30, right: 30 }
  });

  const idStr = subjectId ? `_${subjectId.toUpperCase()}` : '';
  doc.save(`Attendance_${dateStr}${idStr}.pdf`);
};
