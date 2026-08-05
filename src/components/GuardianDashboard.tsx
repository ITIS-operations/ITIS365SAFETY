import React, { useState } from 'react';
import { 
  Home, Map, Bell, Shield, ShieldAlert, Award, User, Settings, CreditCard, Activity,
  MapPin, Plus, Trash2, Battery, Signal, Zap, AlertTriangle, Bus, ChevronRight, CheckCircle2,
  Download, Calendar, Sliders, Volume2, HelpCircle, Phone, Heart, Info, Eye, Languages, Sparkles,
  Users, MessageSquare, FileText, CheckSquare, RefreshCw, Send, FileCheck, Clock, School
} from 'lucide-react';
import { Learner, SafeZone, SafetyAlert, SubscriptionPlan, BusTransport, IncidentTicket, mockBuses, mockSubscriptionPlans } from '../types';
import { InteractiveRouteMap } from './InteractiveRouteMap';
import { PremiumFeatures } from './PremiumFeatures';
import { GuardianLocationMap } from './GuardianLocationMap';
import { GuardianIncidentView } from './GuardianIncidentView';

interface GuardianDashboardProps {
  learners: Learner[];
  safeZones: SafeZone[];
  alerts: SafetyAlert[];
  incidents?: IncidentTicket[];
  onTriggerSOS: (learner: Learner) => void;
  onAddSafeZone: (zone: SafeZone) => void;
  onDeleteSafeZone: (id: string) => void;
  onUpdateLearnerStatus: (id: string, newStatus: 'In School' | 'En Route' | 'At Home' | 'Emergency') => void;
  onAddAlert: (alert: SafetyAlert) => void;
  onAddIncident: (incident: IncidentTicket) => void;
  onUpdateIncident?: (incident: IncidentTicket) => void;
}

