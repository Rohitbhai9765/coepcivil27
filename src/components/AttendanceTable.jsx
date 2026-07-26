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
      
      <div className="table-container" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
        <table>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1, backdropFilter: 'blur(10px)' }}>
            <tr>
              <th>Sr No</th>
              <th>MIS</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {getStudentsForSubject(activeSubject.id).map((student) => {
              const misStr = String(student.mis);
              const firstPart = misStr.length > 2 ? misStr.slice(0, -2) : '';
              const lastTwo = misStr.length > 2 ? misStr.slice(-2) : misStr;
              const isPresent = attendance[student.mis] || false;
              
              return (
                <tr key={student.mis} style={{ opacity: !lectureConducted ? 0.6 : 1, background: isPresent ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                  <td>{student.srNo}</td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {firstPart}
                    <strong style={{ color: '#d32f2f', background: '#ffebee', padding: '0 2px', borderRadius: '3px' }}>
                      {lastTwo}
                    </strong>
                  </td>
                  <td style={{ fontWeight: 500 }}>{student.name}</td>
                  <td>
                    <label className="switch" style={{ margin: 0, transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                      <input 
                        type="checkbox" 
                        disabled={!lectureConducted}
                        checked={isPresent}
                        onChange={() => handleToggle(student.mis)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
