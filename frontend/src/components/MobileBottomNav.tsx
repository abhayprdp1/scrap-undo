'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, TrendingUp, Calculator, ClipboardList } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/rates', label: 'Rates', icon: TrendingUp },
    { href: '/seller/new-listing', label: 'Sell', icon: Camera, isPrimary: true },
    { href: '/calculator', label: 'Calculator', icon: Calculator },
    { href: '/seller/dashboard', label: 'Bookings', icon: ClipboardList },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D1117]/95 backdrop-blur-lg border-t border-scrap-border px-3 py-1.5 flex items-center justify-around shadow-2xl safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (item.isPrimary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-scrap-primaryDark to-scrap-primary flex items-center justify-center text-black shadow-glow border-2 border-scrap-bg group-active:scale-95 transition-transform">
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-scrap-primary mt-0.5">
                Sell
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
              isActive ? 'text-scrap-primary font-bold' : 'text-scrap-muted hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
