import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Utensils, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  Target, 
  Clock, 
  Award,
  ArrowUpRight,
  Menu,
  X,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('hydration');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Hydration State
  const [waterIntake, setWaterIntake] = useState(1750); // ml
  const waterGoal = 3000; // ml

  // Interactive Workout Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [workoutCalories, setWorkoutCalories] = useState(340);

  // Interactive Calorie/Macros State
  const [consumedCalories, setConsumedCalories] = useState(1650);
  const calorieGoal = 2200;
  const [protein, setProtein] = useState(125); // g
  const [carbs, setCarbs] = useState(180); // g
  const [fats, setFats] = useState(48); // g

  // Progress Log State
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
        // Slowly increment burned calories while active
        if (timerSeconds % 4 === 0) {
          setWorkoutCalories((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addWater = (amount) => {
    setWaterIntake((prev) => Math.min(prev + amount, 5000));
  };

  const addQuickMeal = (cals, p, c, f) => {
    setConsumedCalories((prev) => Math.min(prev + cals, 4000));
    setProtein((prev) => prev + p);
    setCarbs((prev) => prev + c);
    setFats((prev) => prev + f);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* BACKGROUND GLOW DECORATION */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-20 blur-3xl -z-10 bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 rounded-full"></div>

      {/* 1. HEADER / NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Fit<span className="text-emerald-400">Hub</span>
            </span>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">Live App Preview</a>
            <a href="#analytics" className="hover:text-emerald-400 transition-colors">Analytics</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Community</a>
          </div>

          {/* QUICK CTA ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-md shadow-emerald-400/20 hover:scale-[1.02] active:scale-[0.98]">
              Get Started Free
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-4">
            <a href="#features" className="block text-slate-300 hover:text-emerald-400 font-medium py-2">Features</a>
            <a href="#demo" className="block text-slate-300 hover:text-emerald-400 font-medium py-2">Live App Preview</a>
            <a href="#analytics" className="block text-slate-300 hover:text-emerald-400 font-medium py-2">Analytics</a>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button className="w-full py-2.5 text-slate-300 font-semibold rounded-xl border border-slate-700">Sign In</button>
              <button className="w-full py-2.5 bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-400/20">Get Started Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        

        {/* HEADLINE */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Track Your Fitness Journey <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            like a Seasoned Pro
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Unify your nutrition, intense workout sessions, daily hydration intake, and long-term strength metrics into a sleek, real-time dashboard.
        </p>

        {/* HERO CALL TO ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#demo" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 group">
            Start Tracking Free
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
            Explore Features
          </a>
        </div>

        {/* HERO METRIC PREVIEW CARDS */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Calorie Burn Goal</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-slate-100">680 / 800</span>
                <span className="text-xs text-slate-400">kcal</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Daily Hydration</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-slate-100">{(waterIntake / 1000).toFixed(2)} / 3.0</span>
                <span className="text-xs text-slate-400">L</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Weekly Streak</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-slate-100">6 Days</span>
                <span className="text-xs text-emerald-400 font-medium">+2 this week</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE FEATURE CARDS & INTERACTIVE APP MODULE DEMO */}
      <section id="demo" className="py-20 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Experience the FitHub Ecosystem
            </h2>
            <p className="mt-4 text-slate-400">
              Try out the live functional prototype below. Toggle between modules to see how seamlessly FitHub manages your fitness routine.
            </p>
          </div>

          {/* INTERACTIVE MODULE TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto">
            <button
              onClick={() => setActiveTab('hydration')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'hydration'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Droplets className="w-4 h-4" />
              Hydration
            </button>

            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'workout'
                  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Workouts
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'nutrition'
                  ? 'bg-orange-400 text-slate-950 shadow-lg shadow-orange-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Nutrition
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'progress'
                  ? 'bg-purple-400 text-slate-950 shadow-lg shadow-purple-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Progress
            </button>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            
            {/* 1. HYDRATION TRACKER TAB */}
            {activeTab === 'hydration' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <Droplets className="w-6 h-6 text-cyan-400" />
                      Hydration Tracker
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Log water consumption & keep fluid balance optimized.</p>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-2 self-start sm:self-auto">
                    <span className="text-xs text-cyan-400 uppercase font-semibold">Goal Status</span>
                    <p className="text-lg font-bold text-slate-100">
                      {Math.round((waterIntake / waterGoal) * 100)}% Completed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* PROGRESS BAR & INTACK DISPLAY */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-3xl font-extrabold text-slate-100">{waterIntake}</span>
                        <span className="text-slate-400 font-medium ml-1">/ {waterGoal} ml</span>
                      </div>
                      <span className="text-sm font-semibold text-cyan-400">
                        {waterGoal - waterIntake > 0 ? `${waterGoal - waterIntake} ml remaining` : 'Daily Goal Met!'}
                      </span>
                    </div>

                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-slate-400">
                      Recommended: Sip 250ml water every 45-60 minutes during active workout windows.
                    </p>
                  </div>

                  {/* QUICK LOG ACTIONS */}
                  <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Quick Water Log</span>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => addWater(250)}
                        className="py-3 px-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 font-semibold text-sm transition-all hover:bg-cyan-500/10 hover:text-cyan-400 flex flex-col items-center gap-1"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        +250 ml
                      </button>
                      <button 
                        onClick={() => addWater(500)}
                        className="py-3 px-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 font-semibold text-sm transition-all hover:bg-cyan-500/10 hover:text-cyan-400 flex flex-col items-center gap-1"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        +500 ml
                      </button>
                      <button 
                        onClick={() => addWater(750)}
                        className="py-3 px-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 font-semibold text-sm transition-all hover:bg-cyan-500/10 hover:text-cyan-400 flex flex-col items-center gap-1"
                      >
                        <Plus className="w-4 h-4 text-cyan-400" />
                        +750 ml
                      </button>
                    </div>
                    <button 
                      onClick={() => setWaterIntake(0)}
                      className="w-full py-2 text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center justify-center gap-1 mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Today's Counter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. WORKOUT LOGGER TAB */}
            {activeTab === 'workout' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-emerald-400" />
                      Active Session & Workout Logger
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Track reps, sets, active time, and estimated calorie burn live.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsTimerActive(!isTimerActive)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                        isTimerActive 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' 
                          : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-md shadow-emerald-400/20'
                      }`}
                    >
                      {isTimerActive ? <Pause className="w-4 h-4 fill-amber-400" /> : <Play className="w-4 h-4 fill-slate-950" />}
                      {isTimerActive ? 'Pause Session' : 'Start Session'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <Clock className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-semibold uppercase">Elapsed Time</span>
                    <p className="text-3xl font-extrabold text-slate-100 font-mono mt-1">{formatTime(timerSeconds)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-semibold uppercase">Est. Calories Burned</span>
                    <p className="text-3xl font-extrabold text-orange-400 mt-1">{workoutCalories} kcal</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-400 font-semibold uppercase">Routine Focus</span>
                    <p className="text-lg font-bold text-slate-100 mt-2">Hypertrophy Chest & Triceps</p>
                  </div>
                </div>

                {/* ROUTINE SET TRACKER TABLE PREVIEW */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200">Current Routine: Bench Press</span>
                    <span className="text-xs text-emerald-400 font-semibold">Set 3 of 4</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-slate-200">Set 1</span>
                      </div>
                      <span className="text-slate-400">80 kg × 12 reps</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-slate-200">Set 2</span>
                      </div>
                      <span className="text-slate-400">85 kg × 10 reps</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-400">3</div>
                        <span className="font-semibold text-slate-100">Set 3</span>
                      </div>
                      <span className="text-emerald-400 font-bold">90 kg × 8 reps</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NUTRITION TRACKER TAB */}
            {activeTab === 'nutrition' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <Utensils className="w-6 h-6 text-orange-400" />
                      Macros & Nutrition Tracker
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Balance protein, carbohydrates, and healthy fats daily.</p>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2">
                    <span className="text-xs text-orange-400 uppercase font-semibold">Calories Consumed</span>
                    <p className="text-lg font-bold text-slate-100">{consumedCalories} / {calorieGoal} kcal</p>
                  </div>
                </div>

                {/* MACRO BREAKDOWN BARS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-200">Protein</span>
                      <span className="text-xs text-emerald-400 font-semibold">{protein}g / 160g</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(protein / 160) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-200">Carbs</span>
                      <span className="text-xs text-amber-400 font-semibold">{carbs}g / 230g</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(carbs / 230) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-200">Fats</span>
                      <span className="text-xs text-rose-400 font-semibold">{fats}g / 65g</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(fats / 65) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* QUICK MEAL ADDERS */}
                <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-800 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Quick Log Sample Meals</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => addQuickMeal(450, 35, 40, 12)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-200 group-hover:text-orange-400 transition-colors">Grilled Chicken Bowl</p>
                        <p className="text-xs text-slate-400">450 kcal • 35g Protein</p>
                      </div>
                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                    </button>

                    <button 
                      onClick={() => addQuickMeal(320, 24, 30, 8)}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 text-left transition-all group flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-slate-200 group-hover:text-orange-400 transition-colors">Whey Shake & Banana</p>
                        <p className="text-xs text-slate-400">320 kcal • 24g Protein</p>
                      </div>
                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PROGRESS ANALYTICS TAB */}
            {activeTab === 'progress' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                      Progress Analytics & Metrics
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Visualize strength progression and body metric trends over time.</p>
                  </div>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    {['7d', '1m', '3m'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all ${
                          selectedPeriod === period
                            ? 'bg-purple-500 text-slate-950 shadow-md'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VISUAL ANALYTICS GRAPH SIMULATION */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase">Bench Press Max Trend</span>
                      <p className="text-2xl font-extrabold text-slate-100">105.5 kg <span className="text-emerald-400 text-sm font-semibold ml-2">+4.5 kg (+4.4%)</span></p>
                    </div>
                    <Award className="w-8 h-8 text-purple-400/80" />
                  </div>

                  {/* SIMULATED CHART BARS */}
                  <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                    {[
                      { day: 'Mon', value: 65 },
                      { day: 'Tue', value: 70 },
                      { day: 'Wed', value: 68 },
                      { day: 'Thu', value: 85 },
                      { day: 'Fri', value: 78 },
                      { day: 'Sat', value: 92 },
                      { day: 'Sun', value: 100 },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-slate-800/80 rounded-t-lg relative flex items-end justify-center overflow-hidden h-36">
                          <div 
                            className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 group-hover:from-purple-500 group-hover:to-indigo-300 transition-all duration-300 rounded-t-lg"
                            style={{ height: `${bar.value}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium group-hover:text-purple-400 transition-colors">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STAT SUMMARY GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Total Workouts</span>
                    <span className="text-xl font-bold text-slate-100 mt-1 block">42 Sessions</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Volume Lifted</span>
                    <span className="text-xl font-bold text-slate-100 mt-1 block">18,450 kg</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Avg. Session Time</span>
                    <span className="text-xl font-bold text-slate-100 mt-1 block">54 mins</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-xs text-slate-400 font-semibold block">Body Fat Ratio</span>
                    <span className="text-xl font-bold text-purple-400 mt-1 block">14.2% (-1.8%)</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 4. VALUE PROPOSITIONS / FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Designed for Modern Athletes & Fitness Enthusiasts
          </h2>
          <p className="mt-4 text-slate-400">
            No more fragmented apps for water, macros, and workout routines. FitHub centralizes everything you need to reach your peak performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Instant Routine Logging</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Log sets, reps, and weights with single-tap controls during active workouts without breaking your focus or resting pace.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Hydration Smart Reminders</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Adaptive water intake tracking based on body metrics, weather conditions, and active workout intensity levels.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">Personalized Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Deep insights into progressive overload curves, target macro achievements, and personal record milestones.
            </p>
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-500/10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Ready to Elevate Your Fitness?</h2>
            <p className="mt-2 text-slate-900 font-medium text-base sm:text-lg">Join over 25,000 users building healthier habits with FitHub today.</p>
          </div>
          <button className="px-8 py-4 bg-slate-950 text-emerald-400 font-bold rounded-2xl hover:bg-slate-900 transition-all duration-200 shadow-xl whitespace-nowrap">
            Create Free Account
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-12 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-slate-300">FitHub Ecosystem</span>
          </div>
          <p>© {new Date().getFullYear()} FitHub Inc. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}