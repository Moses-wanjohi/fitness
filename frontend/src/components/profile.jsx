import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: 'Fitness User',
    email: 'user@fithub.com',
    member_since: '2026-01-28',
    age: 30,
    weight: 72,
    height: 178,
    goal: 'Maintain Weight',
  });
  const [stats, setStats] = useState({ food_entries: 0, activities: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile and stats data if your backend has endpoints for them
    Promise.all([
      apiRequest('/profile/').catch(() => null),
      apiRequest('/dashboard/').catch(() => null),
    ])
      .then(([profileData, dashboardData]) => {
        if (profileData) setProfile((prev) => ({ ...prev, ...profileData }));
        if (dashboardData) {
          setStats({
            food_entries: dashboardData.food_entries_count || 7,
            activities: dashboardData.workouts_count || 4,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Or reload to trigger auth guard
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-slate-100">
      <h2 className="text-3xl font-bold mb-1 text-emerald-400">Profile</h2>
      <p className="text-sm text-slate-400 mb-8">Manage your settings and personal details</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Profile Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center text-xl font-bold">
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{profile.username}</h3>
                <p className="text-xs text-slate-400">Member since {profile.member_since}</p>
              </div>
            </div>
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
            onClick={() => alert('Edit profile feature coming soon!')}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition border border-slate-600"
          >
            Edit Profile
          </button>
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