import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardOverview from './components/DashboardOverview';
import Nutritions from './components/Nutritions';
import Workouts from './components/Workouts';
import Hydration from './components/Hydration';
import ProgressTracker from './components/ProgressTracker';
import Profile from './components/profile';
import LandingPage from './components/LandingPage';

// 1. Your existing sidebar & dashboard view moved into its own component
function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'hydration', label: 'Hydration' },
    { id: 'progress', label: 'Progress' },
    { id: 'profile', label: 'Profile' },
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
        <div className="text-xs text-slate-500 pt-4 border-t border-slate-800">
          FitHub Dashboard v1.0
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
          {activeTab === 'profile' && <Profile />}
        </div>
      </main>
    </div>
  );
}

// 2. Main App component handling the routes
export default function App() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  return (
    <BrowserRouter>
      <Routes>
        {/* Visiting localhost:5173/ shows LandingPage (unless already logged in) */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        
        {/* Visiting localhost:5173/dashboard shows your sidebar & tabs */}
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}