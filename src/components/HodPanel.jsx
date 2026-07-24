import { useState, useEffect, useRef } from 'react';
import { getStudentStatistics, getAttendanceRecords } from '../services/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, ChevronDown } from 'lucide-react';
import { generateStatisticsExcel } from '../utils/excelGenerator';

export default function HodPanel({ activeSubject }) {
  const [stats, setStats] = useState([]);
  const [conductedDates, setConductedDates] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStudentStatistics(activeSubject.id);
      setStats(data);
      const records = await getAttendanceRecords(activeSubject.id);
      const dates = Object.keys(records || {}).filter(date => records[date]?.lectureConducted === true).sort();
      setConductedDates(dates);
    };
    loadData();
  }, [activeSubject.id]);

  const totalClasses = stats.length > 0 ? stats[0].totalClasses : 0;
  const overallAvg = stats.length > 0 ? (stats.reduce((acc, curr) => acc + curr.percentage, 0) / stats.length).toFixed(2) : 0;

  const below75 = stats.filter(s => s.percentage < 75);
  const below50 = stats.filter(s => s.percentage < 50);
  const below25 = stats.filter(s => s.percentage < 25);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(`${activeSubject.title} - HOD Attendance Report`, 14, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Professor: ${activeSubject.professor}`, 14, 28);
    doc.text(`Total Classes Conducted: ${totalClasses}`, 14, 35);
    doc.text(`Class Average Attendance: ${overallAvg}%`, 14, 42);
    
    const tableData = stats.map(s => [
      s.srNo, 
      s.mis, 
      s.name, 
      s.classesAttended, 
      `${s.percentage}%`
    ]);

    autoTable(doc, {
      startY: 49,
      head: [['Sr No', 'MIS', 'Name', 'Classes Attended', 'Percentage']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [245, 124, 0] }, // HOD Orange color
      columnStyles: {
        0: { halign: 'center' }
      }
    });

    const idStr = activeSubject.id ? `_${activeSubject.id.toUpperCase()}` : '';
    doc.save(`HOD_Attendance_Report${idStr}.pdf`);
    setShowDropdown(false);
  };

  const generateExcel = () => {
    generateStatisticsExcel(stats, totalClasses, activeSubject.title, activeSubject.professor, activeSubject.id);
    setShowDropdown(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>HOD Overview - {activeSubject.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Professor: {activeSubject.professor}</p>
        </div>
        <div className="dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <button className="btn btn-primary" onClick={() => setShowDropdown(!showDropdown)}>
            <Download size={18} />
            Export HOD Report
            <ChevronDown size={18} />
          </button>
          {showDropdown && (
            <div className="dropdown-menu" style={{ 
              position: 'absolute', top: '100%', right: 0, 
              background: 'white', border: '1px solid #ccc', 
              borderRadius: '8px', zIndex: 10, marginTop: '0.5rem', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '170px',
              overflow: 'hidden'
            }}>
              <button 
                style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }} 
                onClick={generatePDF}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Export as PDF
              </button>
              <button 
                style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }} 
                onClick={generateExcel}
                onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Export as Excel
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Classes</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalClasses}</p>
          </div>
          <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Class Average</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{overallAvg}%</p>
          </div>
          <div style={{ background: '#fff3e0', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#e65100' }}>&lt; 75% Attendance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e65100' }}>{below75.length} Students</p>
          </div>
          <div style={{ background: '#ffebee', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#c62828' }}>&lt; 50% Attendance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>{below50.length} Students</p>
          </div>
          <div style={{ background: '#b71c1c', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'white' }}>&lt; 25% Attendance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{below25.length} Students</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.5rem' }}>Classes Conducted ({totalClasses})</h3>
        {conductedDates.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No classes conducted yet.</p>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {conductedDates.map(date => {
              const d = new Date(date);
              const formattedDate = !isNaN(d.getTime()) 
                ? d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
                : date;
              return (
                <span key={date} style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  {formattedDate}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#b71c1c', marginBottom: '1rem', borderBottom: '2px solid #ffcdd2', paddingBottom: '0.5rem' }}>Extreme Shortage (&lt; 25% Attendance)</h3>
        {below25.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No students with &lt; 25% attendance.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>MIS</th>
                  <th>Name</th>
                  <th>Attended</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {below25.map(student => (
                  <tr key={student.mis}>
                    <td>{student.mis}</td>
                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                    <td>{student.classesAttended} / {totalClasses}</td>
                    <td><span className="badge badge-red">{student.percentage}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#d32f2f', marginBottom: '1rem', borderBottom: '2px solid #ffcdd2', paddingBottom: '0.5rem' }}>Critical Shortage (&lt; 50% Attendance)</h3>
        {below50.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No students with &lt; 50% attendance.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>MIS</th>
                  <th>Name</th>
                  <th>Attended</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {below50.map(student => (
                  <tr key={student.mis}>
                    <td>{student.mis}</td>
                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                    <td>{student.classesAttended} / {totalClasses}</td>
                    <td><span className="badge badge-red">{student.percentage}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ color: '#f57c00', marginBottom: '1rem', borderBottom: '2px solid #ffe0b2', paddingBottom: '0.5rem' }}>Defaulters (&lt; 75% Attendance)</h3>
        {below75.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No students with &lt; 75% attendance.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>MIS</th>
                  <th>Name</th>
                  <th>Attended</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {below75.map(student => (
                  <tr key={student.mis}>
                    <td>{student.mis}</td>
                    <td style={{ fontWeight: 500 }}>{student.name}</td>
                    <td>{student.classesAttended} / {totalClasses}</td>
                    <td>
                      <span className={`badge ${student.percentage < 50 ? 'badge-red' : 'badge-yellow'}`}>
                        {student.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
