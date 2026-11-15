import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    goal: 'maintain',
    activityLevel: 'moderate',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setError('');
    if (step === 1 && (!formData.age || formData.age < 13 || formData.age > 120)) {
      setError('Please enter a valid age.');
      return;
    }
    if (step === 2 && (!formData.weight || !formData.height)) {
      setError('Please enter both your weight and height.');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // 1. Always save locally immediately so frontend components can read it instantly
    localStorage.setItem('fithub_profile', JSON.stringify(formData));

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/dashboard/profile/', {
        method: 'POST', // or PUT/PATCH depending on your backend view
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const goals = [
    { id: 'lose', title: 'Lose Weight', desc: 'Caloric deficit & fat loss' },
    { id: 'maintain', title: 'Maintain Fitness', desc: 'Balanced nutrition & consistency' },
    { id: 'gain', title: 'Build Muscle', desc: 'Caloric surplus & strength' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between px-6 py-12">
      <div className="max-w-xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
              F
            </div>
            <span className="text-xl font-black tracking-wider text-white">FITHUB</span>
          </div>
          <p className="text-sm text-slate-400">Let's personalize your experience</p>
        </div>

        {/* 3-Segment Progress Bar */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((segment) => (
              <div
                key={segment}
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  segment <= step ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-slate-400">Step {step} of 3</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Age & Gender */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                01
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">How old are you?</h2>
                <p className="text-sm text-slate-400">
                  This helps us calculate your daily calorie and hydration needs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Age <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#1E293B] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Biological Sex</label>
                <div className="grid grid-cols-2 gap-3">
                  {['male', 'female'].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold capitalize transition ${
                        formData.gender === g
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                          : 'bg-[#1E293B] border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Weight & Height */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                02
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your current measurements</h2>
                <p className="text-sm text-slate-400">
                  Used as your starting baseline in Progress Tracker.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Weight (kg) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="74.2"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#1E293B] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Height (cm) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3.5 bg-[#1E293B] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fitness Goal */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                03
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">What is your primary goal?</h2>
                <p className="text-sm text-slate-400">
                  We will tailor your daily calorie and workout targets around this.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {goals.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFormData({ ...formData, goal: item.id })}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    formData.goal === item.id
                      ? 'bg-emerald-500/15 border-emerald-500'
                      : 'bg-[#1E293B] border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-xl w-full mx-auto pt-8 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
          >
            Continue <span>→</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Finish Setup →'}
          </button>
        )}
      </div>
    </div>
  );
}