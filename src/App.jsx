import Dashboard from './components/Dashboard';

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
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
