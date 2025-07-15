import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TradeModal from './components/TradeModal';

import './App.css';

// App Contexts
export const SupabaseContext = createContext();
export const AuthContext = createContext();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const backendApi = process.env.REACT_APP_BACKEND_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [showTrade, setShowTrade] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const currentSession = supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      if (listener) listener.subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <SupabaseContext.Provider value={supabase}>
      <AuthContext.Provider value={session}>
        <Router>
          <div className="app-root">
            {session && <Sidebar activeTheme={theme} toggleTheme={toggleTheme} onTradeClick={()=>setShowTrade(true)} />}
            <main className={session ? "main-content" : "main-auth"}>
              <Routes>
                <Route path="/auth" element={session ? <Navigate to="/" /> : <AuthPage />} />
                <Route path="/" element={session ? <Dashboard backendApi={backendApi} onTradeClick={() => setShowTrade(true)} /> : <Navigate to="/auth" />} />
                <Route path="/analytics" element={session ? <AnalyticsPage backendApi={backendApi}/> : <Navigate to="/auth" />} />
                <Route path="*" element={<Navigate to={session ? "/" : "/auth"} />} />
              </Routes>
              {showTrade && <TradeModal backendApi={backendApi} onClose={() => setShowTrade(false)} />}
            </main>
          </div>
        </Router>
      </AuthContext.Provider>
    </SupabaseContext.Provider>
  );
}

export default App;
