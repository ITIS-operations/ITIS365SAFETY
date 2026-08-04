import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Shield, Map, Eye, Calendar, Clock, Navigation, 
  Activity, Heart, Battery, Signal, Zap, AlertTriangle, ChevronRight, ChevronLeft, MapPin,
  Volume2, VolumeX, Compass, ZoomIn, ZoomOut, Maximize2, Minimize2, Share2, Phone, Plus,
  Sliders, ShieldAlert, CheckCircle2, User, HelpCircle, Info, Award, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Learner, SafeZone, SafetyAlert } from '../types';

interface LivePursuitNavigationProps {
  learners: Learner[];
  safeZones: SafeZone[];
  alerts: SafetyAlert[];
  onTriggerSOS: (learner: Learner) => void;
  initialSelectedLearnerId?: string;
}

interface GPSPoint {
  latitude: number;
  longitude: number;
  locationName: string;
  speed: number; // km/h
  heartRate: number;
  battery: number;
  signal: 'Strong' | 'Medium' | 'Weak' | 'None';
  status: string;
  instruction: string;
  heading: number; // compass heading in degrees
}

// Generate smooth transition coordinates between two lat/lng pairs
const interpolatePoints = (
  p1: { lat: number; lng: number }, 
  p2: { lat: number; lng: number }, 
  steps: number
) => {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: p1.lat + (p2.lat - p1.lat) * t,
      lng: p1.lng + (p2.lng - p1.lng) * t
    });
  }
  return points;
};

// Simulation Paths data for learners
// Path 1: Sipho Ndlovu - Departed Gauteng High School heading to Aunt Lerato's House
const siphoBaseNodes = [
  { lat: -26.1952, lng: 28.0340, name: 'Gauteng High School (Safe Zone)', instruction: 'Start tracking Sipho Ndlovu. Depart school gate.', heading: 10, speed: 0 },
  { lat: -26.1912, lng: 28.0345, name: 'Smit St & De Beer St Transit', instruction: 'Follow Smit Street Eastward toward M1 Highway.', heading: 25, speed: 30 },
  { lat: -26.1834, lng: 28.0355, name: 'M1 Northbound near Parktown', instruction: 'Merging onto M1 North. Traffic density: Low.', heading: 5, speed: 65 },
  { lat: -26.1685, lng: 28.0382, name: 'M1 Highway near Killarney Curvature', instruction: 'Follow M1 North. Maintain safety corridor tracking.', heading: 15, speed: 75 },
  { lat: -26.1550, lng: 28.0410, name: 'Houghton Dr Interchange Exit', instruction: 'Take exit 14 toward Rosebank / Houghton.', heading: 45, speed: 45 },
  { lat: -26.1460, lng: 28.0430, name: 'Glenhove Rd / Rosebank Junction', instruction: 'Turn right onto Glenhove Rd toward Aunt Lerato\'s.', heading: 90, speed: 25 },
  { lat: -26.1415, lng: 28.0482, name: 'Aunt Lerato\'s House (Safe Zone)', instruction: 'Destination reached. SIPHO ARRIVED AT SAFE ZONE.', heading: 120, speed: 0 }
];

// Path 2: Zama Dlamini - Unexpected deviation incident in Braamfontein (SOS Activated)
const zamaBaseNodes = [
  { lat: -26.1824, lng: 28.0210, name: 'Parktown Girls Primary (Safe Zone)', instruction: 'Zama Dlamini checked out. Boarded school bus route 12C.', heading: 180, speed: 0 },
  { lat: -26.1850, lng: 28.0225, name: 'Jan Smuts Ave Transit', instruction: 'Heading South on Jan Smuts Ave toward Braamfontein.', heading: 170, speed: 40 },
  { lat: -26.1905, lng: 28.0280, name: 'Empire Rd / Milpark Junction', instruction: 'Traffic delay detected at Empire Rd. Recalculating path.', heading: 110, speed: 15 },
  { lat: -26.1934, lng: 28.0355, name: 'Smit St & De Beer St Intersection (Incident)', instruction: 'ALERT: Bus stopped suddenly. Panic SOS triggered!', heading: 135, speed: 0 },
  { lat: -26.1945, lng: 28.0390, name: 'Braamfontein Secure Safe-House', instruction: 'Escorting Zama to nearby emergency public safe haven.', heading: 85, speed: 8 },
  { lat: -26.1950, lng: 28.0425, name: 'SAPS Hillbrow Police Station', instruction: 'Zama is secure at SAPS station. Dispatch responding guardian.', heading: 95, speed: 0 }
];

// Historical Expected "School-to-Home" Corridors
const zamaExpectedNodes = [
  { lat: -26.1824, lng: 28.0210, name: 'Parktown Girls Primary (Safe Zone)' },
  { lat: -26.1850, lng: 28.0225, name: 'Jan Smuts Ave Transit' },
  { lat: -26.1800, lng: 28.0180, name: 'Richmond Safe Corridor' },
  { lat: -26.1710, lng: 28.0140, name: 'Melville Expected Waypoint' },
  { lat: -26.1650, lng: 28.0100, name: 'Dlamini Home Safe Zone' }
];

const siphoExpectedNodes = [
  { lat: -26.1952, lng: 28.0340, name: 'Gauteng High School (Safe Zone)' },
  { lat: -26.1912, lng: 28.0345, name: 'Smit St & De Beer St Transit' },
  { lat: -26.1834, lng: 28.0355, name: 'M1 Northbound near Parktown' },
  { lat: -26.1685, lng: 28.0382, name: 'M1 Highway near Killarney Curvature' },
  { lat: -26.1550, lng: 28.0410, name: 'Houghton Dr Interchange Exit' },
  { lat: -26.1460, lng: 28.0430, name: 'Glenhove Rd / Rosebank Junction' },
  { lat: -26.1415, lng: 28.0482, name: 'Aunt Lerato\'s House (Safe Zone)' }
];

