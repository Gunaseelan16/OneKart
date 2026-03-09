import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-black/5">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Required</h1>
        <p className="text-gray-600 mb-8">
          To use authentication features, please set the <code className="bg-gray-100 px-2 py-1 rounded text-emerald-600 font-mono text-sm">VITE_CLERK_PUBLISHABLE_KEY</code> environment variable in your project settings.
        </p>
        <div className="text-sm text-gray-400">
          You can find this key in your <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Clerk Dashboard</a>.
        </div>
      </div>
    </div>
  );
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}
