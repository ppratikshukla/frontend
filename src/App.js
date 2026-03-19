import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [activePage, setActivePage] = useState('dashboard');
  const [historySubject, setHistorySubject] = useState(null);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login'
      ? <LoginPage onSwitch={() => setAuthMode('register')} />
      : <RegisterPage onSwitch={() => setAuthMode('login')} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onPageChange={setActivePage} />;
      case 'subjects': return (
        <SubjectsPage
          onViewHistory={(subject) => {
            setHistorySubject(subject);
            setActivePage('history');
          }}
        />
      );
      case 'history': return <HistoryPage initialSubject={historySubject} onClearInitial={() => setHistorySubject(null)} />;
      case 'about': return <AboutPage />;
      default: return <Dashboard onPageChange={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onPageChange={(p) => { setHistorySubject(null); setActivePage(p); }} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1e2340',
          color: '#e8eaf6',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        duration: 3000,
      }}
    />
    <AppContent />
  </AuthProvider>
);

export default App;
