'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Store, ArrowRight, X, Phone, Star,
  Navigation, Clock, ChevronLeft, ExternalLink
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { SCRAP_SHOPS, PHOTO_MAP, type ScrapShop } from '@/data/scrapShops';

const GEO_URL = '/kerala_districts.geojson';

interface District {
  id: string;
  geoName: string;
  name: string;
  shops: number;
  areas: string[];
  color: string;
  pinColor: string;
  coordinates: [number, number];
}

const DISTRICTS: District[] = [
  { id: 'palakkad', geoName: 'Palakkad', name: 'Palakkad', shops: 9, areas: ['Olavakkode', 'TB Road', 'Kanjikode', 'Victoria College area'], color: '#f59e0b', pinColor: '#fbbf24', coordinates: [76.65, 10.78] },
  { id: 'malappuram', geoName: 'Malappuram', name: 'Malappuram', shops: 8, areas: ['Down Hill', 'Kottakkal', 'Manjeri Road', 'Perinthalmanna'], color: '#3b82f6', pinColor: '#60a5fa', coordinates: [76.07, 11.04] },
  { id: 'thrissur', geoName: 'Thrissur', name: 'Thrissur', shops: 11, areas: ['Round West', 'Ollur Industrial Belt', 'Punkunnam', 'Ayyanthole'], color: '#a855f7', pinColor: '#c084fc', coordinates: [76.21, 10.52] },
  { id: 'kochi', geoName: 'Ernakulam', name: 'Kochi', shops: 14, areas: ['Kakkanad', 'Edappally', 'Palarivattom', 'Vyttila', 'Aluva'], color: '#22c55e', pinColor: '#4ade80', coordinates: [76.26, 10.0] },
];

const DISTRICT_MAP = Object.fromEntries(DISTRICTS.map((d) => [d.geoName, d]));
const SERVICE_GEO_NAMES = new Set(DISTRICTS.map((d) => d.geoName));
const PROJECTION_CONFIG = { scale: 3800, center: [76.3, 10.85] as [number, number] };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="w-2.5 h-2.5"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'transparent'}
          stroke={s <= Math.round(rating) ? '#f59e0b' : '#4b5563'}
        />
      ))}
    </div>
  );
}

