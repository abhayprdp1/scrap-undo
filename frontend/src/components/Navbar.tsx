'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  Recycle, 
  Calculator, 
  TrendingUp, 
  Camera, 
  MapPin, 
  ClipboardList, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/seller/new-listing', label: 'Sell Scrap', icon: Camera, highlight: true },
    { href: '/calculator', label: 'Price Calculator', icon: Calculator },
    { href: '/rates', label: 'Kerala Scrap Rates', icon: TrendingUp },
    { href: '/seller/dashboard', label: 'My Bookings', icon: ClipboardList },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-scrap-border/80 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-scrap-primaryDark to-scrap-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
              scrap<span className="text-scrap-primary">Undo</span>
              <span className="w-2 h-2 rounded-full bg-scrap-primary animate-pulse" />
            </span>
            <span className="text-[10px] text-scrap-muted tracking-wider uppercase font-semibold flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-scrap-primary" /> Kerala
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm transition-all shadow-glow hover:scale-[1.02]"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-scrap-primary bg-scrap-card border border-scrap-border font-semibold'
                    : 'text-scrap-muted hover:text-white hover:bg-scrap-card/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-scrap-muted" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-scrap-border bg-scrap-card text-xs text-scrap-light">
                <div className="w-6 h-6 rounded-full bg-scrap-primary/20 text-scrap-primary flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white leading-none">{user.name}</span>
                  <span className="text-[10px] text-scrap-muted leading-none mt-0.5">{user.city}</span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-lg text-scrap-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 rounded-lg border border-scrap-border text-xs text-scrap-light hover:text-white hover:bg-scrap-card transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/login?tab=signup"
                className="px-3 py-1.5 rounded-lg bg-scrap-primary text-black font-semibold text-xs shadow-glow transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
