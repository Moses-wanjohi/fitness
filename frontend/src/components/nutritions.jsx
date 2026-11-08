import React, { useState, useEffect } from 'react';

export default function Nutritions() {
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Fetch nutrition logs from Django backend API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/nutrition/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch nutrition data');
        return res.json();
      })
      .then((data) => {
        setNutritionLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      food_item: foodItem,
      calories: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
    };

    fetch('http://127.0.0.1:8000/api/nutrition/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add nutrition entry');
        return res.json();
      })
      .then((data) => {
        setNutritionLogs([data, ...nutritionLogs]);
        setFoodItem('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFats('');
      })
      .catch((err) => alert(err.message));
  };

  // Calculate totals
  const totalCalories = nutritionLogs.reduce((acc, item) => acc + (item.calories || 0), 0);
  const totalProtein = nutritionLogs.reduce((acc, item) => acc + (item.protein || 0), 0);
  const totalCarbs = nutritionLogs.reduce((acc, item) => acc + (item.carbs || 0), 0);
  const totalFats = nutritionLogs.reduce((acc, item) => acc + (item.fats || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-6 text-emerald-400">Nutrition & Calorie Tracker</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Total Calories</p>
          <p className="text-2xl font-bold text-orange-400">{totalCalories} kcal</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Protein</p>
          <p className="text-2xl font-bold text-blue-400">{totalProtein}g</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Carbs</p>
          <p className="text-2xl font-bold text-green-400">{totalCarbs}g</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
          <p className="text-slate-400 text-sm">Fats</p>
          <p className="text-2xl font-bold text-yellow-400">{totalFats}g</p>
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="15"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Add Entry
            </button>
          </form>
        </div>

        {/* Meal Log List */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-slate-200">Today's Meal Log</h3>
          {loading ? (
            <p className="text-slate-400">Loading nutrition logs...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : nutritionLogs.length === 0 ? (
            <p className="text-slate-400">No meals logged yet. Add your first entry!</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {nutritionLogs.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-white">{item.food_item}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      P: <span className="text-blue-400">{item.protein || 0}g</span> | C:{' '}
                      <span className="text-green-400">{item.carbs || 0}g</span> | F:{' '}
                      <span className="text-yellow-400">{item.fats || 0}g</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-orange-400 font-bold">{item.calories} kcal</span>
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