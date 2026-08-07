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
import { TechnicianPortal } from './components/TechnicianPortal';
import { GovernmentPortal } from './components/GovernmentPortal';
import { ExecutivePortal } from './components/ExecutivePortal';
import { AdminPortal } from './components/AdminPortal';
import { UserSessionPanel } from './components/UserSessionPanel';
import { AccessDeniedView } from './components/AccessDeniedView';
import { AIChat } from './components/AIChat';
import { PanicConsole } from './components/PanicConsole';
import { EmergencyBypassProfile } from './components/EmergencyBypassProfile';
import { AccountSecurityModal } from './components/AccountSecurityModal';
import itisLogo from './assets/images/itis_logo_1783562386226.jpg';

import { 
  Learner, SafeZone, SafetyAlert, IncidentTicket,
  initialLearners, initialSafeZones, initialAlerts, initialIncidents 
} from './types';
import { wsService } from './services/websocket';
import { authService, UserSession, UserRole } from './services/authService';

export default function App() {
  const [activeSession, setActiveSession] = useState<UserSession | null>(authService.getSession());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!authService.getSession());
  const [userRole, setUserRole] = useState<UserRole>(activeSession ? activeSession.role : 'Parent');
  
  // State variables synchronized across views
  const [learners, setLearners] = useState<Learner[]>(initialLearners);
  const [safeZones, setSafeZones] = useState<SafeZone[]>(initialSafeZones);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(initialAlerts);
  const [incidents, setIncidents] = useState<IncidentTicket[]>(initialIncidents);

  // WebSocket status state
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Active full-screen Panic Console child
  const [activePanicChild, setActivePanicChild] = useState<Learner | null>(null);

  // Emergency SOS Bypass profile state
  const [isEmergencyBypassActive, setIsEmergencyBypassActive] = useState<boolean>(false);

  // Floating AI Chat open state
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

  // Identity & Security Modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Connect and subscribe to WebSocket topics on load
  useEffect(() => {
    wsService.connect();

    const unsubscribeStatus = wsService.onStatusChange((status) => {
      setWsStatus(status);
    });

    const unsubscribeTelemetry = wsService.subscribe('telemetry/learners', (data) => {
      if (Array.isArray(data)) {
        setLearners(data);
      }
    });

    const unsubscribeAlerts = wsService.subscribe('telemetry/alerts', (data) => {
      if (Array.isArray(data)) {
        setAlerts(data);
      }
    });

    const unsubscribeIncidents = wsService.subscribe('telemetry/incidents', (data) => {
      if (Array.isArray(data)) {
        setIncidents(data);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTelemetry();
      unsubscribeAlerts();
      unsubscribeIncidents();
    };
  }, []);

  // Synchronize state changes to WebSocket pub/sub engine
  useEffect(() => {
    wsService.publish('telemetry/learners', learners);
  }, [learners]);

  useEffect(() => {
    wsService.publish('telemetry/alerts', alerts);
  }, [alerts]);

  useEffect(() => {
    wsService.publish('telemetry/incidents', incidents);
  }, [incidents]);

  const handleLoginSuccess = (role: UserRole | 'EmergencyBypass') => {
    if (role === 'EmergencyBypass') {
      setIsEmergencyBypassActive(true);
      setIsLoggedIn(true);
      return;
    }

    const sess = authService.getSession();
    setActiveSession(sess);
    setUserRole(sess ? sess.role : role);
    setIsLoggedIn(true);
    setIsEmergencyBypassActive(false);
  };

  const handleLogout = () => {
    authService.logout();
    setActiveSession(null);
    setIsLoggedIn(false);
    setIsEmergencyBypassActive(false);
  };

  // Trigger Panic SOS
  const triggerSOS = (child: Learner) => {
    if (!child) return;

    setLearners(prev => prev.map(l => {
      if (l.id === child.id) {
        return {
          ...l,
          status: 'Emergency',
          deviceBattery: Math.max(10, l.deviceBattery - 2)
        };
      }
      return l;
    }));

    const newAlert: SafetyAlert = {
      id: `alert-sos-${Date.now()}`,
      type: 'SOS Activated',
      severity: 'critical',
      message: `CRITICAL PANIC TRIGGERED: Emergency SOS signal emitted by ${child.name} near ${child.school}. Tactical dispatch engaged.`,
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      resolved: false
    };

    setAlerts(prev => [newAlert, ...prev]);

    const newTicket: IncidentTicket = {
      id: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      location: 'Near Campus Perimeter',
      latitude: child.latitude,
      longitude: child.longitude,
      learnerName: child.name,
      schoolName: child.school,
      guardianName: child.assignedGuardian,
      assignedOfficer: 'SAPS Gauteng Flying Squad (Unit 4B)',
      status: 'Reported',
      evidenceNotes: ['Active wearable distress button held down for 3 seconds. Multi-agency alert dispatched.'],
      timeline: [{ time: new Date().toLocaleTimeString('en-ZA'), description: 'Wearable SOS Signal Transmitted via Vodacom Private Safety APN' }],
      category: 'Panic Button Emergency'
    };

    setIncidents(prev => [newTicket, ...prev]);
    setActivePanicChild(child);
  };

  const handleAddSafeZone = (zone: SafeZone) => {
    setSafeZones(prev => [zone, ...prev]);
  };

  const handleDeleteSafeZone = (zoneId: string) => {
    setSafeZones(prev => prev.filter(z => z.id !== zoneId));
  };

  const handleUpdateLearnerStatus = (learnerId: string, newStatus: Learner['status']) => {
    setLearners(prev => prev.map(l => l.id === learnerId ? { ...l, status: newStatus } : l));
  };

  const handleAddAlert = (alertItem: SafetyAlert) => {
    setAlerts(prev => [alertItem, ...prev]);
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, status: 'Resolved' } : inc));
  };

  const handleUpdateIncidentStatus = (incidentId: string, status: IncidentTicket['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, status } : inc));
  };

  const handleNewIncidentLogged = (newIncident: IncidentTicket) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleUpdateIncident = (updatedIncident: IncidentTicket) => {
    setIncidents(prev => prev.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc));
  };

  const handleAddLearner = (newLearner: Learner) => {
    setLearners(prev => [newLearner, ...prev]);
  };

  // Render Emergency SOS Bypass Profile view
  if (isLoggedIn && isEmergencyBypassActive) {
    return (
      <EmergencyBypassProfile 
        learner={learners[0]}
        onClose={handleLogout}
        onUpdateStatus={handleUpdateLearnerStatus}
      />
    );
  }

  // Render Login state if not logged in
  if (!isLoggedIn || !activeSession) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Render Full Screen Panic SOS Overlays if active
  if (activePanicChild) {
    return (
      <PanicConsole 
        learner={activePanicChild} 
        onCancel={() => {
          setLearners(prev => prev.map(l => l.id === activePanicChild.id ? { ...l, status: 'In School' } : l));
          setActivePanicChild(null);
        }} 
        onLoggedIncident={handleNewIncidentLogged}
      />
    );
  }

  // Session Isolation Check (MASTER PROMPT E11)
  const isAuthorizedRole = activeSession && activeSession.role === userRole;

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark" id="itis-app-root">
      
      {/* Premium Enterprise Header */}
      <header className="bg-brand-navy-heavy border-b border-brand-gold/25 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shrink-0 z-20">
        <div className="flex items-center gap-3.5">
          {/* Real Generated ITIS Badge Image Logo */}
          <img 
            src={itisLogo} 
            alt="ITIS Badge Logo" 
            className="w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-brand-gold rounded-full shadow-2xl glow-gold shrink-0"
          />
          <div>
            <h1 className="text-md font-bold tracking-wider text-white flex items-center gap-2 flex-wrap font-mono">
              ITIS GUARDIAN NETWORK
              <span className="text-[9px] bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30 uppercase">
                Enterprise RBAC Session
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                wsStatus === 'connected' 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
              }`} title="Live telemetry connection status">
                <span className={`w-1 h-1 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                {wsStatus}
              </span>
            </h1>
            <p className="text-[10px] text-brand-gold font-mono tracking-widest uppercase">
              Integrated Technology Intelligence & Safety · Protecting Every Learner. Every Journey. Every Second.
            </p>
          </div>
        </div>

        {/* Authenticated User Panel in Header - NO INSTANT SWITCHER! */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSession && (
            <UserSessionPanel session={activeSession} onLogout={handleLogout} />
          )}

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="p-2 bg-brand-navy border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Account Security & Identity Hub"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">Security</span>
          </button>

          {/* Quick Dial 10111 South Africa emergency button */}
          <a
            href="tel:10111"
            onClick={() => {
              const dialAlert: SafetyAlert = {
                id: `quick-dial-${Date.now()}`,
                type: 'SOS Activated',
                severity: 'critical',
                message: `📞 EMERGENCY QUICK DIAL: Immediate 10111 call triggered to SAPS Dispatch Command. Preserving live telemetry of current incidents.`,
                time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
                resolved: false
              };
              setAlerts(prev => [dialAlert, ...prev]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white font-mono text-xs font-bold uppercase rounded-xl border border-red-500 hover:border-red-400 shadow-lg cursor-pointer transition-all glow-red"
            title="Quick Dial SAPS / Emergency Services (10111)"
            id="emergency-quick-dial-btn"
          >
            <Phone className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">10111</span>
          </a>
        </div>
      </header>

      {/* Persistent Executive Breadcrumb Bar */}
      <div className="bg-brand-dark/95 border-b border-brand-gold/15 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0 z-10">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <button 
            onClick={handleLogout}
            className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
          >
            Sign Out
          </button>
          <span className="text-brand-gold/60">/</span>
          <span className="text-slate-300">Isolated Portal</span>
          <span className="text-brand-gold/60">/</span>
          <span className="text-brand-gold font-bold">
            {userRole} Workspace
          </span>
          <span className="text-brand-gold/60">/</span>
          <span className="text-slate-200">
            Tenant: {activeSession.tenantId}
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono">
          <span className="text-slate-400">SESSION: {activeSession.sessionId}</span>
          <span className="text-emerald-400 font-bold">ISO 27001 & POPIA ENFORCED</span>
        </div>
      </div>

      {/* Main Body with Route Isolation Guard */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!isAuthorizedRole ? (
          <AccessDeniedView 
            session={activeSession}
            attemptedPortal={userRole}
            onReturnToAllowed={() => setUserRole(activeSession.role)}
            onLogoutAndSwitch={handleLogout}
          />
        ) : (
          <>
            {userRole === 'Parent' && (
              <GuardianDashboard 
                learners={learners}
                safeZones={safeZones}
                alerts={alerts}
                incidents={incidents}
                onTriggerSOS={triggerSOS}
                onAddSafeZone={handleAddSafeZone}
                onDeleteSafeZone={handleDeleteSafeZone}
                onUpdateLearnerStatus={handleUpdateLearnerStatus}
                onAddAlert={handleAddAlert}
                onAddIncident={handleNewIncidentLogged}
                onUpdateIncident={handleUpdateIncident}
              />
            )}

            {userRole === 'School' && (
              <SchoolPortal 
                learners={learners}
                alerts={alerts}
                incidents={incidents}
                onTriggerSOS={triggerSOS}
                onUpdateLearnerStatus={handleUpdateLearnerStatus}
                onAddAlert={handleAddAlert}
                onUpdateIncident={handleUpdateIncident}
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
                onUpdateIncident={handleUpdateIncident}
              />
            )}

            {userRole === 'Technician' && (
              <TechnicianPortal learners={learners} />
            )}

            {userRole === 'Government' && (
              <GovernmentPortal 
                incidents={incidents}
                learners={learners}
                onUpdateIncident={handleUpdateIncident}
              />
            )}

            {userRole === 'Executive' && (
              <ExecutivePortal 
                incidents={incidents}
              />
            )}

            {userRole === 'Admin' && (
              <AdminPortal 
                learners={learners}
                onAddLearner={handleAddLearner}
                onUpdateLearnerStatus={handleUpdateLearnerStatus}
              />
            )}
          </>
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

      {/* Account Security Self-Service Hub Modal */}
      <AccountSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUserEmail={activeSession?.email}
        currentUserName={activeSession?.name}
      />

      {/* Footer system ribbon */}
      <footer className="bg-brand-navy-heavy border-t border-brand-gold/15 py-1.5 px-6 text-center text-[9px] text-slate-500 font-mono flex flex-col sm:flex-row justify-between shrink-0">
        <span>© 2026 ITIS Guardian Network · Integrated Technology Intelligence & Safety (ITIS) · South Africa</span>
        <span className="text-brand-gold">POPIA ENCRYPTION PROTOCOL ACTIVE · ZERO TRUST SESSION ISOLATION</span>
      </footer>

    </div>
  );
}
