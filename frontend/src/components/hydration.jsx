import React, { useState, useEffect } from 'react';

export default function Hydration() {
  const DAILY_GOAL_ML = 3000;
  const [currentIntake, setCurrentIntake] = useState(0);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hydration/')
      .then((res) => res.json())
      .then((data) => {
        const total = Array.isArray(data)
          ? data.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0)
          : data.total_ml || 0;
        setCurrentIntake(total);
      })
      .catch(() => setCurrentIntake(0));
  }, []);

  const addWater = (amount) => {
    const newTotal = currentIntake + amount;
    setCurrentIntake(newTotal);

    fetch('http://127.0.0.1:8000/api/hydration/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_ml: amount }),
    }).catch((err) => console.error('Failed to log water intake:', err));
  };

  const percentage = Math.min(100, Math.round((currentIntake / DAILY_GOAL_ML) * 100));

  return (
    <div className="p-6 max-w-4xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400">Hydration Tracker</h2>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow text-center">
        <p className="text-slate-400 mb-2">Daily Progress</p>
        <div className="text-5xl font-extrabold text-cyan-400 mb-4">
          {(currentIntake / 1000).toFixed(1)} / {(DAILY_GOAL_ML / 1000).toFixed(1)} <span className="text-2xl font-normal text-slate-400">L</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-6 mb-6 overflow-hidden border border-slate-700 p-1">
          <div
            className="bg-cyan-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-cyan-300 font-medium mb-8">{percentage}% of daily goal completed</p>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => addWater(250)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition"
          >
            +250 ml (Glass)
          </button>
          <button
            onClick={() => addWater(500)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={() => addWater(750)}
            className="bg-slate-900 hover:bg-slate-700 border border-cyan-500/40 text-cyan-400 font-semibold px-6 py-3 rounded-xl transition"
          >
            +750 ml (Large Bottle)
          </button>
        </div>
      </div>
    </div>
  );
}