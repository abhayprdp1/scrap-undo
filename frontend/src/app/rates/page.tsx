'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  ArrowRight, 
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { DEMO_RATES, KERALA_CITIES } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';

export default function KeralaRatesPage() {
  const [selectedCity, setSelectedCity] = useState<'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur'>('Kochi');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Electronics', 'Metal', 'Paper', 'Plastic'];

  const filteredRates = useMemo(() => {
    return DEMO_RATES.filter((rate) => {
      const matchesCategory = activeCategory === 'All' || rate.category === activeCategory;
      const matchesSearch =
        rate.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rate.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>scrapUndo Kerala Benchmark Index</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Daily Scrap Market Rates in Kerala
          </h1>
          <p className="text-sm text-scrap-muted">
            Audited daily wholesale benchmark prices for Kochi, Palakkad, Malappuram & Thrissur.
          </p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-scrap-card border border-scrap-border rounded-xl p-2">
          <MapPin className="w-4 h-4 text-scrap-primary ml-1" />
          <span className="text-xs text-scrap-muted">District:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value as any)}
            className="bg-scrap-bg border border-scrap-border text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-scrap-primary"
          >
            <option value="Kochi">Kochi (Ernakulam)</option>
            <option value="Palakkad">Palakkad</option>
            <option value="Malappuram">Malappuram</option>
            <option value="Thrissur">Thrissur</option>
          </select>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-scrap-primary text-black font-bold shadow-glow'
                  : 'text-scrap-muted hover:text-white hover:bg-scrap-card/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-scrap-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material e.g. copper, newspaper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-scrap-bg border border-scrap-border text-white text-xs rounded-xl pl-9 pr-3.5 py-2 focus:outline-none focus:border-scrap-primary placeholder:text-scrap-muted"
          />
        </div>
      </div>

      {/* Grid of Rates with Scroll Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRates.map((rate, index) => (
          <ScrollReveal
            key={rate.id}
            variant="fade-up"
            delay={index % 3 === 0 ? 'delay-100' : index % 3 === 1 ? 'delay-200' : 'delay-300'}
            className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-scrap-bg border border-scrap-border text-scrap-muted">
                  {rate.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-scrap-primary font-medium">
                  <Calendar className="w-3 h-3" /> Today&apos;s Rate
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1">{rate.subcategory}</h3>
              <p className="text-xs text-scrap-muted">
                Price per standard {rate.unit} in {selectedCity}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-scrap-border flex items-end justify-between">
              <div>
                <span className="text-[11px] text-scrap-muted uppercase tracking-wider block">Market Range</span>
                <div className="text-xl font-extrabold text-scrap-gold">
                  ₹{rate.minRate} – ₹{rate.maxRate} <span className="text-xs font-medium text-scrap-muted">/ {rate.unit}</span>
                </div>
              </div>

              <Link
                href="/sell"
                className="p-2.5 rounded-xl bg-scrap-primary/10 hover:bg-scrap-primary text-scrap-primary hover:text-black transition-all group"
                title="Sell this item"
              >
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Trust Banner with Scroll Reveal */}
      <ScrollReveal variant="fade-up" className="mt-12 p-6 rounded-2xl bg-scrap-card/50 border border-scrap-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-scrap-primary flex-shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-white text-sm">Audited Kerala Scrap Pricing</h4>
            <p className="text-scrap-muted leading-relaxed">
              When scrap shops visit your doorstep, certified digital weighing scales ensure 100% fair settlement.
            </p>
          </div>
        </div>
        <Link
          href="/sell"
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-xs shadow-glow transition-all active:scale-95"
        >
          Sell Your Scrap Now
        </Link>
      </ScrollReveal>

    </div>
  );
}
