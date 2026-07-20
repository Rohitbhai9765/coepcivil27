import { useState } from 'react';
import AttendanceTable from './AttendanceTable';
import StatisticsPanel from './StatisticsPanel';
import ViewerPanel from './ViewerPanel';
import LoginModal from './LoginModal';
import logo from '../assets/logo.png';
import { subjects } from '../data/subjects';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer', 'stats', 'mark'
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);

  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  const handleLogin = (token, user) => {
    setCurrentUser(user);
    setShowLogin(false);
    
    // If professor, ensure the active subject is one of theirs
    if (user.role === 'professor' && user.subjectIds && user.subjectIds.length > 0) {
      if (!user.subjectIds.includes(activeSubjectId)) {
        setActiveSubjectId(user.subjectIds[0]);
      }
    }
    
    setActiveTab('mark');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('viewer');
  };

  if (showLogin) {
    return (
      <div className="app-container">
        <header className="header" style={{ position: 'relative' }}>
          <img src={logo} alt="COEP Civil 27" className="portal-logo" />
          <h1>Attendance System</h1>
          <p>{activeSubject.title}</p>
        </header>
        <LoginModal onLogin={handleLogin} />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setShowLogin(false)}>Back to Viewer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header" style={{ position: 'relative' }}>
        <img src={logo} alt="COEP Civil 27" className="portal-logo" />
        <div className="admin-btn-container">
          {currentUser ? (
            <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
          ) : (
            <button className="btn btn-outline" onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
        <h1>Attendance System</h1>
        
        <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
          <select 
            value={activeSubjectId} 
            onChange={(e) => setActiveSubjectId(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', maxWidth: '100%' }}
          >
            {subjects
              .filter(s => {
                if (currentUser && currentUser.role === 'professor') {
                  return currentUser.subjectIds.includes(s.id);
                }
                return true; // Show all for master_admin, cr, lr, and guests
              })
              .map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))
            }
          </select>
        </div>
        
        <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
          Professor: {activeSubject.professor}
        </p>
      </header>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'viewer' ? 'active' : ''}`}
          onClick={() => setActiveTab('viewer')}
        >
          Daily Records
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        {currentUser && (
          <button 
            className={`tab-btn ${activeTab === 'mark' ? 'active' : ''}`}
            onClick={() => setActiveTab('mark')}
          >
            Mark Attendance
          </button>
        )}
      </div>

      <main>
        {activeTab === 'viewer' && <ViewerPanel activeSubject={activeSubject} />}
        {activeTab === 'stats' && <StatisticsPanel activeSubject={activeSubject} />}
        {activeTab === 'mark' && currentUser && <AttendanceTable activeSubject={activeSubject} />}
      </main>
    </div>
  );
}
