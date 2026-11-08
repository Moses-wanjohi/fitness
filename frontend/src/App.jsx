import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import Nutritions from './components/Nutritions';
import Workouts from './components/Workouts';
import Hydration from './components/Hydration';
import ProgressTracker from './components/ProgressTracker';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const navItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'progress', label: 'Progress' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      {/* Vertical Left Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/60 flex flex-col justify-between p-6 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-emerald-400 mb-8">FITHUB</h1>
          <nav className="space-y-2">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
          <div className="text-xs text-slate-500 px-1">
            FitHub Dashboard v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        <div className="max-w-6xl mx-auto py-8">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'nutrition' && <Nutritions />}
          {activeTab === 'workouts' && <Workouts />}
          {activeTab === 'hydration' && <Hydration />}
          {activeTab === 'progress' && <ProgressTracker />}
        </div>
      </main>
    </div>
  );
}