// Alternative path: Sipho Deviated Nodes
const siphoDeviatedNodes = [
  { lat: -26.1952, lng: 28.0340, name: 'Gauteng High School (Safe Zone)', instruction: 'Start tracking Sipho Ndlovu. Depart school gate.', heading: 10, speed: 0 },
  { lat: -26.1912, lng: 28.0345, name: 'Smit St & De Beer St Transit', instruction: 'Follow Smit Street Eastward.', heading: 25, speed: 30 },
  { lat: -26.1980, lng: 28.0150, name: 'Unexpected Turn West toward Melville', instruction: 'WARNING: Sipho took an unexpected Westward turn from M1 corridor!', heading: 270, speed: 45 },
  { lat: -26.2020, lng: 27.9950, name: 'Auckland Park Off-Route Zone', instruction: 'ALERT: Deep corridor drift. Moving away from registered destination.', heading: 260, speed: 55 },
  { lat: -26.2050, lng: 27.9800, name: 'Brixton Perimeter (Off-Corridor)', instruction: 'CRITICAL ALERT: Tracker is now in Brixton off-route zone. Initiating intercept.', heading: 250, speed: 35 }
];

// Generate final high-frequency waypoint array
const generateSimulationPoints = (nodes: typeof siphoBaseNodes, initialBattery: number, isEmergency: boolean): GPSPoint[] => {
  const finalPoints: GPSPoint[] = [];
  const interpSteps = 6; // steps between major nodes
  
  for (let i = 0; i < nodes.length - 1; i++) {
    const current = nodes[i];
    const next = nodes[i + 1];
    const path = interpolatePoints(current, next, interpSteps);
    
    path.forEach((p, idx) => {
      // Don't duplicate connection points
      if (idx === interpSteps && i < nodes.length - 2) return;
      
      const t = idx / interpSteps;
      const speed = Math.round(current.speed + (next.speed - current.speed) * t + (Math.random() * 4 - 2));
      const finalSpeed = speed < 0 ? 0 : speed;
      const heading = Math.round(current.heading + (next.heading - current.heading) * t);
      const battery = Math.max(10, Math.round(initialBattery - (finalPoints.length * 0.3)));
      
      finalPoints.push({
        latitude: p.lat,
        longitude: p.lng,
        locationName: idx > interpSteps / 2 ? next.name : current.name,
        speed: finalSpeed,
        heartRate: isEmergency && i >= 2 ? Math.round(110 + Math.random() * 15) : Math.round(72 + Math.random() * 8),
        battery,
        signal: battery < 20 ? 'Medium' : 'Strong',
        status: isEmergency && i >= 2 
          ? 'EMERGENCY PURSUIT RADAR BROADCASTING' 
          : finalSpeed === 0 ? 'Stationary at Safe Zone' : 'In Transit (En Route)',
        instruction: next.instruction,
        heading
      });
    });
  }
  return finalPoints;
};

// Simulated static points for emergency response hubs in Johannesburg North Area
const emergencyHubs = [
  { id: 'eh1', name: 'SAPS Hillbrow Station', type: 'police', latitude: -26.1950, longitude: 28.0425, phone: '+27 11 488 6511' },
  { id: 'eh2', name: 'Milpark Private Hospital', type: 'hospital', latitude: -26.1805, longitude: 28.0220, phone: '+27 11 480 5600' },
  { id: 'eh3', name: 'Rosebank Police Station', type: 'police', latitude: -26.1472, longitude: 28.0415, phone: '+27 11 778 4700' },
  { id: 'eh4', name: 'Parktown Fire & Rescue', type: 'fire', latitude: -26.1870, longitude: 28.0312, phone: '+27 11 375 5911' }
];

