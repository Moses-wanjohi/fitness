import React, { useState, useEffect } from 'react';

export default function DashboardOverview() {
  const [nutrition, setNutrition] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [hydration, setHydration] = useState(0);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/nutrition/').then((res) => res.json()).catch(() => []),
      fetch('http://127.0.0.1:8000/api/workouts/').then((res) => res.json()).catch(() => []),
      fetch('http://127.0.0.1:8000/api/hydration/').then((res) => res.json()).catch(() => []),
      fetch('http://127.0.0.1:8000/api/progress/').then((res) => res.json()).catch(() => []),
    ])
      .then(([nutritionData, workoutData, hydrationData, progressData]) => {
        setNutrition(Array.isArray(nutritionData) ? nutritionData : []);
        setWorkouts(Array.isArray(workoutData) ? workoutData : []);
        
        const hydrationTotal = Array.isArray(hydrationData)
          ? hydrationData.reduce((acc, curr) => acc + (curr.amount_ml || 0), 0)
          : hydrationData.total_ml || 0;
        setHydration(hydrationTotal);

        setProgress(Array.isArray(progressData) ? progressData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  }, []);

  // Calculations
  const totalCalories = nutrition.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalWorkoutMinutes = workouts.reduce((acc, item) => acc + (item.duration || 0), 0);
  const latestWeight = progress.length > 0 ? progress[0].weight : 'N/A';

  if (loading) {
    return <div className="p-6 text-slate-400">Loading your dashboard overview...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-2 text-emerald-400">Dashboard Overview</h2>
      <p className="text-slate-400 mb-8">Welcome back! Here is a summary of your fitness progress.</p>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Calories Consumed</p>
          <p className="text-3xl font-extrabold text-orange-400 mt-1">{totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Active Workout Time</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{totalWorkoutMinutes} <span className="text-sm font-normal text-slate-400">mins</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Water Intake</p>
          <p className="text-3xl font-extrabold text-cyan-400 mt-1">{(hydration / 1000).toFixed(1)} <span className="text-sm font-normal text-slate-400">L</span></p>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Latest Weight</p>
          <p className="text-3xl font-extrabold text-purple-400 mt-1">{latestWeight} <span className="text-sm font-normal text-slate-400">kg</span></p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Recent Workouts</h3>
          {workouts.length === 0 ? (
            <p className="text-slate-400 text-sm">No workouts recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {workouts.slice(0, 3).map((w, index) => (
                <div key={w.id || index} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{w.title}</p>
                    <span className="text-xs text-emerald-400">{w.category}</span>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-300">{w.duration} mins</p>
                    <p className="text-xs text-orange-400">{w.calories_burned} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Meals */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Recent Nutrition Logs</h3>
          {nutrition.length === 0 ? (
            <p className="text-slate-400 text-sm">No meals logged yet.</p>
          ) : (
            <div className="space-y-3">
              {nutrition.slice(0, 3).map((n, index) => (
                <div key={n.id || index} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{n.food_item}</p>
                    <p className="text-xs text-slate-400">P: {n.protein || 0}g | C: {n.carbs || 0}g | F: {n.fats || 0}g</p>
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