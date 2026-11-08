import React, { useState } from 'react';
import Nutritions from './components/Nutritions';
import Workouts from './components/Workouts';
import Hydration from './components/Hydration';
import ProgressTracker from './components/ProgressTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState('nutrition');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-wider text-emerald-400">FITHUB</h1>
          <nav className="flex space-x-2">
            {['nutrition', 'workouts', 'hydration', 'progress'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main View Container */}
      <main className="py-6">
        {activeTab === 'nutrition' && <Nutritions />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'hydration' && <Hydration />}
        {activeTab === 'progress' && <ProgressTracker />}
      </main>
    </div>
  );
}