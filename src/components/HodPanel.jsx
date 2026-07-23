import { useState, useEffect } from 'react';
import { getStudentStatistics } from '../services/db';

export default function HodPanel({ activeSubject }) {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStudentStatistics(activeSubject.id);
      setStats(data);
    };
    loadData();
  }, [activeSubject.id]);

  const totalClasses = stats.length > 0 ? stats[0].totalClasses : 0;
  const overallAvg = stats.length > 0 ? (stats.reduce((acc, curr) => acc + curr.percentage, 0) / stats.length).toFixed(2) : 0;

  const below75 = stats.filter(s => s.percentage < 75);
  const below50 = stats.filter(s => s.percentage < 50);
  const below25 = stats.filter(s => s.percentage < 25);

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>HOD Overview - {activeSubject.title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>Professor: {activeSubject.professor}</p>
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
