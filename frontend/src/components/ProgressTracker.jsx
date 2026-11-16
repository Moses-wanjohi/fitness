import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

export default function ProgressTracker() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. Try loading from localStorage first for instant display
    const localLogs = localStorage.getItem('fithub_progress_logs');
    if (localLogs) {
      try {
        setLogs(JSON.parse(localLogs));
      } catch (e) {
        console.error('Failed to parse local progress logs');
      }
    }

    // 2. Fetch from backend API
    apiRequest('/progress/')
      .then((data) => {
        const fetchedLogs = Array.isArray(data) ? data : data.results || [];
        if (fetchedLogs.length > 0) {
          setLogs(fetchedLogs);
          localStorage.setItem('fithub_progress_logs', JSON.stringify(fetchedLogs));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend sync offline, using local storage:', err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) return;

    const newEntry = {
      id: Date.now(),
      weight: parseFloat(weight),
      notes: notes || 'Weight check-in',
      date: new Date().toISOString().split('T')[0],
    };

    const updatedLogs = [newEntry, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('fithub_progress_logs', JSON.stringify(updatedLogs));
    setWeight('');
    setNotes('');
    setMessage('Weight check-in recorded successfully!');
    setTimeout(() => setMessage(''), 3000);

    // Attempt backend sync
    apiRequest('/progress/', {
      method: 'POST',
      body: JSON.stringify({
        weight: newEntry.weight,
        notes: newEntry.notes,
        date: newEntry.date,
      }),
    }).catch(() => {
      // Silent catch for offline mode
    });
  };

  const handleDelete = (id) => {
    const updatedLogs = logs.filter((item) => item.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem('fithub_progress_logs', JSON.stringify(updatedLogs));

    // Attempt backend delete
    apiRequest(`/progress/${id}/`, {
      method: 'DELETE',
    }).catch(() => {
      // Silent catch for offline mode
    });
  };

  // Calculate stats
  const latestWeight = logs.length > 0 ? logs[0].weight : '--';
  const startingWeight = logs.length > 0 ? logs[logs.length - 1].weight : '--';
  const weightDiff =
    typeof latestWeight === 'number' && typeof startingWeight === 'number'
      ? (latestWeight - startingWeight).toFixed(1)
      : '0.0';

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Progress Tracker</h2>
      <p className="text-sm text-slate-400 mb-6">Monitor your body weight trends and milestones</p>

      {message && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Latest Weight</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{latestWeight} <span className="text-base font-normal text-slate-400">kg</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Change</span>
          <p className={`text-3xl font-black mt-1 ${Number(weightDiff) <= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
            {weightDiff > 0 ? `+${weightDiff}` : weightDiff} <span className="text-base font-normal text-slate-400">kg</span>
          </p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Check-ins</span>
          <p className="text-3xl font-black text-white mt-1">{logs.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weight Form */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Log Weight Check-In</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="75.5"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notes / Milestones</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Felt great during today's workout..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Record Weight
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Weight Log History</h3>
          {loading ? (
            <p className="text-slate-400">Loading progress logs...</p>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-medium">No weight entries logged yet.</p>
              <p className="text-xs mt-1">Record your first check-in using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {logs.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <span className="text-xs font-semibold text-emerald-400">{item.date}</span>
                    <p className="text-sm text-slate-300 mt-0.5">{item.notes || 'No notes added.'}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{item.weight} <span className="text-xs font-normal text-slate-400">kg</span></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
}