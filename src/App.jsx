import { useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { ClerkProvider } from '@clerk/clerk-react';
import { syncOfflineData } from './services/db';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  useEffect(() => {
    // Attempt sync on load
    syncOfflineData();
    
    // Attempt sync when coming back online
    const handleOnline = () => {
      console.log('App is online, attempting sync...');
      syncOfflineData();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
  if (!PUBLISHABLE_KEY) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-main)' }}>
        <h2>Missing Clerk Publishable Key</h2>
        <p>Please add VITE_CLERK_PUBLISHABLE_KEY to your frontend .env file.</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Dashboard />
    </ClerkProvider>
  );
}

export default App;
