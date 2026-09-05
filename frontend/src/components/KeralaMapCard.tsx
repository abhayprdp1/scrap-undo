'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Store, ArrowRight, X, Phone, Star,
  Navigation, Clock, ChevronLeft, ExternalLink,
  ZoomIn, ZoomOut, RotateCcw, Compass, CheckCircle2,
  ChevronRight, Search, SlidersHorizontal, Layers
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
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
  {
    id: 'palakkad',
    geoName: 'Palakkad',
    name: 'Palakkad',
    shops: 9,
    areas: ['Olavakkode', 'TB Road', 'Kanjikode', 'Victoria College area'],
    color: '#f59e0b',
    pinColor: '#fbbf24',
    coordinates: [76.65, 10.78],
  },
  {
    id: 'malappuram',
    geoName: 'Malappuram',
    name: 'Malappuram',
    shops: 8,
    areas: ['Down Hill', 'Kottakkal', 'Manjeri Road', 'Perinthalmanna'],
    color: '#3b82f6',
    pinColor: '#60a5fa',
    coordinates: [76.07, 11.04],
  },
  {
    id: 'thrissur',
    geoName: 'Thrissur',
    name: 'Thrissur',
    shops: 11,
    areas: ['Round West', 'Ollur Industrial Belt', 'Punkunnam', 'Ayyanthole'],
    color: '#a855f7',
    pinColor: '#c084fc',
    coordinates: [76.21, 10.52],
  },
  {
    id: 'kochi',
    geoName: 'Ernakulam',
    name: 'Kochi',
    shops: 14,
    areas: ['Kakkanad', 'Edappally', 'Palarivattom', 'Vyttila', 'Aluva'],
    color: '#22c55e',
    pinColor: '#4ade80',
    coordinates: [76.26, 10.0],
  },
];

const DISTRICT_MAP = Object.fromEntries(DISTRICTS.map((d) => [d.geoName, d]));
const SERVICE_GEO_NAMES = new Set(DISTRICTS.map((d) => d.geoName));

// Center of Kerala state and projection scale tuned so all 14 districts fit perfectly
const KERALA_CENTER: [number, number] = [76.25, 10.55];
const BASE_SCALE = 4700;
const MAP_WIDTH = 340;
const MAP_HEIGHT = 420;

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

