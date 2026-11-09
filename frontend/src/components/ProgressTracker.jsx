import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

export default function ProgressTracker() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/progress/')
      .then((data) => {
        setLogs(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      weight: parseFloat(weight),
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    apiRequest('/progress/', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
      .then((data) => {
        setLogs([data, ...logs]);
        setWeight('');
        setNotes('');
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    apiRequest(`/progress/${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setLogs(logs.filter((item) => item.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400">Progress Tracker</h2>

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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="75.5"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Notes / Milestones</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Felt great during today's run..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
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
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : logs.length === 0 ? (
            <p className="text-slate-400">No weight entries logged yet.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {logs.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <span className="text-xs text-slate-400">{item.date}</span>
                    <p className="text-sm text-slate-300 mt-0.5">{item.notes || 'No notes added.'}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-400">{item.weight} kg</span>
                    </div>
                    <button
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