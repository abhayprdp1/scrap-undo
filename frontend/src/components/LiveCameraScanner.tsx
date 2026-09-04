'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Sparkles, AlertCircle, Upload } from 'lucide-react';

interface LiveCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  isProcessing?: boolean;
}

export default function LiveCameraScanner({
  isOpen,
  onClose,
  onCapture,
  isProcessing = false,
}: LiveCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setErrorMsg(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasPermission(false);
      setErrorMsg(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission denied. Please allow camera access in your browser or upload a photo instead.'
          : 'Could not access device camera. Please upload a photo from your gallery.'
      );
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (isOpen) {
      startStream();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, startStream, stopStream]);

  const handleCapture = () => {
    if (!videoRef.current || isProcessing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onCapture(dataUrl);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFallbackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          onCapture(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-scrap-card border border-scrap-border rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-scrap-border bg-scrap-bg/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-scrap-primary/10 border border-scrap-primary/30 flex items-center justify-center text-scrap-primary">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Live AI Scrap Scanner
                <span className="inline-block w-2 h-2 rounded-full bg-scrap-primary animate-ping" />
              </h3>
              <p className="text-[11px] text-scrap-muted">Point camera at scrap material</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-scrap-bg hover:bg-scrap-border flex items-center justify-center text-scrap-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Viewfinder */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {hasPermission === false ? (
            <div className="p-6 text-center space-y-4 max-w-xs">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-scrap-light leading-relaxed">{errorMsg}</p>
              <label className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-scrap-primary text-black text-xs font-bold shadow-glow cursor-pointer active:scale-95 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Gallery Instead</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFallbackUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Reticle */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-scrap-primary/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                {/* Corner Accents */}
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-scrap-primary rounded-tl" />
                  <div className="w-5 h-5 border-t-2 border-r-2 border-scrap-primary rounded-tr" />
                </div>

                {/* Animated Scanner Laser Bar */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-scrap-primary to-transparent animate-pulse shadow-glow" />

                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-2 border-l-2 border-scrap-primary rounded-bl" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-scrap-primary rounded-br" />
                </div>
              </div>

              {/* Targeting Hint */}
              <div className="absolute top-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[11px] font-medium text-white flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-scrap-gold animate-spin" />
                <span>Align item inside frame & hold steady</span>
              </div>
            </>
          )}

          {/* Hidden Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-scrap-bg/90 border-t border-scrap-border flex items-center justify-between">
          <button
            type="button"
            onClick={toggleFacingMode}
            className="p-3 rounded-xl bg-scrap-card hover:bg-scrap-cardHover border border-scrap-border text-scrap-light hover:text-white transition-all active:scale-95"
            title="Flip camera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Shutter Button */}
          <button
            type="button"
            onClick={handleCapture}
            disabled={hasPermission === false || isProcessing}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-scrap-primary hover:bg-scrap-primaryHover text-black font-extrabold text-sm shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing AI...' : 'Capture & Identify'}</span>
          </button>

          {/* Gallery Fallback */}
          <label
            className="p-3 rounded-xl bg-scrap-card hover:bg-scrap-cardHover border border-scrap-border text-scrap-light hover:text-white transition-all cursor-pointer active:scale-95"
            title="Upload file"
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFallbackUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