function ShopCard({ shop, districtColor, districtPinColor }: { shop: ScrapShop; districtColor: string; districtPinColor: string }) {
  const photoSrc = PHOTO_MAP[shop.photo];
  return (
    <div
      className="rounded-xl overflow-hidden border transition-all duration-200 hover:border-opacity-80 bg-[#0d1622]/80"
      style={{ borderColor: districtColor + '33' }}
    >
      {/* Shop Photo */}
      <div className="relative w-full h-28 overflow-hidden">
        <Image
          src={photoSrc}
          alt={shop.name}
          fill
          className="object-cover"
          sizes="300px"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {/* Open/Closed badge */}
        <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${shop.openNow ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {shop.openNow ? '● Open Now' : '● Closed'}
        </div>
        {/* District area tag */}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" style={{ color: districtPinColor }} />
          {shop.area}
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-2.5 space-y-2">
        {/* Name + Rating */}
        <div>
          <h4 className="text-xs font-bold text-white leading-snug">{shop.name}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRating rating={shop.rating} />
            <span className="text-[10px] font-bold text-amber-400">{shop.rating}</span>
            <span className="text-[9px] text-scrap-muted">({shop.reviews} reviews)</span>
          </div>
        </div>

        {/* Address */}
        <p className="text-[10px] text-scrap-muted leading-snug line-clamp-2">{shop.address}</p>

        {/* Hours */}
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-scrap-muted flex-shrink-0" />
          <span className="text-[9px] text-scrap-muted">{shop.hours}</span>
        </div>

        {/* Accepted types */}
        <div className="flex flex-wrap gap-1">
          {shop.types.slice(0, 3).map((t) => (
            <span key={t} className="px-1 py-0.5 rounded text-[8px] font-medium bg-white/5 text-scrap-muted border border-white/10">{t}</span>
          ))}
          {shop.types.length > 3 && (
            <span className="px-1 py-0.5 rounded text-[8px] text-scrap-muted">+{shop.types.length - 3}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5 pt-1">
          <a
            href={`tel:${shop.phone}`}
            className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 border"
            style={{ background: districtColor + '18', color: districtPinColor, borderColor: districtColor + '44' }}
          >
            <Phone className="w-3 h-3" />
            Call
          </a>
          <a
            href={shop.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all hover:brightness-110 border"
            style={{ background: districtColor + '18', color: districtPinColor, borderColor: districtColor + '44' }}
          >
            <Navigation className="w-3 h-3" />
            Directions
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:brightness-110"
            style={{ background: districtColor + '18', borderColor: districtColor + '44' }}
            title="View on Google Maps"
          >
            <ExternalLink className="w-3 h-3" style={{ color: districtPinColor }} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function KeralaMapCard() {
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [hoveredGeoName, setHoveredGeoName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showShops, setShowShops] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleDistrictClick = (d: District) => {
    if (activeDistrict?.id === d.id) {
      setActiveDistrict(null);
      setShowShops(false);
    } else {
      setActiveDistrict(d);
      setShowShops(true);
    }
  };

  const getFill = (geoName: string) => {
    const d = DISTRICT_MAP[geoName];
    if (!d) return '#131e2c';
    if (activeDistrict?.geoName === geoName) return d.color + 'cc';
    if (hoveredGeoName === geoName) return d.color + '88';
    return d.color + '2a';
  };

  const getStroke = (geoName: string) => {
    const d = DISTRICT_MAP[geoName];
    if (!d) return '#1e2d3e';
    if (activeDistrict?.geoName === geoName || hoveredGeoName === geoName) return d.color;
    return d.color + '55';
  };

  const shops = activeDistrict ? (SCRAP_SHOPS[activeDistrict.id] ?? []) : [];

  return (
    <div className="relative rounded-3xl border border-scrap-border bg-scrap-card/90 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-scrap-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-scrap-primary" />
          <span className="text-xs font-mono text-scrap-muted ml-2">
            {showShops && activeDistrict ? `${activeDistrict.name} Scrap Shops` : 'kerala-scrap-map'}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-scrap-primary/20 text-scrap-primary border border-scrap-primary/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-scrap-primary animate-pulse inline-block" />
          LIVE MAP
        </span>
      </div>

      {/* Main content — slides between Map view and Shop list view */}
      <div className="relative overflow-hidden">

        {/* ===== MAP VIEW ===== */}
        <div
          className="transition-all duration-500 ease-in-out"
          style={{ opacity: showShops ? 0 : 1, height: showShops ? 0 : 'auto', overflow: showShops ? 'hidden' : 'visible' }}
        >
          <div className="flex gap-4 items-start p-5">
            {/* Map */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div
                className="rounded-2xl overflow-hidden border border-scrap-border/60"
                style={{ width: 155, height: 238, background: '#0d1622', boxShadow: '0 0 24px rgba(34,197,94,0.07) inset' }}
              >
                {mounted && (
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={PROJECTION_CONFIG}
                    width={155}
                    height={238}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Geographies geography={GEO_URL}>
                      {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => {
                          const geoName: string = geo.properties.DISTRICT;
                          const isService = SERVICE_GEO_NAMES.has(geoName);
                          const d = DISTRICT_MAP[geoName];
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={getFill(geoName)}
                              stroke={getStroke(geoName)}
                              strokeWidth={activeDistrict?.geoName === geoName || hoveredGeoName === geoName ? 1.2 : 0.6}
                              style={{
                                default: { outline: 'none', cursor: isService ? 'pointer' : 'default', transition: 'fill 0.25s, stroke 0.25s' },
                                hover: { outline: 'none' },
                                pressed: { outline: 'none' },
                              }}
                              onClick={() => { if (d) handleDistrictClick(d); }}
                              onMouseEnter={() => { if (isService) setHoveredGeoName(geoName); }}
                              onMouseLeave={() => setHoveredGeoName(null)}
                            />
                          );
                        })
                      }
                    </Geographies>

                    {DISTRICTS.map((d) => {
                      const isActive = activeDistrict?.id === d.id;
                      const isHovered = hoveredGeoName === d.geoName;
                      return (
                        <Marker key={d.id} coordinates={d.coordinates}
                          onClick={() => handleDistrictClick(d)}
                          onMouseEnter={() => setHoveredGeoName(d.geoName)}
                          onMouseLeave={() => setHoveredGeoName(null)}
                        >
                          <g style={{ cursor: 'pointer' }}>
                            {(isActive || isHovered) && (
                              <circle r="0" fill="none" stroke={d.color} strokeWidth="1.5">
                                <animate attributeName="r" values="5;16" dur="1.4s" repeatCount="indefinite" />
                                <animate attributeName="stroke-opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
                              </circle>
                            )}
                            <circle r={isActive ? 9 : isHovered ? 8 : 6.5} fill={d.color} fillOpacity="0.22" stroke={d.color} strokeWidth="1.4" style={{ transition: 'r 0.2s' }} />
                            <circle r={isActive ? 4.5 : isHovered ? 4 : 3} fill={d.pinColor} stroke="#0d1622" strokeWidth="1.2" style={{ transition: 'r 0.2s' }} />
                            <text textAnchor="middle" y={-12} style={{ fontFamily: 'monospace', fontSize: 5.5, fontWeight: 'bold', fill: d.color, pointerEvents: 'none', userSelect: 'none' }}>
                              {d.shops} shops
                            </text>
                          </g>
                        </Marker>
                      );
                    })}
                  </ComposableMap>
                )}
              </div>

              {/* Legend */}
              <div className="mt-2 w-[155px] space-y-1">
                {DISTRICTS.map((d) => (
                  <button key={`legend-${d.id}`} onClick={() => handleDistrictClick(d)} className="flex items-center gap-1.5 w-full text-left group">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" style={{ background: d.pinColor, boxShadow: `0 0 6px ${d.color}88` }} />
                    <span className="text-[10px] font-medium" style={{ color: activeDistrict?.id === d.id ? d.pinColor : '#8a9bb0' }}>{d.name}</span>
                    <span className="text-[9px] ml-auto font-bold" style={{ color: activeDistrict?.id === d.id ? d.color : '#4b5563' }}>{d.shops}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Info Panel */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="space-y-0.5">
                <p className="text-[10px] text-scrap-muted uppercase tracking-widest font-semibold">Coverage</p>
                <p className="text-sm font-bold text-white">42 Verified Shops</p>
                <p className="text-[10px] text-scrap-muted">4 Kerala districts active</p>
              </div>

              {/* District chips */}
              <div className="flex flex-wrap gap-1.5">
                {DISTRICTS.map((d) => (
                  <button key={`chip-${d.id}`} onClick={() => handleDistrictClick(d)}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all duration-200"
                    style={activeDistrict?.id === d.id
                      ? { background: `${d.color}22`, borderColor: d.color, color: d.pinColor, boxShadow: `0 0 8px ${d.color}44` }
                      : { background: 'transparent', borderColor: '#2a3545', color: '#8a9bb0' }}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              {/* Placeholder or selected district hint */}
              <div className="rounded-xl p-3 border border-scrap-border bg-scrap-bg/60 text-center space-y-1.5">
                <MapPin className="w-5 h-5 text-scrap-primary mx-auto opacity-50" />
                <p className="text-[10px] text-scrap-muted leading-snug">
                  Tap a district on the map to see verified scrap shops with directions & contact
                </p>
              </div>

              <Link href="/seller/new-listing"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-xs shadow-glow transition-all hover:scale-[1.02] active:scale-95"
              >
                <Store className="w-3.5 h-3.5" />
                Find Nearby Shop
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* ===== SHOP LIST VIEW ===== */}
        {showShops && activeDistrict && (
          <div className="p-4 space-y-3">
            {/* Back bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setShowShops(false); setActiveDistrict(null); }}
                className="flex items-center gap-1.5 text-scrap-muted hover:text-white transition-colors text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Map
              </button>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: activeDistrict.pinColor, boxShadow: `0 0 6px ${activeDistrict.color}` }} />
                <span className="text-xs font-bold" style={{ color: activeDistrict.pinColor }}>{activeDistrict.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ background: activeDistrict.color + '22', color: activeDistrict.pinColor }}>
                  {shops.length} shops
                </span>
              </div>
            </div>

            {/* District chips row */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {DISTRICTS.map((d) => (
                <button key={d.id} onClick={() => { setActiveDistrict(d); }}
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all"
                  style={activeDistrict?.id === d.id
                    ? { background: `${d.color}22`, borderColor: d.color, color: d.pinColor }
                    : { background: 'transparent', borderColor: '#2a3545', color: '#8a9bb0' }}
                >
                  {d.name}
                </button>
              ))}
            </div>

            {/* Shop cards — scrollable */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-hide">
              {shops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  districtColor={activeDistrict.color}
                  districtPinColor={activeDistrict.pinColor}
                />
              ))}
              {/* Footer CTA */}
              <div className="pt-1">
                <Link
                  href={`https://www.google.com/maps/search/scrap+dealers+${activeDistrict.name}+Kerala`}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border text-xs font-bold transition-all hover:brightness-110"
                  style={{ background: activeDistrict.color + '18', color: activeDistrict.pinColor, borderColor: activeDistrict.color + '44' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  See all shops in {activeDistrict.name} on Google Maps
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-scrap-primary/40 to-transparent" />
    </div>
  );
}
