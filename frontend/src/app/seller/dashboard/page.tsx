'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  Banknote, 
  Scale, 
  TreePine, 
  PlusCircle, 
  Clock, 
  Truck, 
  Store,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import ScrollReveal from '@/components/ScrollReveal';

interface BookingRecord {
  id: string;
  items: string;
  status: 'SCHEDULED' | 'COLLECTED';
  slot: string;
  shopName: string;
  shopPhone: string;
  estRange: string;
  otpCode: string;
  address: string;
}

export default function MyBookingsDashboard() {
  const { user } = useAuth();

  const [bookings] = useState<BookingRecord[]>([
    {
      id: 'bk-koc-101',
      items: 'Old CRT TV (1 pc) • Newspaper (14 kg)',
      status: 'SCHEDULED',
      slot: 'Tomorrow • 9:00 AM – 12:00 PM',
      shopName: 'Cochin Green Recyclers & Scrap Mart',
      shopPhone: '+91 94470 12345',
      estRange: '₹430 – ₹680',
      otpCode: '4829',
      address: 'Edappally Toll Junction, Kochi, Kerala',
    },
    {
      id: 'bk-koc-098',
      items: 'Copper wires (3.5 kg) • Aluminium frames (5 kg)',
      status: 'COLLECTED',
      slot: 'Yesterday • 11:00 AM',
      shopName: 'Kochi Metro E-Waste & Metal Traders',
      shopPhone: '+91 98460 67890',
      estRange: '₹2,250 (Cash Paid)',
      otpCode: '1984',
      address: 'Edappally Toll Junction, Kochi, Kerala',
    },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-scrap-border">
        <div>
          <span className="text-xs font-semibold text-scrap-primary uppercase tracking-wider">scrapUndo Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Scrap Bookings
          </h1>
          <p className="text-xs text-scrap-muted mt-0.5">
            Hello, <span className="text-white font-semibold">{user?.name || 'Abhay P'}</span> • Location: <span className="text-scrap-gold font-semibold">{user?.city || 'Kochi'}, Kerala</span>
          </p>
        </div>

        <Link
          href="/seller/new-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Sell More Scrap</span>
        </Link>
      </div>

      {/* Environmental Impact Statistics with Scroll Reveal */}
      <ScrollReveal variant="fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Your Cumulative Recycling Impact</span>
          </h2>
          <span className="text-xs text-scrap-muted">scrapUndo Kerala Initiative</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-scrap-muted">Scrap Sold</span>
              <Scale className="w-4 h-4 text-scrap-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">22.5 kg</div>
            <p className="text-[11px] text-scrap-muted mt-1">Diverted from Kerala landfills</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border-scrap-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-scrap-muted">CO₂ Avoided</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">~49.5 kg</div>
            <p className="text-[11px] text-scrap-muted mt-1">Emissions saved</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border-scrap-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-scrap-muted">Trees Saved</span>
              <TreePine className="w-4 h-4 text-scrap-gold" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-scrap-gold">0.6 Trees</div>
            <p className="text-[11px] text-scrap-muted mt-1">Via recycled papers</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border-scrap-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-scrap-muted">Cash Received</span>
              <Banknote className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">₹2,250</div>
            <p className="text-[11px] text-scrap-muted mt-1">Paid directly on collection</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-scrap-primary" />
          <span>Active Doorstep Pickups</span>
        </h2>

        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <ScrollReveal
              key={booking.id}
              variant="fade-up"
              delay={idx === 0 ? 'delay-100' : 'delay-200'}
              className="glass-card rounded-2xl p-6 border-scrap-border hover:border-scrap-borderHover transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-scrap-border gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'SCHEDULED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-scrap-primary/20 text-scrap-primary border border-scrap-primary/30'
                  }`}>
                    {booking.status === 'SCHEDULED' ? 'Collector Assigned • Confirmed' : 'Collected & Paid'}
                  </span>
                  <span className="text-xs text-scrap-muted">Booking #{booking.id}</span>
                </div>

                <span className="text-xs text-scrap-light font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-scrap-gold" /> {booking.slot}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Scrap Items & Address */}
                <div className="md:col-span-6 space-y-1">
                  <h3 className="text-base font-bold text-white">{booking.items}</h3>
                  <p className="text-xs text-scrap-muted flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-scrap-primary" /> {booking.address}
                  </p>
                  <p className="text-xs text-scrap-gold font-semibold">Estimated Value: {booking.estRange}</p>
                </div>

                {/* Assigned Scrap Shop */}
                <div className="md:col-span-3 p-3 rounded-xl bg-scrap-bg border border-scrap-border space-y-1 text-xs">
                  <span className="text-[10px] text-scrap-muted uppercase tracking-wider block flex items-center gap-1">
                    <Store className="w-3 h-3 text-scrap-primary" /> Collecting Scrap Shop
                  </span>
                  <p className="font-bold text-white">{booking.shopName}</p>
                  <p className="text-scrap-muted">{booking.shopPhone}</p>
                </div>

                {/* Secure OTP Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-gradient-to-br from-scrap-primary/10 to-transparent border border-scrap-primary/30 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-scrap-primary tracking-wider block">
                    Your Pickup OTP
                  </span>
                  <div className="text-2xl font-black font-mono tracking-widest text-white">
                    {booking.otpCode}
                  </div>
                  <p className="text-[10px] text-scrap-muted">
                    Give to collector after cash handover
                  </p>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

    </div>
  );
}
