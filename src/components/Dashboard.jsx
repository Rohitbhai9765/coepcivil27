import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react';
import AttendanceTable from './AttendanceTable';
import StatisticsPanel from './StatisticsPanel';
import ViewerPanel from './ViewerPanel';
import logo from '../assets/logo.png';
import { subjects } from '../data/subjects';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer', 'stats', 'mark'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);
  const [authError, setAuthError] = useState('');

  const { isLoaded, isSignedIn, getToken } = useAuth();
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  useEffect(() => {
    async function fetchProfile() {
      if (isSignedIn) {
        try {
          setAuthError('');
          const token = await getToken();
          const API_URL = import.meta.env.VITE_API_URL || '';
          const res = await fetch(`${API_URL}/api/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          
          if (data.success) {
            setCurrentUser(data.user);
            
            // If professor, ensure the active subject is one of theirs
            if (data.user.role === 'professor' && data.user.subjectIds?.length > 0) {
              if (!data.user.subjectIds.includes(activeSubjectId)) {
                setActiveSubjectId(data.user.subjectIds[0]);
              }
            }
            setActiveTab('mark');
          } else {
            setAuthError(data.error || 'Failed to load user profile. Make sure your email is registered in the database.');
            setCurrentUser(null);
            setActiveTab('viewer');
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setAuthError('Network error connecting to backend.');
          setCurrentUser(null);
          setActiveTab('viewer');
        }
      } else {
        setCurrentUser(null);
        setActiveTab('viewer');
      }
    }
    
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, getToken]); // Note: activeSubjectId is intentionally omitted to avoid loops

  return (
    <div className="app-container">
      <header className="header" style={{ position: 'relative', minHeight: '150px' }}>
        <img src={logo} alt="COEP Civil 27" className="portal-logo" />
        <div className="admin-btn-container">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Login</button>
            </SignInButton>
          </SignedOut>
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

        {authError && (
          <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.9rem' }}>
            {authError}
          </div>
        )}
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
