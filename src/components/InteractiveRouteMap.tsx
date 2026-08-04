import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Shield, Map, Eye, Calendar, Clock, Navigation, 
  Activity, Heart, Battery, Signal, Zap, AlertTriangle, ChevronRight, ChevronLeft, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Learner, SafeZone } from '../types';

interface Waypoint {
  id: string;
  time: string;
  latitude: number;
  longitude: number;
  locationName: string;
  speed: number; // km/h
  battery: number; // percentage
  signal: 'Strong' | 'Medium' | 'Weak' | 'None';
  heartRate: number;
  temperature: number;
  status: string;
}

interface InteractiveRouteMapProps {
  learner: Learner;
  safeZones: SafeZone[];
}

// Custom route histories for mock data representing different learners on different days in Johannesburg
const routeHistories: Record<string, Record<'today' | 'yesterday' | 'before', Waypoint[]>> = {
  'l1': { // Sipho Ndlovu
    today: [
      { id: 'l1-t1', time: '07:15', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 98, signal: 'Strong', heartRate: 72, temperature: 36.5, status: 'Departed Home Safe Zone' },
      { id: 'l1-t2', time: '07:22', latitude: -26.1385, longitude: 27.9940, locationName: 'President Fouche Dr Transit', speed: 48, battery: 97, signal: 'Strong', heartRate: 75, temperature: 36.6, status: 'En Route' },
      { id: 'l1-t3', time: '07:29', latitude: -26.1550, longitude: 28.0010, locationName: 'Beyers Naude Dr Intersection', speed: 55, battery: 96, signal: 'Medium', heartRate: 78, temperature: 36.6, status: 'En Route' },
      { id: 'l1-t4', time: '07:35', latitude: -26.1810, longitude: 28.0240, locationName: 'Empire Rd / Milpark Junction', speed: 30, battery: 95, signal: 'Strong', heartRate: 76, temperature: 36.7, status: 'Approaching School Area' },
      { id: 'l1-t5', time: '07:38', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School (Arrival)', speed: 0, battery: 94, signal: 'Strong', heartRate: 74, temperature: 36.6, status: 'Arrived at School Safe Zone' },
      { id: 'l1-t6', time: '14:30', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School (Departure)', speed: 0, battery: 85, signal: 'Strong', heartRate: 73, temperature: 36.6, status: 'Exited School Safe Zone' },
      { id: 'l1-t7', time: '14:42', latitude: -26.1934, longitude: 28.0355, locationName: 'Smit St & De Beer St, Braamfontein', speed: 12, battery: 84, signal: 'Strong', heartRate: 78, temperature: 36.6, status: 'En Route via Bus 12C' },
      { id: 'l1-t8', time: '15:10', latitude: -26.1415, longitude: 28.0482, locationName: "Aunt Lerato's House (Arrival)", speed: 0, battery: 82, signal: 'Strong', heartRate: 74, temperature: 36.6, status: 'Arrived Aunt Lerato Geofence' }
    ],
    yesterday: [
      { id: 'l1-y1', time: '07:10', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 99, signal: 'Strong', heartRate: 70, temperature: 36.4, status: 'Departed Home' },
      { id: 'l1-y2', time: '07:22', latitude: -26.1550, longitude: 28.0010, locationName: 'Beyers Naude Dr', speed: 50, battery: 98, signal: 'Strong', heartRate: 75, temperature: 36.5, status: 'En Route' },
      { id: 'l1-y3', time: '07:30', latitude: -26.1810, longitude: 28.0240, locationName: 'Empire Rd Junction', speed: 40, battery: 97, signal: 'Strong', heartRate: 74, temperature: 36.6, status: 'En Route' },
      { id: 'l1-y4', time: '07:35', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School', speed: 0, battery: 96, signal: 'Strong', heartRate: 72, temperature: 36.5, status: 'Arrived School' },
      { id: 'l1-y5', time: '14:35', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School (Departure)', speed: 0, battery: 88, signal: 'Strong', heartRate: 74, temperature: 36.6, status: 'Leaving School' },
      { id: 'l1-y6', time: '14:50', latitude: -26.1460, longitude: 28.0430, locationName: 'Rosebank Mall Fields', speed: 15, battery: 87, signal: 'Medium', heartRate: 98, temperature: 37.1, status: 'Extracurricular Sports' },
      { id: 'l1-y7', time: '16:15', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 80, signal: 'Strong', heartRate: 72, temperature: 36.5, status: 'Arrived Home' }
    ],
    before: [
      { id: 'l1-b1', time: '07:18', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 100, signal: 'Strong', heartRate: 71, temperature: 36.5, status: 'Departed Home (Slight delay)' },
      { id: 'l1-b2', time: '07:30', latitude: -26.1550, longitude: 28.0010, locationName: 'Beyers Naude Dr Transit', speed: 42, battery: 99, signal: 'Strong', heartRate: 76, temperature: 36.6, status: 'En Route' },
      { id: 'l1-b3', time: '07:42', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School', speed: 0, battery: 97, signal: 'Strong', heartRate: 85, temperature: 36.8, status: 'Arrived School (Late check-in)' },
      { id: 'l1-b4', time: '14:30', latitude: -26.1952, longitude: 28.0340, locationName: 'Gauteng High School (Departure)', speed: 0, battery: 89, signal: 'Strong', heartRate: 72, temperature: 36.6, status: 'Exited School' },
      { id: 'l1-b5', time: '15:02', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 85, signal: 'Strong', heartRate: 73, temperature: 36.5, status: 'Arrived Home' }
    ]
  },
  'l2': { // Zama Dlamini
    today: [
      { id: 'l2-t1', time: '07:20', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 92, signal: 'Strong', heartRate: 79, temperature: 36.7, status: 'Departed Home' },
      { id: 'l2-t2', time: '07:31', latitude: -26.1600, longitude: 28.0120, locationName: 'Jan Smuts Ave / Westcliff', speed: 48, battery: 90, signal: 'Strong', heartRate: 83, temperature: 36.8, status: 'En Route' },
      { id: 'l2-t3', time: '07:42', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary', speed: 0, battery: 88, signal: 'Strong', heartRate: 80, temperature: 36.7, status: 'Arrived School' },
      { id: 'l2-t4', time: '14:15', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary (Departure)', speed: 0, battery: 65, signal: 'Strong', heartRate: 78, temperature: 36.8, status: 'Departed School' },
      { id: 'l2-t5', time: '14:45', latitude: -26.1934, longitude: 28.0355, locationName: 'Smit St & De Beer St (Flat Tyre)', speed: 0, battery: 60, signal: 'Strong', heartRate: 98, temperature: 37.0, status: 'Bus Delayed - Flat Tyre (SOS Logged)' },
      { id: 'l2-t6', time: '15:12', latitude: -26.1415, longitude: 28.0482, locationName: "Aunt Lerato's House", speed: 0, battery: 45, signal: 'Medium', heartRate: 81, temperature: 36.8, status: 'Arrived at Aunt Lerato Geofence' }
    ],
    yesterday: [
      { id: 'l2-y1', time: '07:15', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 96, signal: 'Strong', heartRate: 75, temperature: 36.6, status: 'Departed Home' },
      { id: 'l2-y2', time: '07:28', latitude: -26.1600, longitude: 28.0120, locationName: 'Jan Smuts Ave', speed: 52, battery: 95, signal: 'Strong', heartRate: 78, temperature: 36.7, status: 'En Route' },
      { id: 'l2-y3', time: '07:39', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary', speed: 0, battery: 93, signal: 'Strong', heartRate: 76, temperature: 36.6, status: 'Arrived School' },
      { id: 'l2-y4', time: '14:15', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary (Departure)', speed: 0, battery: 74, signal: 'Strong', heartRate: 78, temperature: 36.7, status: 'Exited School' },
      { id: 'l2-y5', time: '14:40', latitude: -26.1460, longitude: 28.0430, locationName: 'Rosebank Mall Playlands', speed: 0, battery: 70, signal: 'Strong', heartRate: 92, temperature: 36.9, status: 'Social / Extracurricular Activity' },
      { id: 'l2-y6', time: '16:30', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 58, signal: 'Strong', heartRate: 76, temperature: 36.6, status: 'Arrived Home' }
    ],
    before: [
      { id: 'l2-b1', time: '07:18', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 100, signal: 'Strong', heartRate: 76, temperature: 36.5, status: 'Departed Home' },
      { id: 'l2-b2', time: '07:30', latitude: -26.1600, longitude: 28.0120, locationName: 'Jan Smuts Ave', speed: 44, battery: 99, signal: 'Strong', heartRate: 81, temperature: 36.6, status: 'En Route' },
      { id: 'l2-b3', time: '07:41', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary', speed: 0, battery: 98, signal: 'Strong', heartRate: 78, temperature: 36.6, status: 'Arrived School' },
      { id: 'l2-b4', time: '14:15', latitude: -26.1824, longitude: 28.0210, locationName: 'Parktown Girls Primary (Departure)', speed: 0, battery: 80, signal: 'Strong', heartRate: 77, temperature: 36.7, status: 'Departed School' },
      { id: 'l2-b5', time: '14:50', latitude: -26.1154, longitude: 27.9712, locationName: 'Home (Randburg)', speed: 0, battery: 74, signal: 'Strong', heartRate: 75, temperature: 36.5, status: 'Arrived Home' }
    ]
  }
};

const getSpeedColor = (speed: number) => {
  if (speed <= 15) {
    // Interpolate between Blue (#3b82f6) and Cyan (#06b6d4)
    const ratio = speed / 15;
    const r = Math.round(59 + (6 - 59) * ratio);
    const g = Math.round(130 + (182 - 130) * ratio);
    const b = Math.round(246 + (212 - 246) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (speed <= 35) {
    // Interpolate between Cyan (#06b6d4) and Orange/Gold (#f59e0b)
    const ratio = (speed - 15) / 20;
    const r = Math.round(6 + (245 - 6) * ratio);
    const g = Math.round(182 + (158 - 182) * ratio);
    const b = Math.round(212 + (11 - 212) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Interpolate between Orange/Gold (#f59e0b) and Red (#ef4444)
    const ratio = Math.min((speed - 35) / 20, 1);
    const r = Math.round(245 + (239 - 245) * ratio);
    const g = Math.round(158 + (68 - 158) * ratio);
    const b = Math.round(11 + (68 - 11) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export function InteractiveRouteMap({ learner, safeZones }: InteractiveRouteMapProps) {
  const [selectedDay, setSelectedDay] = useState<'today' | 'yesterday' | 'before'>('today');
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(2); // Multiplier of tick speed
  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current learner's histories, fall back to default if not defined
  const currentHistoryMap = routeHistories[learner.id] || routeHistories['l1'];
  const waypoints = currentHistoryMap[selectedDay];
  const activeWaypoint = waypoints[activeWaypointIndex] || waypoints[0];

  // Map settings
  const svgWidth = 600;
  const svgHeight = 350;
  const margin = 45;

  // Reset indices on day changes or learner changes
  useEffect(() => {
    setActiveWaypointIndex(0);
    setIsPlaying(false);
  }, [selectedDay, learner.id]);

  // Handle Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 1500 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setActiveWaypointIndex((prevIndex) => {
          if (prevIndex >= waypoints.length - 1) {
            return 0; // Loop back
          }
          return prevIndex + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, waypoints.length]);

  // 1. Calculate dynamic bounding box based on waypoints AND safe zones to ensure they all scale elegantly inside the viewport!
  const allPointsToMap = [
    ...waypoints.map(w => ({ lat: w.latitude, lng: w.longitude })),
    ...safeZones.map(z => ({ lat: z.latitude, lng: z.longitude }))
  ];

  const latitudes = allPointsToMap.map(p => p.lat);
  const longitudes = allPointsToMap.map(p => p.lng);

  const minLat = Math.min(...latitudes) - 0.005; // adding small padding buffer
  const maxLat = Math.max(...latitudes) + 0.005;
  const minLng = Math.min(...longitudes) - 0.005;
  const maxLng = Math.max(...longitudes) + 0.005;

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  // Coordinates translation function (Lat/Lng => SVG X/Y)
  const mapLatLngToSvg = (lat: number, lng: number) => {
    const x = margin + (lngSpan > 0 ? (lng - minLng) / lngSpan * (svgWidth - 2 * margin) : 0);
    const y = svgHeight - (margin + (latSpan > 0 ? (lat - minLat) / latSpan * (svgHeight - 2 * margin) : 0));
    return { x, y };
  };

  // Convert a geographic meter distance into SVG pixels on the Y-Axis
  const getSvgRadius = (radiusInMeters: number) => {
    const degPerPixelY = latSpan / (svgHeight - 2 * margin);
    // 1 degree latitude = ~111,320 meters
    const radiusInDegrees = radiusInMeters / 111320;
    const svgRadius = radiusInDegrees / degPerPixelY;
    // Cap radius so it doesn't look ridiculously huge if viewport zoom is extremely narrow
    return Math.min(Math.max(svgRadius, 20), 120);
  };

  // Build the SVG path (Polyline string)
  const pathD = waypoints.reduce((path, wp, idx) => {
    const { x, y } = mapLatLngToSvg(wp.latitude, wp.longitude);
    return path + `${idx === 0 ? 'M' : 'L'} ${x} ${y} `;
  }, '');

  // Calculate day summary statistics
  const totalWaypoints = waypoints.length;
  const avgDaySpeed = Math.round(waypoints.reduce((acc, w) => acc + w.speed, 0) / totalWaypoints);
  const maxDaySpeed = Math.max(...waypoints.map(w => w.speed));
  const activePosition = mapLatLngToSvg(activeWaypoint.latitude, activeWaypoint.longitude);

  return (
    <div className="glass-panel p-5 rounded-2xl space-y-5 border border-brand-gold/15" id="interactive-polyline-visualization">
      
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
        <div>
          <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Map className="w-5 h-5 text-brand-gold" /> Daily Route History Map Analyzer
          </h3>
          <p className="text-xs text-brand-silver">
            Interactive geographic tracking module · Wearable <strong className="text-brand-gold">{learner.trackerSerial}</strong>
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex gap-1.5 p-1 bg-brand-dark/80 rounded-xl border border-brand-gold/10 text-xs font-mono">
          <button 
            onClick={() => setSelectedDay('today')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedDay === 'today' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Today, 8 July
          </button>
          <button 
            onClick={() => setSelectedDay('yesterday')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedDay === 'yesterday' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Yesterday, 7 July
          </button>
          <button 
            onClick={() => setSelectedDay('before')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedDay === 'before' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            6 July 2026
          </button>
        </div>
      </div>

      {/* Main Grid: Map Visualizer on left, Telemetry HUD on right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER: The Map Container */}
        <div className="xl:col-span-2 space-y-4">
          <div className="relative bg-brand-dark border border-brand-gold/15 rounded-xl overflow-hidden flex flex-col justify-between shadow-inner group">
            
            {/* Map Telemetry HUD Overlay Top */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
              <div className="bg-brand-navy-heavy/90 border border-brand-gold/25 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-brand-silver space-y-0.5 shadow-md">
                <div className="text-brand-gold font-bold uppercase tracking-wider text-[8px]">TACTICAL POSITIONING</div>
                <div>LAT: {activeWaypoint.latitude.toFixed(6)}</div>
                <div>LNG: {activeWaypoint.longitude.toFixed(6)}</div>
              </div>

              <div className="bg-brand-navy-heavy/90 border border-brand-gold/25 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-brand-silver flex gap-3 shadow-md">
                <div className="flex items-center gap-1">
                  <Battery className={`w-3.5 h-3.5 ${activeWaypoint.battery < 30 ? 'text-red-500 animate-pulse' : 'text-brand-gold'}`} />
                  <span>{activeWaypoint.battery}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5 text-brand-gold" />
                  <span>{activeWaypoint.signal}</span>
                </div>
              </div>
            </div>

            {/* Map Canvas Background Vector & SVG Overlay */}
            <div className="relative h-[350px] w-full bg-brand-dark flex items-center justify-center">
              
              {/* Simulated Map Background Texture */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-[0.22] mix-blend-color-dodge transition-all duration-500 pointer-events-none" 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800')` }} 
              />
              
              {/* Sci-fi HUD crosshair overlay */}
              <div className="absolute inset-0 border border-brand-gold/5 pointer-events-none flex items-center justify-center">
                <div className="w-full h-[1px] bg-brand-gold/5 absolute" />
                <div className="h-full w-[1px] bg-brand-gold/5 absolute" />
                <div className="w-16 h-16 border border-brand-gold/5 rounded-full absolute" />
                <div className="w-32 h-32 border border-brand-gold/5 rounded-full absolute" />
              </div>

              {/* Dynamic Scaling SVG Canvas */}
              <svg className="absolute inset-0 w-full h-full z-0 select-none">
                <defs>
                  {/* Glowing Marker Gradient */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  {/* Route Polyline Gradient */}
                  <linearGradient id="route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8c6d12" />
                    <stop offset="50%" stopColor="#C8A646" />
                    <stop offset="100%" stopColor="#f7d05e" />
                  </linearGradient>
                </defs>

                {/* Draw Dynamic Grid Points */}
                {Array.from({ length: 8 }).map((_, r) => (
                  Array.from({ length: 12 }).map((_, c) => (
                    <circle 
                      key={`${r}-${c}`} 
                      cx={`${(c + 1) * 8.33}%`} 
                      cy={`${(r + 1) * 12.5}%`} 
                      r="1" 
                      fill="rgba(200, 166, 70, 0.15)" 
                    />
                  ))
                ))}

                {/* Render Safe Zones on Route Space */}
                {safeZones.map((zone) => {
                  const { x, y } = mapLatLngToSvg(zone.latitude, zone.longitude);
                  const radius = getSvgRadius(zone.radius);
                  const isHome = zone.type === 'home';
                  const isSchool = zone.type === 'school';
                  
                  return (
                    <g key={zone.id}>
                      {/* Translucent Perimeter Ring */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={radius} 
                        fill={isHome ? 'rgba(200, 166, 70, 0.02)' : isSchool ? 'rgba(16, 185, 129, 0.02)' : 'rgba(14, 165, 233, 0.02)'} 
                        stroke={isHome ? '#C8A646' : isSchool ? '#10B981' : '#0EA5E9'} 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" 
                        className="transition-all"
                      />
                      {/* Interactive Center Anchor */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="4" 
                        fill={isHome ? '#C8A646' : isSchool ? '#10B981' : '#0EA5E9'} 
                        className="cursor-help"
                      />
                    </g>
                  );
                })}

                {/* Underlay shadow/outline path for high-contrast visibility */}
                {pathD && (
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="rgba(15, 23, 42, 0.45)" 
                    strokeWidth="5.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                )}

                {/* Speed-based Segment Color Coding */}
                {waypoints.map((wp, idx) => {
                  if (idx === 0) return null;
                  const prevWp = waypoints[idx - 1];
                  const p1 = mapLatLngToSvg(prevWp.latitude, prevWp.longitude);
                  const p2 = mapLatLngToSvg(wp.latitude, wp.longitude);
                  const color = getSpeedColor(wp.speed);
                  
                  return (
                    <line
                      key={`seg-${wp.id}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={color}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="opacity-95"
                    />
                  );
                })}

                {/* Waypoint nodes plotted on polyline */}
                {waypoints.map((wp, idx) => {
                  const { x, y } = mapLatLngToSvg(wp.latitude, wp.longitude);
                  const isActive = idx === activeWaypointIndex;
                  const isHovered = hoveredWaypoint?.id === wp.id;
                  
                  return (
                    <g key={wp.id}>
                      {/* Invisible larger hover zone */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="14" 
                        fill="transparent" 
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredWaypoint(wp)}
                        onMouseLeave={() => setHoveredWaypoint(null)}
                        onClick={() => setActiveWaypointIndex(idx)}
                      />
                      {/* Ring indicator */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isActive ? "7" : isHovered ? "6" : "4"} 
                        fill={wp.speed > 0 ? "rgba(200,166,70,0.2)" : "rgba(251,191,36,0.3)"}
                        stroke={isActive ? "#FFFFFF" : isHovered ? "#C8A646" : "rgba(200,166,70,0.7)"} 
                        strokeWidth={isActive ? "2" : "1.5"}
                        className="transition-all duration-150 cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Live Tracker Animated Overlay Pulsing Cursor */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${activeWaypointIndex}-${selectedDay}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
                  style={{ left: activePosition.x, top: activePosition.y }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-3 bg-brand-gold rounded-full animate-ping opacity-35" />
                    <div className="absolute -inset-1 bg-brand-gold/20 rounded-full blur-sm" />
                    <img 
                      src={learner.photoUrl} 
                      alt={learner.name} 
                      className="w-10 h-10 rounded-full border-2 border-brand-gold object-cover relative shadow-2xl"
                    />
                  </div>
                  
                  {/* Current mini node name tag */}
                  <div className="bg-brand-navy-heavy/90 border border-brand-gold/40 px-2 py-0.5 rounded text-[8px] font-mono text-white mt-1 uppercase tracking-wide shadow-lg">
                    {activeWaypoint.time}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Hover Tooltip Overlay */}
              {hoveredWaypoint && (
                <div 
                  className="absolute z-20 bg-brand-navy-heavy/95 border border-brand-gold/50 p-2.5 rounded-lg text-[10px] font-mono text-brand-silver space-y-1 shadow-2xl pointer-events-none transition-all duration-150"
                  style={{ 
                    left: `${Math.min(Math.max(mapLatLngToSvg(hoveredWaypoint.latitude, hoveredWaypoint.longitude).x - 65, 10), svgWidth - 140)}px`, 
                    top: `${Math.min(Math.max(mapLatLngToSvg(hoveredWaypoint.latitude, hoveredWaypoint.longitude).y - 95, 10), svgHeight - 110)}px` 
                  }}
                >
                  <div className="text-white font-bold">{hoveredWaypoint.time} · {hoveredWaypoint.locationName}</div>
                  <div className="text-brand-gold">{hoveredWaypoint.status}</div>
                  <div className="grid grid-cols-2 gap-x-2 pt-1 border-t border-slate-800">
                    <div>Speed: <strong className="text-white">{hoveredWaypoint.speed} km/h</strong></div>
                    <div>Battery: <strong className="text-white">{hoveredWaypoint.battery}%</strong></div>
                  </div>
                </div>
              )}

              {/* Coordinate map labels overlay & Speed Legend */}
              <div className="absolute bottom-2 left-3 right-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[9px] font-mono text-slate-400 select-none bg-brand-navy-heavy/90 border border-brand-gold/15 px-3 py-1.5 rounded-lg">
                <span className="text-[8px] text-slate-500 uppercase tracking-wider">GRID RECONSTRUCTION ACTIVE</span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-slate-500 uppercase font-bold text-[8px]">Speed Index:</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6] inline-block shadow-sm" />
                    <span>0-15 km/h (Slow/Stop)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#06b6d4] inline-block shadow-sm" />
                    <span>15-35 km/h (Cruising)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block shadow-sm" />
                    <span>35-50 km/h (Moderate)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#ef4444] inline-block shadow-sm animate-pulse" />
                    <span className="text-red-400 font-semibold">50+ km/h (Speed Alert)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls & Scrubber Ribbon */}
            <div className="bg-brand-navy border-t border-brand-gold/15 px-4 py-3 flex flex-col sm:flex-row items-center gap-4 z-10">
              
              {/* Play Pause buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activeWaypointIndex >= waypoints.length - 1) {
                      setActiveWaypointIndex(0);
                    }
                    setIsPlaying(!isPlaying);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isPlaying ? 'bg-brand-gold text-brand-dark' : 'bg-brand-navy-light text-brand-gold border border-brand-gold/20 hover:border-brand-gold'}`}
                  title={isPlaying ? 'Pause Simulation' : 'Play Route History'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-brand-dark" /> : <Play className="w-4 h-4 fill-brand-gold ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveWaypointIndex(0);
                  }}
                  className="w-9 h-9 bg-brand-navy-light hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  title="Reset Playback"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Scrubber Range Slider */}
              <div className="flex-1 w-full flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400">{waypoints[0].time}</span>
                <input 
                  type="range"
                  min="0"
                  max={waypoints.length - 1}
                  value={activeWaypointIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setActiveWaypointIndex(Number(e.target.value));
                  }}
                  className="flex-1 h-1.5 accent-brand-gold bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-400">{waypoints[waypoints.length - 1].time}</span>
              </div>

              {/* Playback Speed Controller */}
              <div className="flex bg-brand-dark/50 border border-slate-800 p-1 rounded-lg gap-1 text-[10px] font-mono">
                {([1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded transition-colors font-bold cursor-pointer ${playbackSpeed === spd ? 'bg-brand-gold text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Stats Banner below map */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-brand-navy-light/30 border border-brand-gold/5 p-3 rounded-xl">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Avg Speed Today</span>
              <strong className="text-white text-sm font-mono">{avgDaySpeed} km/h</strong>
            </div>
            <div className="bg-brand-navy-light/30 border border-brand-gold/5 p-3 rounded-xl">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Max Recorded Speed</span>
              <strong className="text-white text-sm font-mono">{maxDaySpeed} km/h</strong>
            </div>
            <div className="bg-brand-navy-light/30 border border-brand-gold/5 p-3 rounded-xl">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Recorded Geofences</span>
              <strong className="text-white text-sm font-mono">3 Zones</strong>
            </div>
            <div className="bg-brand-navy-light/30 border border-brand-gold/5 p-3 rounded-xl">
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Threat Flags Raised</span>
              <strong className={`text-sm font-mono ${maxDaySpeed > 50 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {maxDaySpeed > 50 ? '1 Speed Flag' : '0 Safe'}
              </strong>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Telemetry HUD & Route Logs */}
        <div className="space-y-4">
          
          {/* Active Node Telemetry Card */}
          <div className="glass-panel p-4 rounded-xl border-t-2 border-brand-gold space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-brand-gold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> Telemetry HUD
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-brand-dark/80 rounded-lg flex items-center justify-between border border-slate-850">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  <span className="text-slate-400">Position Timestamp:</span>
                </div>
                <strong className="text-white font-mono text-sm">{activeWaypoint.time}</strong>
              </div>

              <div className="p-2.5 bg-brand-dark/80 rounded-lg flex items-center justify-between border border-slate-850">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-gold" />
                  <span className="text-slate-400">Geographic Node:</span>
                </div>
                <strong className="text-white truncate max-w-[130px] text-right" title={activeWaypoint.locationName}>
                  {activeWaypoint.locationName}
                </strong>
              </div>

              <div className="p-2.5 bg-brand-dark/80 rounded-lg flex items-center justify-between border border-slate-850">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-gold" />
                  <span className="text-slate-400">Current Velocity:</span>
                </div>
                <strong className="text-brand-gold font-mono text-sm">{activeWaypoint.speed} km/h</strong>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-brand-dark/80 rounded-lg border border-slate-850 text-center">
                  <Heart className="w-3.5 h-3.5 text-red-500 mx-auto mb-1 animate-pulse" />
                  <span className="block text-[9px] text-slate-500 uppercase font-mono">Heart Rate</span>
                  <strong className="text-white font-mono">{activeWaypoint.heartRate} BPM</strong>
                </div>

                <div className="p-2 bg-brand-dark/80 rounded-lg border border-slate-850 text-center">
                  <span className="text-brand-gold text-xs font-mono font-bold block mb-1">🌡️</span>
                  <span className="block text-[9px] text-slate-500 uppercase font-mono">Body Temp</span>
                  <strong className="text-white font-mono">{activeWaypoint.temperature}°C</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Day Route Log Timeline */}
          <div className="glass-panel p-4 rounded-xl space-y-3 max-h-[210px] overflow-y-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Timeline Log Book
            </h4>

            <div className="relative border-l border-brand-gold/20 ml-2 pl-3 space-y-4 py-1 text-xs">
              {waypoints.map((wp, idx) => {
                const isActive = idx === activeWaypointIndex;
                return (
                  <div 
                    key={wp.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveWaypointIndex(idx);
                    }}
                    className={`relative cursor-pointer group transition-all ${isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    {/* Anchor dot */}
                    <div className={`absolute -left-[17.5px] top-1.5 w-2 h-2 rounded-full border transition-all ${isActive ? 'bg-white border-white scale-125' : 'bg-brand-navy border-brand-gold group-hover:border-white'}`} />
                    
                    <div className="flex justify-between items-start">
                      <span>{wp.time}</span>
                      <span className={`text-[9px] font-mono px-1 rounded ${isActive ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-500'}`}>
                        {wp.speed} km/h
                      </span>
                    </div>
                    <div className="text-[10px] truncate max-w-[190px]">{wp.locationName}</div>
                    <div className="text-[9px] text-brand-gold/75 mt-0.5">{wp.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
