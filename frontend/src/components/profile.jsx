import React, { useState, useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

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

function getLocalStatsCounts() {
  let foodCount = 0;
  let activityCount = 0;

  try {
    const nutritionData = JSON.parse(localStorage.getItem('fithub_nutrition_logs') || '[]');
    if (Array.isArray(nutritionData)) {
      foodCount = nutritionData.length;
    }
  } catch {
    foodCount = 0;
  }

  try {
    const workoutData = JSON.parse(localStorage.getItem('fithub_workouts') || '[]');
    if (Array.isArray(workoutData)) {
      activityCount = workoutData.length;
    }
  } catch {
    activityCount = 0;
  }

  return { food_entries: foodCount, activities: activityCount };
}

export default function Profile() {
  const initialUsername =
    localStorage.getItem('username') || getUsernameFromToken() || 'Fitness User';

  const [profile, setProfile] = useState({
    username: initialUsername,
    email: 'user@fithub.com',
    member_since: '2026-11-15',
    age: 25,
    weight: 74.2,
    height: 175,
    goal: 'Maintain Fitness',
    avatar: '',
  });
  const [stats, setStats] = useState(() => getLocalStatsCounts());
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUsername =
      localStorage.getItem('username') || getUsernameFromToken();

    // Always read latest counts from fithub_nutrition_logs and fithub_workouts
    const localCounts = getLocalStatsCounts();
    setStats(localCounts);

    // Load profile data from fithub_profile
    const savedOnboarding = localStorage.getItem('fithub_profile');
    if (savedOnboarding) {
      try {
        const parsed = JSON.parse(savedOnboarding);
        const goalMap = {
          lose: 'Lose Weight',
          maintain: 'Maintain Fitness',
          gain: 'Build Muscle',
        };

        const updated = {
          username: parsed.username || storedUsername || profile.username,
          age: parsed.age || profile.age,
          weight: parsed.weight || profile.weight,
          height: parsed.height || profile.height,
          goal: goalMap[parsed.goal] || parsed.goal || profile.goal,
          avatar: parsed.avatar || profile.avatar,
        };

        setProfile((prev) => ({ ...prev, ...updated }));
        setEditForm((prev) => ({ ...prev, ...updated }));
      } catch {
        // ignore malformed profile JSON
      }
    } else if (storedUsername) {
      setProfile((prev) => ({ ...prev, username: storedUsername }));
      setEditForm((prev) => ({ ...prev, username: storedUsername }));
    }

    // Fetch backend profile if server is running
    const token = localStorage.getItem('access_token');
    fetch(`${API_BASE_URL}/api/dashboard/profile/`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((backendData) => {
        if (backendData) {
          setProfile((prev) => ({
            ...prev,
            ...backendData,
            username: backendData.username || prev.username,
          }));
          setEditForm((prev) => ({
            ...prev,
            ...backendData,
            username: backendData.username || prev.username,
          }));

          const backendStats = backendData.stats || backendData;
          setStats({
            food_entries: Math.max(
              localCounts.food_entries,
              Number(backendStats.food_entries) || 0
            ),
            activities: Math.max(
              localCounts.activities,
              Number(backendStats.activities) || 0
            ),
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      setProfile((prev) => {
        const next = { ...prev, avatar: base64Image };
        localStorage.setItem('fithub_profile', JSON.stringify(next));
        return next;
      });
      setEditForm((prev) => ({ ...prev, avatar: base64Image }));
      setMessage('Profile picture updated!');
      setTimeout(() => setMessage(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    setProfile(editForm);
    localStorage.setItem('fithub_profile', JSON.stringify(editForm));
    if (editForm.username) {
      localStorage.setItem('username', editForm.username);
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/dashboard/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Saved locally (Backend sync pending).');
      }
    } catch {
      setMessage('Saved locally (Offline mode).');
    } finally {
      setSaving(false);
      setIsEditing(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('fithub_profile');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Profile</h2>
      <p className="text-sm text-slate-400 mb-6">Manage your settings and personal details</p>

      {message && (
        <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Profile Cards / Edit Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile picture"
                className="relative group w-16 h-16 rounded-full cursor-pointer shrink-0 overflow-hidden border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-emerald-400">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}

                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[11px] font-semibold text-white">
                  Change
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div>
                <h3 className="text-lg font-semibold text-white">{profile.username}</h3>
                <p className="text-xs text-slate-400">Member since {profile.member_since}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 text-xs font-medium text-emerald-400 hover:underline"
                >
                  {profile.avatar ? 'Change photo' : 'Upload photo'}
                </button>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow flex justify-between items-center">
                <span className="text-sm text-slate-400">Username</span>
                <span className="text-base font-semibold text-white">{profile.username}</span>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow flex justify-between items-center">
                <span className="text-sm text-slate-400">Age</span>
                <span className="text-base font-semibold text-white">{profile.age} years</span>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow flex justify-between items-center">
                <span className="text-sm text-slate-400">Weight</span>
                <span className="text-base font-semibold text-emerald-400">{profile.weight} kg</span>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow flex justify-between items-center">
                <span className="text-sm text-slate-400">Height</span>
                <span className="text-base font-semibold text-white">{profile.height} cm</span>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow flex justify-between items-center">
                <span className="text-sm text-slate-400">Goal</span>
                <span className="text-base font-semibold text-orange-400">{profile.goal}</span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">Edit Your Details</h3>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Display Name / Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Profile Picture</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-200 transition"
                  >
                    Choose Image...
                  </button>
                  {editForm.avatar && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...editForm, avatar: '' };
                        setEditForm(updated);
                        setProfile(updated);
                        localStorage.setItem('fithub_profile', JSON.stringify(updated));
                        setMessage('Profile picture removed!');
                        setTimeout(() => setMessage(''), 3000);
                      }}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Age (years)</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Goal</label>
                <select
                  value={editForm.goal}
                  onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Maintain Fitness">Maintain Fitness</option>
                  <option value="Build Muscle">Build Muscle</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(profile);
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Stats & Logout */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <span className="text-3xl font-bold text-emerald-400">{stats.food_entries}</span>
                <p className="text-xs text-slate-400 mt-1">Food entries</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <span className="text-3xl font-bold text-emerald-400">{stats.activities}</span>
                <p className="text-xs text-slate-400 mt-1">Activities</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-red-500/30 shadow">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 font-semibold py-2 rounded-lg transition hover:bg-red-500/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}