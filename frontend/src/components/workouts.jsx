import React, { useState, useEffect } from 'react';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strength');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  useEffect(() => {
    // 1. Load from localStorage first for instant display
    const savedWorkouts = localStorage.getItem('fithub_workouts');
    if (savedWorkouts) {
      try {
        const parsed = JSON.parse(savedWorkouts);
        setWorkouts(parsed);
      } catch (e) {
        console.error('Failed to parse local workouts');
      }
    }

    // 2. Fetch from backend API
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/api/workouts/', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const fetchedWorkouts = Array.isArray(data) ? data : data.results || [];
          if (fetchedWorkouts.length > 0) {
            setWorkouts(fetchedWorkouts);
            localStorage.setItem('fithub_workouts', JSON.stringify(fetchedWorkouts));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback handled gracefully by localStorage
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !duration) return;

    const newWorkout = {
      id: Date.now(),
      title,
      category,
      duration: parseInt(duration) || 0,
      calories_burned: parseInt(caloriesBurned) || 0,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedWorkouts = [newWorkout, ...workouts];
    setWorkouts(updatedWorkouts);
    localStorage.setItem('fithub_workouts', JSON.stringify(updatedWorkouts));

    setTitle('');
    setDuration('');
    setCaloriesBurned('');
    setMessage('Workout session logged successfully!');
    setTimeout(() => setMessage(''), 3000);

    // Sync with backend
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/api/workouts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        title: newWorkout.title,
        category: newWorkout.category,
        duration: newWorkout.duration,
        calories_burned: newWorkout.calories_burned,
      }),
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    const updatedWorkouts = workouts.filter((item) => item.id !== id);
    setWorkouts(updatedWorkouts);
    localStorage.setItem('fithub_workouts', JSON.stringify(updatedWorkouts));

    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch(`http://127.0.0.1:8000/api/workouts/${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).catch(() => {});
  };

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const totalCalories = workouts.reduce((acc, curr) => acc + (Number(curr.calories_burned) || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Workout Tracker</h2>
      <p className="text-sm text-slate-400 mb-6">Log your training sessions and monitor your physical output</p>

      {message && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Sessions</span>
          <p className="text-3xl font-black text-white mt-1">{totalWorkouts}</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Time</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{totalMinutes} <span className="text-base font-normal text-slate-400">mins</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Calories Burned</span>
          <p className="text-3xl font-black text-orange-400 mt-1">{totalCalories} <span className="text-base font-normal text-slate-400">kcal</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log Workout Form */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Log Workout</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Exercise Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                placeholder="e.g., Bench Press"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="Strength">Strength Training</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility / Yoga</option>
                <option value="HIIT">HIIT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Est. Calories Burned</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                placeholder="300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
            >
              Log Session
            </button>
          </form>
        </div>

        {/* Workout History */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Recent Sessions</h3>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading workouts...</p>
          ) : workouts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-medium">No workouts logged yet.</p>
              <p className="text-xs mt-1">Record your training session using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {workouts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 text-xs bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-md font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-slate-200 font-semibold">{item.duration} mins</p>
                      <p className="text-xs text-orange-400 mt-0.5">{item.calories_burned} kcal burned</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400 p-2 transition rounded-lg hover:bg-slate-800"
                      title="Delete workout"
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