export function GuardianDashboard({
  learners,
  safeZones,
  alerts,
  incidents = [],
  onTriggerSOS,
  onAddSafeZone,
  onDeleteSafeZone,
  onUpdateLearnerStatus,
  onAddAlert,
  onAddIncident,
  onUpdateIncident
}: GuardianDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'mychildren' | 'map' | 'sos' | 'alerts' | 'history' | 'devices' | 'messages' | 'subscription' | 'premium' | 'documents' | 'support' | 'profile' | 'settings'>('home');
  const [language, setLanguage] = useState<'en' | 'zu' | 'xh' | 'af' | 'so'>('en');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(learners[0]?.id || '');
  
  // Custom mock data for parent messages, profile, documents, etc.
  const [parentMessages, setParentMessages] = useState([
    { id: 'm1', from: 'ITIS National Command', subject: 'Wearable Fallback Roaming Activated', body: 'The Wearable device SIM has been upgraded with fallback Roaming priority on MTN, Vodacom, and Telkom networks to maximize signal reliability across remote coordinates.', time: '10:14 AM', read: false },
    { id: 'm2', from: 'Gauteng High School', subject: 'Weather Warning Dispatch Delay', body: 'Due to severe heavy rain warnings in Gauteng, school transport buses will depart 15 minutes earlier to ensure safe, daylight handovers.', time: 'Yesterday', read: true },
    { id: 'm3', from: 'Transport Operator (Enoch)', subject: 'Bus onboard checks completed', body: 'Confirmed all learners are safely accounted for. Real-time geofence link is active.', time: 'Yesterday', read: true }
  ]);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [supportCategory, setSupportCategory] = useState('Hardware');
  const [supportDesc, setSupportDesc] = useState('');
  const [supportUrgent, setSupportUrgent] = useState(false);
  const [supportTicketSuccess, setSupportTicketSuccess] = useState(false);

  const [profileName, setProfileName] = useState('Thabo Ndlovu');
  const [profilePhone, setProfilePhone] = useState('+27 82 123 4567');
  const [profileAddress, setProfileAddress] = useState('14 West Street, Sandown, Sandton, 2196');
  const [profileAltPhone, setProfileAltPhone] = useState('+27 71 987 6543');
  const [isMfaActive, setIsMfaActive] = useState(true);
  const [isPopiaConsent, setIsPopiaConsent] = useState(true);
  const [isSmsNotify, setIsSmsNotify] = useState(true);
  const [simRefreshRate, setSimRefreshRate] = useState('30s');
  const [alertSettings, setAlertSettings] = useState({
    sos: true,
    geofence: true,
    battery: true,
    speed: true
  });

  // Guardian Incident View State
  const [guardianNoteInput, setGuardianNoteInput] = useState('');
  const [guardianNoteSuccess, setGuardianNoteSuccess] = useState(false);
  const [editingMedical, setEditingMedical] = useState(false);
  const [medicalConditionsText, setMedicalConditionsText] = useState('Emergency inhaler situated in front backpack pocket. Mild peanut allergy. Chronic asthma.');
  const [identityConfirmed, setIdentityConfirmed] = useState(false);

  // Safe zone form fields
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState<'home' | 'school' | 'grandparents' | 'sports_field' | 'church' | 'library' | 'mall'>('home');
  const [newZoneRadius, setNewZoneRadius] = useState(200);
  const [newZoneArrival, setNewZoneArrival] = useState(true);
  const [newZoneDeparture, setNewZoneDeparture] = useState(true);
  const [newZoneCurfew, setNewZoneCurfew] = useState('');

  // Selected subscription plan index
  const [selectedPlanId, setSelectedPlanId] = useState<string>('sub-premium');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  // Find currently active learner in view
  const currentLearner = learners.find(l => l.id === selectedLearnerId) || learners[0];

  // Plain language incident stages for Guardian Incident View
  const incidentStagesList = [
    { id: 1, label: 'SOS Received', desc: 'We have received your child\'s emergency alert.' },
    { id: 2, label: 'Verifying Location', desc: 'Our Operations Centre is verifying the situation.' },
    { id: 3, label: 'Guardian Contacted', desc: 'Guardian contact confirmed.' },
    { id: 4, label: 'Emergency Services Notified', desc: 'Emergency responders have been notified.' },
    { id: 5, label: 'Responder En Route', desc: 'A responder is travelling to your child\'s location.' },
    { id: 6, label: 'Responder On Scene', desc: 'Emergency responders have arrived on scene.' },
    { id: 7, label: 'Child Located', desc: 'Your child has been safely located.' },
    { id: 8, label: 'Incident Resolved', desc: 'The situation is fully resolved.' }
  ];

  const currentStageId = currentLearner.status === 'Emergency' ? 4 : 8;

  const handleCreateSafeZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;

    // Simulate coordinates near Johannesburg
    const offsetLat = (Math.random() - 0.5) * 0.05;
    const offsetLng = (Math.random() - 0.5) * 0.05;

    const newZone: SafeZone = {
      id: `sz-${Date.now()}`,
      name: newZoneName,
      type: newZoneType,
      latitude: -26.15 + offsetLat,
      longitude: 28.03 + offsetLng,
      radius: newZoneRadius,
      notifyOnArrival: newZoneArrival,
      notifyOnDeparture: newZoneDeparture,
      curfewRule: newZoneCurfew || undefined
    };

    onAddSafeZone(newZone);
    setNewZoneName('');
    setNewZoneCurfew('');
  };

  const handleSendGuardianNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianNoteInput.trim()) return;

    onAddAlert({
      id: `gn-${Date.now()}`,
      type: 'SOS Activated',
      message: `Guardian Note from ${profileName}: ${guardianNoteInput}`,
      time: new Date().toISOString(),
      severity: 'low',
      learnerId: currentLearner.id,
      learnerName: currentLearner.name,
      resolved: false
    });

    setGuardianNoteSuccess(true);
    setGuardianNoteInput('');
    setTimeout(() => setGuardianNoteSuccess(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-brand-dark min-h-screen" id="guardian-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-navy border-r border-brand-gold/15 flex flex-col justify-between" id="guardian-sidebar">
        <div>
          {/* Dashboard Profile Swapper */}
          <div className="p-4 border-b border-brand-gold/10">
            <label className="block text-[10px] uppercase tracking-wider text-brand-gold font-mono mb-2">Registered Children</label>
            <div className="space-y-2">
              {learners.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLearnerId(l.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${selectedLearnerId === l.id ? 'bg-brand-navy-light/80 border-brand-gold' : 'bg-brand-dark/40 border-slate-800/80 hover:border-slate-700'}`}
                >
                  <img src={l.photoUrl} alt={l.name} className="w-9 h-9 rounded-full object-cover border border-brand-gold/30" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{l.name}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${l.status === 'In School' ? 'bg-green-950 text-green-300 border border-green-500/20' : l.status === 'Emergency' ? 'bg-red-950 text-red-300 border border-red-500/30 font-bold animate-pulse' : 'bg-brand-gold/15 text-brand-gold border border-brand-gold/20'}`}>
                      {l.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-240px)] custom-sidebar-scroll">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'home' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Home className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('mychildren')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'mychildren' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Users className="w-3.5 h-3.5" /> My Children
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'map' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Map className="w-3.5 h-3.5" /> Child Location Map
            </button>
            <button
              onClick={() => setActiveTab('sos')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'sos' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> SOS & Emergency
              {currentLearner.status === 'Emergency' && (
                <span className="ml-auto bg-red-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  ACTIVE
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'alerts' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Bell className="w-3.5 h-3.5" /> Notifications
              {alerts.filter(a => !a.resolved).length > 0 && (
                <span className="ml-auto bg-red-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {alerts.filter(a => !a.resolved).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'history' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Calendar className="w-3.5 h-3.5" /> Journey History
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'devices' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Activity className="w-3.5 h-3.5" /> Device Status
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Messages
              {parentMessages.filter(m => !m.read).length > 0 && (
                <span className="ml-auto bg-brand-gold text-brand-dark text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold">
                  {parentMessages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all border border-brand-gold/15 cursor-pointer ${activeTab === 'premium' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-brand-gold bg-brand-navy-light/10 hover:bg-brand-navy-light'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Membership Card
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'documents' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Documents
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'support' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Support
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <User className="w-3.5 h-3.5" /> Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-slate-300 hover:bg-brand-navy-light'}`}
            >
              <Settings className="w-3.5 h-3.5" /> Settings
            </button>
          </nav>
        </div>

        {/* Global Emergency SOS Quick-Button */}
        <div className="p-4 border-t border-brand-gold/10 bg-brand-dark/20 text-center space-y-3">
          <p className="text-[10px] text-slate-400 font-mono uppercase">EMERGENCY ASSISTANCE</p>
          <button
            onClick={() => {
              onTriggerSOS(currentLearner);
              onUpdateLearnerStatus(currentLearner.id, 'Emergency');
              setActiveTab('sos');
            }}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all animate-pulse"
          >
            🚨 TRIGGER EMERGENCY SOS ALERT
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6" id="guardian-main-content">
        
        {/* Banner/Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
          <div>
            <h2 className="text-xl font-bold font-sans tracking-wide text-white">
              Good Morning, Guardian
            </h2>
            <p className="text-xs text-brand-silver">
              Guardian Portal Active · Verified Security for <strong className="text-brand-gold">{currentLearner.name}</strong>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Multilingual Selector */}
            <div className="flex items-center gap-1.5 bg-brand-navy border border-brand-gold/15 px-3 py-2 rounded-xl text-xs font-mono text-brand-silver">
              <Languages className="w-3.5 h-3.5 text-brand-gold" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-white border-none text-[11px] font-mono focus:outline-none cursor-pointer"
                title="Select South African National Language"
              >
                <option value="en" className="bg-brand-navy text-white font-mono text-xs">English</option>
                <option value="zu" className="bg-brand-navy text-white font-mono text-xs">IsiZulu</option>
                <option value="xh" className="bg-brand-navy text-white font-mono text-xs">IsiXhosa</option>
                <option value="af" className="bg-brand-navy text-white font-mono text-xs">Afrikaans</option>
                <option value="so" className="bg-brand-navy text-white font-mono text-xs">Sesotho</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-brand-navy border border-brand-gold/10 px-4 py-2.5 rounded-xl text-xs font-mono">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>Operations Centre: <strong className="text-brand-gold">CONNECTED</strong></span>
            </div>
          </div>
        </div>

        {/* ==================================== TAB 1: HOME ==================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6" id="guardian-home-tab">
            {/* Synchronized Guardian Incident View for active incidents */}
            {(() => {
              const activeInc = incidents.find(inc => inc.learnerName === currentLearner.name) || incidents[0];
              if (activeInc && (currentLearner.status === 'Emergency' || activeInc.status !== 'Resolved')) {
                return (
                  <GuardianIncidentView 
                    incident={activeInc}
                    learner={currentLearner}
                    onUpdateIncident={onUpdateIncident}
                  />
                );
              }
              return null;
            })()}

            {/* Child Status Spotlight Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Telemetry Status Summary Card */}
              <div className="md:col-span-2 glass-panel p-5 rounded-2xl relative overflow-hidden border-t-2 border-brand-gold flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold">Child Safety Spotlight</span>
                    <span className="text-[9px] bg-brand-navy px-2 py-0.5 rounded border border-brand-gold/15 text-brand-silver font-mono">ID: {currentLearner.trackerSerial}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img src={currentLearner.photoUrl} alt={currentLearner.name} className="w-16 h-16 rounded-full border-2 border-brand-gold object-cover" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{currentLearner.name}</h3>
                      <p className="text-xs text-slate-300">{currentLearner.school} · {currentLearner.grade}</p>
                      
                      {/* Interactive Status Display */}
                      <div className="flex gap-1.5 mt-2">
                        {(['In School', 'En Route', 'At Home'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateLearnerStatus(currentLearner.id, st)}
                            className={`text-[9px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${currentLearner.status === st ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-brand-navy hover:bg-brand-navy-light text-slate-300 border border-slate-800'}`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onTriggerSOS(currentLearner);
                          onUpdateLearnerStatus(currentLearner.id, 'Emergency');
                          setActiveTab('sos');
                        }}
                        className="mt-3 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-[11px] uppercase rounded-lg shadow flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-white" />
                        <span>Request Emergency SOS Support</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-brand-navy-light pt-4 mt-5">
                  <div className="text-center p-2.5 bg-brand-navy/60 rounded-xl border border-brand-gold/5">
                    <div className="flex justify-center mb-1"><Battery className="w-4 h-4 text-brand-gold" /></div>
                    <span className="block text-[10px] text-slate-400">Battery</span>
                    <strong className="text-xs text-slate-200 font-mono">{currentLearner.deviceBattery}%</strong>
                  </div>
                  <div className="text-center p-2.5 bg-brand-navy/60 rounded-xl border border-brand-gold/5">
                    <div className="flex justify-center mb-1"><Signal className="w-4 h-4 text-brand-gold" /></div>
                    <span className="block text-[10px] text-slate-400">Signal</span>
                    <strong className="text-xs text-slate-200 font-mono">{currentLearner.deviceSignal}</strong>
                  </div>
                  <div className="text-center p-2.5 bg-brand-navy/60 rounded-xl border border-brand-gold/5">
                    <div className="flex justify-center mb-1"><Award className="w-4 h-4 text-brand-gold" /></div>
                    <span className="block text-[10px] text-slate-400">Safety Score</span>
                    <strong className="text-xs text-slate-200 font-mono">{currentLearner.safetyScore}/100</strong>
                  </div>
                </div>
              </div>

              {/* Today's Route & Map Preview Card */}
              <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Safe Zone Boundary Status
                  </h4>
                  <div className="relative bg-brand-dark h-32 rounded-xl overflow-hidden border border-brand-gold/10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400')` }} />
                    <div className="absolute w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center animate-pulse">
                      <MapPin className="w-5 h-5 text-brand-gold" />
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-brand-navy-light mt-3">
                  <div className="flex items-center justify-between text-xs text-brand-silver">
                    <span>Coordinates</span>
                    <span className="font-mono">{currentLearner.latitude.toFixed(4)}, {currentLearner.longitude.toFixed(4)}</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab('map')}
                    className="w-full mt-2 py-2 bg-brand-navy-light text-brand-gold border border-brand-gold/20 hover:bg-brand-navy text-xs font-mono uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    View Full Location Map <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* School Announcements, Buses & Transport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Transport Tracker Console */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Bus className="w-4 h-4 text-brand-gold" /> Associated School Bus Transport (Route 12C)
                </h4>
                
                {mockBuses.map((bus) => (
                  <div key={bus.id} className="p-3.5 bg-brand-navy-light/40 border border-brand-gold/10 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-mono">{bus.routeNumber}</strong>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${bus.status === 'On Schedule' ? 'bg-green-950 text-green-300' : 'bg-brand-gold/10 text-brand-gold'}`}>
                        {bus.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-800/80">
                      <div>Driver: <strong className="text-white">{bus.driverName}</strong></div>
                      <div>Vehicle: <strong className="text-white font-mono">{bus.vehicleReg}</strong></div>
                      <div>Learners: <strong className="text-white">{bus.learnersOnboard} onboard</strong></div>
                      <div>ETA to Station: <strong className="text-brand-gold font-mono">{bus.eta}</strong></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert Snippets Feed */}
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-brand-gold" /> Reassurance & Security Updates
                  </h4>
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className="text-[10px] text-brand-gold hover:underline font-mono uppercase cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {alerts.slice(0, 3).map((al) => (
                    <div 
                      key={al.id} 
                      className={`p-3 rounded-lg border text-xs flex gap-2.5 ${
                        al.severity === 'critical' ? 'bg-red-950/30 border-red-500/40 text-red-200' :
                        al.severity === 'high' ? 'bg-orange-950/20 border-orange-500/30 text-orange-200' :
                        'bg-brand-navy/50 border-brand-gold/10 text-brand-silver'
                      }`}
                    >
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${al.severity === 'critical' ? 'text-red-400 animate-pulse' : 'text-brand-gold'}`} />
                      <div>
                        <p className="font-semibold leading-normal">{al.message}</p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">{new Date(al.time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================== TAB 2: CHILD LOCATION MAP ==================================== */}
        {activeTab === 'map' && (
          <div className="space-y-6" id="guardian-map-tab">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Map className="w-5 h-5 text-brand-gold" /> Child Location & Safe Zone View
                </h3>
                <p className="text-xs text-brand-silver">Verified position, school, home, and registered safe zone perimeters</p>
              </div>
            </div>

            <GuardianLocationMap 
              learner={currentLearner} 
              safeZones={safeZones} 
              showEtaMarker={currentLearner.status === 'Emergency'}
              etaMinutes={7}
              height="h-[480px]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/15 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Verified Location</span>
                <strong className="text-white block font-sans">Empire Road Junction, Empire Rd, Johannesburg</strong>
                <span className="text-[10px] text-emerald-400 font-mono">GPS Accuracy: ± 2.4 meters</span>
              </div>
              <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/15 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Assigned School</span>
                <strong className="text-white block font-sans">{currentLearner.school}</strong>
                <span className="text-[10px] text-brand-gold font-mono">Boundary Active (07:30 - 14:30)</span>
              </div>
              <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/15 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Primary Safe Zone</span>
                <strong className="text-white block font-sans">Home Safe Zone (200m Radius)</strong>
                <span className="text-[10px] text-emerald-400 font-mono">Arrival/Departure Notifications Active</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 3: GUARDIAN INCIDENT VIEW (SOS) ==================================== */}
        {activeTab === 'sos' && (
          <div className="space-y-6" id="guardian-sos-tab">
            {/* Header Banner */}
            <div className="p-5 bg-gradient-to-r from-red-950/80 via-brand-navy to-brand-navy border-2 border-red-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-white font-sans uppercase tracking-wide">
                    Child Emergency Safety View
                  </h3>
                  <span className="px-2.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-mono font-bold uppercase animate-pulse">
                    SOS Active
                  </span>
                </div>
                <p className="text-xs text-brand-silver">
                  Operations Command Centre Reference: <strong className="text-brand-gold font-mono">REF-2026-0805-4912</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <span className="text-[10px] text-slate-300 font-mono">Emergency Hotline:</span>
                <a 
                  href="tel:0624304906"
                  className="px-3.5 py-2 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 shadow hover:bg-brand-gold-dark transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Operations Centre
                </a>
              </div>
            </div>

            {/* Plain Language Incident Stage Progress */}
            <div className="glass-panel p-5 rounded-2xl space-y-4 border-t-2 border-brand-gold">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gold" /> Current Incident Progress
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/20">
                  Stage {currentStageId} of 8: {incidentStagesList.find(s => s.id === currentStageId)?.label}
                </span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-[10px]">
                {incidentStagesList.map((st) => {
                  const isPast = st.id < currentStageId;
                  const isCurrent = st.id === currentStageId;
                  return (
                    <div 
                      key={st.id} 
                      className={`p-2 rounded-lg border text-center flex flex-col justify-between transition-all ${
                        isCurrent ? 'bg-brand-gold text-brand-dark font-bold border-brand-gold shadow-md' :
                        isPast ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' :
                        'bg-brand-dark/40 text-slate-500 border-slate-800'
                      }`}
                    >
                      <span className="block text-[9px] opacity-75">Step {st.id}</span>
                      <strong className="block text-[10px] leading-tight mt-1">{st.label}</strong>
                    </div>
                  );
                })}
              </div>

              {/* Reassurance Statement Box */}
              <div className="p-4 bg-brand-navy border border-brand-gold/20 rounded-xl space-y-1">
                <span className="text-[10px] text-brand-gold font-mono uppercase font-bold block">
                  Latest Verified Update from Operations Centre:
                </span>
                <p className="text-xs text-white leading-relaxed font-sans">
                  "We have received your child's emergency alert. Our Operations Centre is verifying the situation and emergency responders have been notified."
                </p>
                <div className="pt-2 flex items-center gap-4 text-[10px] text-slate-400 font-mono border-t border-slate-800/80 mt-2">
                  <span>Time SOS Received: <strong className="text-white">14:02:15 UTC+2</strong></span>
                  <span>Estimated Responder Arrival: <strong className="text-emerald-400 font-bold">~7 minutes</strong></span>
                </div>
              </div>
            </div>

            {/* Child Spotlight & Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Child Photograph & Details Card */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                  Child Details
                </h4>

                <div className="flex items-center gap-4">
                  <img src={currentLearner.photoUrl} alt={currentLearner.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-gold shadow-lg" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">{currentLearner.name}</h4>
                    <p className="text-xs text-slate-300">{currentLearner.school}</p>
                    <span className="inline-block px-2 py-0.5 bg-red-950 text-red-300 border border-red-500/30 rounded text-[9px] font-mono font-bold uppercase">
                      Safety Status: Emergency
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-slate-300">
                    <span>Grade / Class:</span>
                    <strong className="text-white font-sans">{currentLearner.grade}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Verified Location:</span>
                    <strong className="text-brand-gold">{currentLearner.latitude.toFixed(4)}, {currentLearner.longitude.toFixed(4)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Tracker Serial:</span>
                    <strong className="text-white">{currentLearner.trackerSerial}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Wearable Battery:</span>
                    <strong className="text-emerald-400">{currentLearner.deviceBattery}%</strong>
                  </div>
                </div>

                {/* Confirm Identity Button */}
                <button
                  onClick={() => setIdentityConfirmed(true)}
                  disabled={identityConfirmed}
                  className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 ${identityConfirmed ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-brand-gold text-brand-dark hover:bg-brand-gold-dark'}`}
                >
                  <CheckSquare className="w-4 h-4" />
                  {identityConfirmed ? 'Identity Confirmed by Guardian' : 'Confirm Child Identity Details'}
                </button>
              </div>

              {/* Map Showing Child Location */}
              <div className="lg:col-span-2 space-y-4">
                <GuardianLocationMap 
                  learner={currentLearner} 
                  safeZones={safeZones} 
                  showEtaMarker={true} 
                  etaMinutes={7} 
                  height="h-[320px]" 
                />
              </div>

            </div>

            {/* Emergency Contact Buttons */}
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Direct Emergency Contacts
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <a
                  href="tel:0624304906"
                  className="p-3.5 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-brand-gold text-brand-dark rounded-lg font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Command Centre</strong>
                    <span className="text-brand-gold text-[11px]">0624304906</span>
                  </div>
                </a>

                <a
                  href="tel:0624304906"
                  className="p-3.5 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg font-bold">
                    <School className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">School Admin</strong>
                    <span className="text-blue-300 text-[11px]">0624304906</span>
                  </div>
                </a>

                <a
                  href="tel:10111"
                  className="p-3.5 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-red-600 text-white rounded-lg font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">SAPS Flying Squad</strong>
                    <span className="text-red-300 text-[11px]">10111</span>
                  </div>
                </a>

                <a
                  href="tel:10177"
                  className="p-3.5 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="p-2 bg-amber-600 text-white rounded-lg font-bold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">EMS / Ambulance</strong>
                    <span className="text-amber-300 text-[11px]">10177</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Guardian Information & Medical Field Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Guardian Additional Notes Field */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Send className="w-4 h-4 text-brand-gold" /> Send Information to Command Centre
                </h4>

                {guardianNoteSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Information transmitted securely to Command Centre coordinators.</span>
                  </div>
                )}

                <form onSubmit={handleSendGuardianNote} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                      Additional Guardian Notes / Sightings / Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={guardianNoteInput}
                      onChange={(e) => setGuardianNoteInput(e.target.value)}
                      placeholder="e.g. Sipho was wearing his navy school jacket. Grandmother is nearby in Sandton."
                      className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2 text-white text-xs leading-relaxed focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Send Additional Note to Command Centre
                  </button>
                </form>
              </div>

              {/* Medical Information */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" /> Child Medical Information
                  </h4>
                  <button
                    onClick={() => setEditingMedical(!editingMedical)}
                    className="text-[10px] font-mono text-brand-gold hover:underline cursor-pointer uppercase"
                  >
                    {editingMedical ? 'Cancel' : 'Update Medical Notes'}
                  </button>
                </div>

                {editingMedical ? (
                  <div className="space-y-3 text-xs">
                    <textarea
                      rows={3}
                      value={medicalConditionsText}
                      onChange={(e) => setMedicalConditionsText(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2 text-white font-sans text-xs"
                    />
                    <button
                      onClick={() => setEditingMedical(false)}
                      className="px-4 py-2 bg-brand-gold text-brand-dark font-mono font-bold text-xs uppercase rounded cursor-pointer"
                    >
                      Save Medical Notes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                      <div className="p-2.5 bg-brand-dark/40 border border-slate-800 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Blood Type</span>
                        <strong className="text-red-400 font-bold">{currentLearner.bloodGroup || 'O+'}</strong>
                      </div>
                      <div className="p-2.5 bg-brand-dark/40 border border-slate-800 rounded-lg">
                        <span className="text-[10px] text-slate-400 block uppercase">Allergies</span>
                        <strong className="text-amber-300">Registered</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl">
                      <span className="text-[10px] font-mono text-red-300 uppercase block mb-1">Medical Conditions / Inhaler Notes:</span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">{medicalConditionsText}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Emergency Contacts & Incident Summary Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Emergency Contacts */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 text-xs">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                  Verified Emergency Contacts
                </h4>

                <div className="space-y-2">
                  <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <strong className="text-white block font-sans">Thabo Ndlovu (Primary Guardian)</strong>
                      <span className="text-slate-400 font-mono text-[11px]">+27 82 123 4567 · Father</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono uppercase">
                      Verified
                    </span>
                  </div>

                  <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <strong className="text-white block font-sans">Lindiwe Ndlovu (Secondary Contact)</strong>
                      <span className="text-slate-400 font-mono text-[11px]">+27 71 987 6543 · Mother</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono uppercase">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident History & Download Summary */}
              <div className="glass-panel p-5 rounded-2xl space-y-3 text-xs">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                  Child Incident Records & Summaries
                </h4>

                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <strong className="text-white block font-sans">Incident REF-2026-0805-4912</strong>
                      <span className="text-slate-400 text-[10px]">Today, 14:02 · Active SOS Event</span>
                    </div>
                    <span className="text-amber-400 font-bold uppercase text-[9px]">
                      In Progress
                    </span>
                  </div>

                  <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <strong className="text-white block font-sans">Geofence Boundary Alert (Resolved)</strong>
                      <span className="text-slate-400 text-[10px]">12 Jan 2026 · Safe resolution confirmed</span>
                    </div>
                    <button
                      onClick={() => alert("Downloading Final Incident Summary PDF for REF-2026-0112-1082...")}
                      className="px-2.5 py-1 bg-brand-navy hover:bg-brand-navy-light text-brand-gold border border-brand-gold/20 rounded text-[10px] uppercase cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Summary PDF
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================== TAB 4: SAFEZONES ==================================== */}
        {activeTab === 'safezones' && (
          <div className="space-y-6" id="guardian-safezones-tab">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Form: Create Safe Zone */}
              <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
                  Add Security Safe Zone
                </h3>

                <form onSubmit={handleCreateSafeZone} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[9px]">Zone Name</label>
                    <input
                      type="text"
                      required
                      value={newZoneName}
                      onChange={(e) => setNewZoneName(e.target.value)}
                      placeholder="e.g. Grandparents House"
                      className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[9px]">Zone Category</label>
                    <select
                      value={newZoneType}
                      onChange={(e) => setNewZoneType(e.target.value as any)}
                      className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-brand-gold"
                    >
                      <option value="home">🏡 Home Zone</option>
                      <option value="school">🏫 School Zone</option>
                      <option value="grandparents">👵 Family / Grandparents</option>
                      <option value="sports_field">⚽ Sports Fields</option>
                      <option value="church">⛪ Community / Church</option>
                      <option value="library">📚 Library / Education</option>
                      <option value="mall">🛍️ Shopping Center</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 font-mono uppercase tracking-widest text-[9px]">Geofence Radius (meters)</label>
                      <span className="font-mono text-brand-gold text-[10px]">{newZoneRadius}m</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={newZoneRadius}
                      onChange={(e) => setNewZoneRadius(Number(e.target.value))}
                      className="w-full accent-brand-gold bg-slate-800 rounded-lg h-2"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[9px]">Curfew Time Constraint (Optional)</label>
                    <input
                      type="text"
                      value={newZoneCurfew}
                      onChange={(e) => setNewZoneCurfew(e.target.value)}
                      placeholder="e.g. Must stay until 14:00"
                      className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-slate-300">
                      <input 
                        type="checkbox" 
                        checked={newZoneArrival} 
                        onChange={(e) => setNewZoneArrival(e.target.checked)}
                        className="accent-brand-gold" 
                      />
                      <span>Notify on Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input 
                        type="checkbox" 
                        checked={newZoneDeparture} 
                        onChange={(e) => setNewZoneDeparture(e.target.checked)}
                        className="accent-brand-gold" 
                      />
                      <span>Notify on Departure</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-lg uppercase tracking-wider font-mono cursor-pointer transition-colors"
                  >
                    Save Geofence
                  </button>
                </form>
              </div>

              {/* Right List: Configured Safe Zones */}
              <div className="md:col-span-2 glass-panel p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand-gold" /> Configured Security Geofences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {safeZones.map((zone) => (
                    <div 
                      key={zone.id} 
                      className="p-4 bg-brand-navy-light/40 border border-brand-gold/15 rounded-xl flex flex-col justify-between text-xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white">{zone.name}</h4>
                          <span className="text-[10px] text-brand-gold uppercase font-mono font-bold">{zone.type} zone</span>
                        </div>
                        <button
                          onClick={() => onDeleteSafeZone(zone.id)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-red-950/20 transition-colors cursor-pointer"
                          title="Delete Zone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1 text-slate-300 font-mono text-[10px]">
                        <div>Radius constraint: <strong className="text-brand-silver">{zone.radius} meters</strong></div>
                        {zone.curfewRule && <div>Curfew rule: <strong className="text-brand-silver">{zone.curfewRule}</strong></div>}
                        <div className="flex gap-2 pt-1 border-t border-slate-800/80">
                          <span className={zone.notifyOnArrival ? 'text-emerald-400' : 'text-slate-500'}>✓ Arrival SMS</span>
                          <span className={zone.notifyOnDeparture ? 'text-emerald-400' : 'text-slate-500'}>✓ Departure SMS</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================== TAB 5: ALERTS ==================================== */}
        {activeTab === 'alerts' && (
          <div className="glass-panel p-5 rounded-2xl space-y-4" id="guardian-alerts-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bell className="w-5 h-5 text-brand-gold" /> Security & Telemetry Notification Feed
            </h3>

            <div className="space-y-3 max-w-2xl">
              {alerts.map((al) => (
                <div 
                  key={al.id} 
                  className={`p-4 rounded-xl border flex gap-3 text-xs ${
                    al.severity === 'critical' ? 'bg-red-950/40 border-red-500/40 text-red-200' :
                    al.severity === 'high' ? 'bg-orange-950/20 border-orange-500/30 text-orange-100' :
                    'bg-brand-navy-light/40 border-slate-800 text-brand-silver'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${al.severity === 'critical' ? 'text-red-400 animate-pulse' : 'text-brand-gold'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <strong className="text-white font-sans text-sm">{al.type}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(al.time).toLocaleString('en-ZA')}</span>
                    </div>
                    <p className="leading-relaxed">{al.message}</p>
                    <div className="mt-2.5 flex gap-2">
                      <span className="px-2 py-0.5 bg-brand-dark/60 rounded font-mono text-[9px] uppercase">Severity: {al.severity}</span>
                      {al.learnerName && <span className="px-2 py-0.5 bg-brand-dark/60 rounded font-mono text-[9px]">Child: {al.learnerName}</span>}
                      {al.resolved ? (
                        <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[9px] uppercase">Resolved</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-brand-gold/15 text-brand-gold border border-brand-gold/25 rounded font-mono text-[9px] uppercase animate-pulse">Monitoring</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================== TAB 6: HISTORY ==================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6" id="guardian-history-tab">
            <InteractiveRouteMap learner={currentLearner} safeZones={safeZones} />
          </div>
        )}

        {/* ==================================== TAB 7: DEVICES ==================================== */}
        {activeTab === 'devices' && (
          <div className="space-y-6" id="guardian-devices-tab">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Device Spec details */}
              <div className="md:col-span-2 glass-panel p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-gold" /> Wearable OS Diagnostics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-brand-dark border border-brand-gold/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Device Model</span>
                    <strong className="text-slate-200 block">ITIS-Wear v3.0 (LTE Gold Edition)</strong>
                  </div>
                  <div className="p-3 bg-brand-dark border border-brand-gold/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Hardware IMEI</span>
                    <strong className="text-slate-200 block">{currentLearner.trackerImei}</strong>
                  </div>
                  <div className="p-3 bg-brand-dark border border-brand-gold/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Secure SIM Assignment</span>
                    <strong className="text-slate-200 block">{currentLearner.simNumber} (MTN SA)</strong>
                  </div>
                  <div className="p-3 bg-brand-dark border border-brand-gold/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Firmware version</span>
                    <strong className="text-slate-200 block">ITIS_OS_3.4.15_STABLE</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-navy-light/60 flex flex-wrap gap-2">
                  <button 
                    onClick={() => alert("Sent remote ping cascade. Telemetry calibration check OK.")}
                    className="px-4 py-2 bg-brand-navy-light hover:bg-brand-navy text-brand-gold border border-brand-gold/25 text-xs font-mono rounded cursor-pointer"
                  >
                    ⚙ Run Diagnostics calibration
                  </button>
                  <button 
                    onClick={() => alert("Simulating firmware over-the-air update check. Firmware is already up to date.")}
                    className="px-4 py-2 bg-brand-navy-light hover:bg-brand-navy text-slate-300 border border-slate-800 text-xs font-mono rounded cursor-pointer"
                  >
                    ↓ Check OTA Firmware update
                  </button>
                </div>
              </div>

              {/* Right: Live diagnostics metrics */}
              <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Sensor Telemetry HUD
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-brand-dark rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center text-slate-400 mb-1 font-mono text-[10px]">
                      <span>HEART RATE SENSOR</span>
                      <strong className="text-brand-gold">{currentLearner.heartRate || 74} BPM</strong>
                    </div>
                    <div className="flex items-end gap-1 h-8 px-1">
                      {[15, 25, 20, 32, 22, 18, 30, 24, 28, 15, 25].map((h, i) => (
                        <div key={i} className="bg-brand-gold/75 flex-1 rounded-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-brand-dark rounded-xl border border-slate-850 font-mono text-[11px] space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Body Temp:</span>
                      <strong className="text-slate-200">{currentLearner.temperature || 36.6}°C (Normal)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sync Latency:</span>
                      <strong className="text-emerald-400">0.8 seconds</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Secure Chip State:</span>
                      <strong className="text-emerald-400">TAMPER SECURE</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================== TAB 8: SUBSCRIPTION ==================================== */}
        {activeTab === 'subscription' && (
          <div className="space-y-6" id="guardian-billing-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-gold" /> Select Your ITIS Guardian Protection Tier
            </h3>

            {isPaid ? (
              <div className="p-6 bg-emerald-950/40 border-2 border-emerald-500/40 rounded-2xl max-w-lg text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Payment Approved & Subscriptions Secured</h4>
                <p className="text-xs text-emerald-200 leading-relaxed font-mono">
                  Receipt dispatched successfully to mthokozisi@live.co.za.<br />
                  Your ITIS GPS Tracker IMEI {currentLearner.trackerImei} is active on the Premium Guardian Tier.
                </p>
                <button 
                  onClick={() => setIsPaid(false)}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-mono rounded text-xs cursor-pointer"
                >
                  Configure billing options
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockSubscriptionPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4 relative ${selectedPlanId === plan.id ? 'border-2 border-brand-gold glow-gold' : 'border-brand-navy-light'}`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-gold text-brand-dark px-3 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">
                        MOST POPULAR
                      </span>
                    )}

                    <div>
                      <h4 className="text-md font-bold text-white font-sans">{plan.name}</h4>
                      <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                        R {plan.priceZar} <span className="text-xs text-slate-400">/ {plan.period}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Billed local ZAR (South Africa)</p>
                      
                      <ul className="space-y-2 mt-4 text-xs text-brand-silver">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-brand-gold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${selectedPlanId === plan.id ? 'bg-brand-gold text-brand-dark' : 'bg-brand-navy-light text-slate-300 hover:bg-brand-navy'}`}
                    >
                      {selectedPlanId === plan.id ? 'Selected Tier' : 'Choose Tier'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Simulated Checkout Form */}
            {!isPaid && (
              <div className="glass-panel p-5 rounded-2xl max-w-xl space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-brand-gold">
                  Secure Checkout Terminal
                </h4>

                <div className="flex gap-4 text-xs border-b border-slate-800 pb-3 mb-3 font-mono">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="accent-brand-gold" 
                    />
                    <span>Card (Visa, Mastercard, Apple Pay)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input 
                      type="radio" 
                      name="payment_opt" 
                      checked={paymentMethod === 'eft'} 
                      onChange={() => setPaymentMethod('eft')}
                      className="accent-brand-gold" 
                    />
                    <span>Instant EFT (Standard Bank, Absa, FNB, Capitec)</span>
                  </label>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setIsPaid(true); }} className="space-y-3.5 text-xs">
                  {paymentMethod === 'card' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          required 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. Thabo Ndlovu" 
                          className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Card Number</label>
                        <input 
                          type="text" 
                          required 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4000 1234 5678 9010" 
                          className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-brand-dark rounded border border-brand-gold/15 text-[11px] font-mono text-brand-silver">
                      🔒 Your transaction is handled by standard PayFast gateway simulation. You will be redirected to complete EFT validation inside your banking app.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-extrabold rounded-xl uppercase tracking-widest text-xs font-mono cursor-pointer transition-colors"
                  >
                    Confirm Secure Transaction · R {mockSubscriptionPlans.find(p => p.id === selectedPlanId)?.priceZar || 299}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================================== TAB 9: PREMIUM SUITE ==================================== */}
        {activeTab === 'premium' && (
          <PremiumFeatures 
            learners={learners}
            safeZones={safeZones}
            alerts={alerts}
            onTriggerSOS={onTriggerSOS}
            onAddAlert={onAddAlert}
            onAddIncident={onAddIncident}
            language={language}
          />
        )}

        {/* ==================================== TAB 10: MY CHILDREN ==================================== */}
        {activeTab === 'mychildren' && (
          <div className="space-y-6" id="guardian-my-children-tab">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-gold" /> Children Safety Profiles & Information
                </h3>
                <p className="text-xs text-brand-silver">Manage demographics, medical history, transit, and tracker links for your enrolled children</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Profile details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-t-2 border-brand-gold space-y-4">
                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start border-b border-slate-800 pb-5">
                    <img 
                      src={currentLearner.photoUrl} 
                      alt={currentLearner.name} 
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-brand-gold shadow-lg glow-gold" 
                    />
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-brand-gold uppercase bg-brand-navy px-2 py-0.5 rounded border border-brand-gold/20">
                          ID: {currentLearner.id} · REG: Active
                        </span>
                        <h4 className="text-xl font-bold text-white mt-1.5">{currentLearner.name}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-brand-silver font-mono">
                        <div>🏫 School: <strong className="text-white font-sans">{currentLearner.school}</strong></div>
                        <div>📚 Grade/Class: <strong className="text-white">{currentLearner.grade}</strong></div>
                        <div>🩸 Blood Type: <strong className="text-red-400 font-bold">{currentLearner.bloodGroup || 'O+'}</strong></div>
                        <div>📡 Wearable GPS: <strong className="text-emerald-400">ACTIVE ({currentLearner.trackerImei.slice(0, 10)}...)</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Medical notes and Allergies */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider flex items-center gap-1.5">
                        <Heart className="w-4 h-4" /> Crucial Medical Information
                      </h5>
                      <button
                        onClick={() => setEditingMedical(!editingMedical)}
                        className="text-[10px] font-mono text-brand-gold hover:underline cursor-pointer uppercase"
                      >
                        {editingMedical ? 'Cancel' : 'Update Medical Notes'}
                      </button>
                    </div>

                    {editingMedical ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={medicalConditionsText}
                          onChange={(e) => setMedicalConditionsText(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-3 py-2 text-white font-sans text-xs"
                        />
                        <button
                          onClick={() => setEditingMedical(false)}
                          className="px-3.5 py-1.5 bg-brand-gold text-brand-dark font-mono font-bold text-xs uppercase rounded cursor-pointer"
                        >
                          Save Medical Notes
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl">
                        <p className="text-xs text-red-200 leading-relaxed font-sans">
                          <strong className="text-white block font-mono text-[10px] uppercase mb-1">Medical Diagnosis & Instructions:</strong>
                          {medicalConditionsText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Guardian / Next of Kin Contacts */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-xs font-mono font-bold uppercase text-brand-gold tracking-wider">
                      Secondary Emergency Contacts
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl">
                        <strong className="text-white block">Thabo Ndlovu (Primary Guardian)</strong>
                        <span className="text-slate-400 font-mono text-[11px]">+27 82 123 4567 · Father</span>
                      </div>
                      <div className="p-3 bg-brand-dark/40 border border-slate-800 rounded-xl">
                        <strong className="text-white block">Lindiwe Ndlovu (Backup Contact)</strong>
                        <span className="text-slate-400 font-mono text-[11px]">+27 71 987 6543 · Mother</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily transit & attendance logs */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2">
                    <Bus className="w-4 h-4 text-brand-gold" /> Transport Manifest & Attendance
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 bg-brand-navy-light/20 border border-slate-800 rounded-xl space-y-1.5">
                      <strong className="text-brand-gold block font-mono text-[10px] uppercase">Allocated Transport</strong>
                      <p className="text-white font-bold">ITIS Bus 12C · Sandton Route</p>
                      <p className="text-slate-400 text-[11px]">Operator: Gauteng Joint Safety Transit<br />Driver: Enoch Khumalo (+27 83 234 5678)</p>
                      <span className="inline-block bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase mt-1">
                        On Path
                      </span>
                    </div>

                    <div className="p-4 bg-brand-navy-light/20 border border-slate-800 rounded-xl space-y-1.5">
                      <strong className="text-brand-gold block font-mono text-[10px] uppercase">Today's Attendance Roll-Call</strong>
                      <p className="text-white font-bold">Checked Present at school campus</p>
                      <p className="text-slate-400 text-[11px]">Time logged: 07:34 AM UTC+2<br />Method: NFC Tracker Beacon Sync</p>
                      <span className="inline-block bg-green-950 text-green-300 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase mt-1">
                        Accounted For
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Curfew Schedule */}
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                    Daily Schedule & Boundaries
                  </h4>

                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 bg-brand-dark/45 border-l-2 border-brand-gold rounded-r-xl">
                      <span className="text-[10px] text-brand-gold font-mono block">07:00 - 07:30</span>
                      <strong className="text-white">Transit Route Geofence Window</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Alert triggered if child deviates more than 500m from transit highway corridor.</p>
                    </div>

                    <div className="p-3 bg-brand-dark/45 border-l-2 border-emerald-400 rounded-r-xl">
                      <span className="text-[10px] text-emerald-400 font-mono block">07:30 - 14:30</span>
                      <strong className="text-white">Active School Safe-Zone Boundary</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Child must reside within School perimeter.</p>
                    </div>

                    <div className="p-3 bg-brand-dark/45 border-l-2 border-brand-gold rounded-r-xl">
                      <span className="text-[10px] text-brand-gold font-mono block">14:30 - 15:30</span>
                      <strong className="text-white">Afternoon Transport Return</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Handover logs verified between transport provider and guardian.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                    NFC Safe Zones Registered
                  </h4>
                  <div className="space-y-2">
                    {safeZones.map((zone) => (
                      <div key={zone.id} className="p-2.5 bg-brand-navy-light/20 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-white block">{zone.name}</strong>
                          <span className="text-[10px] text-slate-400">Radius: {zone.radius} meters</span>
                        </div>
                        <span className="text-brand-gold text-[10px] uppercase font-mono">
                          {zone.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 11: MESSAGES ==================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6" id="guardian-messages-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-gold" /> Encrypted Safety Communications Inbox
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Message List */}
              <div className="lg:col-span-1 space-y-3">
                {parentMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setParentMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-sans cursor-pointer ${!msg.read ? 'bg-brand-navy border-brand-gold glow-gold' : 'bg-brand-dark/40 border-slate-850'}`}
                  >
                    <div className="flex justify-between items-center mb-1 font-mono">
                      <span className="font-bold text-brand-gold truncate max-w-[120px]">{msg.from}</span>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <strong className="text-white block truncate">{msg.subject}</strong>
                    <p className="text-slate-400 text-[11px] truncate mt-1">{msg.body}</p>
                  </button>
                ))}
              </div>

              {/* Message Detail & Quick Reply */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border-t-2 border-brand-gold space-y-4 text-xs flex flex-col justify-between min-h-[350px]">
                <div>
                  <div className="border-b border-slate-800 pb-3 mb-3">
                    <span className="text-[10px] font-mono text-brand-gold uppercase">ITIS Secure Channel</span>
                    <h4 className="text-md font-bold text-white mt-1">SIM Telemetry Update Completed</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">From: ITIS National Command Center · Date: Today</p>
                  </div>

                  <p className="text-slate-200 leading-relaxed text-xs">
                    The wearable safety tracker has successfully established telemetry. Fallback roaming priority is currently active on Vodacom, MTN, and Telkom cellular frequencies. Handover diagnostics signal maximum response throughput. Safezone perimeters are refreshed and synchronized. No administrative intervention is required at this time.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <h5 className="font-mono font-bold text-white uppercase text-[10px] text-brand-gold">Secure reply channel (Command Link)</h5>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type secure response to coordinator..."
                      className="flex-1 bg-brand-dark border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      onClick={() => alert("Message dispatched securely under public protection protocol.")}
                      className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded uppercase cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 12: DOCUMENTS ==================================== */}
        {activeTab === 'documents' && (
          <div className="space-y-6" id="guardian-documents-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-gold" /> Parent Consent & Compliance Documents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">ITIS Child Wearable Setup Guide (PDF)</h4>
                    <span className="text-[10px] text-slate-500 font-mono">SIZE: 4.8 MB · UPDATED: FEB 2026</span>
                  </div>
                  <button 
                    onClick={() => alert("Downloading ITIS Setup Guide...")}
                    className="p-2 bg-brand-dark hover:bg-brand-navy-light text-brand-gold rounded border border-brand-gold/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Contains steps to synchronize, configure notifications, adjust geofence radius guidelines, and manage batteries.
                </p>
              </div>

              <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">SAPS National Child Evacuation Guidelines</h4>
                    <span className="text-[10px] text-slate-500 font-mono">SIZE: 1.2 MB · PUBLIC SCHEME</span>
                  </div>
                  <button 
                    onClick={() => alert("Downloading SAPS Guidelines...")}
                    className="p-2 bg-brand-dark hover:bg-brand-navy-light text-brand-gold rounded border border-brand-gold/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Joint evacuation procedures managed with South African Police Services and public emergency response clinics.
                </p>
              </div>

              <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">POPIA Data Protection Consent Agreement</h4>
                    <span className="text-[10px] text-slate-500 font-mono">SIZE: 2.1 MB · SIGNED AND VERIFIED</span>
                  </div>
                  <button 
                    onClick={() => alert("Downloading POPIA Agreement...")}
                    className="p-2 bg-brand-dark hover:bg-brand-navy-light text-brand-gold rounded border border-brand-gold/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Legal agreement defining data retention limits, secure cloud encryption, and parental authorization of biometric tracking.
                </p>
              </div>

              <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">ITIS School Indemnity Form Template</h4>
                    <span className="text-[10px] text-slate-500 font-mono">SIZE: 840 KB · REQUIREMENT</span>
                  </div>
                  <button 
                    onClick={() => alert("Downloading School Indemnity Template...")}
                    className="p-2 bg-brand-dark hover:bg-brand-navy-light text-brand-gold rounded border border-brand-gold/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Required template allowing the school transport team to access live location beacons for daily safety handovers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 13: SUPPORT ==================================== */}
        {activeTab === 'support' && (
          <div className="space-y-6" id="guardian-support-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-gold" /> Citizen Support Hotline & Live Assistance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Submission */}
              <div className="md:col-span-2 glass-panel p-6 rounded-2xl border-t-2 border-brand-gold space-y-4 text-xs">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                  Submit Operational Support Ticket
                </h4>

                {supportTicketSuccess ? (
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-xl space-y-2">
                    <strong className="block text-white">Ticket Filed Successfully!</strong>
                    <p className="text-[11px] font-mono leading-relaxed">
                      Reference Code: <strong className="text-emerald-400">ITIS-SUP-592</strong>. Our National Command operations support unit is investigating. Standard response time is within 30 minutes.
                    </p>
                    <button 
                      onClick={() => { setSupportTicketSuccess(false); setSupportDesc(''); }}
                      className="px-3 py-1 bg-emerald-900 text-emerald-200 font-mono rounded cursor-pointer"
                    >
                      File another query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSupportTicketSuccess(true); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1">Inquiry Category</label>
                        <select
                          value={supportCategory}
                          onChange={(e) => setSupportCategory(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white"
                        >
                          <option value="Hardware">Wearable Hardware Fault</option>
                          <option value="Geofence">Safezone GPS Delay</option>
                          <option value="Billing">Subscription & Billing</option>
                          <option value="POPIA">POPI Act Data Inquiry</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id="urgent_chk"
                          checked={supportUrgent}
                          onChange={(e) => setSupportUrgent(e.target.checked)}
                          className="accent-brand-gold"
                        />
                        <label htmlFor="urgent_chk" className="text-red-400 font-mono font-bold uppercase tracking-wider">
                          🚨 CRITICAL FIELD DEVIATION FLAG
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Issue Description</label>
                      <textarea
                        required
                        rows={4}
                        value={supportDesc}
                        onChange={(e) => setSupportDesc(e.target.value)}
                        placeholder="Please describe any issues you are facing, including the child's tracker ID or IMEI if applicable."
                        className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white leading-normal"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded uppercase cursor-pointer"
                    >
                      Submit Ticket To Command Centre
                    </button>
                  </form>
                )}
              </div>

              {/* Support FAQs */}
              <div className="glass-panel p-5 rounded-2xl space-y-4 text-xs font-sans">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                  South Africa Safety FAQ
                </h4>

                <div className="space-y-3">
                  <div>
                    <strong className="text-white block">How often does GPS sync?</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Standard interval is every 30 seconds. If emergency mode is active, telemetry transmits in real-time.
                    </p>
                  </div>
                  <div>
                    <strong className="text-white block">Who holds tracking consent?</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Only authorized guardians and verified administrators at the child's enrolled school have permission to pull coordinates.
                    </p>
                  </div>
                  <div>
                    <strong className="text-white block">Does it support global roaming?</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Yes, South African safety mandates require dual networks, covering MTN, Vodacom, and Telkom masts nationwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== TAB 14: PROFILE ==================================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6" id="guardian-profile-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-gold" /> Citizen Profile Credentials
            </h3>

            <div className="glass-panel p-6 rounded-2xl border-t-2 border-brand-gold space-y-6 max-w-2xl text-xs">
              <form onSubmit={(e) => { e.preventDefault(); alert("Profile updated successfully!"); }} className="space-y-4 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Guardian Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Cellular Number (MFA Linked)</label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Residential Street Address</label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Alternative Contact Phone</label>
                    <input
                      type="text"
                      value={profileAltPhone}
                      onChange={(e) => setProfileAltPhone(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="mfa_chk"
                      checked={isMfaActive}
                      onChange={(e) => setIsMfaActive(e.target.checked)}
                      className="accent-brand-gold"
                    />
                    <label htmlFor="mfa_chk" className="text-slate-300">
                      Enable Multi-Factor SMS Verification
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-brand-dark rounded-xl border border-slate-850 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="popia_chk"
                    required
                    checked={isPopiaConsent}
                    onChange={(e) => setIsPopiaConsent(e.target.checked)}
                    className="mt-0.5 accent-brand-gold"
                  />
                  <div>
                    <label htmlFor="popia_chk" className="font-bold text-white block">
                      POPI Act Compliance Statement & Authorization
                    </label>
                    <span className="text-slate-400 text-[10px] block leading-relaxed mt-1 font-mono">
                      I authorize the ITIS National Public Safety Consortium to preserve and transmit live tracking logs of my children to authorized school staff and SAPS dispatchers during active school days.
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded uppercase cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ==================================== TAB 15: SETTINGS ==================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6" id="guardian-settings-tab">
            <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-gold" /> System Settings & Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                  Notification Dispatch Toggles
                </h4>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <div>
                      <strong className="text-white block">Geofence Entry & Departure Alerts</strong>
                      <span className="text-[10px] text-slate-400">Receive alerts when child joins/departs safezone boundaries</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertSettings.geofence}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, geofence: e.target.checked }))}
                      className="accent-brand-gold w-4 h-4"
                    />
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <div>
                      <strong className="text-white block">Critical SOS Alert Push</strong>
                      <span className="text-[10px] text-slate-400">Always notify via SMS and Push notification on emergency alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertSettings.sos}
                      className="accent-brand-gold w-4 h-4 animate-pulse"
                      disabled
                    />
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <div>
                      <strong className="text-white block">Battery Low Warnings</strong>
                      <span className="text-[10px] text-slate-400">Notify when child wearable device drops below 20% battery</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertSettings.battery}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, battery: e.target.checked }))}
                      className="accent-brand-gold w-4 h-4"
                    />
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <div>
                      <strong className="text-white block">High Speed Violations</strong>
                      <span className="text-[10px] text-slate-400">Notify if transport vehicle exceeds 100km/h boundary speed limit</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertSettings.speed}
                      onChange={(e) => setAlertSettings(prev => ({ ...prev, speed: e.target.checked }))}
                      className="accent-brand-gold w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                  Telemetry Frequency Configuration
                </h4>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Wearable Heartbeat Reporting Rate</label>
                    <select
                      value={simRefreshRate}
                      onChange={(e) => setSimRefreshRate(e.target.value)}
                      className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white"
                    >
                      <option value="15s">15 Seconds (High Accuracy)</option>
                      <option value="30s">30 Seconds (Standard Balance)</option>
                      <option value="60s">60 Seconds (Power-saving mode)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => alert("Diagnostic ping initiated to wearable chip. Sync OK.")}
                      className="w-full py-2 bg-emerald-950/40 hover:bg-emerald-950 text-emerald-300 border border-emerald-500/20 rounded font-bold uppercase cursor-pointer"
                    >
                      📡 PING WEARABLE HARDWARE CHIP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
