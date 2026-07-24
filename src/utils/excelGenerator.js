import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const generateDailyExcel = async (date, presentStudents, studentsData, subjectTitle, professorName, subjectId) => {
  const d = new Date(date);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayStr = days[d.getDay()];
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const formattedDate = `${weekdayStr}, ${dd}/${mm}/${yy}`;

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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');

  worksheet.columns = [
    { key: 'srNo', width: 10 },
    { key: 'mis', width: 20 },
    { key: 'name', width: 40 },
    { key: 'status', width: 15 }
  ];

  // Title Row (Row 1)
  const titleRow = worksheet.addRow([subjectTitle || 'Attendance Report']);
  worksheet.mergeCells('A1:D1');
  titleRow.font = { name: 'Arial', size: 16, bold: true };
  titleRow.alignment = { horizontal: 'center' };

  // Subtitle Row (Row 2)
  const subRow = worksheet.addRow([`Professor: ${professorName || 'Unknown'}`, '', `Date: ${formattedDate}`, '']);
  worksheet.mergeCells('A2:B2');
  worksheet.mergeCells('C2:D2');
  subRow.font = { name: 'Arial', size: 12, bold: true };
  subRow.getCell(3).alignment = { horizontal: 'right' };

  // Summary Row (Row 3)
  const totalSt = studentsData.length;
  const presSt = presentStudents.length;
  const absSt = totalSt - presSt;
  const summaryRow = worksheet.addRow([`Total Students: ${totalSt}`, '', `Present: ${presSt}`, `Absent: ${absSt}`]);
  worksheet.mergeCells('A3:B3');
  summaryRow.font = { name: 'Arial', size: 11, bold: true };
  summaryRow.getCell(3).alignment = { horizontal: 'center' };
  summaryRow.getCell(4).alignment = { horizontal: 'right' };

  // Empty Row
  worksheet.addRow([]);

  // Attendance Title Row (Row 4)
  const attTitleRow = worksheet.addRow([attendanceTitle]);
  worksheet.mergeCells('A4:D4');
  attTitleRow.font = { name: 'Arial', size: 14, bold: true };
  attTitleRow.alignment = { horizontal: 'center' };

  // Empty Row
  worksheet.addRow([]);

  // Headers (Row 6)
  const headerRow = worksheet.addRow(['Sr. No.', 'MIS', 'Name of Student', 'Status']);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
  });

  // Data
  let count = 1;
  studentsData.forEach(student => {
    const isPresent = presentStudents.includes(student.mis);
    const row = worksheet.addRow([
      count++,
      student.mis,
      student.name,
      isPresent ? 'Present' : 'Absent'
    ]);
    
    row.eachCell((cell, colNumber) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (colNumber === 1 || colNumber === 4) {
        cell.alignment = { horizontal: 'center' };
      }
      if (colNumber === 4) {
        if (cell.value === 'Present') {
          cell.font = { color: { argb: 'FF008000' }, bold: true };
        } else if (cell.value === 'Absent') {
          cell.font = { color: { argb: 'FFFF0000' }, bold: true };
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const idStr = subjectId ? `_${subjectId.toUpperCase()}` : '';
  saveAs(new Blob([buffer]), `Attendance_${date}${idStr}.xlsx`);
};

export const generateStatisticsExcel = async (stats, totalClasses, subjectTitle, professorName, subjectId) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Statistics');

  worksheet.columns = [
    { key: 'srNo', width: 10 },
    { key: 'mis', width: 20 },
    { key: 'name', width: 40 },
    { key: 'attended', width: 20 },
    { key: 'percentage', width: 15 }
  ];

  // Title Row (Row 1)
  const titleRow = worksheet.addRow([`${subjectTitle || 'Subject'} - Attendance Report`]);
  worksheet.mergeCells('A1:E1');
  titleRow.font = { name: 'Arial', size: 16, bold: true };
  titleRow.alignment = { horizontal: 'center' };

  // Subtitle Row (Row 2)
  const subRow = worksheet.addRow([`Professor: ${professorName || 'Unknown'}`]);
  worksheet.mergeCells('A2:E2');
  subRow.font = { name: 'Arial', size: 12, bold: true };

  // Total Classes Row (Row 3)
  const totalRow = worksheet.addRow([`Total Classes Conducted: ${totalClasses}`]);
  worksheet.mergeCells('A3:E3');
  totalRow.font = { name: 'Arial', size: 12, bold: true };

  // Empty Row
  worksheet.addRow([]);

  // Headers (Row 5)
  const headerRow = worksheet.addRow(['Sr No', 'MIS', 'Name', 'Classes Attended', 'Percentage']);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };
  headerRow.eachCell((cell) => {
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
  });

  stats.forEach(s => {
    const row = worksheet.addRow([
      s.srNo,
      s.mis,
      s.name,
      s.classesAttended,
      `${s.percentage}%`
    ]);
    
    row.eachCell((cell, colNumber) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (colNumber === 1 || colNumber === 4 || colNumber === 5) {
        cell.alignment = { horizontal: 'center' };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const idStr = subjectId ? `_${subjectId.toUpperCase()}` : '';
  saveAs(new Blob([buffer]), `Attendance_Report${idStr}.xlsx`);
};
