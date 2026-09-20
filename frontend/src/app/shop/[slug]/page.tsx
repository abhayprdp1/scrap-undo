'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Share2,
  Navigation,
  Check,
  ChevronLeft,
  GlassWater,
  Layers,
  FileText,
  Cpu,
  ArrowUpRight,
  Clock,
  Star,
} from 'lucide-react';
import {
  PHOTO_MAP,
  getShopPosterData,
  findShopBySlug,
  type ScrapShop,
} from '@/data/scrapShops';

/* ─── Cash icon ─────────────────────────────────── */
function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v1m0 8v1M9.5 9.5C9.5 8.67 10.67 8 12 8s2.5.67 2.5 1.5S13.33 11 12 11s-2.5.83-2.5 1.5S10.67 14 12 14s2.5-.67 2.5-1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Scrap-type icon ────────────────────────────── */
function ScrapTypeIcon({ photo }: { photo: string }) {
  if (photo === 'bottle') return <GlassWater className="w-5 h-5 text-[#7c5c2e]" />;
  if (photo === 'ewaste') return <Cpu className="w-5 h-5 text-[#3b82f6]" />;
  if (photo === 'paper') return <FileText className="w-5 h-5 text-[#ca8a04]" />;
  return <Layers className="w-5 h-5 text-[#64748b]" />;
}

/* ─── 404 fallback ───────────────────────────────── */
function ShopNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-6 gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
        <GlassWater className="w-8 h-8 text-emerald-600" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900">Shop not found</h1>
        <p className="text-sm text-gray-500 max-w-xs">
          No shop matched{' '}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">/shop/{slug}</code>.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1c6b3e] text-white font-bold text-sm shadow-lg"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Infinity Space
      </Link>
    </div>
  );
}

