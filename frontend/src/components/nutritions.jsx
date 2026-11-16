import React, { useState, useEffect } from 'react';

export default function Nutritions() {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Form state
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Fetch nutrition logs from Django backend API with local fallback
  useEffect(() => {
    // 1. Load from localStorage first for instant display
    const savedLogs = localStorage.getItem('fithub_nutrition_logs');
    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs);
        setNutritionLogs(parsed);
      } catch (e) {
        console.error('Failed to parse local nutrition logs');
      }
    }

    // 2. Fetch from backend API with JWT Authorization
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/api/nutrition/', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const fetchedLogs = Array.isArray(data) ? data : data.results || [];
          if (fetchedLogs.length > 0) {
            setNutritionLogs(fetchedLogs);
            localStorage.setItem('fithub_nutrition_logs', JSON.stringify(fetchedLogs));
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodItem || !calories) return;

    const newEntry = {
      id: Date.now(),
      food_item: foodItem,
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedLogs = [newEntry, ...nutritionLogs];
    setNutritionLogs(updatedLogs);
    localStorage.setItem('fithub_nutrition_logs', JSON.stringify(updatedLogs));

    setFoodItem('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setMessage('Meal logged successfully!');
    setTimeout(() => setMessage(''), 3000);

    // Sync with backend
    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/api/nutrition/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        food_item: newEntry.food_item,
        calories: newEntry.calories,
        protein: newEntry.protein,
        carbs: newEntry.carbs,
        fats: newEntry.fats,
      }),
    }).catch(() => {});
  };

  const handleDelete = (id) => {
    const updatedLogs = nutritionLogs.filter((item) => item.id !== id);
    setNutritionLogs(updatedLogs);
    localStorage.setItem('fithub_nutrition_logs', JSON.stringify(updatedLogs));

    const token = localStorage.getItem('access_token') || localStorage.getItem('access');
    fetch(`http://127.0.0.1:8000/api/nutrition/${id}/`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).catch(() => {});
  };

  // Calculate totals
  const totalCalories = nutritionLogs.reduce((acc, item) => acc + (Number(item.calories) || 0), 0);
  const totalProtein = nutritionLogs.reduce((acc, item) => acc + (Number(item.protein) || 0), 0);
  const totalCarbs = nutritionLogs.reduce((acc, item) => acc + (Number(item.carbs) || 0), 0);
  const totalFats = nutritionLogs.reduce((acc, item) => acc + (Number(item.fats) || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Nutrition & Calorie Tracker</h2>
      <p className="text-sm text-slate-400 mb-6">Log your meals and track your daily macronutrient breakdown</p>

      {message && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Total Calories</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{totalCalories} <span className="text-sm font-normal text-slate-400">kcal</span></p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Protein</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalProtein}g</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Carbs</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalCarbs}g</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Fats</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{totalFats}g</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Meal Form */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Log Meal / Food</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Food Item</label>
              <input
                type="text"
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                placeholder="e.g., Chicken & Rice"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
                placeholder="500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Fats (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="15"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
            >
              Add Entry
            </button>
          </form>
        </div>

        {/* Meal Log List */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Today's Meal Log</h3>
          {loading ? (
            <p className="text-slate-400 text-sm">Loading nutrition logs...</p>
          ) : nutritionLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-medium">No meals logged yet.</p>
              <p className="text-xs mt-1">Add your first meal using the form on the left.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {nutritionLogs.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-white">{item.food_item}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      P: <span className="text-blue-400">{item.protein || 0}g</span> | C:{' '}
                      <span className="text-green-400">{item.carbs || 0}g</span> | F:{' '}
                      <span className="text-yellow-400">{item.fats || 0}g</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-orange-400 font-bold">{item.calories} kcal</span>
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