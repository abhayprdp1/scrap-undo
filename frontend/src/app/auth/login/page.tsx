'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Recycle, Phone, User, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();
  
  const initialTab = searchParams.get('tab') === 'signup' ? 'SIGNUP' : 'LOGIN';
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(initialTab);

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCity, setSignupCity] = useState<'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur'>('Kochi');
  const [signupAddress, setSignupAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(loginPhone);
      toast.success('Welcome back! Successfully logged in.');
      router.push('/seller/new-listing');
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!signupPhone || signupPhone.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signup(signupName, signupPhone, signupCity, signupAddress);
      toast.success(`Account created! Welcome to scrapUndo Kerala, ${signupName}!`);
      router.push('/seller/new-listing');
    }, 500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 space-y-6 shadow-2xl border-scrap-border relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-scrap-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-scrap-primaryDark to-scrap-primary flex items-center justify-center text-white mx-auto shadow-glow font-bold">
            <Recycle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">scrapUndo Kerala</h1>
          <p className="text-xs text-scrap-muted">
            Doorstep scrap collection in Kochi, Palakkad, Malappuram & Thrissur
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-scrap-bg border border-scrap-border rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('LOGIN')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LOGIN'
                ? 'bg-scrap-primary text-black shadow-glow'
                : 'text-scrap-muted hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SIGNUP')}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SIGNUP'
                ? 'bg-scrap-primary text-black shadow-glow'
                : 'text-scrap-muted hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'LOGIN' ? (
          /* Log In Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="+91 94470 54321"
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Log In & Sell Scrap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 rounded-xl bg-scrap-bg border border-scrap-border text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginPhone('+91 94470 54321');
                  login('+91 94470 54321', 'Abhay P', 'Kochi');
                  toast.success('Logged in as Abhay P (Kochi)!');
                  router.push('/seller/new-listing');
                }}
                className="text-xs text-scrap-gold hover:underline font-semibold"
              >
                ⚡ Quick 1-Click Login as Abhay P (Demo)
              </button>
            </div>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Abhay P"
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+91 94470 54321"
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Service City in Kerala</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={signupCity}
                  onChange={(e) => setSignupCity(e.target.value as any)}
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl pl-10 pr-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                >
                  <option value="Kochi">Kochi (Ernakulam District)</option>
                  <option value="Palakkad">Palakkad District</option>
                  <option value="Malappuram">Malappuram District</option>
                  <option value="Thrissur">Thrissur District</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-1.5">Local Address / Locality</label>
              <input
                type="text"
                value={signupAddress}
                onChange={(e) => setSignupAddress(e.target.value)}
                placeholder="e.g. Edappally Toll, Kochi"
                className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Sign Up & Start Selling'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 border-t border-scrap-border flex items-center justify-center gap-1.5 text-xs text-scrap-muted">
          <ShieldCheck className="w-4 h-4 text-scrap-primary" />
          <span>Doorstep Weighing & Instant Cash Payout</span>
        </div>

      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-scrap-muted">Loading scrapUndo Kerala...</div>}>
      <AuthContent />
    </Suspense>
  );
}

