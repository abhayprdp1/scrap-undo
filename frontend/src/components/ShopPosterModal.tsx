'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Share2,
  Navigation,
  Check,
  Sparkles,
  GlassWater,
  Layers,
  FileText,
  Cpu,
} from 'lucide-react';
import { PHOTO_MAP, getShopPosterData, type ScrapShop } from '@/data/scrapShops';

interface ShopPosterModalProps {
  shop: ScrapShop | null;
  onClose: () => void;
}

/* Cash/money icon for the rate circle */
function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v1m0 8v1M9.5 9.5C9.5 8.67 10.67 8 12 8s2.5.67 2.5 1.5S13.33 11 12 11s-2.5.83-2.5 1.5S10.67 14 12 14s2.5-.67 2.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* Scrap-type icon based on photo type */
function ScrapTypeIcon({ photo }: { photo: string }) {
  if (photo === 'bottle') return <GlassWater className="w-5 h-5 text-[#7c5c2e]" />;
  if (photo === 'ewaste') return <Cpu className="w-5 h-5 text-[#3b82f6]" />;
  if (photo === 'paper') return <FileText className="w-5 h-5 text-[#ca8a04]" />;
  return <Layers className="w-5 h-5 text-[#64748b]" />;
}

export default function ShopPosterModal({ shop, onClose }: ShopPosterModalProps) {
  const [copied, setCopied] = useState(false);

  if (!shop) return null;

  const pd = getShopPosterData(shop);
  const photoSrc = PHOTO_MAP[shop.photo] || PHOTO_MAP.metal;

  const shareText =
    `♻️ *${shop.name.toUpperCase()} – SCRAP COLLECTION*\n` +
    `📍 ${shop.address || `${shop.area}, Ernakulam`}\n` +
    `💰 ${pd.rateText} *${pd.ratePrice}* ${pd.rateUnit}\n` +
    `📦 Scrap Type: ${pd.scrapTypeTitle}\n` +
    `🚚 Home Delivery: ${pd.homeDelivery ? 'Yes' : 'No'}\n` +
    `ℹ️ ${pd.noticeTitle} — ${pd.noticeSubtitle}\n` +
    `📞 Contact: ${shop.phone}`;

  const handleWhatsApp = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: `${shop.name} Scrap`, text: shareText }); return; }
      catch (_) { /* fall through */ }
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end items-center"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      {/* ── Bottom Sheet ── */}
      <div
        className="relative w-full bg-white shadow-2xl"
        style={{
          maxWidth: 430,
          borderRadius: '24px 24px 0 0',
          maxHeight: '94dvh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Top header row: drag pill (left) + close button (right) ── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          {/* spacer */}
          <div className="w-8" />
          {/* drag pill centered */}
          <div className="w-10 h-[5px] rounded-full bg-gray-200" />
          {/* close button — isolated from content below */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─────────────── CONTENT ─────────────── */}
        <div className="px-4 pb-6 pt-1 space-y-3">

          {/* ═══════════════════════════════════
              MAIN 2-COLUMN GRID
              Left: Image + Rate card
              Right: Name/Location + Service cards
          ═══════════════════════════════════ */}
          <div className="flex gap-2.5">

            {/* ── LEFT COLUMN (image on top, rate card below) ── */}
            <div className="flex flex-col gap-2" style={{ width: '44%' }}>

              {/* Shop Photo */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{
                  borderRadius: 14,
                  height: 148,
                  background: '#eff0ef',
                }}
              >
                <Image
                  src={photoSrc}
                  alt={shop.name}
                  fill
                  className="object-cover"
                  sizes="165px"
                  priority
                />
                {/* Tag badge — full-width green band at bottom (exactly as reference) */}
                <div
                  className="absolute bottom-0 inset-x-0 flex items-center gap-1.5 px-2.5 py-1.5"
                  style={{ background: '#1c6b3e' }}
                >
                  <GlassWater className="w-3 h-3 text-white flex-shrink-0" />
                  <span className="text-white text-[10px] font-bold tracking-wide">{pd.tag}</span>
                </div>
              </div>

              {/* Rate card — mint green */}
              <div
                className="flex-1 rounded-2xl p-3 flex flex-col justify-between"
                style={{ background: '#edfbf2', minHeight: 110 }}
              >
                {/* Cash circle icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{ background: '#1c6b3e' }}
                >
                  <CashIcon />
                </div>

                {/* Rate text + price */}
                <div className="mt-1">
                  <p className="text-[11px] text-gray-600 font-medium leading-snug">{pd.rateText}</p>
                  <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
                    <span
                      className="font-black leading-none"
                      style={{ fontSize: 32, color: '#1c5e35' }}
                    >
                      {pd.ratePrice}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">{pd.rateUnit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (shop info on top, service cards below) ── */}
            <div className="flex-1 flex flex-col gap-2 min-w-0">

              {/* Shop name + Verified + Location */}
              <div className="pt-0.5">
                {/* Name row with Verified badge — no X overlap possible (X is in own row) */}
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className="font-black text-gray-900 leading-tight flex-1 min-w-0"
                    style={{ fontSize: 21 }}
                  >
                    {shop.name}
                  </h2>
                  {/* Verified badge */}
                  <div className="flex-shrink-0 flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2e9c5e' }} />
                    <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: '#2e9c5e' }}>
                      Verified
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-1.5 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[12px] text-gray-500 leading-snug">
                    {shop.address || `${shop.area}, Ernakulam`}
                  </span>
                </div>
              </div>

              {/* Delivery card */}
              <div
                className="flex-1 rounded-2xl px-3 py-2.5 flex items-center gap-2.5"
                style={{ background: '#fff', border: '1px solid #f0f0f0' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#fff5e6' }}
                >
                  <Truck className="w-[18px] h-[18px] text-orange-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-bold text-gray-900 leading-tight">
                    {pd.homeDeliveryLabel ?? (pd.homeDelivery ? 'Yes' : 'No')}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">
                    {pd.homeDeliverySub ?? 'Home Delivery'}
                  </div>
                </div>
              </div>

              {/* Scrap type card */}
              <div
                className="flex-1 rounded-2xl px-3 py-2.5 flex items-center gap-2.5"
                style={{ background: '#fff', border: '1px solid #f0f0f0' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#fdf3e7' }}
                >
                  <ScrapTypeIcon photo={shop.photo} />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">
                    Scrap Type
                  </div>
                  <div
                    className="font-bold text-gray-800 leading-tight"
                    style={{ fontSize: 12 }}
                  >
                    {pd.scrapTypeTitle}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════
              NOTICE BOX — full width
              (green bold title, exactly as reference)
          ═══════════════════════════════════ */}
          <div
            className="rounded-2xl flex items-start gap-3 px-4 py-3.5"
            style={{
              background: '#fff',
              border: '1px solid #e8e8e8',
            }}
          >
            {/* ⓘ icon — green outlined circle */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ border: '2px solid #2e9c5e' }}
            >
              <span className="text-[11px] font-black leading-none" style={{ color: '#2e9c5e' }}>i</span>
            </div>
            <div>
              {/* Green bold title — exactly as reference */}
              <p className="font-bold leading-snug" style={{ fontSize: 13, color: '#1c6b3e' }}>
                {pd.noticeTitle}
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                {pd.noticeSubtitle}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════
              PHONE + CALL NOW — full width
          ═══════════════════════════════════ */}
          <div
            className="rounded-2xl flex items-center justify-between gap-3 px-4 py-3.5"
            style={{ background: '#fff', border: '1px solid #ebebeb' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Phone icon in light green circle */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#edfbf2' }}
              >
                <Phone className="w-5 h-5" style={{ color: '#1c6b3e' }} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Mobile number
                </div>
                <div
                  className="font-black tracking-wide leading-snug truncate"
                  style={{ fontSize: 18, color: '#111' }}
                >
                  {shop.phone}
                </div>
              </div>
            </div>

            {/* Call Now button */}
            <a
              href={`tel:${shop.phone}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 flex-shrink-0"
              style={{ background: '#1c6b3e', fontSize: 14 }}
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Call Now</span>
            </a>
          </div>

          {/* ═══════════════════════════════════
              SHOP OWNER STATUS ACTIONS
          ═══════════════════════════════════ */}
          <div className="space-y-2.5 pt-0.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Shop Owner Status
              </span>
              <span className="text-[11px] text-gray-400">Tap to share your poster</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
                style={{ background: '#25D366', fontSize: 13 }}
              >
                <span>📲</span>
                <span>Put on WhatsApp</span>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold border text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
                style={{ borderColor: '#e0e0e0', fontSize: 13 }}
              >
                {copied
                  ? <><Check className="w-4 h-4 text-emerald-600" /><span className="text-emerald-700">Copied!</span></>
                  : <><Share2 className="w-4 h-4 text-gray-500" /><span>Copy Details</span></>
                }
              </button>
            </div>

            {/* Google Maps directions */}
            <a
              href={shop.mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 font-semibold transition-colors"
              style={{ color: '#1c6b3e', fontSize: 12 }}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open directions in Google Maps</span>
            </a>
          </div>

        </div>{/* /px-4 */}
      </div>{/* /sheet */}
    </div>/* /backdrop */
  );
}
