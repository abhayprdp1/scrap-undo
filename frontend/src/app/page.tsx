'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import KeralaMapCard from '@/components/KeralaMapCard';

export default function HomePage() {
  const liveRatesKerala = [
    { item: 'Copper Wire / Pipes', rate: '₹460 - ₹560', unit: 'kg', trend: '+4%' },
    { item: 'Brass (Pithala)', rate: '₹290 - ₹380', unit: 'kg', trend: '+2%' },
    { item: 'Aluminium Vessels', rate: '₹85 - ₹120', unit: 'kg', trend: '+1%' },
    { item: 'Old CRT / LED TV', rate: '₹250 - ₹900', unit: 'piece', trend: 'High Demand' },
    { item: 'Dead Laptops / PCs', rate: '₹850 - ₹3,200', unit: 'piece', trend: '+5%' },
    { item: 'Newspaper (Pathram)', rate: '₹13 - ₹17', unit: 'kg', trend: 'Stable' },
    { item: 'Carton Boxes', rate: '₹9 - ₹13', unit: 'kg', trend: 'Stable' },
  ];

  return (
    <div className="flex flex-col min-h-screen gradient-mesh">
      
      {/* Top Ticker: Live Kerala Scrap Rates - Unobstructed Smooth Moving Marquee */}
      <div className="w-full bg-[#0c1015] border-b border-scrap-border/70 py-2.5 overflow-hidden relative group">
        {/* Soft edge fade masks so text glides in and out smoothly without getting chopped */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0c1015] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0c1015] to-transparent z-10" />

        {/* Continuous moving ticker stream */}
        <div className="animate-ticker flex items-center whitespace-nowrap">
          {/* Render items duplicated 3 times for a completely seamless, continuous loop */}
          {[...liveRatesKerala, ...liveRatesKerala, ...liveRatesKerala].map((r, i) => (
            <div key={i} className="inline-flex items-center gap-2.5 mx-6 text-xs">
              <span className="w-2 h-2 rounded-full bg-scrap-primary animate-pulse" />
              <span className="text-scrap-muted font-medium">{r.item}:</span>
              <span className="font-extrabold text-white text-sm">{r.rate}/{r.unit}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${r.trend.startsWith('+') ? 'bg-scrap-primary/15 text-scrap-primary' : 'bg-scrap-gold/15 text-scrap-gold'}`}>
                {r.trend}
              </span>
              <span className="text-scrap-border/60 ml-2">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Prop with Scroll Reveal */}
          <ScrollReveal variant="fade-up" className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Available in Kochi • Palakkad • Malappuram • Thrissur</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Sell Your Household Scrap with <span className="text-transparent bg-clip-text bg-gradient-to-r from-scrap-primary via-emerald-400 to-scrap-gold">Instant AI Pricing</span>.
            </h1>

            <p className="text-base sm:text-lg text-scrap-muted max-w-2xl leading-relaxed">
              Upload a photo of your old TV, newspaper stack, or metal scrap. Our AI assumes the fair market value, locates verified scrap shops near your location in Kerala, and dispatches doorstep collection with instant cash handover.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/seller/new-listing"
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-scrap-primary to-emerald-500 hover:from-scrap-primaryHover hover:to-emerald-400 text-black font-extrabold text-base shadow-glow transition-all hover:scale-[1.02] active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>Upload Photo & Sell Scrap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/calculator"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-scrap-card hover:bg-scrap-cardHover border border-scrap-border hover:border-scrap-borderHover text-white font-semibold text-base transition-all active:scale-95"
              >
                <span>Check Price Calculator</span>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-scrap-border/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-scrap-primary flex-shrink-0" />
                <span className="text-xs text-scrap-muted font-medium">OTP Secured Cash</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-scrap-primary flex-shrink-0" />
                <span className="text-xs text-scrap-muted font-medium">Digital Scale Weighing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-scrap-primary flex-shrink-0" />
                <span className="text-xs text-scrap-muted font-medium">Verified Nearby Shops</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Kerala Map Card */}
          <ScrollReveal variant="fade-right" delay="delay-200" className="lg:col-span-5 relative">
            <KeralaMapCard />
          </ScrollReveal>

        </div>
      </section>

      {/* 4-Step User Journey with Scroll Reveal Animation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-scrap-border/60">
        <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-xs uppercase font-bold text-scrap-primary tracking-widest">Simple 4-Step Doorstep Pickup</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">How to Sell Your Scrap</p>
          <p className="text-sm text-scrap-muted">Zero haggling. We locate nearby collection shops in Kerala with fair certified pricing.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <ScrollReveal variant="fade-up" delay="delay-100" className="glass-card glass-card-hover rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-scrap-primary/10 border border-scrap-primary/30 flex items-center justify-center text-scrap-primary font-extrabold text-base mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Upload Scrap Photo</h3>
            <p className="text-xs text-scrap-muted leading-relaxed">
              Upload any image of your scrap items—old TVs, laptops, newspapers, copper wires, or plastic cartons.
            </p>
          </ScrollReveal>

          {/* Step 2 */}
          <ScrollReveal variant="fade-up" delay="delay-200" className="glass-card glass-card-hover rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-scrap-gold/10 border border-scrap-gold/30 flex items-center justify-center text-scrap-gold font-extrabold text-base mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI Assumes the Price</h3>
            <p className="text-xs text-scrap-muted leading-relaxed">
              Our Vision AI analyzes the materials and displays fair market rates based on Kerala wholesale rate cards.
            </p>
          </ScrollReveal>

          {/* Step 3 */}
          <ScrollReveal variant="fade-up" delay="delay-300" className="glass-card glass-card-hover rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Locate Nearby Shops</h3>
            <p className="text-xs text-scrap-muted leading-relaxed">
              Input your Kerala location (Kochi, Palakkad, Malappuram, Thrissur). We list verified scrap shops near you.
            </p>
          </ScrollReveal>

          {/* Step 4 */}
          <ScrollReveal variant="fade-up" delay="delay-400" className="glass-card glass-card-hover rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-base mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-white mb-2">Book Slot & Cash on Pickup</h3>
            <p className="text-xs text-scrap-muted leading-relaxed">
              Choose your collection slot. The collector visits with a digital scale and hands over cash with an OTP receipt.
            </p>
          </ScrollReveal>

        </div>
      </section>

      {/* Kerala Service Districts Grid with Scroll Reveal */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ScrollReveal variant="fade-up" className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs uppercase font-bold text-scrap-primary tracking-widest">Kerala Coverage</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">Active Doorstep Service Cities</p>
          <p className="text-xs text-scrap-muted">Verified scrap shops ready for immediate collection across 4 key districts</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { city: 'Kochi (Ernakulam)', areas: 'Kakkanad, Edappally, Palarivattom, Vyttila, Aluva', shops: '14 Active Shops' },
            { city: 'Palakkad', areas: 'Olavakkode, TB Road, Victoria College area, Kanjikode', shops: '9 Active Shops' },
            { city: 'Malappuram', areas: 'Down Hill, Kottakkal, Manjeri Road, Perinthalmanna', shops: '8 Active Shops' },
            { city: 'Thrissur', areas: 'Round West, Ollur Industrial Belt, Punkunnam, Ayyanthole', shops: '11 Active Shops' },
          ].map((loc, i) => (
            <ScrollReveal
              key={i}
              variant="fade-up"
              delay={i === 0 ? 'delay-100' : i === 1 ? 'delay-200' : i === 2 ? 'delay-300' : 'delay-400'}
              className="glass-card rounded-2xl p-6 border-scrap-border hover:border-scrap-primary/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <MapPin className="w-5 h-5 text-scrap-primary" />
                <span className="text-[10px] font-bold text-scrap-gold bg-scrap-gold/10 px-2 py-0.5 rounded border border-scrap-gold/20">
                  {loc.shops}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{loc.city}</h3>
              <p className="text-xs text-scrap-muted">{loc.areas}</p>
              <div className="pt-2">
                <Link
                  href="/seller/new-listing"
                  className="text-xs text-scrap-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Book pickup in {loc.city.split(' ')[0]} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Direct Call to Action with Scroll Animation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ScrollReveal variant="fade-up" className="rounded-3xl bg-gradient-to-r from-scrap-card via-scrap-cardHover to-scrap-card border border-scrap-primary/40 p-8 sm:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Ready to Clear Your Scrap & Get Paid Cash Today?
          </h2>
          <p className="text-xs sm:text-sm text-scrap-muted max-w-xl mx-auto">
            Takes less than 60 seconds. Upload a photo, pick your local scrap shop in Kerala, and get doorstep collection.
          </p>
          <div>
            <Link
              href="/seller/new-listing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-extrabold text-base shadow-glow transition-all hover:scale-[1.02] active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Sell Your Scrap Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
