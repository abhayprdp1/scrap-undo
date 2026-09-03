'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { DEMO_RATES } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';

interface SelectedScrapItem {
  id: string;
  category: string;
  subcategory: string;
  qty: number;
  unit: string;
  minRate: number;
  maxRate: number;
}

export default function CalculatorPage() {
  const [city, setCity] = useState('Kochi');
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [selectedSubcategory, setSelectedSubcategory] = useState('CRT TV');
  const [qtyInput, setQtyInput] = useState<number>(1);
  const [itemsList, setItemsList] = useState<SelectedScrapItem[]>([
    {
      id: 'item-1',
      category: 'Electronics',
      subcategory: 'CRT TV',
      qty: 1,
      unit: 'piece',
      minRate: 200,
      maxRate: 500,
    },
    {
      id: 'item-2',
      category: 'Paper',
      subcategory: 'Newspaper',
      qty: 15,
      unit: 'kg',
      minRate: 12,
      maxRate: 16,
    },
    {
      id: 'item-3',
      category: 'Metal',
      subcategory: 'Copper',
      qty: 2,
      unit: 'kg',
      minRate: 450,
      maxRate: 550,
    },
  ]);

  const categories = useMemo(() => {
    return Array.from(new Set(DEMO_RATES.map((r) => r.category)));
  }, []);

  const availableSubcategories = useMemo(() => {
    return DEMO_RATES.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  const currentRate = useMemo(() => {
    return DEMO_RATES.find(
      (r) => r.category === selectedCategory && r.subcategory === selectedSubcategory
    ) || availableSubcategories[0] || DEMO_RATES[0];
  }, [selectedCategory, selectedSubcategory, availableSubcategories]);

  const handleAddItem = () => {
    if (!currentRate || qtyInput <= 0) return;

    const newItem: SelectedScrapItem = {
      id: 'item-' + Date.now(),
      category: currentRate.category,
      subcategory: currentRate.subcategory,
      qty: qtyInput,
      unit: currentRate.unit,
      minRate: currentRate.minRate,
      maxRate: currentRate.maxRate,
    };

    setItemsList((prev) => [...prev, newItem]);
    setQtyInput(1);
  };

  const handleRemoveItem = (id: string) => {
    setItemsList((prev) => prev.filter((i) => i.id !== id));
  };

  const totals = useMemo(() => {
    let min = 0;
    let max = 0;
    let totalKg = 0;

    itemsList.forEach((item) => {
      min += item.qty * item.minRate;
      max += item.qty * item.maxRate;
      if (item.unit === 'kg') totalKg += item.qty;
      else totalKg += item.qty * 4; // approx equivalent
    });

    const co2Saved = totalKg * 2.2;

    return {
      min: Math.round(min),
      max: Math.round(max),
      totalKg: Math.round(totalKg),
      co2Saved: Math.round(co2Saved),
    };
  }, [itemsList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="max-w-3xl mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Public Valuation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Free Scrap Value Calculator
        </h1>
        <p className="text-sm text-scrap-muted">
          Estimate how much cash your household scrap or office waste is worth based on verified city rate cards. Add items to create a digital estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Select Scrap & Add */}
        <ScrollReveal variant="fade-up" className="lg:col-span-7 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-scrap-border">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-scrap-primary" />
                <span>Add Scrap Items to Calculator</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-scrap-muted">City:</span>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-scrap-bg border border-scrap-border text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-scrap-primary"
                >
                  <option value="Kochi">Kochi (Ernakulam)</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Thrissur">Thrissur</option>
                </select>
              </div>
            </div>

            {/* Category selection tabs */}
            <div>
              <label className="block text-xs font-medium text-scrap-muted mb-2">1. Select Material Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      const firstSub = DEMO_RATES.find((r) => r.category === cat)?.subcategory || '';
                      setSelectedSubcategory(firstSub);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      selectedCategory === cat
                        ? 'bg-scrap-primary text-black font-bold shadow-glow'
                        : 'bg-scrap-bg border border-scrap-border text-scrap-muted hover:text-white hover:border-scrap-borderHover'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategory & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-scrap-muted mb-2">2. Item Type</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-scrap-primary"
                >
                  {availableSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.subcategory}>
                      {sub.subcategory} (₹{sub.minRate} - ₹{sub.maxRate}/{sub.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-scrap-muted mb-2">
                  3. Approximate Quantity ({currentRate?.unit || 'kg'})
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={qtyInput}
                    onChange={(e) => setQtyInput(Math.max(1, Number(e.target.value)))}
                    className="flex-1 bg-scrap-bg border border-scrap-border text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-scrap-primary"
                  />
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Rate Tip */}
            {currentRate && (
              <div className="p-3 rounded-xl bg-scrap-bg border border-scrap-border flex items-center justify-between text-xs">
                <span className="text-scrap-muted">Market rate for {currentRate.subcategory}:</span>
                <span className="text-scrap-gold font-bold">
                  ₹{currentRate.minRate} – ₹{currentRate.maxRate} per {currentRate.unit}
                </span>
              </div>
            )}

          </div>

          {/* List of Added Items */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-scrap-border">
              <h3 className="text-sm font-bold text-white">Your Scrap Inventory ({itemsList.length} items)</h3>
              {itemsList.length > 0 && (
                <button
                  onClick={() => setItemsList([])}
                  className="text-xs text-scrap-muted hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {itemsList.length === 0 ? (
              <div className="py-8 text-center text-scrap-muted text-xs">
                No items added yet. Choose a category above and click Add!
              </div>
            ) : (
              <div className="space-y-2.5">
                {itemsList.map((item) => {
                  const itemMin = item.qty * item.minRate;
                  const itemMax = item.qty * item.maxRate;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-scrap-bg border border-scrap-border hover:border-scrap-borderHover transition-all"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{item.subcategory}</div>
                        <div className="text-xs text-scrap-muted">
                          {item.qty} {item.unit} • ₹{item.minRate} - ₹{item.maxRate}/{item.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-scrap-gold">₹{itemMin} – ₹{itemMax}</div>
                          <div className="text-[10px] text-scrap-muted">Est. value</div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-scrap-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </ScrollReveal>

        {/* Right Summary: Cash Payout Estimation & Instant Book CTA */}
        <ScrollReveal variant="fade-up" delay="delay-200" className="lg:col-span-5 space-y-6">
          
          <div className="glass-card rounded-2xl p-6 space-y-6 border-scrap-primary/30 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-scrap-primary">Calculated Valuation</span>
              <h3 className="text-xl font-extrabold text-white">Estimated Doorstep Payout</h3>
            </div>

            <div className="p-5 rounded-2xl bg-scrap-bg border border-scrap-border text-center space-y-1">
              <span className="text-xs text-scrap-muted">Expected Cash Range</span>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-scrap-gold via-yellow-300 to-amber-400">
                ₹{totals.min.toLocaleString()} – ₹{totals.max.toLocaleString()}
              </div>
              <p className="text-[11px] text-scrap-muted pt-1">
                Final amount confirmed on-site using digital weighing scales
              </p>
            </div>

            {/* Environmental impact metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-scrap-bg border border-scrap-border">
                <div className="text-xs text-scrap-muted">Total Scrap</div>
                <div className="text-lg font-bold text-white mt-0.5">{totals.totalKg} kg</div>
              </div>
              <div className="p-3 rounded-xl bg-scrap-bg border border-scrap-border">
                <div className="text-xs text-scrap-muted">CO₂ Avoided</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">~{totals.co2Saved} kg</div>
              </div>
            </div>

            {/* Direct Conversion CTA */}
            <div className="space-y-3 pt-2">
              <Link
                href="/seller/new-listing"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all hover:scale-[1.02]"
              >
                <span>Book Doorstep Pickup for this Scrap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-2 text-xs text-scrap-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-scrap-primary" />
                <span>Zero pickup fee • Cash handover at doorstep</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 rounded-xl bg-scrap-card/50 border border-scrap-border/50 text-[11px] text-scrap-muted leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-scrap-muted flex-shrink-0 mt-0.5" />
              <span>
                Rates are benchmarked against official wholesale Mandi / recycling yard prices in {city}. Heavily soiled paper or damaged electronics may be quoted at lower salvage values.
              </span>
            </div>

          </div>

        </ScrollReveal>

      </div>

    </div>
  );
}
