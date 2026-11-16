import React, { useState, useEffect } from 'react';

export default function Hydration() {
  const DAILY_GOAL_ML = 3000;
  const [currentIntake, setCurrentIntake] = useState(0);
  const [logs, setLogs] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. Load from localStorage first for instant display
    const savedLogs = localStorage.getItem('fithub_hydration_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        setLogs(parsed);
        const total = parsed.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0);
        setCurrentIntake(total);
      } catch (e) {
        console.error('Failed to parse hydration logs');
      }
    }

    // 2. Fetch from backend API
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/hydration/', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const fetchedLogs = Array.isArray(data) ? data : data.results || [];
          if (fetchedLogs.length > 0) {
            setLogs(fetchedLogs);
            const total = fetchedLogs.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0);
            setCurrentIntake(total);
            localStorage.setItem('fithub_hydration_logs', JSON.stringify(fetchedLogs));
          }
        }
      })
      .catch(() => {
        // Fallback handled by localStorage
      });
  }, []);

  const addWater = (amount) => {
    const newEntry = {
      id: Date.now(),
      amount_ml: Number(amount),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedLogs = [newEntry, ...logs];
    const newTotal = currentIntake + Number(amount);

    setLogs(updatedLogs);
    setCurrentIntake(newTotal);
    localStorage.setItem('fithub_hydration_logs', JSON.stringify(updatedLogs));

    setMessage(`Added ${amount} ml of water!`);
    setTimeout(() => setMessage(''), 3000);

    // Sync with backend
    const token = localStorage.getItem('access_token');
    fetch('http://127.0.0.1:8000/api/hydration/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ amount_ml: amount }),
    }).catch((err) => console.error('Backend sync pending:', err));
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customAmount || Number(customAmount) <= 0) return;
    addWater(customAmount);
    setCustomAmount('');
  };

  const handleDelete = (id, amount) => {
    const updatedLogs = logs.filter((item) => item.id !== id);
    const newTotal = Math.max(0, currentIntake - amount);

    setLogs(updatedLogs);
    setCurrentIntake(newTotal);
    localStorage.setItem('fithub_hydration_logs', JSON.stringify(updatedLogs));

    const token = localStorage.getItem('access_token');
    fetch(`http://127.0.0.1:8000/api/hydration/${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).catch(() => {});
  };

  const percentage = Math.min(100, Math.round((currentIntake / DAILY_GOAL_ML) * 100));

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Hydration Tracker</h2>
      <p className="text-sm text-slate-400 mb-6">Track your daily water intake and stay energized</p>

      {message && (
        <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      {/* Main Progress Card */}
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow text-center mb-8">
        <p className="text-slate-400 mb-2">Daily Progress</p>
        <div className="text-5xl font-extrabold text-cyan-400 mb-4">
          {(currentIntake / 1000).toFixed(1)} / {(DAILY_GOAL_ML / 1000).toFixed(1)}{' '}
          <span className="text-2xl font-normal text-slate-400">L</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-6 mb-6 overflow-hidden border border-slate-700 p-1">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-cyan-300 font-medium mb-6">{percentage}% of daily goal completed</p>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => addWater(250)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition shadow"
          >
            +250 ml (Glass)
          </button>
          <button
            onClick={() => addWater(500)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition shadow"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={() => addWater(750)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition shadow"
          >
            +750 ml (Large Bottle)
          </button>
        </div>

        {/* Custom Amount Form */}
        <form onSubmit={handleCustomSubmit} className="max-w-md mx-auto flex gap-3">
          <input
            type="number"
            placeholder="Custom amount in ml..."
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 text-sm"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm"
          >
            Add
          </button>
        </form>
      </div>

      {/* Hydration Log History */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
        <h3 className="text-xl font-semibold mb-4 text-slate-200">Today's Hydration Log</h3>
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No water intake logged yet today.</p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {logs.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold text-cyan-400">Water Intake</span>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time || 'Logged today'}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-white">+{item.amount_ml} ml</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.amount_ml)}
                    className="text-slate-500 hover:text-red-400 p-2 transition rounded-lg hover:bg-slate-800"
                    title="Delete entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}