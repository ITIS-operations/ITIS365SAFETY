/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, LogOut, Radio, UserCheck, MessageSquare, HelpCircle, AlertTriangle, 
  Settings, Server, Cpu, Heart, Database, Compass, Phone
} from 'lucide-react';

import { LoginScreen } from './components/LoginScreen';
import { GuardianDashboard } from './components/GuardianDashboard';
import { SchoolPortal } from './components/SchoolPortal';
import { CommandCentre } from './components/CommandCentre';
import { AIChat } from './components/AIChat';
import { PanicConsole } from './components/PanicConsole';
import { EmergencyBypassProfile } from './components/EmergencyBypassProfile';
import itisLogo from './assets/images/itis_logo_1783562386226.jpg';

import { 
  Learner, SafeZone, SafetyAlert, IncidentTicket,
  initialLearners, initialSafeZones, initialAlerts, initialIncidents 
} from './types';
import { wsService } from './services/websocket';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'Parent' | 'School' | 'Command'>('Parent');
  
  // State variables synchronized across views
  const [learners, setLearners] = useState<Learner[]>(initialLearners);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(initialSafeZones);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(initialAlerts);
  const [incidents, setIncidents] = useState<IncidentTicket[]>(initialIncidents);

  // WebSocket status state
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Connect and subscribe to WebSocket topics on load
  useEffect(() => {
    wsService.connect();

    const unsubStatus = wsService.onStatusChange((status) => {
      setWsStatus(status);
    });

    const unsubLearners = wsService.subscribe('learners', (data) => {
      if (Array.isArray(data)) {
        setLearners(data);
      } else {
        setLearners(prev => prev.map(l => l.id === data.id ? { ...l, ...data } : l));
      }
    });

    const unsubAlerts = wsService.subscribe('alerts', (data) => {
      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        setAlerts(prev => {
          if (prev.some(a => a.id === data.id)) {
            return prev.map(a => a.id === data.id ? { ...a, ...data } : a);
          }
          return [data, ...prev];
        });
      }
    });

    const unsubIncidents = wsService.subscribe('incidents', (data) => {
      if (Array.isArray(data)) {
        setIncidents(data);
      } else {
        setIncidents(prev => {
          if (prev.some(i => i.id === data.id)) {
            return prev.map(i => i.id === data.id ? { ...i, ...data } : i);
          }
          return [data, ...prev];
        });
      }
    });

    return () => {
      unsubStatus();
      unsubLearners();
      unsubAlerts();
      unsubIncidents();
    };
  }, []);

  // Active panic/SOS screen
  const [activePanicChild, setActivePanicChild] = useState<Learner | null>(null);

  // AI chat widget toggle
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Emergency Bypass Learner (First Responder scanning QR Code)
  const [emergencyBypassLearner, setEmergencyBypassLearner] = useState<Learner | null>(null);

  // Parse URL search params for First Responder Emergency Bypass on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bypass = params.get('bypass');
    const learnerId = params.get('learnerId');
    if (bypass === 'true' && learnerId) {
      const found = learners.find(l => l.id === learnerId);
      if (found) {
        setEmergencyBypassLearner(found);
      }
    }

    // Auto-request notification permission on load to ensure parents receive browser push notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [learners]);

  // Real-time Browser Push Notification system helper
  const triggerBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: '/src/assets/images/itis_logo_1783562386226.jpg',
          tag: 'itis-realtime-safety-alert',
          requireInteraction: true // keeps alert visible until user interacts with it
        });
      } catch (err) {
        console.warn("Browser Notification instantiation failed:", err);
      }
    }
  };

  // Handle Login Event
  const handleLoginSuccess = (role: string) => {
    if (role === 'EmergencyBypass') {
      // Trigger instant panic bypass for simulation
      setUserRole('Parent');
      setIsLoggedIn(true);
      setActivePanicChild(learners[0]);
    } else {
      setUserRole(role as any);
      setIsLoggedIn(true);
    }
  };

  // Trigger global SOS panic screen
  const triggerSOS = (learner: Learner) => {
    const updatedLearner = { ...learner, status: 'Emergency' as const };
    
    // 1. Mark status as emergency in state
    setLearners(prev => prev.map(l => l.id === learner.id ? updatedLearner : l));
    
    // 2. Open full-screen PanicConsole
    setActivePanicChild(learner);

    // 3. Add to notifications feed
    const newAlert: SafetyAlert = {
      id: `sos-alert-${Date.now()}`,
      learnerId: learner.id,
      learnerName: learner.name,
      type: 'SOS Activated',
      severity: 'critical',
      message: `🚨 IMMEDIATE PANIC KEY TRIGGERED BY ${learner.name.toUpperCase()} (SERIAL: ${learner.trackerSerial}). Active audio loop and SAPS tracking enabled.`,
      time: new Date().toISOString(),
      resolved: false,
      coordinates: { lat: learner.latitude, lng: learner.longitude }
    };
    setAlerts(prev => [newAlert, ...prev]);

    // Send real-time browser push notification
    triggerBrowserNotification(
      `🚨 CRITICAL SOS ALERT: ${learner.name}`,
      `IMMEDIATE ACTION REQUIRED: ${learner.name} has triggered their panic key. Current coordinates: ${learner.latitude}, ${learner.longitude}. Click to track live.`
    );

    // Publish to WebSockets for full multi-user real-time synchronization
    wsService.publish('learners', updatedLearner);
    wsService.publish('alerts', newAlert);
  };

  // Handle addition/deletion of safe zones
  const handleAddSafeZone = (zone: SafeZone) => {
    setSafeZones(prev => [zone, ...prev]);

    // Dispatch automated alert
    const newAlert: SafetyAlert = {
      id: `zone-created-${Date.now()}`,
      type: 'Weather Alert',
      severity: 'low',
      message: `Security geofence '${zone.name}' (${zone.radius}m) successfully configured and deployed.`,
      time: new Date().toISOString(),
      resolved: true
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleDeleteSafeZone = (id: string) => {
    setSafeZones(prev => prev.filter(z => z.id !== id));
  };

  const handleUpdateLearnerStatus = (id: string, newStatus: 'In School' | 'En Route' | 'At Home' | 'Emergency') => {
    setLearners(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

    // Send notification of status changes
    const target = learners.find(l => l.id === id);
    if (target) {
      const type = newStatus === 'In School' ? 'School Arrival' : newStatus === 'At Home' ? 'School Departure' : 'Leaving Safe Zone';
      const severity = newStatus === 'Emergency' ? 'critical' : newStatus === 'En Route' ? 'medium' : 'low';
      const newAlert: SafetyAlert = {
        id: `status-alert-${Date.now()}`,
        learnerId: target.id,
        learnerName: target.name,
        type: type as any,
        severity: severity,
        message: `${target.name} state marked as '${newStatus}' by authorized guardian portal.`,
        time: new Date().toISOString(),
        resolved: true
      };
      setAlerts(prev => [newAlert, ...prev]);

      // Trigger actual real-time browser push notification
      if (newStatus === 'Emergency') {
        triggerBrowserNotification(
          `🚨 CRITICAL EMERGENCY Status: ${target.name}`,
          `${target.name} is now marked in Emergency status. Location: ${target.latitude}, ${target.longitude}.`
        );
      } else if (newStatus === 'En Route') {
        triggerBrowserNotification(
          `⚠️ Exited Safe Zone: ${target.name}`,
          `${target.name} has exited a safe zone and is now marked as En Route. Location: ${target.latitude}, ${target.longitude}.`
        );
      } else {
        triggerBrowserNotification(
          `✅ Safe Zone Entry: ${target.name}`,
          `${target.name} has safely arrived at: ${newStatus === 'In School' ? 'School' : 'Home'}.`
        );
      }

      // Publish updates to WebSocket server to sync across all connected portal nodes
      wsService.publish('learners', { ...target, status: newStatus });
      wsService.publish('alerts', newAlert);
    }
  };

  // Add Incident Ticket from Panic trigger
  const handleNewIncidentLogged = (newIncident: IncidentTicket) => {
    setIncidents(prev => [newIncident, ...prev]);
    wsService.publish('incidents', newIncident);
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: 'Reported' | 'Dispatched' | 'On Scene' | 'Resolved') => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updated = { ...inc, status: newStatus };
        wsService.publish('incidents', updated);
        return updated;
      }
      return inc;
    }));
  };

  const handleResolveIncident = (id: string, resolutionNote: string) => {
    let updatedIncident: IncidentTicket | null = null;
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        updatedIncident = {
          ...inc,
          status: 'Resolved',
          evidenceNotes: [...inc.evidenceNotes, `Resolution logged: ${resolutionNote}`],
          timeline: [...inc.timeline, { time: new Date().toLocaleTimeString('en-ZA'), description: `Case resolved: ${resolutionNote}` }]
        };
        return updatedIncident;
      }
      return inc;
    }));

    if (updatedIncident) {
      wsService.publish('incidents', updatedIncident);
    }

    // Find if any learner matches this case name to reset status
    const targetCase = incidents.find(inc => inc.id === id);
    if (targetCase) {
      const targetLearner = learners.find(l => l.name === targetCase.learnerName);
      if (targetLearner) {
        const updatedLearner = { ...targetLearner, status: 'In School' as const };
        setLearners(prev => prev.map(l => l.id === targetLearner.id ? updatedLearner : l));
        wsService.publish('learners', updatedLearner);
      }
    }
  };

  const handleAddAlert = (newAlert: SafetyAlert) => {
    setAlerts(prev => [newAlert, ...prev]);

    // Send push notification for any added alert
    const title = newAlert.severity === 'critical' ? `🚨 CRITICAL: ${newAlert.type}` : `⚠️ ALERT: ${newAlert.type}`;
    triggerBrowserNotification(title, newAlert.message);

    wsService.publish('alerts', newAlert);
  };

  // Render Emergency Bypass first (for first responders who scan child QR code)
  if (emergencyBypassLearner) {
    return (
      <EmergencyBypassProfile 
        learner={emergencyBypassLearner} 
        onClose={() => setEmergencyBypassLearner(null)}
        onUpdateStatus={handleUpdateLearnerStatus}
      />
    );
  }

  // Render Login state first
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Full Screen Panic SOS Overlays if active
  if (activePanicChild) {
    return (
      <PanicConsole 
        learner={activePanicChild} 
        onCancel={() => {
          // Reset child state to In School when cancelling panic
          setLearners(prev => prev.map(l => l.id === activePanicChild.id ? { ...l, status: 'In School' } : l));
          setActivePanicChild(null);
        }} 
        onLoggedIncident={handleNewIncidentLogged}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark" id="itis-app-root">
      
      {/* Premium Header */}
      <header className="bg-brand-navy-heavy border-b border-brand-gold/25 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shrink-0 z-20">
        <div className="flex items-center gap-3">
          {/* Real Generated ITIS Badge Image Logo */}
          <img 
            src={itisLogo} 
            alt="ITIS Badge Logo" 
            className="w-12 h-12 object-cover border-2 border-brand-gold rounded-full shadow-lg glow-gold"
          />
          <div>
            <h1 className="text-md font-bold tracking-wider text-white flex items-center gap-2 flex-wrap">
              ITIS GUARDIAN
              <span className="text-[9px] bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30 font-mono uppercase">SA National Public Safety</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded border font-mono uppercase flex items-center gap-1 ${
                wsStatus === 'connected' 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' 
                  : wsStatus === 'connecting'
                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/30 animate-pulse'
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              }`} title="Live telemetry connection status">
                <span className={`w-1 h-1 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-400' : wsStatus === 'connecting' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                {wsStatus}
              </span>
            </h1>
            <p className="text-[10px] text-brand-gold font-mono tracking-widest uppercase">
              Integrated Technology Intelligence & Safety
            </p>
          </div>
        </div>

        {/* Portal Switching Bar for Evaluators */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider hidden md:inline">Simulation Node:</span>
          <div className="flex bg-brand-dark rounded-xl p-1 border border-brand-gold/15" id="header-portal-switcher">
            {(['Parent', 'School', 'Command'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${userRole === role ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:text-white'}`}
              >
                {role === 'Parent' ? '🛡️ Guardian' : role === 'School' ? '🏫 School' : '🛰️ CC Centre'}
              </button>
            ))}
          </div>

          {/* Quick Dial 10111 South Africa emergency button */}
          <a
            href="tel:10111"
            onClick={() => {
              const dialAlert: SafetyAlert = {
                id: `quick-dial-${Date.now()}`,
                type: 'SOS Activated',
                severity: 'critical',
                message: `📞 EMERGENCY QUICK DIAL: Immediate 10111 call triggered to SAPS Dispatch Command. Preserving live telemetry of current incidents.`,
                time: new Date().toISOString(),
                resolved: false
              };
              setAlerts(prev => [dialAlert, ...prev]);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white font-mono text-xs font-bold uppercase rounded-lg border border-red-500 hover:border-red-400 shadow-lg cursor-pointer transition-all animate-pulse hover:animate-none duration-1000 glow-red"
            title="Quick Dial SAPS / Emergency Services (10111)"
            id="emergency-quick-dial-btn"
          >
            <Phone className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Quick Dial:</span>
            <span>10111</span>
          </a>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="p-2 bg-brand-navy border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Persistent Executive Breadcrumb Bar */}
      <div className="bg-brand-dark/95 border-b border-brand-gold/15 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 z-10">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
          >
            Landing
          </button>
          <span className="text-brand-gold/60">/</span>
          <span className="text-slate-300">Portal</span>
          <span className="text-brand-gold/60">/</span>
          <span className="text-brand-gold font-bold">
            {userRole === 'Parent' ? 'Guardian Workspace' : userRole === 'School' ? 'School Campus Command' : 'National Operations Command'}
          </span>
          <span className="text-brand-gold/60">/</span>
          <span className="text-slate-200">
            {userRole === 'Parent' ? 'Learner Telemetry & Geofences' : userRole === 'School' ? 'Campus Roll Call & Drill Dispatch' : 'SAPS Incident Queue & Pursuit'}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-500">
          <span>CLASSIFICATION: OFFICIAL / PUBLIC SAFETY</span>
          <span className="text-emerald-400">STATE: ENCRYPTED (AES-256)</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {userRole === 'Parent' && (
          <GuardianDashboard 
            learners={learners}
            safeZones={safeZones}
            alerts={alerts}
            onTriggerSOS={triggerSOS}
            onAddSafeZone={handleAddSafeZone}
            onDeleteSafeZone={handleDeleteSafeZone}
            onUpdateLearnerStatus={handleUpdateLearnerStatus}
            onAddAlert={handleAddAlert}
            onAddIncident={handleNewIncidentLogged}
          />
        )}

        {userRole === 'School' && (
          <SchoolPortal 
            learners={learners}
            alerts={alerts}
            onTriggerSOS={triggerSOS}
            onUpdateLearnerStatus={handleUpdateLearnerStatus}
            onAddAlert={handleAddAlert}
          />
        )}

        {userRole === 'Command' && (
          <CommandCentre 
            learners={learners}
            safeZones={safeZones}
            alerts={alerts}
            onTriggerSOS={triggerSOS}
            incidents={incidents}
            onResolveIncident={handleResolveIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        )}
      </div>

      {/* Floating AI Intelligence Button */}
      <div className="fixed right-6 bottom-6 z-40" id="ai-chat-launcher">
        <button
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className="w-14 h-14 bg-gradient-to-br from-brand-gold-dark to-brand-gold text-brand-dark hover:from-brand-gold hover:to-brand-gold-dark rounded-full shadow-2xl flex items-center justify-center cursor-pointer transform active:scale-90 transition-all glow-gold border border-brand-gold"
          title="ITIS AI Intelligence core"
        >
          <Cpu className="w-6 h-6 text-brand-dark animate-pulse" />
        </button>
      </div>

      {/* AIChat Sidebar Container */}
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Footer system ribbon */}
      <footer className="bg-brand-navy-heavy border-t border-brand-gold/15 py-1.5 px-6 text-center text-[9px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between shrink-0">
        <span>© 2026 Integrated Technology Intelligence & Safety (ITIS) · South Africa</span>
        <span className="text-brand-gold">POPIA ENCRYPTION PROTOCOL ACTIVE · MIL-STD-810G COMPLIANT</span>
      </footer>

    </div>
  );
}
