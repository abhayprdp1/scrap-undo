import React from 'react';
import Link from 'next/link';
import { Recycle, ShieldCheck, Leaf, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-scrap-border bg-scrap-bg text-scrap-muted text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-scrap-primary flex items-center justify-center text-black font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">scrapUndo Kerala</span>
            </div>
            <p className="text-xs leading-relaxed text-scrap-muted">
              Kerala&apos;s AI-powered doorstep scrap collection platform. Photograph your scrap, get instant market price estimation, find verified scrap shops nearby, and book doorstep collection.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-scrap-primary">
              <Leaf className="w-3.5 h-3.5" />
              <span>Eco-Friendly Recycling in Kerala</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/seller/new-listing" className="hover:text-scrap-primary transition-colors">Sell Scrap Now</Link></li>
              <li><Link href="/calculator" className="hover:text-scrap-primary transition-colors">Free Scrap Price Calculator</Link></li>
              <li><Link href="/rates" className="hover:text-scrap-primary transition-colors">Kerala Daily Scrap Rates</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-scrap-primary transition-colors">My Scrap Bookings</Link></li>
              <li><Link href="/auth/login" className="hover:text-scrap-primary transition-colors">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Scrap Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Scrap Materials Collected</h4>
            <ul className="space-y-2 text-xs">
              <li>Electronics & E-Waste (Old TVs, PCs, Fridges, Cables)</li>
              <li>Metals (Copper wire, Brass/Pithala, Aluminium, Iron)</li>
              <li>Paper (Malayalam/English newspapers, Cartons, Books)</li>
              <li>Plastics (PET bottles, Water cans, HDPE containers)</li>
              <li>Old Household Appliances & Machinery</li>
            </ul>
          </div>

          {/* Service Locations in Kerala */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Active Services in Kerala</h4>
            <div className="space-y-2 text-xs text-scrap-light mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-scrap-primary" />
                <span className="font-semibold text-white">Kochi (Cochin)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-scrap-primary" />
                <span className="font-semibold text-white">Palakkad</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-scrap-primary" />
                <span className="font-semibold text-white">Malappuram</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-scrap-primary" />
                <span className="font-semibold text-white">Thrissur</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-scrap-border flex items-center gap-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-scrap-gold" />
              <span>Verified Local Scrap Collection Partners</span>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-scrap-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-scrap-muted gap-4">
          <p>© {new Date().getFullYear()} scrapUndo Kerala. Serving households and offices.</p>
          <div className="flex items-center gap-1 text-xs">
            <span>Built for sustainable recycling in Kerala</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