/* ─── Map Section ────────────────────────────────── */
function ShopMapSection({ shop }: { shop: ScrapShop }) {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(shop.mapsQuery)}&output=embed&z=15`;

  return (
    <div className="relative w-full" style={{ height: '54vh', minHeight: 280, maxHeight: 420 }}>
      {/* Google Maps iframe */}
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${shop.name}`}
      />

      {/* Gradient overlay at top for nav legibility */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      {/* Gradient overlay at bottom for smooth card transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      {/* Back button */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 pl-2 pr-3.5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/60 text-gray-800 font-semibold text-xs"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>

      {/* "Change Area" style pill — top right */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/60">
        <MapPin className="w-3.5 h-3.5" style={{ color: '#1c6b3e' }} />
        <span className="text-xs font-bold text-gray-700">{shop.area}</span>
      </div>

      {/* Floating direct Google Maps link */}
      <a
        href={shop.mapsDirectionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="poster-map-direct-link"
        className="absolute bottom-8 right-4 z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-all active:scale-95"
        title="Open exact location in Google Maps"
      >
        <Navigation className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
        <span>Open in Google Maps</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
      </a>
    </div>
  );
}

/* ─── Main poster card ───────────────────────────── */
function ShopPosterCard({ shop }: { shop: ScrapShop }) {
  const [copied, setCopied] = useState(false);
  const pd = getShopPosterData(shop);
  const photoSrc = PHOTO_MAP[shop.photo] || PHOTO_MAP.metal;

  const shareText =
    `♻️ *${shop.name.toUpperCase()} – SCRAP COLLECTION*\n` +
    `📍 ${shop.address || `${shop.area}, Ernakulam`}\n` +
    `💰 ${pd.rateText} *${pd.ratePrice}* ${pd.rateUnit}\n` +
    `📦 Scrap Type: ${pd.scrapTypeTitle}\n` +
    `🚚 Home Delivery: ${pd.homeDelivery ? 'Yes' : 'No'}\n` +
    `ℹ️ ${pd.noticeTitle} — ${pd.noticeSubtitle}\n` +
    `📞 Contact: ${shop.phone}\n` +
    `🌐 View poster: https://infinityspace.netlify.app/shop/${shop.slug}`;

  const handleWhatsApp = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `${shop.name} Scrap`, text: shareText });
        return;
      } catch (_) { /* fall through */ }
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: '#f7f8fa', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── Map Top Section ── */}
      <ShopMapSection shop={shop} />

      {/* ── Bottom sliding card ── */}
      <div
        className="relative -mt-6 px-4 pb-10 pt-5 space-y-3"
        style={{
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.10)',
          minHeight: '60vh',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1.5 rounded-full bg-gray-200 mx-auto mb-3" />

        {/* ══════════════════════════════════
            TOP NAME ROW — FULL WIDTH
            (matches reference header style)
        ══════════════════════════════════ */}
        <div className="flex items-start justify-between gap-3 pb-1">
          <div className="min-w-0">
            <h1
              className="font-black text-gray-900 leading-tight"
              style={{ fontSize: 24, letterSpacing: '-0.3px' }}
            >
              {shop.name}
            </h1>
            <a
              href={shop.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-1.5 group cursor-pointer hover:opacity-90 transition-opacity"
              title="Open location in Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#1c6b3e' }} />
              <span className="text-[13px] text-gray-600 font-medium group-hover:text-emerald-700 underline decoration-gray-300 group-hover:decoration-emerald-500 underline-offset-2 transition-colors">
                {shop.address || `${shop.area}, Ernakulam`}
              </span>
              <ArrowUpRight className="w-3 h-3 text-emerald-600 opacity-70 group-hover:opacity-100 flex-shrink-0" />
            </a>
            {/* Rating + hours row */}
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-[12px] font-bold text-gray-700">{shop.rating}</span>
                <span className="text-[11px] text-gray-400">({shop.reviews})</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400">{shop.hours}</span>
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={
                  shop.openNow
                    ? { background: '#dcfce7', color: '#16a34a' }
                    : { background: '#fee2e2', color: '#dc2626' }
                }
              >
                {shop.openNow ? '● Open' : '● Closed'}
              </span>
            </div>
          </div>

          {/* Verified badge */}
          <div
            className="flex-shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 mt-0.5"
            style={{ background: '#edfbf2', border: '1.5px solid #bbf7d0' }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#2e9c5e' }} />
            <span className="text-[12px] font-bold" style={{ color: '#2e9c5e' }}>
              Verified
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* ══════════════════════════════════
            2-COLUMN INFO GRID
            Left : shop thumbnail + rate
            Right: delivery + scrap type
        ══════════════════════════════════ */}
        <div className="flex gap-3">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-2.5" style={{ width: '44%' }}>

            {/* Thumbnail with KUPPI tag */}
            <div
              className="relative overflow-hidden flex-shrink-0"
              style={{ borderRadius: 16, height: 152, background: '#f0f0f0' }}
            >
              <Image
                src={photoSrc}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="165px"
              />
              {/* Green label band */}
              <div
                className="absolute bottom-0 inset-x-0 flex items-center gap-1.5 px-2.5 py-1.5"
                style={{ background: 'rgba(28, 107, 62, 0.92)', backdropFilter: 'blur(4px)' }}
              >
                <GlassWater className="w-3 h-3 text-white flex-shrink-0" />
                <span className="text-white text-[10px] font-black tracking-widest">{pd.tag}</span>
              </div>
            </div>

            {/* Rate card */}
            <div
              className="flex-1 rounded-2xl p-3.5 flex flex-col justify-between"
              style={{
                background: 'linear-gradient(135deg, #edfbf2 0%, #d1fae5 100%)',
                border: '1px solid #bbf7d0',
                minHeight: 116,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow"
                style={{ background: 'linear-gradient(135deg, #1c6b3e, #2e9c5e)' }}
              >
                <CashIcon />
              </div>
              <div className="mt-2">
                <p className="text-[11px] text-gray-500 font-medium leading-snug">{pd.rateText}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className="font-black leading-none"
                    style={{ fontSize: 30, color: '#1c5e35' }}
                  >
                    {pd.ratePrice}
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold">{pd.rateUnit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">

            {/* Delivery card */}
            <div
              className="flex-1 rounded-2xl px-3.5 py-3 flex items-center gap-3"
              style={{ background: '#fff9f0', border: '1px solid #fed7aa' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#fff5e6' }}
              >
                <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-black text-gray-900 leading-tight">
                  {pd.homeDeliveryLabel ?? (pd.homeDelivery ? 'Yes' : 'No')}
                </div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {pd.homeDeliverySub ?? 'Home Delivery'}
                </div>
              </div>
            </div>

            {/* Scrap type card */}
            <div
              className="flex-1 rounded-2xl px-3.5 py-3 flex items-center gap-3"
              style={{ background: '#fefce8', border: '1px solid #fde68a' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#fef3c7' }}
              >
                <ScrapTypeIcon photo={shop.photo} />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                  Scrap Type
                </div>
                <div className="font-black text-gray-800 leading-tight" style={{ fontSize: 13 }}>
                  {pd.scrapTypeTitle}
                </div>
              </div>
            </div>

            {/* Open / Hours card */}
            <div
              className="flex-1 rounded-2xl px-3.5 py-3 flex items-center gap-3"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#dcfce7' }}
              >
                <Clock className="w-5 h-5" style={{ color: '#16a34a' }} />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                  Today's Hours
                </div>
                <div className="font-black text-gray-800 leading-tight" style={{ fontSize: 11 }}>
                  {shop.hours}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            NOTICE BOX — full width
        ══════════════════════════════════ */}
        <div
          className="rounded-2xl flex items-start gap-3 px-4 py-3.5"
          style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: '#dcfce7', border: '1.5px solid #4ade80' }}
          >
            <span className="text-[12px] font-black leading-none" style={{ color: '#16a34a' }}>i</span>
          </div>
          <div className="min-w-0">
            <p className="font-bold leading-snug" style={{ fontSize: 13, color: '#1c6b3e' }}>
              {pd.noticeTitle}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
              {pd.noticeSubtitle}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════
            PHONE + CALL NOW
        ══════════════════════════════════ */}
        <div
          className="rounded-2xl flex items-center justify-between gap-3 px-4 py-3.5"
          style={{
            background: '#fff',
            border: '1.5px solid #e5e7eb',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #edfbf2, #d1fae5)' }}
            >
              <Phone className="w-5 h-5" style={{ color: '#1c6b3e' }} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Mobile number
              </div>
              <div
                className="font-black tracking-wide leading-snug"
                style={{ fontSize: 19, color: '#111', letterSpacing: '0.5px' }}
              >
                {shop.phone}
              </div>
            </div>
          </div>

          <a
            href={`tel:${shop.phone}`}
            id="call-now-btn"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-black flex-shrink-0 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #1c6b3e, #2e9c5e)',
              fontSize: 14,
              boxShadow: '0 4px 14px rgba(28,107,62,0.35)',
            }}
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Call Now</span>
          </a>
        </div>

        {/* ══════════════════════════════════
            SHARE ACTIONS
        ══════════════════════════════════ */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
              ✨ Shop Owner? Share your poster
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="whatsapp-share-btn"
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                fontSize: 13,
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
              }}
            >
              <span>📲</span>
              <span>Put on WhatsApp</span>
            </button>

            <button
              id="copy-details-btn"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold border transition-all active:scale-95"
              style={{
                borderColor: '#e0e0e0',
                fontSize: 13,
                background: copied ? '#f0fdf4' : '#fafafa',
                color: copied ? '#16a34a' : '#374151',
              }}
            >
              {copied
                ? <><Check className="w-4 h-4 text-emerald-600" /><span>Copied!</span></>
                : <><Share2 className="w-4 h-4 text-gray-500" /><span>Copy Details</span></>
              }
            </button>
          </div>

          {/* Google Maps directions button */}
          <a
            href={shop.mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="maps-directions-link"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold transition-all active:scale-95"
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              color: '#1c6b3e',
              fontSize: 13,
            }}
          >
            <Navigation className="w-4 h-4" />
            <span>Open directions in Google Maps</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Infinity Space branding */}
        <div className="pt-3 pb-2 flex items-center justify-center gap-1.5">
          <span className="text-[11px] text-gray-400">Powered by</span>
          <Link href="/" className="text-[12px] font-black" style={{ color: '#1c6b3e' }}>
            Infinity Space ♻️
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page entry point ───────────────────────────── */
export default function ShopPosterPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const shop = findShopBySlug(slug);

  if (!shop) return <ShopNotFound slug={slug} />;
  return <ShopPosterCard shop={shop} />;
}
