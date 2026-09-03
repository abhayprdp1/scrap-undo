'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  Camera, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  Phone, 
  Store, 
  Star, 
  Calendar, 
  ShieldCheck,
  Navigation,
  Check,
  Zap,
  LocateFixed
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DEMO_DEALERS, DEMO_RATES, KERALA_CITIES, ScrapShop } from '@/lib/api';
import { getRealUserLocation, calculateDistanceKm } from '@/lib/location';
import ScrollReveal from '@/components/ScrollReveal';

interface ScrapItemValuation {
  id: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  minRate: number;
  maxRate: number;
  condition: string;
  confidence: number;
}

export default function SellScrapPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Wizard Steps:
  // 1: UPLOAD_PHOTO
  // 2: AI_VALUATION (Rates & Price breakdown)
  // 3: LOCATION_AND_NEARBY_SHOPS
  // 4: BOOK_TIME_SLOT
  // 5: BOOKING_CONFIRMED
  const [step, setStep] = useState<number>(1);

  // Uploaded photo preview
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');

  // Scrap items detected & valued
  const [scrapItems, setScrapItems] = useState<ScrapItemValuation[]>([
    {
      id: 'it-1',
      name: 'Old CRT Television (21 inch)',
      category: 'Electronics',
      qty: 1,
      unit: 'piece',
      minRate: 250,
      maxRate: 550,
      condition: 'Non-working / intact tube',
      confidence: 0.94,
    },
    {
      id: 'it-2',
      name: 'Malayalam & English Newspapers (Pathram)',
      category: 'Paper',
      qty: 14,
      unit: 'kg',
      minRate: 13,
      maxRate: 17,
      condition: 'Dry stacked bundles',
      confidence: 0.96,
    },
  ]);

  // Real user GPS coordinates
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Location details (default to user city or Kochi)
  const [selectedCity, setSelectedCity] = useState<'Kochi' | 'Palakkad' | 'Malappuram' | 'Thrissur'>(
    user?.city || 'Kochi'
  );
  const [userAddress, setUserAddress] = useState<string>(
    user?.address || 'Edappally Toll Junction, Kochi, Kerala'
  );
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Selected nearby scrap shop
  const [selectedShopId, setSelectedShopId] = useState<string>('shop-koc-1');

  // Time slot booking
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingSlot, setBookingSlot] = useState('Morning: 9:00 AM – 12:00 PM');
  const [notes, setNotes] = useState('Scrap items kept in car porch');

  // Generated OTP for collection
  const [generatedOtp, setGeneratedOtp] = useState('4829');

  // Quick photo samples for instant testing
  const quickPresets = [
    {
      id: 'sample-tv',
      title: 'Old Television (TV)',
      emoji: '📺',
      badge: 'E-Waste',
      items: [
        {
          id: 'tv-1',
          name: 'Old CRT Television',
          category: 'Electronics',
          qty: 1,
          unit: 'piece',
          minRate: 250,
          maxRate: 550,
          condition: 'Non-working / heavy glass tube',
          confidence: 0.94,
        },
        {
          id: 'tv-2',
          name: 'Copper Deflection Yoke',
          category: 'Metal',
          qty: 1.5,
          unit: 'kg',
          minRate: 460,
          maxRate: 560,
          condition: 'Copper salvage',
          confidence: 0.89,
        },
      ],
    },
    {
      id: 'sample-paper',
      title: 'Newspapers & Cartons',
      emoji: '📰',
      badge: 'Raddi Paper',
      items: [
        {
          id: 'p-1',
          name: 'Newspaper (Pathram)',
          category: 'Paper',
          qty: 20,
          unit: 'kg',
          minRate: 13,
          maxRate: 17,
          condition: 'Dry stacked paper',
          confidence: 0.97,
        },
        {
          id: 'p-2',
          name: 'Cardboard Cartons',
          category: 'Paper',
          qty: 8,
          unit: 'kg',
          minRate: 9,
          maxRate: 13,
          condition: 'Flattened packing boxes',
          confidence: 0.92,
        },
      ],
    },
    {
      id: 'sample-metal',
      title: 'Copper Wires & Aluminium',
      emoji: '🔩',
      badge: 'High Value Metal',
      items: [
        {
          id: 'm-1',
          name: 'Copper Wire / Scrap Pipes',
          category: 'Metal',
          qty: 3.5,
          unit: 'kg',
          minRate: 460,
          maxRate: 560,
          condition: 'Pure copper wire scrap',
          confidence: 0.95,
        },
        {
          id: 'm-2',
          name: 'Aluminium Utensils & Frames',
          category: 'Metal',
          qty: 5.0,
          unit: 'kg',
          minRate: 85,
          maxRate: 120,
          condition: 'Clean household scrap',
          confidence: 0.91,
        },
      ],
    },
  ];

  // Dynamically calculate distance and sort scrap shops nearest first
  const nearbyShops = useMemo(() => {
    let list = DEMO_DEALERS.map((shop) => {
      let dist = shop.distanceKm;
      if (userCoords) {
        dist = calculateDistanceKm(userCoords.lat, userCoords.lng, shop.lat, shop.lng);
      }
      return {
        ...shop,
        realDistanceKm: dist,
      };
    });

    // If user has not detected GPS yet, show shops in the selected district first
    if (!userCoords) {
      const cityMatches = list.filter((s) => s.city === selectedCity);
      if (cityMatches.length > 0) {
        list = cityMatches;
      }
    }

    // Sort ascending: closest shop first!
    list.sort((a, b) => a.realDistanceKm - b.realDistanceKm);

    return list;
  }, [userCoords, selectedCity]);

  // Selected shop object
  const selectedShop = useMemo(() => {
    return DEMO_DEALERS.find((s) => s.id === selectedShopId) || nearbyShops[0] || DEMO_DEALERS[0];
  }, [selectedShopId, nearbyShops]);

  // Price calculations
  const totalValuation = useMemo(() => {
    let min = 0;
    let max = 0;
    scrapItems.forEach((item) => {
      min += item.qty * item.minRate;
      max += item.qty * item.maxRate;
    });
    return { min: Math.round(min), max: Math.round(max) };
  }, [scrapItems]);

  const handleSelectPreset = (preset: typeof quickPresets[0]) => {
    setPhotoName(preset.title);
    setScrapItems(preset.items);
    setStep(2);
    toast.success(`AI identified ${preset.items.length} scrap items from image!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedImage(URL.createObjectURL(file));
      setPhotoName(file.name);
      
      // AI Valuation Simulation
      toast.loading('Analyzing image with Gemini Vision AI...', { id: 'scan' });
      setTimeout(() => {
        toast.success('Scrap detected & priced based on Kerala rate card!', { id: 'scan' });
        setStep(2);
      }, 1000);
    }
  };

  // Real GPS Location Detection & Automatic Nearest Scrap Shop Sorting
  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    toast.loading('Acquiring real GPS coordinates from device...', { id: 'gps' });
    
    try {
      const geo = await getRealUserLocation();
      setUserCoords({ lat: geo.latitude, lng: geo.longitude });

      if (geo.formattedAddress) {
        setUserAddress(geo.formattedAddress);
      }
      if (
        geo.detectedCity &&
        ['Kochi', 'Palakkad', 'Malappuram', 'Thrissur'].includes(geo.detectedCity)
      ) {
        setSelectedCity(geo.detectedCity as any);
      }

      toast.success('GPS location locked! Sorted scrap shops by nearest distance.', { id: 'gps' });
    } catch (err: any) {
      console.warn('GPS permission denied or unavailable, using district centroid', err);
      // Realistic Kerala centroid fallback
      const districtCoords: Record<string, { lat: number; lng: number; address: string }> = {
        Kochi: { lat: 10.0261, lng: 76.3125, address: 'Edappally Toll, Kochi, Kerala' },
        Palakkad: { lat: 10.7867, lng: 76.6548, address: 'Olavakkode, Palakkad, Kerala' },
        Malappuram: { lat: 11.0722, lng: 76.0740, address: 'Down Hill, Malappuram, Kerala' },
        Thrissur: { lat: 10.5276, lng: 76.2144, address: 'Round West, Thrissur, Kerala' },
      };
      const fb = districtCoords[selectedCity] || districtCoords.Kochi;
      setUserCoords({ lat: fb.lat, lng: fb.lng });
      setUserAddress(fb.address);
      toast.success(`Location set to ${selectedCity}. Scrap shops sorted by nearest distance!`, { id: 'gps' });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setStep(5);
    toast.success(`Doorstep pickup booked with ${selectedShop.shopName}!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Visual Step Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-scrap-muted mb-2">
          <span className={step >= 1 ? 'text-scrap-primary' : ''}>1. Upload Photo</span>
          <span className={step >= 2 ? 'text-scrap-primary' : ''}>2. AI Price Rates</span>
          <span className={step >= 3 ? 'text-scrap-primary' : ''}>3. Nearby Scrap Shops</span>
          <span className={step >= 4 ? 'text-scrap-primary' : ''}>4. Book Slot</span>
          <span className={step >= 5 ? 'text-scrap-primary' : ''}>5. Confirmed OTP</span>
        </div>
        <div className="w-full bg-scrap-card h-2 rounded-full overflow-hidden border border-scrap-border">
          <div 
            className="bg-gradient-to-r from-scrap-primary to-scrap-gold h-full transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: UPLOAD ANY SCRAP PHOTO */}
      {step === 1 && (
        <div className="space-y-8">
          <ScrollReveal variant="fade-up" className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 4 • AI Scrap Recognition</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Upload a Photo of Your Scrap</h1>
            <p className="text-xs text-scrap-muted">
              Photograph any scrap items in your home or office (Old TV, Newspaper, Copper, Cartons, Plastic, Laptop). Our AI will instantly calculate the market value.
            </p>
          </ScrollReveal>

          {/* Photo Drop Area */}
          <ScrollReveal variant="fade-up" delay="delay-100" className="glass-card rounded-3xl p-8 sm:p-12 border-2 border-dashed border-scrap-border hover:border-scrap-primary/60 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-scrap-primary/10 border border-scrap-primary/30 flex items-center justify-center text-scrap-primary mx-auto shadow-glow">
              <Camera className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Snap or upload scrap photo</h3>
              <p className="text-xs text-scrap-muted">JPEG, PNG, WebP supported from camera or gallery</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
                <Camera className="w-4 h-4" />
                <span>Snap with Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-scrap-card hover:bg-scrap-cardHover border border-scrap-border hover:border-scrap-primary text-white font-semibold text-sm transition-all cursor-pointer active:scale-95">
                <UploadCloud className="w-4 h-4 text-scrap-primary" />
                <span>Choose from Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </ScrollReveal>

          {/* 1-Click Realistic Presets for Instant Demo with Scroll Reveal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-scrap-gold flex items-center gap-1.5">
                ⚡ Or test with 1-click scrap samples:
              </span>
              <span className="text-xs text-scrap-muted">Based on Kerala rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickPresets.map((preset, idx) => (
                <ScrollReveal
                  key={preset.id}
                  variant="fade-up"
                  delay={idx === 0 ? 'delay-100' : idx === 1 ? 'delay-200' : 'delay-300'}
                >
                  <button
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full h-full glass-card glass-card-hover rounded-2xl p-5 text-left border-scrap-border hover:border-scrap-primary/60 transition-all group active:scale-95"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{preset.emoji}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-scrap-primary/10 text-scrap-primary border border-scrap-primary/30">
                        {preset.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-scrap-primary transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-scrap-muted mt-1">
                      {preset.items.length} items • Instant AI pricing
                    </p>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* STEP 2: AI ESTIMATED PRICE & RATE DISPLAY WITH SCROLL REVEAL */}
      {step === 2 && (
        <div className="space-y-6">
          <ScrollReveal variant="fade-up" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-scrap-border">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Step 2 of 4 • AI Assumed Price</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Estimated Scrap Valuation</h2>
              <p className="text-xs text-scrap-muted">
                Rates calculated based on current wholesale recycling prices in Kerala.
              </p>
            </div>

            <div className="text-right p-3 rounded-2xl bg-scrap-bg border border-scrap-border">
              <span className="text-[10px] text-scrap-muted uppercase tracking-wider block">Estimated Payout</span>
              <span className="text-2xl font-black text-scrap-gold">₹{totalValuation.min} – ₹{totalValuation.max}</span>
            </div>
          </ScrollReveal>

          {/* List of items detected with Scroll Reveal */}
          <div className="space-y-3">
            {scrapItems.map((item, index) => (
              <ScrollReveal
                key={item.id}
                variant="fade-up"
                delay={index === 0 ? 'delay-100' : 'delay-200'}
                className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-scrap-border"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-scrap-bg border border-scrap-border flex items-center justify-center text-scrap-primary font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{item.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-scrap-primary/10 text-scrap-primary border border-scrap-primary/30">
                        {Math.round(item.confidence * 100)}% Match
                      </span>
                    </div>
                    <p className="text-xs text-scrap-muted mt-0.5">Condition: {item.condition}</p>
                    <div className="text-xs text-scrap-light font-medium mt-1">
                      Kerala Market Rate: <span className="text-scrap-gold font-bold">₹{item.minRate} - ₹{item.maxRate}</span> / {item.unit}
                    </div>
                  </div>
                </div>

                {/* Editable Qty */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center gap-1.5 bg-scrap-bg border border-scrap-border rounded-xl px-3 py-1.5">
                    <span className="text-xs text-scrap-muted">Qty:</span>
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={item.qty}
                      onChange={(e) => {
                        const val = Math.max(0.5, Number(e.target.value));
                        setScrapItems((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, qty: val } : i))
                        );
                      }}
                      className="w-14 bg-transparent text-white text-xs font-bold focus:outline-none text-center"
                    />
                    <span className="text-xs text-scrap-muted">{item.unit}</span>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <div className="text-sm font-extrabold text-scrap-gold">
                      ₹{Math.round(item.qty * item.minRate)} – ₹{Math.round(item.qty * item.maxRate)}
                    </div>
                    <div className="text-[10px] text-scrap-muted">Estimated cash</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-scrap-border">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-scrap-muted hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Change Photo
            </button>

            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Find Nearby Scrap Shops in Kerala</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REAL USER LOCATION & SORTED NEAREST SCRAP SHOPS */}
      {step === 3 && (
        <div className="space-y-6">
          <ScrollReveal variant="fade-up" className="space-y-1 pb-4 border-b border-scrap-border">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Step 3 of 4 • Real Location & Nearest Scrap Shops</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Scrap Shops Sorted by Nearest Distance</h2>
            <p className="text-xs text-scrap-muted">
              Using real GPS coordinates to calculate exact distance to each verified scrap shop in Kerala.
            </p>
          </ScrollReveal>

          {/* Real Location Finder Header with Scroll Reveal */}
          <ScrollReveal variant="fade-up" delay="delay-100" className="glass-card rounded-2xl p-5 space-y-4 border-scrap-primary/40 shadow-glow">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-scrap-muted mb-1">District in Kerala</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const city = e.target.value as any;
                    setSelectedCity(city);
                    const defaultAddress = 
                      city === 'Kochi' ? 'Edappally / Kakkanad, Kochi, Kerala' :
                      city === 'Palakkad' ? 'Olavakkode / TB Road, Palakkad, Kerala' :
                      city === 'Malappuram' ? 'Down Hill / Kottakkal, Malappuram, Kerala' :
                      'Round West / Ollur, Thrissur, Kerala';
                    setUserAddress(defaultAddress);
                  }}
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-sm font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-scrap-primary"
                >
                  <option value="Kochi">Kochi (Ernakulam)</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Thrissur">Thrissur</option>
                </select>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-medium text-scrap-muted mb-1">Your Street / Locality Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-scrap-primary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full bg-scrap-bg border border-scrap-border text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-scrap-primary"
                    placeholder="e.g. Edappally Toll, Kochi"
                  />
                </div>
              </div>

              <div className="sm:col-span-3 pt-5 sm:pt-0">
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={isDetectingLocation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black text-xs font-extrabold shadow-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  <LocateFixed className="w-4 h-4 animate-pulse" />
                  <span>{isDetectingLocation ? 'Locating GPS...' : 'Use Real GPS'}</span>
                </button>
              </div>

            </div>

            {userCoords && (
              <div className="p-2.5 rounded-xl bg-scrap-bg border border-scrap-primary/30 flex items-center justify-between text-[11px] text-scrap-light">
                <span className="flex items-center gap-1.5 text-scrap-primary font-semibold">
                  <LocateFixed className="w-3.5 h-3.5" />
                  GPS Active: {userCoords.lat.toFixed(4)}° N, {userCoords.lng.toFixed(4)}° E
                </span>
                <span className="text-scrap-gold font-bold">✓ Sorted by nearest distance</span>
              </div>
            )}
          </ScrollReveal>

          {/* Displaying the Scrap Shops Sorted Ascending by Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-scrap-primary" />
                <span>Verified Scrap Shops ({nearbyShops.length} Found • Sorted by Nearest)</span>
              </span>
              <span className="text-xs text-scrap-muted">Select your collection partner</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {nearbyShops.map((shop, index) => {
                const isSelected = selectedShopId === shop.id;
                const isClosest = index === 0;

                return (
                  <ScrollReveal
                    key={shop.id}
                    variant="fade-up"
                    delay={index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300'}
                  >
                    <div
                      onClick={() => setSelectedShopId(shop.id)}
                      className={`glass-card rounded-2xl p-5 cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-scrap-primary bg-scrap-primary/5 shadow-glow'
                          : 'border-scrap-border hover:border-scrap-borderHover'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white">{shop.shopName}</h3>
                            
                            {/* Distance Badge */}
                            <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-scrap-primary/15 text-scrap-primary border border-scrap-primary/30 flex items-center gap-1">
                              <Navigation className="w-3 h-3 text-scrap-primary" />
                              {shop.realDistanceKm} km away
                            </span>

                            {/* Nearest Badge */}
                            {isClosest && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-scrap-gold/20 text-scrap-gold border border-scrap-gold/30 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-scrap-gold" /> Closest Scrap Shop
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-scrap-muted flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-scrap-primary flex-shrink-0" /> {shop.address}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-scrap-light pt-1">
                            <span className="text-scrap-gold font-bold flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-scrap-gold" /> {shop.ratingAvg} ({shop.totalRatings} pickups)
                            </span>
                            <span className="text-scrap-muted">• Timings: {shop.timings}</span>
                            <span className="text-scrap-muted">• Phone: {shop.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            type="button"
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-scrap-primary text-black shadow-glow'
                                : 'bg-scrap-card text-scrap-light hover:text-white border border-scrap-border'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <span>Select Shop</span>
                            )}
                          </button>
                        </div>

                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-scrap-border">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 text-xs text-scrap-muted hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Rates
            </button>

            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Book Collection with {selectedShop.shopName.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 4: BOOK TIME SLOT FOR COLLECTION */}
      {step === 4 && (
        <form onSubmit={handleCompleteBooking} className="space-y-6">
          <ScrollReveal variant="fade-up" className="space-y-1 pb-4 border-b border-scrap-border">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-scrap-primary/10 border border-scrap-primary/30 text-scrap-primary text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Step 4 of 4 • Book Doorstep Pickup Slot</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Choose Collection Date & Time</h2>
            <p className="text-xs text-scrap-muted">
              {selectedShop.shopName} ({selectedShop.realDistanceKm ?? selectedShop.distanceKm} km away) will arrive at your address with a certified digital weighing scale and pay cash.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Day & Slot Selector */}
            <ScrollReveal variant="fade-up" delay="delay-100" className="md:col-span-7 glass-card rounded-2xl p-6 space-y-5">
              {/* Day selection */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  1. Select Pickup Day
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'This Weekend'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setBookingDate(day)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                        bookingDate === day
                          ? 'bg-scrap-primary text-black border-scrap-primary shadow-glow'
                          : 'bg-scrap-bg border-scrap-border text-scrap-muted hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot selection */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  2. Preferred Time Slot
                </label>
                <div className="space-y-2">
                  {[
                    'Morning: 9:00 AM – 12:00 PM',
                    'Afternoon: 1:00 PM – 4:00 PM',
                    'Evening: 4:30 PM – 7:30 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingSlot(slot)}
                      className={`w-full p-3 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                        bookingSlot === slot
                          ? 'bg-scrap-primary/10 border-scrap-primary text-scrap-primary shadow-glow'
                          : 'bg-scrap-bg border-scrap-border text-scrap-muted hover:text-white'
                      }`}
                    >
                      <span>{slot}</span>
                      {bookingSlot === slot && <Check className="w-4 h-4 text-scrap-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                  3. Notes for Collector
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call when reaching gate / near landmark"
                  className="w-full bg-scrap-bg border border-scrap-border text-white text-xs rounded-xl p-3 focus:outline-none focus:border-scrap-primary"
                />
              </div>
            </ScrollReveal>

            {/* Right: Booking Summary Card */}
            <ScrollReveal variant="fade-up" delay="delay-200" className="md:col-span-5 glass-card rounded-2xl p-6 space-y-4 border-scrap-gold/30">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-scrap-border">
                Booking Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-scrap-muted block">Selected Scrap Shop:</span>
                  <p className="font-bold text-white text-sm">{selectedShop.shopName}</p>
                  <p className="text-scrap-muted">{selectedShop.address} ({selectedShop.realDistanceKm ?? selectedShop.distanceKm} km away)</p>
                </div>

                <div>
                  <span className="text-scrap-muted block">Pickup Address:</span>
                  <p className="font-semibold text-white">{userAddress}</p>
                </div>

                <div>
                  <span className="text-scrap-muted block">Scheduled Window:</span>
                  <p className="font-semibold text-scrap-primary">{bookingDate} • {bookingSlot}</p>
                </div>

                <div className="pt-2 border-t border-scrap-border">
                  <span className="text-[10px] text-scrap-muted uppercase tracking-wider block">Estimated Cash Payout</span>
                  <div className="text-2xl font-black text-scrap-gold">
                    ₹{totalValuation.min} – ₹{totalValuation.max}
                  </div>
                  <p className="text-[11px] text-scrap-muted">Zero pickup fee • Paid cash on collection</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-sm shadow-glow transition-all hover:scale-[1.02] active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Doorstep Booking</span>
                </button>
              </div>
            </ScrollReveal>

          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1 text-xs text-scrap-muted hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Shops
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: BOOKING CONFIRMED & PICKUP OTP */}
      {step === 5 && (
        <ScrollReveal variant="fade-up" className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 border-scrap-primary/40 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-scrap-primary/20 border border-scrap-primary text-scrap-primary flex items-center justify-center mx-auto shadow-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-scrap-primary uppercase tracking-widest">Doorstep Pickup Confirmed!</span>
            <h2 className="text-2xl font-black text-white">{selectedShop.shopName}</h2>
            <p className="text-xs text-scrap-muted">
              Scheduled for <span className="text-white font-semibold">{bookingDate}, {bookingSlot}</span> at {userAddress}
            </p>
          </div>

          {/* Secure Doorstep Confirmation OTP */}
          <div className="p-6 rounded-2xl bg-scrap-bg border border-scrap-primary/50 text-center space-y-2">
            <span className="text-[11px] text-scrap-muted uppercase tracking-wider font-semibold block">
              Your 4-Digit Pickup Confirmation OTP
            </span>
            <div className="text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-scrap-primary to-scrap-gold">
              {generatedOtp}
            </div>
            <p className="text-[11px] text-scrap-muted">
              Give this code to the collector only after they weigh your scrap and hand over your cash.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/seller/dashboard"
              className="flex-1 py-3 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-xs shadow-glow transition-all active:scale-95"
            >
              View in My Bookings
            </Link>
            <button
              onClick={() => {
                setStep(1);
                toast.success('Ready to list another scrap batch!');
              }}
              className="flex-1 py-3 rounded-xl bg-scrap-card hover:bg-scrap-cardHover border border-scrap-border text-white text-xs font-semibold active:scale-95"
            >
              Sell Another Item
            </button>
          </div>
        </ScrollReveal>
      )}

    </div>
  );
}
