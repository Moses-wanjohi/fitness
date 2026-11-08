import React, { useState, useEffect } from 'react';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strength');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/workouts/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch workouts');
        return res.json();
      })
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newWorkout = {
      title,
      category,
      duration: parseInt(duration) || 0,
      calories_burned: parseInt(caloriesBurned) || 0,
    };

    fetch('http://127.0.0.1:8000/api/workouts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWorkout),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save workout');
        return res.json();
      })
      .then((data) => {
        setWorkouts([data, ...workouts]);
        setTitle('');
        setDuration('');
        setCaloriesBurned('');
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400">Workout Tracker</h2>

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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="e.g., Bench Press"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Est. Calories Burned</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Log Session
            </button>
          </form>
        </div>

        {/* Workout History */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Recent Sessions</h3>
          {loading ? (
            <p className="text-slate-400">Loading workouts...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : workouts.length === 0 ? (
            <p className="text-slate-400">No workouts logged yet.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {workouts.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-300 font-medium">{item.duration} mins</p>
                    <p className="text-xs text-orange-400">{item.calories_burned} kcal burned</p>
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