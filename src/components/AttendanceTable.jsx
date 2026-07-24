import { useState, useEffect } from 'react';
import { getStudentsForSubject } from '../data/studentsData';
import { getAttendanceRecords, saveAttendance } from '../services/db';

export default function AttendanceTable({ activeSubject }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [lectureConducted, setLectureConducted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const records = await getAttendanceRecords(activeSubject.id);
      const todaysRecord = records[date]?.presentStudents || [];
      const isConducted = records[date]?.lectureConducted ?? false;
      
      const initialAttendance = {};
      const currentStudents = getStudentsForSubject(activeSubject.id);
      currentStudents.forEach(student => {
        initialAttendance[student.mis] = todaysRecord.includes(student.mis);
      });
      setAttendance(initialAttendance);
      setLectureConducted(isConducted);
    };
    loadData();
  }, [date, activeSubject.id]);

  const handleToggle = (mis) => {
    if (!lectureConducted) return;
    const updated = {
      ...attendance,
      [mis]: !attendance[mis]
    };
    setAttendance(updated);
    
    // Save to DB
    const presentStudents = Object.keys(updated).filter(k => updated[k]);
    saveAttendance(date, activeSubject.id, presentStudents, lectureConducted);
  };

  const markAll = (present) => {
    if (!lectureConducted) return;
    const updated = {};
    const currentStudents = getStudentsForSubject(activeSubject.id);
    currentStudents.forEach(s => {
      updated[s.mis] = present;
    });
    setAttendance(updated);
    const presentStudents = present ? currentStudents.map(s => s.mis) : [];
    saveAttendance(date, activeSubject.id, presentStudents, lectureConducted);
  };

  const handleLectureToggle = () => {
    const newStatus = !lectureConducted;
    setLectureConducted(newStatus);
    const presentStudents = Object.keys(attendance).filter(k => attendance[k]);
    saveAttendance(date, activeSubject.id, presentStudents, newStatus);
  };

  return (
    <div className="glass-panel">
      <div className="toolbar">
        <div className="toolbar-item" style={{ flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '1rem', fontWeight: '500' }}>Date:</label>
            <input 
              type="date" 
              className="date-picker"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: lectureConducted ? 'inherit' : 'var(--text-light)' }}>Lecture Conducted:</label>
            <label className="switch" style={{ margin: 0 }}>
              <input 
                type="checkbox" 
                checked={lectureConducted}
                onChange={handleLectureToggle}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        <div className="toolbar-item">
          <button className="btn btn-outline" disabled={!lectureConducted} style={{ opacity: lectureConducted ? 1 : 0.5, flex: 1 }} onClick={() => markAll(true)}>Mark All Present</button>
          <button className="btn btn-outline" disabled={!lectureConducted} style={{ opacity: lectureConducted ? 1 : 0.5, flex: 1 }} onClick={() => markAll(false)}>Clear All</button>
        </div>
      </div>
      
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', 
          gap: '0.5rem', 
          maxHeight: 'calc(100vh - 280px)', 
          overflowY: 'auto', 
          paddingRight: '0.25rem',
          alignContent: 'start'
        }}
      >
        {getStudentsForSubject(activeSubject.id).map((student) => {
          const misStr = String(student.mis);
          const firstPart = misStr.length > 2 ? misStr.slice(0, -2) : '';
          const lastTwo = misStr.length > 2 ? misStr.slice(-2) : misStr;
          const isPresent = attendance[student.mis] || false;
          
          return (
            <div 
              key={student.mis} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '0.5rem 0.75rem', 
                border: `1px solid ${isPresent ? 'var(--success)' : 'var(--surface-border)'}`, 
                borderRadius: '8px', 
                background: isPresent ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface)',
                opacity: !lectureConducted ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: '1.25rem' }}>{student.srNo}.</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {firstPart}
                  <strong style={{ color: '#d32f2f', fontSize: '0.95rem', background: '#ffebee', padding: '0 2px', borderRadius: '3px' }}>
                    {lastTwo}
                  </strong>
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }} title={student.name}>
                  {student.name}
                </span>
              </div>
              <label className="switch" style={{ margin: 0, transform: 'scale(0.8)', transformOrigin: 'right center' }}>
                <input 
                  type="checkbox" 
                  disabled={!lectureConducted}
                  checked={isPresent}
                  onChange={() => handleToggle(student.mis)}
                />
                <span className="slider"></span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
