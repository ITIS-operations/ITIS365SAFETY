import React, { useState } from 'react';
import { MapPin, Shield, ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Clock, Navigation, AlertTriangle, School, Home as HomeIcon } from 'lucide-react';
import { Learner, SafeZone } from '../types';

interface GuardianLocationMapProps {
  learner: Learner;
  safeZones: SafeZone[];
  showEtaMarker?: boolean;
  etaMinutes?: number;
  height?: string;
}

export function GuardianLocationMap({ 
  learner, 
  safeZones, 
  showEtaMarker = false, 
  etaMinutes = 7,
  height = 'h-80'
}: GuardianLocationMapProps) {
  const [mapMode, setMapMode] = useState<'street' | 'satellite' | 'zones'>('street');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showSafeZoneOverlay, setShowSafeZoneOverlay] = useState(true);

  // SVG canvas bounds
  const svgWidth = 600;
  const svgHeight = 320;
  const margin = 50;

  // Key locations in Johannesburg coordinate space
  const schoolLat = -26.1952;
  const schoolLng = 28.0340;
  const homeLat = -26.1154;
  const homeLng = 27.9712;

  // All points to bound
  const points = [
    { lat: learner.latitude, lng: learner.longitude },
    { lat: schoolLat, lng: schoolLng },
    { lat: homeLat, lng: homeLng },
    ...safeZones.map(z => ({ lat: z.latitude, lng: z.longitude }))
  ];

  const lats = points.map(p => p.lat);
  const lngs = points.map(p => p.lng);

  const minLat = Math.min(...lats) - 0.008 / zoomLevel;
  const maxLat = Math.max(...lats) + 0.008 / zoomLevel;
  const minLng = Math.min(...lngs) - 0.008 / zoomLevel;
  const maxLng = Math.max(...lngs) + 0.008 / zoomLevel;

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  const toSvg = (lat: number, lng: number) => {
    const x = margin + (lngSpan > 0 ? ((lng - minLng) / lngSpan) * (svgWidth - 2 * margin) : svgWidth / 2);
    const y = svgHeight - (margin + (latSpan > 0 ? ((lat - minLat) / latSpan) * (svgHeight - 2 * margin) : svgHeight / 2));
    return { x, y };
  };

  const learnerSvg = toSvg(learner.latitude, learner.longitude);
  const schoolSvg = toSvg(schoolLat, schoolLng);
  const homeSvg = toSvg(homeLat, homeLng);

  // ETA Marker position offset slightly from learner
  const etaLat = learner.latitude + 0.003;
  const etaLng = learner.longitude + 0.003;
  const etaSvg = toSvg(etaLat, etaLng);

  return (
    <div className="glass-panel p-4 rounded-2xl border border-brand-gold/20 flex flex-col justify-between space-y-3">
      {/* Map Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-gold" />
          <span className="font-bold text-white uppercase tracking-wider">Verified Location Map</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded text-[9px] uppercase font-mono">
            Verified GPS Telemetry
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMapMode(m => m === 'street' ? 'satellite' : m === 'satellite' ? 'zones' : 'street')}
            className="px-2.5 py-1 bg-brand-navy border border-brand-gold/20 text-brand-gold hover:bg-brand-navy-light rounded text-[10px] uppercase cursor-pointer"
          >
            Mode: {mapMode}
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.min(z + 0.25, 2))}
            className="p-1 bg-brand-navy border border-brand-gold/20 text-brand-gold hover:bg-brand-navy-light rounded cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.75))}
            className="p-1 bg-brand-navy border border-brand-gold/20 text-brand-gold hover:bg-brand-navy-light rounded cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 bg-brand-navy border border-brand-gold/20 text-brand-gold hover:bg-brand-navy-light rounded cursor-pointer"
            title="Recenter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className={`relative ${height} bg-brand-dark rounded-xl overflow-hidden border border-brand-gold/15 shadow-inner`}>
        {/* Map Background Grid/Satellite overlay */}
        {mapMode === 'satellite' ? (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800')` }} 
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        )}

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connected route line between Home, School, and Learner */}
          <path
            d={`M ${homeSvg.x} ${homeSvg.y} Q ${(homeSvg.x + schoolSvg.x)/2} ${(homeSvg.y + schoolSvg.y)/2 - 20} ${schoolSvg.x} ${schoolSvg.y}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Safe Zone Circles */}
          {showSafeZoneOverlay && safeZones.map((zone) => {
            const zSvg = toSvg(zone.latitude, zone.longitude);
            return (
              <g key={zone.id}>
                <circle
                  cx={zSvg.x}
                  cy={zSvg.y}
                  r="35"
                  fill="#f59e0b"
                  fillOpacity="0.1"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={zSvg.x}
                  y={zSvg.y + 48}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* School Location Marker */}
          <g transform={`translate(${schoolSvg.x}, ${schoolSvg.y})`}>
            <circle r="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
            <text x="0" y="3" textAnchor="middle" fill="#3b82f6" fontSize="10">🏫</text>
            <text x="0" y="-16" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {learner.school}
            </text>
          </g>

          {/* Home Location Marker */}
          <g transform={`translate(${homeSvg.x}, ${homeSvg.y})`}>
            <circle r="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="0" y="3" textAnchor="middle" fill="#10b981" fontSize="10">🏡</text>
            <text x="0" y="-16" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Home
            </text>
          </g>

          {/* Learner Current Location Marker */}
          <g transform={`translate(${learnerSvg.x}, ${learnerSvg.y})`}>
            {/* Outer pulse */}
            <circle r="22" fill="#f59e0b" fillOpacity="0.25">
              <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
            </circle>

            <circle r="14" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2.5" filter="url(#glowGold)" />
            
            <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
              📍
            </text>

            <g transform="translate(0, -22)">
              <rect x="-45" y="-12" width="90" height="16" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                {learner.name}
              </text>
            </g>
          </g>

          {/* Optional Responder ETA Marker */}
          {showEtaMarker && (
            <g transform={`translate(${etaSvg.x}, ${etaSvg.y})`}>
              <line
                x1="0"
                y1="0"
                x2={learnerSvg.x - etaSvg.x}
                y2={learnerSvg.y - etaSvg.y}
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <rect x="-65" y="-14" width="130" height="20" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
              <text x="0" y="-1" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold">
                Responder ETA: ~{etaMinutes} mins
              </text>
            </g>
          )}
        </svg>

        {/* Bottom Location Info Bar */}
        <div className="absolute bottom-2 left-2 right-2 bg-brand-dark/90 backdrop-blur-md px-3 py-2 rounded-lg border border-brand-gold/20 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              Coordinates: <strong className="text-brand-gold">{learner.latitude.toFixed(4)}, {learner.longitude.toFixed(4)}</strong>
            </span>
          </div>
          <span className="text-slate-400">
            Last Verified: <strong className="text-white">Just now</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