export function LivePursuitNavigation({ 
  learners, 
  safeZones, 
  alerts, 
  onTriggerSOS,
  initialSelectedLearnerId
}: LivePursuitNavigationProps) {
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(initialSelectedLearnerId || learners[0]?.id || 'l1');
  const [routingMode, setRoutingMode] = useState<'driving' | 'walking' | 'emergency' | 'safest'>('driving');
  const [mapMode, setMapMode] = useState<'vector' | 'satellite'>('vector');
  const [is3D, setIs3D] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.2);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [followMode, setFollowMode] = useState<boolean>(true);
  const [isSosTriggered, setIsSosTriggered] = useState<boolean>(false);
  const [voiceMuted, setVoiceMuted] = useState<boolean>(true);
  
  // AI Route Predictive states
  const [siphoDeviation, setSiphoDeviation] = useState<boolean>(false);
  const [transitHoursActive, setTransitHoursActive] = useState<boolean>(true);

  // Simulation player states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1); // seconds per tick
  const [voiceLog, setVoiceLog] = useState<string[]>(['Pursuit engine initialized. Standard safety monitoring active.']);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Find current learner
  const currentLearner = learners.find(l => l.id === selectedLearnerId) || learners[0];
  const isEmergencyActive = currentLearner.status === 'Emergency' || isSosTriggered;

  // Choose expected baseline route and raw nodes based on settings
  const expectedNodes = selectedLearnerId === 'l2' ? zamaExpectedNodes : siphoExpectedNodes;
  const rawNodes = selectedLearnerId === 'l2' 
    ? zamaBaseNodes 
    : (siphoDeviation ? siphoDeviatedNodes : siphoBaseNodes);

  const simPoints = generateSimulationPoints(rawNodes, currentLearner.deviceBattery, isEmergencyActive);
  const maxSteps = simPoints.length;
  const currentPoint = simPoints[simStep] || simPoints[0];

  // Helper to calculate the shortest distance from the current point to any node in the expected historical corridor
  const getMinimumDrift = (currentLat: number, currentLng: number, targetExpectedNodes: typeof zamaExpectedNodes) => {
    let minDistanceDegrees = Infinity;
    for (let i = 0; i < targetExpectedNodes.length; i++) {
      const node = targetExpectedNodes[i];
      const dy = currentLat - node.lat;
      const dx = currentLng - node.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistanceDegrees) {
        minDistanceDegrees = dist;
      }
    }
    // Convert degrees to approximate meters (1 degree is ~111,320 meters in JHB latitude)
    const driftMetersVal = minDistanceDegrees * 111320;
    return Math.round(driftMetersVal);
  };

  const driftMeters = getMinimumDrift(currentPoint.latitude, currentPoint.longitude, expectedNodes);
  
  // Calculate compliance score. If within 150m, compliance is perfect (98%). Above 150m, it decays by 1% per 12 meters.
  const calculatedComplianceScore = Math.max(12, Math.min(98, Math.round(98 - (driftMeters > 150 ? (driftMeters - 150) / 12 : 0))));
  const isPredictiveDeviationFlagged = transitHoursActive && calculatedComplianceScore < 75;

  // Simulated Parent Starting Coordinates (Randburg area)
  // We'll calculate a moving parent vector that converges onto the child
  const parentStartLat = -26.1154;
  const parentStartLng = 27.9712;
  
  // Interpolate parent coordinate as getting closer to the child
  const parentLat = parentStartLat + (currentPoint.latitude - parentStartLat) * Math.min(1, (simStep / (maxSteps - 1)) * 1.15);
  const parentLng = parentStartLng + (currentPoint.longitude - parentStartLng) * Math.min(1, (simStep / (maxSteps - 1)) * 1.15);

  // Trigger voice speech synthesis if unmuted and instruction changes
  useEffect(() => {
    if (!currentPoint) return;
    
    let sentence = currentPoint.instruction;
    
    // Override or append voice alerts if route prediction registers deviation
    if (isPredictiveDeviationFlagged && simStep >= 2) {
      sentence = `AI WARNING: Trajectory deviation detected for ${currentLearner.name.split(' ')[0]}. Expected route drifted by ${driftMeters} meters. Corridor compliance is ${calculatedComplianceScore}%.`;
    }

    if (!voiceMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 1.05;
      utterance.pitch = 0.95; // slightly lower pitch for authoritative command centre voice
      window.speechSynthesis.speak(utterance);
    }
    
    setVoiceLog(prev => {
      if (prev[0] === sentence) return prev;
      return [sentence, ...prev.slice(0, 5)];
    });
  }, [simStep, selectedLearnerId, voiceMuted, isPredictiveDeviationFlagged]);

  // Handle radar sweeping rotation in the background
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarSweepAngle(prev => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Recenter map viewport
  const handleRecenter = () => {
    setZoom(1.2);
    setPanOffset({ x: 0, y: 0 });
    setFollowMode(true);
  };

  // Run simulation playback loop
  useEffect(() => {
    if (isSimulating) {
      const intervalMs = (2000 / simulationSpeed);
      timerRef.current = setInterval(() => {
        setSimStep(prev => {
          if (prev >= maxSteps - 1) {
            setIsSimulating(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, simulationSpeed, maxSteps]);

  // Reset simulation step on learner swapper
  useEffect(() => {
    setSimStep(0);
    setIsSimulating(false);
    setIsSosTriggered(selectedLearnerId === 'l2'); // Zama starts in SOS state by default
  }, [selectedLearnerId]);

  // Map settings
  const svgWidth = 800;
  const svgHeight = 450;
  const margin = 50;

  // Coordinate bounding box covering parent, child, safe zones, and response hubs
  const allLatitudes = [parentLat, currentPoint.latitude, ...safeZones.map(z => z.latitude), ...emergencyHubs.map(h => h.latitude)];
  const allLongitudes = [parentLng, currentPoint.longitude, ...safeZones.map(z => z.longitude), ...emergencyHubs.map(h => h.longitude)];

  const minLat = Math.min(...allLatitudes) - 0.008;
  const maxLat = Math.max(...allLatitudes) + 0.008;
  const minLng = Math.min(...allLongitudes) - 0.008;
  const maxLng = Math.max(...allLongitudes) + 0.008;

  const latSpan = maxLat - minLat;
  const lngSpan = maxLng - minLng;

  // Translate geographic lat/lng coordinates directly into the responsive SVG coordinate system
  const mapLatLngToSvg = (lat: number, lng: number) => {
    const baseValX = margin + (lngSpan > 0 ? (lng - minLng) / lngSpan * (svgWidth - 2 * margin) : 0);
    const baseValY = svgHeight - (margin + (latSpan > 0 ? (lat - minLat) / latSpan * (svgHeight - 2 * margin) : 0));
    
    // Apply pan and zoom offsets
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;
    const zoomedX = centerX + (baseValX - centerX) * zoom + panOffset.x;
    const zoomedY = centerY + (baseValY - centerY) * zoom + panOffset.y;
    
    return { x: zoomedX, y: zoomedY };
  };

  // Convert real-world distance into SVG scale radius
  const getSvgRadius = (radiusInMeters: number) => {
    const degPerPixelY = latSpan / (svgHeight - 2 * margin);
    const radiusInDegrees = radiusInMeters / 111320;
    const svgRadius = (radiusInDegrees / degPerPixelY) * zoom;
    return Math.min(Math.max(svgRadius, 15), 150);
  };

  // Handle map panning with pointer drag
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setFollowMode(false); // break follow mode on manual pan
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    dragStartRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Generate turn-by-turn route coordinates based on active routing algorithm
  // Walking has a direct line, Driving wraps around mock blocks, Emergency cuts corners, Safest avoids crime areas
  const getRouteCoordinates = () => {
    const start = mapLatLngToSvg(parentLat, parentLng);
    const end = mapLatLngToSvg(currentPoint.latitude, currentPoint.longitude);
    
    if (routingMode === 'walking') {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
    
    // Create detailed multi-segment path to simulate routing around mock streets
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    if (routingMode === 'emergency') {
      // Direct angled fast-response path
      return `M ${start.x} ${start.y} L ${start.x + dx * 0.4} ${start.y + dy * 0.1} L ${start.x + dx * 0.7} ${start.y + dy * 0.9} L ${end.x} ${end.y}`;
    }
    
    if (routingMode === 'safest') {
      // Wide circular bypass path to avoid incident areas
      return `M ${start.x} ${start.y} Q ${start.x + dx * 0.15} ${start.y + dy * 0.8} ${start.x + dx * 0.6} ${start.y + dy * 0.9} T ${end.x} ${end.y}`;
    }
    
    // Default driving - grid navigation blocks
    return `M ${start.x} ${start.y} L ${start.x + dx * 0.5} ${start.y} L ${start.x + dx * 0.5} ${end.y} L ${end.x} ${end.y}`;
  };

  const calculatedRoutePath = getRouteCoordinates();
  
  // Historical expected path for AI deviation matching representation
  const getExpectedRouteCoordinates = () => {
    return expectedNodes
      .map((node, idx) => {
        const p = mapLatLngToSvg(node.lat, node.lng);
        return `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
      })
      .join(' ');
  };
  const expectedRoutePath = getExpectedRouteCoordinates();

  const parentPosition = mapLatLngToSvg(parentLat, parentLng);
  const childPosition = mapLatLngToSvg(currentPoint.latitude, currentPoint.longitude);

  // Auto-follow mode adjustments: centers map viewport between parent and child
  useEffect(() => {
    if (followMode) {
      const targetCenterX = (parentPosition.x + childPosition.x) / 2;
      const targetCenterY = (parentPosition.y + childPosition.y) / 2;
      const svgMidX = svgWidth / 2;
      const svgMidY = svgHeight / 2;
      
      // Gradually adjust panOffset to keep center
      const diffX = svgMidX - targetCenterX;
      const diffY = svgMidY - targetCenterY;
      
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        setPanOffset(prev => ({
          x: prev.x + diffX * 0.4,
          y: prev.y + diffY * 0.4
        }));
      }
    }
  }, [simStep, followMode, parentPosition.x, parentPosition.y, childPosition.x, childPosition.y]);

  // Calculate telemetry values
  // Distance estimate in meters based on simple coordinate diff
  const latDiff = currentPoint.latitude - parentLat;
  const lngDiff = currentPoint.longitude - parentLng;
  const distanceKm = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111.32;
  const remainingDistanceStr = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} meters` : `${distanceKm.toFixed(2)} km`;
  
  // ETA calculation based on speed mode
  const currentVelocity = currentPoint.speed === 0 ? 12 : currentPoint.speed;
  const durationHours = distanceKm / currentVelocity;
  const durationMins = Math.max(1, Math.round(durationHours * 60));
  const etaTimeStr = `${durationMins} mins`;

  // Color according to speed limit
  const getSpeedTextColor = (spd: number) => {
    if (spd > 50) return 'text-red-400 animate-pulse font-bold';
    if (spd > 30) return 'text-amber-400';
    return 'text-sky-400';
  };

  return (
    <div className="flex flex-col gap-5" id="live-pursuit-navigation-system">
      
      {/* Top Banner Control Centre Header */}
      <div className="bg-brand-navy border border-brand-gold/15 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`absolute -inset-1 rounded-full blur-md opacity-70 ${isEmergencyActive ? 'bg-red-500 animate-pulse' : 'bg-brand-gold'}`} />
            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border ${isEmergencyActive ? 'bg-red-950 border-red-500 text-red-400 animate-pulse' : 'bg-brand-dark border-brand-gold text-brand-gold'}`}>
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              ITIS Live Pursuit Navigation™ <span className="text-[10px] bg-brand-navy-light text-brand-gold border border-brand-gold/25 px-2 py-0.5 rounded-full font-bold">PRO ACTIVE RECON</span>
            </h2>
            <p className="text-xs text-brand-silver">
              Automated intercept routing and turn-by-turn guidance to active wearable tracker.
            </p>
          </div>
        </div>

        {/* Child Command Centre Selector */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex bg-brand-dark/95 border border-brand-gold/15 p-1 rounded-xl">
            {learners.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLearnerId(l.id)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${selectedLearnerId === l.id ? 'bg-brand-gold text-brand-dark font-black' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light/40'}`}
              >
                <img src={l.photoUrl} alt={l.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{l.name.split(' ')[0]}</span>
                {l.status === 'Emergency' && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (isSosTriggered) {
                setIsSosTriggered(false);
                onTriggerSOS({ ...currentLearner, status: 'In School' });
              } else {
                setIsSosTriggered(true);
                onTriggerSOS({ ...currentLearner, status: 'Emergency' });
              }
            }}
            className={`px-4 py-2 text-xs uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${isEmergencyActive ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-brand-navy border border-red-500/30 text-red-400 hover:bg-red-950/20'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isEmergencyActive ? 'Active SOS Mode' : 'Simulate SOS'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Radar Map on left, Tactical Telemetry Dashboard on right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT / CENTER: Dynamic Map HUD Panel */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          
          <div className={`relative bg-brand-dark border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isEmergencyActive ? 'border-red-500/40 glow-red/5' : 'border-brand-gold/15'}`}>
            
            {/* Top Interactive HUD Ribbon overlays */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none select-none">
              
              {/* Coordinates block */}
              <div className="bg-brand-navy-heavy/90 backdrop-blur-md border border-brand-gold/20 px-3 py-2 rounded-xl text-[10px] font-mono text-brand-silver space-y-0.5 shadow-lg">
                <div className="text-brand-gold font-bold uppercase tracking-wider text-[8px] flex items-center gap-1">
                  <Activity className="w-3 h-3 text-brand-gold animate-pulse" /> Live Telemetry
                </div>
                <div>DEST LAT: <span className="text-white">{currentPoint.latitude.toFixed(6)}</span></div>
                <div>DEST LNG: <span className="text-white">{currentPoint.longitude.toFixed(6)}</span></div>
                <div>HEADING: <span className="text-white">{currentPoint.heading}° {currentPoint.heading > 315 || currentPoint.heading <= 45 ? 'North' : currentPoint.heading <= 135 ? 'East' : currentPoint.heading <= 225 ? 'South' : 'West'}</span></div>
              </div>

              {/* SIM state overlays */}
              <div className="flex gap-2">
                <div className="bg-brand-navy-heavy/90 backdrop-blur-md border border-brand-gold/20 px-3 py-2 rounded-xl text-[10px] font-mono text-brand-silver flex gap-3 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Battery className={`w-3.5 h-3.5 ${currentPoint.battery < 20 ? 'text-red-500 animate-pulse' : 'text-brand-gold'}`} />
                    <span className="text-white">{currentPoint.battery}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                    <Signal className="w-3.5 h-3.5 text-brand-gold" />
                    <span className="text-white">{currentPoint.signal}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setVoiceMuted(!voiceMuted)}
                  className="pointer-events-auto bg-brand-navy-heavy/90 backdrop-blur-md border border-brand-gold/20 p-2 rounded-xl text-brand-gold hover:text-white hover:bg-slate-900 transition-all shadow-lg cursor-pointer"
                  title={voiceMuted ? 'Unmute Audio Voice Prompts' : 'Mute Voice Assistant'}
                >
                  {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
                </button>
              </div>
            </div>

            {/* Simulated Map Canvas SVG Area */}
            <div className="relative h-[450px] w-full bg-brand-dark select-none overflow-hidden" id="interactive-pursuit-viewport">
              
              {/* Grid Radar Swirl Texture */}
              <div className={`absolute inset-0 bg-cover bg-center transition-all duration-750 mix-blend-color-dodge pointer-events-none ${mapMode === 'satellite' ? 'opacity-35' : 'opacity-10'}`} 
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000')` }} 
              />
              
              {/* Techy Neon wireframe background when in vector mode */}
              {mapMode === 'vector' && (
                <div className="absolute inset-0 bg-brand-dark pointer-events-none opacity-[0.95]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(200, 166, 70, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 166, 70, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />
                  
                  {/* Neon Grid Sweep Lines */}
                  <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-brand-gold/10" />
                  <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-brand-gold/10" />
                  <div className="absolute top-0 bottom-0 left-[80%] w-[1px] bg-brand-gold/10" />
                  <div className="absolute left-0 right-0 top-[25%] h-[1px] bg-brand-gold/10" />
                  <div className="absolute left-0 right-0 top-[55%] h-[1px] bg-brand-gold/10" />
                  <div className="absolute left-0 right-0 top-[85%] h-[1px] bg-brand-gold/10" />
                </div>
              )}

              {/* Dynamic Radar Sweeper Widget */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-brand-gold/5 rounded-full pointer-events-none flex items-center justify-center">
                <div className="absolute w-[500px] h-[500px] border border-brand-gold/5 rounded-full" />
                <div className="absolute w-[300px] h-[300px] border border-brand-gold/5 rounded-full" />
                <div className="absolute w-[100px] h-[100px] border border-brand-gold/5 rounded-full" />
                
                {/* Rotating Sweeper Beam */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    transform: `rotate(${radarSweepAngle}deg)`,
                    background: 'conic-gradient(from 0deg, rgba(200, 166, 70, 0.15) 0deg, rgba(200, 166, 70, 0.01) 60deg, transparent 90deg)',
                    transformOrigin: 'center center'
                  }}
                />
              </div>

              {/* Responsive SVG Layer */}
              <svg 
                className="absolute inset-0 w-full h-full z-10 cursor-move" 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ 
                  transform: is3D ? 'perspective(800px) rotateX(45deg)' : 'none',
                  transformOrigin: '50% 50%',
                  transition: 'transform 0.4s ease-out'
                }}
              >
                <defs>
                  {/* Marker Shadows and Glow Effects */}
                  <filter id="hud-glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="hud-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Safe Zones Ring Plots */}
                {safeZones.map((zone) => {
                  const { x, y } = mapLatLngToSvg(zone.latitude, zone.longitude);
                  const radius = getSvgRadius(zone.radius);
                  const isSchoolZone = zone.type === 'school';
                  const isHomeZone = zone.type === 'home';
                  
                  return (
                    <g key={zone.id} className="opacity-60 hover:opacity-100 transition-opacity">
                      {/* Boundary perimeter */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={radius} 
                        fill={isHomeZone ? 'rgba(200, 166, 70, 0.02)' : isSchoolZone ? 'rgba(16, 185, 129, 0.02)' : 'rgba(14, 165, 233, 0.02)'} 
                        stroke={isHomeZone ? '#C8A646' : isSchoolZone ? '#10B981' : '#0EA5E9'} 
                        strokeWidth="1.5" 
                        strokeDasharray="5,4" 
                      />
                      {/* Core anchor pin */}
                      <circle cx={x} cy={y} r="3" fill={isHomeZone ? '#C8A646' : isSchoolZone ? '#10B981' : '#0EA5E9'} />
                    </g>
                  );
                })}

                {/* Active Emergency Facilities */}
                {emergencyHubs.map((hub) => {
                  const { x, y } = mapLatLngToSvg(hub.latitude, hub.longitude);
                  const isHospital = hub.type === 'hospital';
                  
                  return (
                    <g key={hub.id}>
                      <circle cx={x} cy={y} r="8" fill="rgba(15, 23, 42, 0.85)" stroke={isHospital ? '#10B981' : '#ef4444'} strokeWidth="1.5" />
                      <text x={x} y={y + 3} textAnchor="middle" fill={isHospital ? '#10B981' : '#ef4444'} fontSize="7" fontWeight="bold" fontFamily="monospace">
                        {isHospital ? 'H' : 'P'}
                      </text>
                      {/* Text label overlay */}
                      <text x={x} y={y - 12} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="semibold">
                        {hub.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Historical School-to-Home Baseline Corridor */}
                {expectedRoutePath && (
                  <>
                    {/* Glowing outer boundary ribbon */}
                    <path 
                      d={expectedRoutePath} 
                      fill="none" 
                      stroke="rgba(16, 185, 129, 0.12)" 
                      strokeWidth="18" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="pointer-events-none"
                    />
                    {/* Dotted core centerline */}
                    <path 
                      d={expectedRoutePath} 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeDasharray="4,6"
                      className="opacity-40 pointer-events-none"
                    />
                  </>
                )}

                {/* Route polyline connecting parent to child */}
                {calculatedRoutePath && (
                  <>
                    {/* Shadow route underlay */}
                    <path 
                      d={calculatedRoutePath} 
                      fill="none" 
                      stroke="rgba(15, 23, 42, 0.6)" 
                      strokeWidth="6" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    
                    {/* Glowing colored navigation route */}
                    <path 
                      d={calculatedRoutePath} 
                      fill="none" 
                      stroke={isEmergencyActive ? '#ef4444' : '#C8A646'} 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeDasharray={routingMode === 'walking' ? '5,5' : 'none'}
                      className="opacity-90"
                    />
                  </>
                )}

                {/* Draw Route History Breadcrumbs */}
                {simPoints.slice(0, simStep).map((pt, idx) => {
                  const { x, y } = mapLatLngToSvg(pt.latitude, pt.longitude);
                  return (
                    <circle 
                      key={`hist-${idx}`} 
                      cx={x} 
                      cy={y} 
                      r="1.5" 
                      fill={isEmergencyActive ? '#ef4444' : '#C8A646'} 
                      className="opacity-40" 
                    />
                  );
                })}

                {/* Parent Vehicle Marker */}
                <g>
                  {/* Pulse perimeter */}
                  <circle 
                    cx={parentPosition.x} 
                    cy={parentPosition.y} 
                    r="15" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1" 
                    className="animate-ping opacity-25" 
                  />
                  
                  {/* Outer ring */}
                  <circle 
                    cx={parentPosition.x} 
                    cy={parentPosition.y} 
                    r="8" 
                    fill="#1e293b" 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    shadow-md="true"
                  />
                  
                  {/* Innermost dot */}
                  <circle 
                    cx={parentPosition.x} 
                    cy={parentPosition.y} 
                    r="3.5" 
                    fill="#3b82f6" 
                  />
                </g>

                {/* Child Moving Target Marker */}
                <g>
                  {/* Pulsing hazard perimeter if SOS is active */}
                  <circle 
                    cx={childPosition.x} 
                    cy={childPosition.y} 
                    r={getSvgRadius(150)} 
                    fill={isEmergencyActive ? 'rgba(239, 68, 68, 0.05)' : 'rgba(200, 166, 70, 0.03)'} 
                    stroke={isEmergencyActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(200, 166, 70, 0.15)'} 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                  />

                  {/* Pulsing anchor rings */}
                  <circle 
                    cx={childPosition.x} 
                    cy={childPosition.y} 
                    r="24" 
                    fill="none" 
                    stroke={isEmergencyActive ? '#ef4444' : '#C8A646'} 
                    strokeWidth="1" 
                    className="animate-ping opacity-35" 
                    style={{ animationDuration: '2s' }}
                  />

                  <circle 
                    cx={childPosition.x} 
                    cy={childPosition.y} 
                    r="16" 
                    fill="none" 
                    stroke={isEmergencyActive ? '#ef4444' : '#C8A646'} 
                    strokeWidth="1.5" 
                    className="animate-pulse opacity-50" 
                  />
                </g>
              </svg>

              {/* HTML Absolute Overlays on top of SVG */}
              {/* Dynamic Child Photo Node */}
              <div 
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{ 
                  left: childPosition.x, 
                  top: childPosition.y - 30, // Offset upwards slightly
                  transform: is3D ? 'perspective(800px) rotateX(-45deg)' : 'none' 
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={currentLearner.photoUrl} 
                      alt={currentLearner.name} 
                      className={`w-11 h-11 rounded-full object-cover border-2 shadow-2xl ${isEmergencyActive ? 'border-red-500 ring-4 ring-red-500/35 animate-pulse' : 'border-brand-gold'}`} 
                    />
                    {isEmergencyActive && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white text-[8px] font-black text-white items-center justify-center">SOS</span>
                      </span>
                    )}
                  </div>
                  <div className={`mt-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-lg border backdrop-blur-md ${isEmergencyActive ? 'bg-red-950/90 border-red-500/50 text-white' : 'bg-brand-navy-heavy/90 border-brand-gold/40 text-brand-gold'}`}>
                    {currentPoint.speed > 0 ? `MOVING: ${currentPoint.speed} km/h` : 'STATIONARY'}
                  </div>
                </div>
              </div>

              {/* Dynamic Guardian Avatar Tag */}
              <div 
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{ 
                  left: parentPosition.x, 
                  top: parentPosition.y - 25, 
                  transform: is3D ? 'perspective(800px) rotateX(-45deg)' : 'none' 
                }}
              >
                <div className="bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider shadow-lg">
                  Guardian Car
                </div>
              </div>

              {/* Live Voice Prompt Caption HUD */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-brand-navy-heavy/95 border border-brand-gold/15 p-3 rounded-xl flex items-center gap-3 shadow-2xl backdrop-blur-md">
                <div className="w-6 h-6 rounded-lg bg-brand-navy border border-brand-gold/30 flex items-center justify-center">
                  <Volume2 className={`w-3.5 h-3.5 text-brand-gold ${isSimulating ? 'animate-pulse' : ''}`} />
                </div>
                <div className="flex-1 min-w-0 font-mono">
                  <div className="text-[7px] text-slate-500 uppercase font-black tracking-widest">TACTICAL VOICE COMMAND</div>
                  <p className="text-xs text-white truncate font-bold">{currentPoint.instruction}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                  <span className="text-[8px] font-mono text-brand-gold uppercase tracking-widest font-black">ACTIVE</span>
                </div>
              </div>

              {/* Map controls panel widget overlay */}
              <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5">
                <button 
                  onClick={() => setZoom(z => Math.min(2.5, z + 0.15))}
                  className="bg-brand-navy-heavy/90 border border-brand-gold/15 p-2 rounded-lg text-brand-gold hover:text-white hover:bg-slate-900 transition-all shadow-md cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
                  className="bg-brand-navy-heavy/90 border border-brand-gold/15 p-2 rounded-lg text-brand-gold hover:text-white hover:bg-slate-900 transition-all shadow-md cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleRecenter}
                  className={`border p-2 rounded-lg transition-all shadow-md cursor-pointer ${followMode ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'bg-brand-navy-heavy/90 border-brand-gold/15 text-brand-gold hover:text-white hover:bg-slate-900'}`}
                  title="Recenter Map & Re-enable Auto-Follow"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIs3D(!is3D)}
                  className={`border p-2 rounded-lg transition-all shadow-md cursor-pointer ${is3D ? 'bg-brand-gold text-brand-dark border-brand-gold' : 'bg-brand-navy-heavy/90 border-brand-gold/15 text-brand-gold hover:text-white hover:bg-slate-900'}`}
                  title="Toggle 2D / 3D Perspective Map"
                >
                  <span className="text-[10px] font-black font-mono">3D</span>
                </button>
                <button 
                  onClick={() => setMapMode(m => m === 'vector' ? 'satellite' : 'vector')}
                  className="bg-brand-navy-heavy/90 border border-brand-gold/15 p-2 rounded-lg text-brand-gold hover:text-white hover:bg-slate-900 transition-all shadow-md cursor-pointer text-[9px] font-bold font-mono"
                  title="Toggle Satellite / Vector View"
                >
                  {mapMode === 'satellite' ? 'VECT' : 'SAT'}
                </button>
              </div>

            </div>

            {/* Simulation controls strip */}
            <div className="bg-brand-navy border-t border-brand-gold/15 px-4 py-3.5 flex flex-col md:flex-row items-center gap-4 z-10">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (simStep >= maxSteps - 1) {
                      setSimStep(0);
                    }
                    setIsSimulating(!isSimulating);
                  }}
                  className={`h-9 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-bold font-mono uppercase ${isSimulating ? 'bg-amber-500 text-brand-dark' : 'bg-brand-gold text-brand-dark hover:bg-brand-gold/90'}`}
                >
                  {isSimulating ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-brand-dark" /> Pause Recon
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-brand-dark ml-0.5" /> Start Pursuit Sim
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsSimulating(false);
                    setSimStep(0);
                  }}
                  className="w-9 h-9 bg-brand-navy-light hover:bg-slate-800 text-slate-300 border border-slate-850 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  title="Reset Pursuit Timeline"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Progress and Scrubber Slider */}
              <div className="flex-1 w-full flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400">START</span>
                <input 
                  type="range"
                  min="0"
                  max={maxSteps - 1}
                  value={simStep}
                  onChange={(e) => {
                    setIsSimulating(false);
                    setSimStep(Number(e.target.value));
                  }}
                  className="flex-1 h-1.5 accent-brand-gold bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-400">INTERCEPT ({Math.round((simStep / (maxSteps - 1)) * 100)}%)</span>
              </div>

              {/* Simulation speed multiplier */}
              <div className="flex bg-brand-dark/65 border border-slate-800 p-1 rounded-lg gap-1 text-[10px] font-mono">
                {([1, 2.5, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2 py-1 rounded transition-colors font-bold cursor-pointer ${simulationSpeed === spd ? 'bg-brand-gold text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Map options routing profiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'driving', label: 'Driving Route', desc: 'Fastest intercept, highway pathing' },
              { id: 'walking', label: 'Walking Route', desc: 'Direct pedestrian alleyways' },
              { id: 'emergency', label: 'Tactical Direct', desc: 'Active SAPS bypass, emergency' },
              { id: 'safest', label: 'Safest Corridor', desc: 'Avoids reported high-crime zones' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setRoutingMode(p.id as any)}
                className={`text-left p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${routingMode === p.id ? 'bg-brand-navy-light border-brand-gold' : 'bg-brand-navy-light/20 border-brand-gold/5 hover:border-slate-800'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[10px] font-bold ${routingMode === p.id ? 'text-brand-gold' : 'text-slate-400'}`}>
                    {p.label}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${routingMode === p.id ? 'bg-brand-gold' : 'bg-slate-600'}`} />
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL: Live Status Panel & AI Safety HUD */}
        <div className="space-y-4">
          
          {/* Tactical Target Pursuit HUD */}
          <div className="glass-panel p-4.5 rounded-2xl border-t-2 border-brand-gold space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-brand-gold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> Intercept HUD Status
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-brand-dark/90 rounded-xl flex items-center justify-between border border-slate-850">
                <span className="text-slate-400 font-mono">ESTIMATED ETA:</span>
                <strong className="text-brand-gold font-mono text-sm animate-pulse">{etaTimeStr}</strong>
              </div>

              <div className="p-3 bg-brand-dark/90 rounded-xl flex items-center justify-between border border-slate-850">
                <span className="text-slate-400 font-mono">REMAINING DISTANCE:</span>
                <strong className="text-white font-mono text-sm">{remainingDistanceStr}</strong>
              </div>

              <div className="p-3 bg-brand-dark/90 rounded-xl flex items-center justify-between border border-slate-850">
                <span className="text-slate-400 font-mono">TARGET VELOCITY:</span>
                <strong className={`font-mono text-sm ${getSpeedTextColor(currentPoint.speed)}`}>
                  {currentPoint.speed} km/h
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-brand-dark/90 rounded-xl border border-slate-850 text-center">
                  <Heart className="w-4 h-4 text-red-500 mx-auto mb-1 animate-pulse" />
                  <span className="block text-[8px] text-slate-500 uppercase font-mono">Heart Rate</span>
                  <strong className="text-white font-mono text-xs">{currentPoint.heartRate} BPM</strong>
                </div>

                <div className="p-2.5 bg-brand-dark/90 rounded-xl border border-slate-850 text-center">
                  <span className="text-brand-gold text-sm font-mono font-bold block mb-1">🌡️</span>
                  <span className="block text-[8px] text-slate-500 uppercase font-mono">Body Temp</span>
                  <strong className="text-white font-mono text-xs">36.6 °C</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Intelligent Safety Monitoring AI Detector */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-gold" /> AI Threat & Safety Analyzer
            </h4>
            
            <div className="space-y-2 text-xs">
              {/* Threat 1: Speed Alert */}
              <div className={`p-3 rounded-xl border ${currentPoint.speed > 55 ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-brand-dark/40 border-slate-850 text-brand-silver'}`}>
                <div className="flex items-center gap-2 font-bold mb-1 font-mono text-[10px]">
                  <Zap className={`w-3.5 h-3.5 ${currentPoint.speed > 55 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                  <span>SPEEDING VELOCITY ALGORITHM</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {currentPoint.speed > 55 
                    ? `Velocity is ${currentPoint.speed} km/h. Exceeds recommended school safe-zone speed limit.`
                    : 'Velocity threshold within normal driving parameters.'}
                </p>
              </div>

              {/* Threat 2: AI Predictive Route Deviation Alert */}
              <div className={`p-3.5 rounded-xl border transition-all ${isPredictiveDeviationFlagged ? 'bg-red-950/30 border-red-500 text-red-200 shadow-lg' : 'bg-brand-dark/40 border-slate-850 text-brand-silver'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[10px]">
                    <AlertTriangle className={`w-3.5 h-3.5 ${isPredictiveDeviationFlagged ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                    <span>AI PREDICTIVE ROUTE GUARD</span>
                  </div>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-black ${isPredictiveDeviationFlagged ? 'bg-red-900/50 text-red-300 animate-pulse' : 'bg-emerald-950/60 text-emerald-300'}`}>
                    {isPredictiveDeviationFlagged ? 'CRITICAL DRIFT' : 'MATCHES CORRIDOR'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Trajectory Compliance:</span>
                    <strong className={`font-mono ${isPredictiveDeviationFlagged ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>{calculatedComplianceScore}%</strong>
                  </div>
                  <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isPredictiveDeviationFlagged ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${calculatedComplianceScore}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-mono border-t border-slate-800/40 pt-1.5">
                    <span className="text-slate-500">DRIFT DISTANCE:</span>
                    <strong className={isPredictiveDeviationFlagged ? 'text-red-400 font-bold' : 'text-slate-300'}>{driftMeters} meters</strong>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed pt-1 font-sans">
                    {isPredictiveDeviationFlagged 
                      ? `CRITICAL ALERT: Tracker deviated from the registered school-to-home corridor by ${driftMeters}m. Anomaly confidence: 94%. Predictive intercept routing updated.`
                      : 'Tracker follows the 30-day historical baseline corridor perfectly. Standard school-to-home heading match.'}
                  </p>
                </div>
              </div>

              {/* Threat 3: General Status */}
              <div className="p-3 bg-brand-dark/40 border border-slate-850 rounded-xl text-[10px] font-mono text-slate-400 space-y-1">
                <div className="text-white text-[9px] font-bold">DEVICE HEALTH DIAGNOSTIC:</div>
                <div className="flex justify-between">
                  <span>GPS LOCK:</span>
                  <span className="text-emerald-400">SECURE (3D FIX)</span>
                </div>
                <div className="flex justify-between">
                  <span>TAMPER SENSOR:</span>
                  <span className="text-emerald-400">NORMAL (ON BODY)</span>
                </div>
                <div className="flex justify-between">
                  <span>DATA ENCRYPTION:</span>
                  <span className="text-brand-gold">E2EE ACTIVE (AES-256)</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Route Predictive Settings and Testing */}
          <div className="glass-panel p-4 rounded-2xl border-l-2 border-brand-gold space-y-3.5 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-brand-gold" /> AI Predictive Routing Guard
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 bg-brand-dark/95 border border-slate-850 rounded-xl">
                <div>
                  <span className="block text-[10px] text-white font-bold">Transit Hour Filter</span>
                  <span className="text-[8px] text-slate-500">Expected: 14:00 - 18:00</span>
                </div>
                <button
                  onClick={() => setTransitHoursActive(!transitHoursActive)}
                  className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-colors cursor-pointer ${transitHoursActive ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-slate-800 text-slate-400'}`}
                >
                  {transitHoursActive ? 'ARMED' : 'STANDBY'}
                </button>
              </div>

              {selectedLearnerId === 'l1' ? (
                <div className="flex items-center justify-between p-2.5 bg-brand-dark/95 border border-slate-850 rounded-xl">
                  <div>
                    <span className="block text-[10px] text-white font-bold">Simulate Route Drift</span>
                    <span className="text-[8px] text-slate-500">Force Sipho to deviate west</span>
                  </div>
                  <button
                    onClick={() => {
                      setSiphoDeviation(!siphoDeviation);
                      setSimStep(0);
                    }}
                    className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-colors cursor-pointer ${siphoDeviation ? 'bg-red-600 text-white animate-pulse font-bold' : 'bg-slate-850 text-slate-400 border border-slate-700'}`}
                  >
                    {siphoDeviation ? 'DRIFT ON' : 'TEST DRIFT'}
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-brand-dark/40 border border-slate-850 rounded-xl text-[9px] text-slate-400 leading-relaxed font-sans">
                  <span className="text-brand-gold font-bold block mb-0.5">Zama Dlamini Incident:</span>
                  Route deviation and SOS triggers automatically at Step 3 on her timeline. Switch to Sipho to manually toggle custom trajectory drifts!
                </div>
              )}
            </div>
          </div>

          {/* Incident Command Terminal Logs */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Timeline Command Log
            </h4>
            <div className="bg-brand-dark/95 border border-brand-gold/15 rounded-xl p-3 h-[120px] overflow-y-auto font-mono text-[10px] text-brand-silver space-y-2">
              {voiceLog.map((log, idx) => (
                <div key={idx} className={`border-b border-slate-900 pb-1.5 leading-relaxed ${idx === 0 ? 'text-brand-gold font-bold' : 'opacity-65'}`}>
                  <span className="text-slate-500 mr-1.5">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Intercept Action Triggers */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Encrypted pursuit intercept tracking link has been copied to your clipboard! Securely share this with active responder agencies.");
              }}
              className="py-2.5 bg-brand-navy-light hover:bg-slate-850 border border-brand-gold/15 text-white font-bold font-mono rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-gold" />
              <span>Share Live Route</span>
            </button>
            <button
              onClick={() => {
                alert(`Dispatching SAPS emergency tactical backup squad directly to Sipho's current live location node at latitude: ${currentPoint.latitude.toFixed(6)}, longitude: ${currentPoint.longitude.toFixed(6)}.`);
              }}
              className="py-2.5 bg-red-950/40 hover:bg-red-900/30 border border-red-500/35 text-red-200 font-bold font-mono rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all animate-pulse"
            >
              <Phone className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              <span>Escalate response</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
