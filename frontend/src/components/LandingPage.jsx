import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-wider text-emerald-400">
            FITHUB
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All-in-One Fitness & Nutrition Tracker
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Master your fitness,{' '}
              <span className="text-emerald-400">one rep and meal</span> at a time.
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              Stop juggling multiple apps. Log your daily calories, time your workouts, track hydration, and monitor body weight trends in one streamlined dashboard.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25"
              >
                Start free
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-semibold px-7 py-3.5 rounded-xl border border-slate-700 transition-colors"
              >
                I have an account
              </Link>
            </div>
          </div>

          {/* Right Column: Live Dashboard Preview Cards */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Live Preview
                  </p>
                  <h2 className="text-lg font-bold text-white">Today's Snapshot</h2>
                </div>
                <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">
                  Synced
                </span>
              </div>

              {/* 2x2 Grid mirroring your actual Dashboard cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1E293B]/90 border border-slate-700/60 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Calories Consumed</p>
                  <p className="text-2xl font-extrabold text-orange-400">
                    1,850 <span className="text-xs font-normal text-slate-400">kcal</span>
                  </p>
                </div>

                <div className="bg-[#1E293B]/90 border border-slate-700/60 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Active Workout</p>
                  <p className="text-2xl font-extrabold text-emerald-400">
                    45 <span className="text-xs font-normal text-slate-400">mins</span>
                  </p>
                </div>

                <div className="bg-[#1E293B]/90 border border-slate-700/60 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Water Intake</p>
                  <p className="text-2xl font-extrabold text-sky-400">
                    2.5 <span className="text-xs font-normal text-slate-400">L</span>
                  </p>
                </div>

                <div className="bg-[#1E293B]/90 border border-slate-700/60 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Current Weight</p>
                  <p className="text-2xl font-extrabold text-purple-400">
                    74.2 <span className="text-xs font-normal text-slate-400">kg</span>
                  </p>
                </div>
              </div>

              {/* Mini Log Preview */}
              <div className="mt-4 bg-[#1E293B]/60 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Recent Activity</p>
                  <p className="text-sm font-semibold text-slate-200">
                    Upper Body Strength • 45 mins
                  </p>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Modules Section (Matching your Sidebar) */}
        <section className="mt-24 pt-16 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Everything you need to stay consistent
            </h2>
            <p className="text-slate-400 mt-2">
              Four focused modules built to give you clarity without the clutter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#161F30] border border-slate-800 p-6 rounded-xl hover:border-orange-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold mb-4">
                kcal
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Nutrition Logs</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Record daily meals and keep an eye on your caloric intake against your goals.
              </p>
            </div>

            <div className="bg-[#161F30] border border-slate-800 p-6 rounded-xl hover:border-emerald-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-4">
                min
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Workout Tracking</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log training sessions, track active minutes, and review your recent workout history.
              </p>
            </div>

            <div className="bg-[#161F30] border border-slate-800 p-6 rounded-xl hover:border-sky-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold mb-4">
                H₂O
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hydration Goals</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Monitor your water intake in liters throughout the day so you never fall behind.
              </p>
            </div>

            <div className="bg-[#161F30] border border-slate-800 p-6 rounded-xl hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-4">
                kg
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Body Progress</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track weight milestones over time and visualize long-term changes in your profile.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-sm text-slate-500">
        <p>FitHub Dashboard v1.0 • Built for consistent progress.</p>
      </footer>
    </div>
  );
};

export default LandingPage;