function ShopCard({
  shop,
  districtColor,
  districtPinColor,
}: {
  shop: ScrapShop;
  districtColor: string;
  districtPinColor: string;
}) {
  const photoSrc = PHOTO_MAP[shop.photo];
  return (
    <div
      className="rounded-xl overflow-hidden border transition-all duration-200 hover:border-opacity-80 bg-[#0d1622]/90 shadow-md"
      style={{ borderColor: districtColor + '40' }}
    >
      {/* Shop Photo */}
      <div className="relative w-full h-32 overflow-hidden bg-slate-900">
        <Image
          src={photoSrc}
          alt={shop.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md ${
            shop.openNow ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {shop.openNow ? '● Open Now' : '● Closed'}
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white flex items-center gap-1.5 backdrop-blur-sm">
          <MapPin className="w-3 h-3" style={{ color: districtPinColor }} />
          {shop.area}
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-3 space-y-2">
        <div>
          <h4 className="text-sm font-bold text-white leading-snug">{shop.name}</h4>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={shop.rating} />
            <span className="text-xs font-bold text-amber-400">{shop.rating}</span>
            <span className="text-[10px] text-scrap-muted">({shop.reviews} reviews)</span>
          </div>
        </div>

        <p className="text-[11px] text-scrap-muted leading-relaxed line-clamp-2">{shop.address}</p>

        <div className="flex items-center gap-1.5 text-scrap-muted">
          <Clock className="w-3 h-3 text-scrap-muted flex-shrink-0" />
          <span className="text-[10px]">{shop.hours}</span>
        </div>

        <div className="flex flex-wrap gap-1 pt-0.5">
          {shop.types.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 text-gray-300 border border-white/10"
            >
              {t}
            </span>
          ))}
          {shop.types.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[9px] text-scrap-muted bg-white/5">
              +{shop.types.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <a
            href={`tel:${shop.phone}`}
            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 border"
            style={{
              background: districtColor + '22',
              color: districtPinColor,
              borderColor: districtColor + '55',
            }}
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
          <a
            href={shop.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 border"
            style={{
              background: districtColor + '22',
              color: districtPinColor,
              borderColor: districtColor + '55',
            }}
          >
            <Navigation className="w-3.5 h-3.5" />
            Directions
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-2 rounded-lg border transition-all hover:brightness-110 text-xs font-bold"
            style={{
              background: districtColor + '15',
              borderColor: districtColor + '40',
              color: districtPinColor,
            }}
            title="Open in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="ml-1 hidden sm:inline">GMap</span>
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
  const [activeTab, setActiveTab] = useState<'map' | 'shops'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirectoryDistrict, setSelectedDirectoryDistrict] = useState<string>('all');

  // Zoom & Pan state for the map
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: KERALA_CENTER,
    zoom: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(Number((prev.zoom * 1.35).toFixed(2)), 4),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => {
      const nextZoom = Math.max(Number((prev.zoom / 1.35).toFixed(2)), 1);
      return {
        coordinates: nextZoom === 1 ? KERALA_CENTER : prev.coordinates,
        zoom: nextZoom,
      };
    });
  };

  const handleReset = () => {
    setPosition({
      coordinates: KERALA_CENTER,
      zoom: 1,
    });
    setActiveDistrict(null);
  };

  const handleMoveEnd = (newPosition: { coordinates: [number, number]; zoom: number }) => {
    setPosition(newPosition);
  };

  const handleDistrictSelect = (d: District, zoomIn = false) => {
    setActiveDistrict(d);
    setSelectedDirectoryDistrict(d.id);
    if (zoomIn) {
      setPosition({
        coordinates: d.coordinates,
        zoom: 2.2,
      });
    }
  };

  const handleViewAllShopsForDistrict = (d: District) => {
    setActiveDistrict(d);
    setSelectedDirectoryDistrict(d.id);
    setActiveTab('shops');
  };

  const getFill = (geoName: string) => {
    const d = DISTRICT_MAP[geoName];
    if (!d) return '#101827';
    if (activeDistrict?.geoName === geoName) return d.color + 'dd';
    if (hoveredGeoName === geoName) return d.color + '99';
    return d.color + '33';
  };

  const getStroke = (geoName: string) => {
    const d = DISTRICT_MAP[geoName];
    if (!d) return '#1e293b';
    if (activeDistrict?.geoName === geoName || hoveredGeoName === geoName) return d.color;
    return d.color + '88';
  };

  // Filtered shops for the shop directory view
  const allShopsList = Object.entries(SCRAP_SHOPS).flatMap(([distId, list]) =>
    list.map((s) => ({ ...s, districtInfo: DISTRICTS.find((d) => d.id === distId)! }))
  );

  const filteredShops = allShopsList.filter((s) => {
    const matchesDistrict =
      selectedDirectoryDistrict === 'all' || s.districtId === selectedDirectoryDistrict;
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.types.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistrict && matchesSearch;
  });

  const activeDistrictShops = activeDistrict ? SCRAP_SHOPS[activeDistrict.id] ?? [] : [];

  return (
    <div className="relative rounded-3xl border border-scrap-border bg-scrap-card/95 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
      {/* ── Card Header with Controls & Tabs ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-scrap-border/80 bg-[#090f19]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
          <div className="w-2.5 h-2.5 rounded-full bg-scrap-primary" />
          <span className="text-xs font-mono font-medium text-scrap-muted ml-1.5 hidden sm:inline">
            kerala-scrap-network
          </span>
        </div>

        {/* View Switcher Tabs: Map vs Directory */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-scrap-bg border border-scrap-border/60">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-scrap-primary text-black shadow-sm'
                : 'text-scrap-muted hover:text-white'
            }`}
          >
            <span>🗺️ Map</span>
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'shops'
                ? 'bg-scrap-primary text-black shadow-sm'
                : 'text-scrap-muted hover:text-white'
            }`}
          >
            <span>🏪 Shops (42)</span>
          </button>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-scrap-primary/15 text-scrap-primary border border-scrap-primary/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-scrap-primary animate-pulse inline-block" />
          LIVE
        </span>
      </div>

      {/* ── TAB 1: INTERACTIVE FULL KERALA MAP ── */}
      {activeTab === 'map' && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* Quick District Filter Pills (Top) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={handleReset}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                !activeDistrict && position.zoom === 1
                  ? 'bg-scrap-primary text-black border-scrap-primary shadow-sm'
                  : 'bg-white/5 border-white/10 text-scrap-muted hover:text-white hover:bg-white/10'
              }`}
            >
              All Kerala
            </button>
            {DISTRICTS.map((d) => {
              const isSelected = activeDistrict?.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleDistrictSelect(d, true)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5"
                  style={
                    isSelected
                      ? {
                          background: `${d.color}25`,
                          borderColor: d.color,
                          color: d.pinColor,
                          boxShadow: `0 0 10px ${d.color}44`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.03)',
                          borderColor: '#243042',
                          color: '#94a3b8',
                        }
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.pinColor }}
                  />
                  <span>{d.name}</span>
                  <span
                    className="text-[9px] px-1 py-0.2 rounded font-bold"
                    style={{ background: d.color + '33', color: d.pinColor }}
                  >
                    {d.shops}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map Viewport Box — Full Size, 380px tall, completely fitted */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border border-scrap-border/80 bg-[#090f19] select-none"
            style={{
              height: 380,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
            }}
          >
            {/* Ambient map grid background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#22c55e 0.75px, transparent 0.75px), radial-gradient(#3b82f6 0.75px, #090f19 0.75px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* ── Zoom Controls Overlay (Top-Right) ── */}
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 shadow-xl">
              <button
                onClick={handleZoomIn}
                disabled={position.zoom >= 4}
                className="w-8 h-8 rounded-xl bg-[#111a28]/95 border border-scrap-border/80 flex items-center justify-center hover:bg-scrap-cardHover transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md active:scale-95"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-scrap-primary" />
              </button>

              <button
                onClick={handleZoomOut}
                disabled={position.zoom <= 1}
                className="w-8 h-8 rounded-xl bg-[#111a28]/95 border border-scrap-border/80 flex items-center justify-center hover:bg-scrap-cardHover transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md active:scale-95"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-scrap-primary" />
              </button>

              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-xl bg-[#111a28]/95 border border-scrap-border/80 flex items-center justify-center hover:bg-scrap-cardHover transition-all text-white shadow-md active:scale-95"
                title="Reset to Full Kerala Map"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-300" />
              </button>

              {/* Zoom percentage pill */}
              <div className="px-1.5 py-0.5 rounded-lg bg-black/80 border border-white/10 text-[9px] font-mono text-center text-scrap-muted font-bold">
                {Math.round(position.zoom * 100)}%
              </div>
            </div>

            {/* Hover tooltip over district */}
            {hoveredGeoName && (
              <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-xl bg-black/85 border border-white/15 backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-none transition-all">
                {DISTRICT_MAP[hoveredGeoName] ? (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: DISTRICT_MAP[hoveredGeoName].pinColor }}
                    />
                    <span className="text-xs font-bold text-white">
                      {DISTRICT_MAP[hoveredGeoName].name}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                      style={{
                        background: DISTRICT_MAP[hoveredGeoName].color + '33',
                        color: DISTRICT_MAP[hoveredGeoName].pinColor,
                      }}
                    >
                      {DISTRICT_MAP[hoveredGeoName].shops} shops
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-xs font-medium text-slate-300">{hoveredGeoName}</span>
                    <span className="text-[10px] text-slate-400">Expansion soon</span>
                  </>
                )}
              </div>
            )}

            {/* Pan/Zoom Drag Hint (Only visible when zoom > 1) */}
            {position.zoom > 1 && (
              <div className="absolute bottom-3 right-3 z-30 px-2.5 py-1 rounded-lg bg-black/75 border border-white/10 text-[10px] font-medium text-scrap-muted backdrop-blur-sm pointer-events-none">
                Drag to explore · Double-click or scroll to zoom
              </div>
            )}

            {/* Map SVG rendered with react-simple-maps */}
            {mounted && (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: BASE_SCALE,
                  center: KERALA_CENTER,
                }}
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: position.zoom > 1 ? 'grab' : 'default',
                }}
              >
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  minZoom={1}
                  maxZoom={4}
                  onMoveEnd={handleMoveEnd}
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
                            strokeWidth={
                              activeDistrict?.geoName === geoName || hoveredGeoName === geoName
                                ? 1.4
                                : 0.6
                            }
                            style={{
                              default: {
                                outline: 'none',
                                cursor: isService ? 'pointer' : 'default',
                                transition: 'fill 0.2s, stroke 0.2s',
                              },
                              hover: {
                                outline: 'none',
                              },
                              pressed: {
                                outline: 'none',
                              },
                            }}
                            onClick={() => {
                              if (d) handleDistrictSelect(d, false);
                            }}
                            onMouseEnter={() => setHoveredGeoName(geoName)}
                            onMouseLeave={() => setHoveredGeoName(null)}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {/* High-visibility District Pins & Shop counts */}
                  {DISTRICTS.map((d) => {
                    const isActive = activeDistrict?.id === d.id;
                    const isHovered = hoveredGeoName === d.geoName;

                    return (
                      <Marker
                        key={d.id}
                        coordinates={d.coordinates}
                        onClick={() => handleDistrictSelect(d, false)}
                        onMouseEnter={() => setHoveredGeoName(d.geoName)}
                        onMouseLeave={() => setHoveredGeoName(null)}
                      >
                        <g style={{ cursor: 'pointer' }}>
                          {/* Animated Radar Pulse Ring */}
                          <circle r="0" fill="none" stroke={d.color} strokeWidth="1.6">
                            <animate
                              attributeName="r"
                              values="6;22"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="stroke-opacity"
                              values="0.9;0"
                              dur="1.8s"
                              repeatCount="indefinite"
                            />
                          </circle>

                          {/* Outer Glow Halo */}
                          <circle
                            r={isActive ? 12 : isHovered ? 11 : 9}
                            fill={d.color}
                            fillOpacity={isActive ? 0.35 : 0.2}
                            stroke={d.color}
                            strokeWidth={1.5}
                            style={{ transition: 'all 0.2s' }}
                          />

                          {/* Center Target Core */}
                          <circle
                            r={isActive ? 6 : isHovered ? 5.5 : 4.5}
                            fill={d.pinColor}
                            stroke="#070c14"
                            strokeWidth={1.5}
                            style={{ transition: 'all 0.2s' }}
                          />

                          {/* Shop Count Tag Badge */}
                          <g transform="translate(0, -15)">
                            <rect
                              x={-24}
                              y={-8}
                              width={48}
                              height={14}
                              rx={4}
                              fill="#090f19"
                              stroke={d.color}
                              strokeWidth={isActive ? 1.2 : 0.8}
                              fillOpacity="0.92"
                            />
                            <text
                              textAnchor="middle"
                              y={2}
                              style={{
                                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                                fontSize: 7,
                                fontWeight: 800,
                                fill: isActive ? '#ffffff' : d.pinColor,
                                pointerEvents: 'none',
                                userSelect: 'none',
                              }}
                            >
                              {d.shops} SHOPS
                            </text>
                          </g>
                        </g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            )}

            {/* Selected District Quick Action Banner (Bottom overlay on map) */}
            {activeDistrict && (
              <div
                className="absolute bottom-3 left-3 right-3 z-30 p-2.5 rounded-xl border backdrop-blur-md shadow-2xl flex items-center justify-between transition-all"
                style={{
                  background: 'rgba(10, 16, 26, 0.92)',
                  borderColor: activeDistrict.color + '66',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: activeDistrict.color + '25', color: activeDistrict.pinColor }}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white truncate">
                        {activeDistrict.name}
                      </h4>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                        style={{
                          background: activeDistrict.color + '25',
                          color: activeDistrict.pinColor,
                        }}
                      >
                        {activeDistrict.shops} verified
                      </span>
                    </div>
                    <p className="text-[10px] text-scrap-muted truncate">
                      {activeDistrict.areas.slice(0, 2).join(', ')}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleViewAllShopsForDistrict(activeDistrict)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-glow flex items-center gap-1 hover:brightness-110 active:scale-95"
                    style={{
                      background: activeDistrict.color,
                      color: '#000000',
                    }}
                  >
                    <span>View Shops</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setActiveDistrict(null)}
                    className="p-1.5 rounded-lg text-scrap-muted hover:text-white bg-white/5 hover:bg-white/10"
                    title="Close preview"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Summary & Quick Stats */}
          <div className="flex items-center justify-between gap-3 pt-1.5 px-1">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white leading-tight whitespace-nowrap">
                42 Verified Scrap Shops
              </h4>
              <p className="text-[10px] text-scrap-muted leading-snug mt-0.5">
                Palakkad · Thrissur · Kochi · Malappuram
              </p>
              <p className="text-[9px] text-scrap-muted/70 leading-none mt-0.5">
                Tap pins or use + / - buttons to zoom into district shops
              </p>
            </div>

            <button
              onClick={() => setActiveTab('shops')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-bold text-xs shadow-glow transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Browse All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: FULL SCRAP SHOP DIRECTORY ── */}
      {activeTab === 'shops' && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* Header & Filter Row */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-1.5 text-scrap-muted hover:text-white transition-colors text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4 text-scrap-primary" />
              Back to Full Map
            </button>

            <span className="text-xs font-bold text-white">
              Showing {filteredShops.length} of 42 shops
            </span>
          </div>

          {/* District Selector Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedDirectoryDistrict('all')}
              className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                selectedDirectoryDistrict === 'all'
                  ? 'bg-scrap-primary text-black border-scrap-primary shadow-sm'
                  : 'bg-white/5 border-white/10 text-scrap-muted hover:text-white'
              }`}
            >
              All Districts (42)
            </button>
            {DISTRICTS.map((d) => {
              const isSelected = selectedDirectoryDistrict === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDirectoryDistrict(d.id)}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5"
                  style={
                    isSelected
                      ? {
                          background: d.color + '25',
                          borderColor: d.color,
                          color: d.pinColor,
                          boxShadow: `0 0 8px ${d.color}44`,
                        }
                      : {
                          background: 'transparent',
                          borderColor: '#243042',
                          color: '#94a3b8',
                        }
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.pinColor }} />
                  {d.name} ({d.shops})
                </button>
              );
            })}
          </div>

          {/* Search bar inside directory */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-scrap-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by shop name, area (e.g. Kakkanad), or scrap type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1622] border border-scrap-border/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-scrap-muted focus:outline-none focus:border-scrap-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-scrap-muted hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scrollable list of shop cards */}
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 scrollbar-hide">
            {filteredShops.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-scrap-muted">
                <Store className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No shops match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDirectoryDistrict('all');
                  }}
                  className="text-xs text-scrap-primary underline font-medium"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              filteredShops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  districtColor={shop.districtInfo.color}
                  districtPinColor={shop.districtInfo.pinColor}
                />
              ))
            )}

            {/* External Google Maps link */}
            <div className="pt-2">
              <a
                href={
                  selectedDirectoryDistrict !== 'all'
                    ? `https://www.google.com/maps/search/scrap+dealers+${DISTRICTS.find((d) => d.id === selectedDirectoryDistrict)?.name}+Kerala`
                    : 'https://www.google.com/maps/search/scrap+dealers+Kerala'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border text-xs font-bold transition-all hover:brightness-110 bg-white/5 border-white/10 text-scrap-muted hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5 text-scrap-primary" />
                Search more shops on Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Subtle bottom gradient accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-scrap-primary/40 to-transparent" />
    </div>
  );
}
