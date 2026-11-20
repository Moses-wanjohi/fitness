import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function getUsernameFromToken() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || payload.user || null;
  } catch {
    return null;
  }
}

export default function DashboardOverview() {
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [hydration, setHydration] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const username =
    localStorage.getItem('username') || getUsernameFromToken() || 'Fitness User';

  useEffect(() => {
    // 1. Load from localStorage first for instant dashboard display
    try {
      const localNutr = localStorage.getItem('fithub_nutrition_logs');
      const localWork = localStorage.getItem('fithub_workouts');
      const localHyd = localStorage.getItem('fithub_hydration_logs');
      const localProg = localStorage.getItem('fithub_progress_logs');

      if (localNutr) setNutrition(JSON.parse(localNutr));
      if (localWork) setWorkouts(JSON.parse(localWork));
      if (localHyd) {
        const hydParsed = JSON.parse(localHyd);
        const totalHyd = hydParsed.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0);
        setHydration(totalHyd);
      }
      if (localProg) setProgress(JSON.parse(localProg));
      setLoading(false);
    } catch (e) {
      console.error('Failed to load local overview cache');
    }

    // 2. Fetch from backend API endpoints with Authorization headers
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    Promise.all([
      fetch('http://127.0.0.1:8000/api/nutrition/', { headers }).then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch('http://127.0.0.1:8000/api/workouts/', { headers }).then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch('http://127.0.0.1:8000/api/hydration/', { headers }).then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch('http://127.0.0.1:8000/api/progress/', { headers }).then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ])
      .then(([nutritionData, workoutData, hydrationData, progressData]) => {
        if (Array.isArray(nutritionData) && nutritionData.length > 0) {
          setNutrition(nutritionData);
          localStorage.setItem('fithub_nutrition_logs', JSON.stringify(nutritionData));
        }
        if (Array.isArray(workoutData) && workoutData.length > 0) {
          setWorkouts(workoutData);
          localStorage.setItem('fithub_workouts', JSON.stringify(workoutData));
        }

        if (hydrationData) {
          const hydrationTotal = Array.isArray(hydrationData)
            ? hydrationData.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0)
            : hydrationData.total_ml || 0;
          if (hydrationTotal > 0) setHydration(hydrationTotal);
        }

        if (Array.isArray(progressData) && progressData.length > 0) {
          setProgress(progressData);
          localStorage.setItem('fithub_progress_logs', JSON.stringify(progressData));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  }, []);

  // Calculations
  const totalCalories = nutrition.reduce((acc, item) => acc + (Number(item.calories) || 0), 0);
  const totalWorkoutMinutes = workouts.reduce((acc, item) => acc + (Number(item.duration) || 0), 0);
  const latestWeight = progress.length > 0 ? progress[0].weight : 'N/A';

  if (loading) {
    return <div className="p-6 text-slate-400">Loading your dashboard overview...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-emerald-400">Welcome back, {username}!</h2>
          <p className="text-slate-400 text-sm mt-1">Here is a live summary of your fitness progress.</p>
        </div>
        <div className="flex flex-wrap gap-2">
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Calories Consumed</p>
          <p className="text-3xl font-black text-orange-400 mt-2">
            {totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span>
          </p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Workout Time</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">
            {totalWorkoutMinutes} <span className="text-sm font-normal text-slate-400">mins</span>
          </p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Water Intake</p>
          <p className="text-3xl font-black text-cyan-400 mt-2">
            {(hydration / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">L</span>
          </p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Latest Weight</p>
          <p className="text-3xl font-black text-purple-400 mt-2">
            {latestWeight} <span className="text-sm font-normal text-slate-400">kg</span>
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Recent Workouts</h3>
            
          </div>
          {workouts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p>No workouts recorded yet.</p>
              <Link to="/workouts" className="mt-2 inline-block text-xs text-emerald-400 font-semibold hover:underline">
                Log your first workout
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((w, index) => (
                <div key={w.id || index} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{w.title}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded font-medium">
                      {w.category}
                    </span>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-200 font-semibold">{w.duration} mins</p>
                    <p className="text-xs text-orange-400 mt-0.5">{w.calories_burned} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Meals */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Recent Nutrition Logs</h3>
          </div>
          {nutrition.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p>No meals logged yet.</p>
              <Link to="/nutrition" className="mt-2 inline-block text-xs text-emerald-400 font-semibold hover:underline">
                Log your first meal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {nutrition.slice(0, 3).map((n, index) => (
                <div key={n.id || index} className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{n.food_item}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      P: <span className="text-blue-400">{n.protein || 0}g</span> | C:{' '}
                      <span className="text-green-400">{n.carbs || 0}g</span> | F:{' '}
                      <span className="text-yellow-400">{n.fats || 0}g</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-400 font-bold">{n.calories} kcal</span>
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
