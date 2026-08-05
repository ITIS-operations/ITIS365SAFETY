import React, { useState } from 'react';
import { 
  Shield, Map, Radio, AlertOctagon, Heart, Server, Globe2, Activity, ShieldAlert,
  Sliders, MessageSquare, CornerDownRight, ThumbsUp, Landmark, Calendar, MapPin, Eye, Play, Search, CloudSun, Navigation,
  CheckCircle2, Clock, Phone, AlertTriangle, UserCheck, FileText, Download, CheckSquare, AlertCircle, RefreshCw,
  Lock, ArrowRight, ShieldCheck, User, Battery, Signal, ChevronRight, FileCheck, Award, Cpu, Smartphone
} from 'lucide-react';
import { Learner, IncidentTicket, NationalStats, mockNationalStats, SafeZone, SafetyAlert } from '../types';
import { LivePursuitNavigation } from './LivePursuitNavigation';
import { LearnerInterventionModal } from './LearnerInterventionModal';

interface CommandCentreProps {
  learners: Learner[];
  safeZones: SafeZone[];
  alerts: SafetyAlert[];
  onTriggerSOS: (learner: Learner) => void;
  incidents: IncidentTicket[];
  onResolveIncident: (id: string, resolutionNote: string) => void;
  onUpdateIncidentStatus: (id: string, newStatus: 'Reported' | 'Dispatched' | 'On Scene' | 'Resolved') => void;
}

export function CommandCentre({ 
  learners, 
  safeZones,
  alerts,
  onTriggerSOS,
  incidents, 
  onResolveIncident, 
  onUpdateIncidentStatus 
}: CommandCentreProps) {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [resolutionInput, setResolutionInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'incidents' | 'national' | 'risk' | 'supervisor'>('incidents');
  const [isLivePursuitActive, setIsLivePursuitActive] = useState(false);
  const [interventionLearner, setInterventionLearner] = useState<Learner | null>(null);

  // Stage state for current selected incident (1 to 9)
  const [incidentStages, setIncidentStages] = useState<Record<string, number>>({});
  
  // Verification Checklist State per incident
  const [verifications, setVerifications] = useState<Record<string, Record<string, boolean>>>({});

  // Guardian Contact State per incident
  const [commsLogs, setCommsLogs] = useState<Record<string, { type: string; outcome: string; time: string }[]>>({});

  // Operator Risk Override
  const [riskOverrides, setRiskOverrides] = useState<Record<string, { approved: boolean; notes: string }>>({});

  // Dispatch Selections per incident
  const [dispatchedUnits, setDispatchedUnits] = useState<Record<string, string[]>>({});

  // On Scene Checklist State
  const [onSceneChecklist, setOnSceneChecklist] = useState<Record<string, Record<string, boolean>>>({});

  // Resolution Checklist State
  const [resolutionChecklist, setResolutionChecklist] = useState<Record<string, Record<string, boolean>>>({});

  // Selected timeline item modal/detail
  const [selectedTimelineIdx, setSelectedTimelineIdx] = useState<number | null>(null);

  // Supervisor intervention mode
  const [isSupervisorOverride, setIsSupervisorOverride] = useState(false);

  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];
  const matchedLearner = learners.find(l => l.name === selectedIncident?.learnerName) || learners[0];

  const currentStage = selectedIncident ? (incidentStages[selectedIncident.id] || (
    selectedIncident.status === 'Resolved' ? 9 :
    selectedIncident.status === 'On Scene' ? 7 :
    selectedIncident.status === 'Dispatched' ? 6 : 1
  )) : 1;

  const updateStage = (incId: string, newStage: number) => {
    setIncidentStages(prev => ({ ...prev, [incId]: newStage }));
    if (newStage >= 6 && selectedIncident.status === 'Reported') {
      onUpdateIncidentStatus(incId, 'Dispatched');
    } else if (newStage >= 7 && selectedIncident.status === 'Dispatched') {
      onUpdateIncidentStatus(incId, 'On Scene');
    } else if (newStage === 9 && selectedIncident.status !== 'Resolved') {
      onUpdateIncidentStatus(incId, 'Resolved');
    }
  };

  const handleToggleVerification = (incId: string, key: string) => {
    setVerifications(prev => ({
      ...prev,
      [incId]: { ...prev[incId], [key]: !prev[incId]?.[key] }
    }));
  };

  const handleAddCommsLog = (incId: string, type: string, outcome: string) => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setCommsLogs(prev => ({
      ...prev,
      [incId]: [
        { type, outcome, time: timeStr },
        ...(prev[incId] || [])
      ]
    }));
  };

  const handleToggleUnit = (incId: string, unitId: string) => {
    setDispatchedUnits(prev => {
      const current = prev[incId] || [];
      const updated = current.includes(unitId)
        ? current.filter(u => u !== unitId)
        : [...current, unitId];
      return { ...prev, [incId]: updated };
    });
  };

  const handleToggleOnScene = (incId: string, key: string) => {
    setOnSceneChecklist(prev => ({
      ...prev,
      [incId]: { ...prev[incId], [key]: !prev[incId]?.[key] }
    }));
  };

  const handleToggleResolution = (incId: string, key: string) => {
    setResolutionChecklist(prev => ({
      ...prev,
      [incId]: { ...prev[incId], [key]: !prev[incId]?.[key] }
    }));
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolutionInput.trim()) return;

    onResolveIncident(selectedIncident.id, resolutionInput.trim());
    updateStage(selectedIncident.id, 9);
    setResolutionInput('');
  };

  const getStageColor = (stageNum: number) => {
    if (stageNum <= 2) return 'border-blue-500 bg-blue-950/30 text-blue-400';
    if (stageNum <= 4) return 'border-amber-500 bg-amber-950/30 text-amber-400';
    if (stageNum <= 6) return 'border-red-500 bg-red-950/30 text-red-400';
    if (stageNum <= 8) return 'border-emerald-500 bg-emerald-950/30 text-emerald-400';
    return 'border-brand-gold bg-brand-navy-heavy text-brand-gold';
  };

  const stagesList = [
    { num: 1, title: 'SOS Received' },
    { num: 2, title: 'Verification' },
    { num: 3, title: 'Guardian Contact' },
    { num: 4, title: 'Risk Assessment' },
    { num: 5, title: 'Dispatch Decision' },
    { num: 6, title: 'Live Response' },
    { num: 7, title: 'On-Scene Triage' },
    { num: 8, title: 'Resolution' },
    { num: 9, title: 'Report & Archive' },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-brand-dark min-h-screen text-slate-100 font-sans" id="command-centre-layout">
      
      {/* Sidebar: Incident Case list & Search & Operational Tabs */}
      <aside className="w-full md:w-80 bg-brand-navy border-r border-brand-gold/15 flex flex-col" id="command-centre-sidebar">
        {/* SubTab Selectors */}
        <div className="grid grid-cols-4 border-b border-brand-gold/15 text-[10px] font-mono font-bold tracking-wider uppercase text-center bg-brand-dark/40">
          <button 
            onClick={() => setActiveSubTab('incidents')}
            className={`py-3 ${activeSubTab === 'incidents' ? 'bg-brand-gold text-brand-dark font-extrabold' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            Live Cases
          </button>
          <button 
            onClick={() => setActiveSubTab('national')}
            className={`py-3 ${activeSubTab === 'national' ? 'bg-brand-gold text-brand-dark font-extrabold' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            Stats
          </button>
          <button 
            onClick={() => setActiveSubTab('risk')}
            className={`py-3 ${activeSubTab === 'risk' ? 'bg-brand-gold text-brand-dark font-extrabold' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            AI Risk
          </button>
          <button 
            onClick={() => setActiveSubTab('supervisor')}
            className={`py-3 ${activeSubTab === 'supervisor' ? 'bg-brand-gold text-brand-dark font-extrabold' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            Audit
          </button>
        </div>

        {activeSubTab === 'incidents' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-brand-gold/10">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-brand-gold/60" />
                <input
                  type="text"
                  placeholder="Search Incident Queue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-brand-dark/80 border border-brand-gold/20 rounded pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-brand-gold font-mono"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2" id="command-cases-list">
              {incidents
                .filter(inc => 
                  inc.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  inc.category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((inc) => {
                  const incStage = incidentStages[inc.id] || (inc.status === 'Resolved' ? 9 : inc.status === 'On Scene' ? 7 : inc.status === 'Dispatched' ? 6 : 1);
                  return (
                    <button
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${selectedIncidentId === inc.id ? 'bg-brand-navy-light/80 border-brand-gold glow-gold' : 'bg-brand-dark/50 border-slate-800/80 hover:border-slate-700'}`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-brand-gold">{inc.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-semibold ${
                          inc.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                          inc.status === 'Reported' ? 'bg-amber-950 text-amber-400 border border-amber-500/30 animate-pulse' :
                          'bg-red-950 text-red-400 border border-red-500/30 animate-pulse'
                        }`}>
                          Stage {incStage}/9 · {inc.status}
                        </span>
                      </div>
                      <strong className="text-white text-xs block truncate">{inc.learnerName}</strong>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
                        <span>{inc.category}</span>
                        <span>{inc.time}</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {activeSubTab === 'national' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono" id="command-national-stats">
            <h4 className="text-[10px] uppercase text-brand-gold tracking-widest border-b border-slate-800 pb-2">National Operational Telemetry</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Connected Wearables</span>
                <strong className="text-md text-slate-200">{mockNationalStats.totalLearnersConnected.toLocaleString()} Active Devices</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Joint Active Schools</span>
                <strong className="text-md text-slate-200">{mockNationalStats.schoolsConnectedCount} Online</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">SAPS/EMS Dispatch Average ETA</span>
                <strong className="text-md text-emerald-400">{mockNationalStats.avgResponseTimeMin} Minutes SLA</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Incident Recovery Rate</span>
                <strong className="text-md text-emerald-400">{mockNationalStats.recoveryRatePercent}% Successful</strong>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'risk' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans" id="command-ai-risks">
            <h4 className="text-[10px] uppercase text-brand-gold tracking-widest border-b border-slate-800 pb-2 font-mono">Cognitive Threat Engine</h4>
            
            <div className="space-y-2.5">
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
                <strong className="text-amber-400 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Traffic Density: Smit St Corridor
                </strong>
                <p className="text-[10px] text-slate-300">Congestion increases pedestrian transit delays near Gauteng High. Dynamic buffer active.</p>
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-1">
                <strong className="text-blue-400 text-xs flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5" /> Severe Thunderstorm Warning
                </strong>
                <p className="text-[10px] text-slate-300">Rain radar triggers automated bus transit speed limits and elevated GPS polling frequency.</p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'supervisor' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono" id="command-supervisor-audit">
            <h4 className="text-[10px] uppercase text-brand-gold tracking-widest border-b border-slate-800 pb-2">Supervisor SLA & Oversight</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20">
                <span className="block text-[9px] text-slate-400">SOS Ack SLA</span>
                <strong className="text-emerald-400 font-bold">14 Seconds (Target: &lt;30s)</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20">
                <span className="block text-[9px] text-slate-400">Human Verification Rate</span>
                <strong className="text-brand-gold font-bold">100% Verified by Operator</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20">
                <span className="block text-[9px] text-slate-400">POPIA Compliance Status</span>
                <strong className="text-emerald-400 font-bold">Audit Encryption Locked</strong>
              </div>
              
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsSupervisorOverride(!isSupervisorOverride)}
                  className={`w-full py-2 px-3 rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                    isSupervisorOverride 
                      ? 'bg-amber-600 text-slate-950 font-extrabold' 
                      : 'bg-brand-navy border border-brand-gold/30 text-brand-gold hover:border-brand-gold'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  {isSupervisorOverride ? 'SUPERVISOR OVERRIDE ACTIVE' : 'ENABLE SUPERVISOR INTERVENTION'}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6" id="command-centre-main">
        
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 font-mono uppercase font-bold">
                E09B Operational Incident Management System
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono uppercase font-bold">
                HUMAN AUTHORIZED DISPATCH
              </span>
            </div>
            <h2 className="text-2xl font-extrabold font-sans tracking-wide text-white flex items-center gap-2 mt-1">
              <Landmark className="w-6 h-6 text-brand-gold" /> Emergency Operations Command Centre
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-brand-navy border border-brand-gold/20 px-4 py-2 rounded-xl text-xs font-mono text-brand-silver flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              <span>Shift SLA: <strong className="text-emerald-400 font-bold">99.8% On Target</strong></span>
            </div>
            <div className="bg-brand-navy border border-brand-gold/20 px-4 py-2 rounded-xl text-xs font-mono text-brand-silver flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-brand-gold" />
              <span>Pretoria Ops: <strong className="text-white font-bold">22°C Clear</strong></span>
            </div>
          </div>
        </div>

        {/* Selected Incident View */}
        {selectedIncident ? (
          <div className="space-y-6" id="incident-workspace-detail">
            
            {/* Header detail card */}
            <div className="glass-panel-heavy p-5 rounded-2xl relative border-t-2 border-brand-gold space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-brand-gold uppercase tracking-widest font-bold">
                      Case File: {selectedIncident.id}
                    </span>
                    <span className="text-[10px] bg-brand-navy px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
                      Category: {selectedIncident.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
                    Learner Target: {selectedIncident.learnerName}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Location: {selectedIncident.location} · Triggered: {selectedIncident.date} at {selectedIncident.time}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setInterventionLearner(matchedLearner)}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border bg-red-600 hover:bg-red-500 border-red-400 text-white shadow-lg glow-red"
                  >
                    <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
                    <span>Safety Intervention & Escalation</span>
                  </button>

                  <button
                    onClick={() => setIsLivePursuitActive(!isLivePursuitActive)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer border ${
                      isLivePursuitActive 
                        ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-lg glow-gold' 
                        : 'bg-brand-navy hover:bg-brand-navy-light border-brand-gold/30 text-brand-gold'
                    }`}
                  >
                    <Navigation className={`w-4 h-4 ${isLivePursuitActive ? 'animate-spin' : ''}`} style={isLivePursuitActive ? { animationDuration: '6s' } : undefined} />
                    <span>{isLivePursuitActive ? 'Standard Tactical View' : 'Launch Live Pursuit Guidance'}</span>
                  </button>
                </div>
              </div>

              {/* 9-STAGE OPERATIONAL PROGRESS BAR */}
              <div className="py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-widest">
                    Operational Stage Workflow Progression (Stage {currentStage} of 9)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Human Verification Required Before Escalation
                  </span>
                </div>

                <div className="grid grid-cols-9 gap-1.5">
                  {stagesList.map((st) => {
                    const isCompleted = currentStage > st.num;
                    const isCurrent = currentStage === st.num;
                    return (
                      <button
                        key={st.num}
                        onClick={() => updateStage(selectedIncident.id, st.num)}
                        className={`py-2 px-1 rounded text-[10px] font-mono font-bold uppercase transition-all border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                          isCurrent 
                            ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-md font-extrabold ring-2 ring-brand-gold/40' 
                            : isCompleted 
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                              : 'bg-brand-dark/60 text-slate-500 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{st.num}. {st.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC STAGE WORKSPACE INTERFACE */}
              <div className={`p-5 rounded-xl border transition-all ${getStageColor(currentStage)}`}>
                
                {/* STAGE 1: SOS RECEIVED */}
                {currentStage === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-blue-500/30 pb-3">
                      <div className="flex items-center gap-3">
                        <AlertOctagon className="w-7 h-7 text-red-500 animate-bounce" />
                        <div>
                          <h4 className="text-lg font-bold text-white">STAGE 1 — EMERGENCY SOS RECEIVED</h4>
                          <p className="text-xs text-blue-200 font-mono">Device Telemetry Signal Triggered · Immediate Operator Acknowledgement Mandatory</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-500/40 text-xs font-mono rounded-full font-bold animate-pulse">
                        ACK PENDING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3 bg-brand-dark/90 rounded-xl border border-blue-500/30 space-y-2">
                        <div className="flex items-center gap-3">
                          <img src={matchedLearner.photoUrl} alt="Target Learner" className="w-12 h-12 rounded-lg object-cover border border-brand-gold" />
                          <div>
                            <strong className="text-white text-sm block">{matchedLearner.name}</strong>
                            <span className="text-slate-400">{matchedLearner.grade} · {matchedLearner.school}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-brand-dark/90 rounded-xl border border-blue-500/30 space-y-1">
                        <span className="text-slate-400 text-[10px] uppercase block">Medical Alerts & Blood Group</span>
                        <strong className="text-amber-400 text-xs block font-bold">{matchedLearner.medicalConditions}</strong>
                        <span className="text-slate-300">Blood Group: <strong className="text-brand-gold">{matchedLearner.bloodGroup}</strong></span>
                      </div>

                      <div className="p-3 bg-brand-dark/90 rounded-xl border border-blue-500/30 space-y-1">
                        <span className="text-slate-400 text-[10px] uppercase block">Device Telemetry</span>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-300"><Battery className="w-3.5 h-3.5 text-emerald-400" /> {matchedLearner.deviceBattery}%</span>
                          <span className="flex items-center gap-1 text-slate-300"><Signal className="w-3.5 h-3.5 text-blue-400" /> {matchedLearner.deviceSignal}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">IMEI: {matchedLearner.trackerImei}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 2)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        ACKNOWLEDGE ALERT & BEGIN VERIFICATION
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 2: VERIFICATION CHECKLIST */}
                {currentStage === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-blue-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 2 — OPERATOR INCIDENT VERIFICATION</h4>
                        <p className="text-xs text-blue-200 font-mono">Verify Telemetry Integrity & Signal Authenticity Before Dispatch</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-500/40 text-xs font-mono rounded-full font-bold">
                        VERIFICATION IN PROGRESS
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {[
                        { key: 'gps', label: 'GPS Coordinates & Satellite Triangulation Authenticated' },
                        { key: 'imei', label: 'Learner Wearable Device Cryptographic Hash Verified' },
                        { key: 'dup', label: 'Duplicate Incident Alert Clearing Check Completed' },
                        { key: 'signal', label: 'Multi-Network SIM Signal Stability Verified' },
                        { key: 'history', label: '30-Day Historical Incident Patterns Checked' },
                      ].map((item) => {
                        const isChecked = verifications[selectedIncident.id]?.[item.key] || false;
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleToggleVerification(selectedIncident.id, item.key)}
                            className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isChecked ? 'bg-blue-900/40 border-blue-400 text-white' : 'bg-brand-dark/70 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CheckSquare className={`w-4 h-4 ${isChecked ? 'text-blue-400' : 'text-slate-600'}`} />
                              {item.label}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-blue-950 text-blue-300' : 'bg-slate-900 text-slate-500'}`}>
                              {isChecked ? 'VERIFIED' : 'PENDING'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 1)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Back to Stage 1
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 3)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <UserCheck className="w-4 h-4" />
                        CONFIRM VERIFIED INCIDENT & CONTACT GUARDIAN
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 3: GUARDIAN & SCHOOL CONTACT */}
                {currentStage === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 3 — GUARDIAN & SCHOOL DIRECT CONTACT</h4>
                        <p className="text-xs text-amber-200 font-mono">Attempt Direct Voice & SMS Contact with Parent and Campus Officer</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-950 text-amber-400 border border-amber-500/40 text-xs font-mono rounded-full font-bold">
                        DIRECT COMMS ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
                      <button
                        onClick={() => handleAddCommsLog(selectedIncident.id, 'Guardian Voice Call', 'Parent Confirms Incident - Requesting SAPS')}
                        className="p-3 bg-brand-dark/90 hover:bg-brand-navy border border-amber-500/30 rounded-xl text-left transition-all cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-amber-400 mb-1" />
                        <strong className="text-white block">Call Guardian ({selectedIncident.guardianName})</strong>
                        <span className="text-[10px] text-amber-300">Click to log voice call attempt</span>
                      </button>

                      <button
                        onClick={() => handleAddCommsLog(selectedIncident.id, 'School Safety Call', 'School Principal Notified - Lockdown Initiated')}
                        className="p-3 bg-brand-dark/90 hover:bg-brand-navy border border-amber-500/30 rounded-xl text-left transition-all cursor-pointer"
                      >
                        <Landmark className="w-4 h-4 text-amber-400 mb-1" />
                        <strong className="text-white block">Call School ({selectedIncident.schoolName})</strong>
                        <span className="text-[10px] text-amber-300">Contact principal / security</span>
                      </button>

                      <button
                        onClick={() => handleAddCommsLog(selectedIncident.id, 'Broadcast SMS Alert', 'Automated SMS sent to all emergency contacts')}
                        className="p-3 bg-brand-dark/90 hover:bg-brand-navy border border-amber-500/30 rounded-xl text-left transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-400 mb-1" />
                        <strong className="text-white block">Send SMS / WhatsApp Alert</strong>
                        <span className="text-[10px] text-amber-300">Broadcast automated message</span>
                      </button>
                    </div>

                    {/* Comms Outcome Log */}
                    <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                        Communication Activity Log
                      </span>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto text-[11px] font-mono">
                        {(commsLogs[selectedIncident.id] || []).length === 0 ? (
                          <span className="text-slate-500 italic block">No communication logged yet. Select an option above.</span>
                        ) : (
                          (commsLogs[selectedIncident.id] || []).map((log, idx) => (
                            <div key={idx} className="flex items-center justify-between border-b border-slate-900 pb-1">
                              <span className="text-white">[{log.time}] <strong className="text-amber-300">{log.type}:</strong> {log.outcome}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 2)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Back to Verification
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 4)}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Sliders className="w-4 h-4" />
                        PROCEED TO COGNITIVE RISK ASSESSMENT
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 4: OPERATOR RISK ASSESSMENT */}
                {currentStage === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 4 — OPERATOR RISK ASSESSMENT & AI RECOMMENDATION</h4>
                        <p className="text-xs text-amber-200 font-mono">AI Suggests — Human Operator Authorizes Emergency Level</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-950 text-amber-400 border border-amber-500/40 text-xs font-mono rounded-full font-bold">
                        HUMAN VERIFICATION REQUIRED
                      </span>
                    </div>

                    <div className="p-4 bg-brand-dark/90 rounded-xl border border-amber-500/30 space-y-3 font-mono">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block">AI Recommended Threat Score</span>
                          <strong className="text-2xl font-extrabold text-amber-400">CRITICAL RISK · 88 / 100</strong>
                        </div>
                        <span className="px-3 py-1 bg-red-950 text-red-300 border border-red-500/30 text-xs rounded font-bold">
                          LEVEL 7 ESCALATION RECOMMENDED (SAPS + EMS)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Reasoning: Learner deviated from designated safe transport route by 1.4km; stationary telemetry detected for &gt; 120 seconds in high-risk zone.
                      </p>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-brand-dark/60 rounded-xl border border-slate-800 space-y-2">
                        <label className="block text-slate-300 font-bold uppercase">Human Operator Override Notes (Optional):</label>
                        <input
                          type="text"
                          placeholder="Enter justification if overriding AI recommendation..."
                          value={riskOverrides[selectedIncident.id]?.notes || ''}
                          onChange={(e) => setRiskOverrides(prev => ({ ...prev, [selectedIncident.id]: { approved: true, notes: e.target.value } }))}
                          className="w-full bg-brand-navy border border-slate-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 3)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Back to Comms
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 5)}
                        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-mono font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        AUTHORIZE RISK LEVEL & PROCEED TO DISPATCH
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 5: DISPATCH DECISION */}
                {currentStage === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 5 — RESPONDER DISPATCH DECISION</h4>
                        <p className="text-xs text-red-200 font-mono">Select Active Tactical & Medical Response Units for Deployment</p>
                      </div>
                      <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-500/40 text-xs font-mono rounded-full font-bold animate-pulse">
                        DISPATCH PENDING
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                      {[
                        { id: 'saps-402', name: 'SAPS Tactical Unit 402', dist: '1.8 km', eta: '3 mins', type: 'Police', status: 'Available' },
                        { id: 'ems-12', name: 'Gauteng EMS Triage Unit 12', dist: '3.4 km', eta: '5 mins', type: 'Medical', status: 'Available' },
                        { id: 'sec-alpha', name: 'School Patrol Security Alpha', dist: '0.9 km', eta: '2 mins', type: 'Private Sec', status: 'Available' },
                        { id: 'metro-88', name: 'Metro Police Intercept 88', dist: '4.1 km', eta: '7 mins', type: 'Police', status: 'Standby' },
                      ].map((unit) => {
                        const isSelected = (dispatchedUnits[selectedIncident.id] || []).includes(unit.id);
                        return (
                          <button
                            key={unit.id}
                            onClick={() => handleToggleUnit(selectedIncident.id, unit.id)}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected ? 'bg-red-950/80 border-red-500 text-white' : 'bg-brand-dark/80 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <strong className="text-white block text-xs">{unit.name}</strong>
                              <span className="text-[10px] text-slate-400">{unit.type} · Distance: {unit.dist} · ETA: <span className="text-emerald-400 font-bold">{unit.eta}</span></span>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${isSelected ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                              {isSelected ? 'DISPATCHED' : 'SELECT'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 4)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Back to Risk Assessment
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 6)}
                        disabled={(dispatchedUnits[selectedIncident.id] || []).length === 0}
                        className={`px-6 py-3 font-mono font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 transition-all ${
                          (dispatchedUnits[selectedIncident.id] || []).length > 0
                            ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer glow-red'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Radio className="w-4 h-4" />
                        DISPATCH RESPONDERS & COMMENCE LIVE INTERCEPT
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 6: LIVE RESPONSE MANAGEMENT */}
                {currentStage === 6 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 6 — LIVE RESPONSE & INTERCEPT WORKSPACE</h4>
                        <p className="text-xs text-red-200 font-mono">Continuous Telemetry Tracking & Multi-Agency Intercept Management</p>
                      </div>
                      <span className="px-3 py-1 bg-red-950 text-red-400 border border-red-500/40 text-xs font-mono rounded-full font-bold animate-pulse">
                        LIVE PURSUIT ACTIVE
                      </span>
                    </div>

                    {isLivePursuitActive ? (
                      <div className="bg-brand-dark border border-brand-gold/20 p-4 rounded-xl shadow-2xl">
                        <LivePursuitNavigation 
                          learners={learners}
                          safeZones={safeZones}
                          alerts={alerts}
                          onTriggerSOS={onTriggerSOS}
                          initialSelectedLearnerId={matchedLearner.id}
                        />
                      </div>
                    ) : (
                      <div className="relative bg-brand-dark border border-red-500/30 rounded-xl h-64 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')` }} />
                        <div className="absolute flex flex-col items-center">
                          <div className="w-12 h-12 bg-red-600/30 border-2 border-red-500 rounded-full animate-ping absolute" />
                          <div className="w-8 h-8 bg-red-600 border border-red-400 rounded-full flex items-center justify-center shadow-2xl relative glow-red">
                            <AlertOctagon className="w-5 h-5 text-white" />
                          </div>
                          <span className="bg-slate-950 border border-red-500/50 text-red-300 px-3 py-1 rounded text-xs font-mono mt-2 font-bold">
                            TARGET LOCATION: {selectedIncident.location}
                          </span>
                        </div>
                        <button
                          onClick={() => setIsLivePursuitActive(true)}
                          className="absolute top-3 right-3 px-3 py-1.5 bg-brand-gold text-brand-dark font-mono font-bold text-xs rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                          Open Turn-by-Turn Guidance
                        </button>
                      </div>
                    )}

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 5)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Adjust Dispatch Units
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 7)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        UNITS ARRIVED — PROCEED TO ON-SCENE TRIAGE
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 7: ON-SCENE TRIAGE */}
                {currentStage === 7 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 7 — ON-SCENE TRIAGE & PHYSICAL VERIFICATION</h4>
                        <p className="text-xs text-emerald-200 font-mono">Confirm Learner Safety Status & Conduct Physical Site Protocol</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono rounded-full font-bold">
                        ON-SCENE TRIAGE
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {[
                        { key: 'located', label: 'Learner Physically Located & Identity Confirmed' },
                        { key: 'secured', label: 'Learner Physical Safety & Perimeter Secured' },
                        { key: 'medical', label: 'Medical Triage Completed (No Acute Injury)' },
                        { key: 'saps_scene', label: 'SAPS / Security Responders On-Scene Confirmed' },
                        { key: 'guardian_notify', label: 'Guardian Updated of Physical Safety Status' },
                        { key: 'evidence_collected', label: 'On-Scene Photographs & Evidence Logs Uploaded' },
                      ].map((item) => {
                        const isChecked = onSceneChecklist[selectedIncident.id]?.[item.key] || false;
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleToggleOnScene(selectedIncident.id, item.key)}
                            className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isChecked ? 'bg-emerald-900/40 border-emerald-400 text-white' : 'bg-brand-dark/70 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CheckSquare className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`} />
                              {item.label}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                              {isChecked ? 'COMPLETED' : 'PENDING'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => updateStage(selectedIncident.id, 6)}
                        className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-400 hover:text-white rounded-lg text-xs font-mono"
                      >
                        Back to Live Pursuit
                      </button>

                      <button
                        onClick={() => updateStage(selectedIncident.id, 8)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-extrabold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        PROCEED TO CASE RESOLUTION & HANDOVER
                      </button>
                    </div>
                  </div>
                )}

                {/* STAGE 8: RESOLUTION */}
                {currentStage === 8 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 8 — CASE RESOLUTION & GUARDIAN HANDOVER</h4>
                        <p className="text-xs text-emerald-200 font-mono">Final Handover Signature & Responder Stand-down Protocol</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono rounded-full font-bold">
                        RESOLUTION HANDOVER
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {[
                        { key: 'handover', label: 'Learner Safely Handed Over to Guardian / School Authority' },
                        { key: 'stood_down', label: 'All Emergency Response Units Formally Stood Down' },
                        { key: 'notes_complete', label: 'Final Operational Case Summary Documented' },
                      ].map((item) => {
                        const isChecked = resolutionChecklist[selectedIncident.id]?.[item.key] || false;
                        return (
                          <button
                            key={item.key}
                            onClick={() => handleToggleResolution(selectedIncident.id, item.key)}
                            className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isChecked ? 'bg-emerald-900/40 border-emerald-400 text-white' : 'bg-brand-dark/70 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <CheckSquare className={`w-4 h-4 ${isChecked ? 'text-emerald-400' : 'text-slate-600'}`} />
                              {item.label}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-900 text-slate-500'}`}>
                              {isChecked ? 'VERIFIED' : 'PENDING'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <form onSubmit={handleResolveSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        required
                        value={resolutionInput}
                        onChange={(e) => setResolutionInput(e.target.value)}
                        placeholder="Enter official resolution notes & supervisor sign-off details..."
                        className="flex-1 bg-brand-dark border border-brand-gold/30 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-gold"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs uppercase rounded cursor-pointer transition-all"
                      >
                        CLOSE CASE & GENERATE REPORT
                      </button>
                    </form>
                  </div>
                )}

                {/* STAGE 9: REPORT & ARCHIVE */}
                {currentStage === 9 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-brand-gold/30 pb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">STAGE 9 — OFFICIAL DIGITAL INCIDENT REPORT & AUDIT ARCHIVE</h4>
                        <p className="text-xs text-brand-silver font-mono">POPIA-Encrypted Case File · Ready for Judicial & Institutional Audit</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono rounded-full font-bold">
                        CASE RESOLVED & ARCHIVED
                      </span>
                    </div>

                    <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/20 space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-brand-gold font-bold">OFFICIAL CASE SUMMARY</span>
                        <span className="text-slate-400 text-[10px]">CASE HASH: #ZA-904-88A</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Learner</span>
                          <strong className="text-white">{selectedIncident.learnerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Assigned Officer</span>
                          <strong className="text-white">{selectedIncident.assignedOfficer}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Total Resolution Time</span>
                          <strong className="text-emerald-400">11 Minutes (SLA Passed)</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Security Class</span>
                          <strong className="text-brand-gold">POPIA ENCRYPTED</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3 justify-end">
                      <button
                        onClick={() => alert(`Official Incident PDF File (#${selectedIncident.id}) generated and saved to audit vault.`)}
                        className="px-5 py-2.5 bg-brand-navy border border-brand-gold hover:bg-brand-gold hover:text-brand-dark text-brand-gold font-mono font-bold text-xs uppercase rounded-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Download className="w-4 h-4" />
                        DOWNLOAD OFFICIAL PDF REPORT
                      </button>

                      <button
                        onClick={() => alert(`Case #${selectedIncident.id} successfully moved to Sovereign Permanent Archive.`)}
                        className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark font-mono font-bold text-xs uppercase rounded-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Lock className="w-4 h-4" />
                        ARCHIVE CASE FILE
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* TIMELINE LOGS WITH CLICKABLE DETAIL INVERTER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Clickable Timeline Logs */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest flex items-center justify-between">
                    <span>Interactive Operational Timeline Logs</span>
                    <span className="text-[9px] text-slate-400 font-normal">Click log entry for audit detail</span>
                  </h4>
                  
                  <div className="space-y-2 border-l-2 border-brand-gold/25 ml-2.5 pl-4 py-1.5 text-xs font-mono">
                    {selectedIncident.timeline.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTimelineIdx(selectedTimelineIdx === idx ? null : idx)}
                        className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer block relative ${
                          selectedTimelineIdx === idx ? 'bg-brand-navy-light border-brand-gold text-white' : 'bg-brand-dark/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="absolute -left-[23px] top-3 w-2.5 h-2.5 bg-brand-gold rounded-full border border-brand-navy" />
                        <div className="flex justify-between items-center">
                          <strong className="text-brand-gold">{item.time}</strong>
                          <span className="text-[9px] text-slate-400">Click to expand</span>
                        </div>
                        <p className="mt-0.5">{item.description}</p>
                        
                        {selectedTimelineIdx === idx && (
                          <div className="mt-2 pt-2 border-t border-brand-gold/20 text-[10px] text-slate-300 space-y-1 bg-brand-dark/90 p-2 rounded">
                            <div>Operator ID: <strong className="text-white">OP-SOUTH-904</strong></div>
                            <div>Device GPS Lock: <strong className="text-white">{selectedIncident.latitude.toFixed(5)}, {selectedIncident.longitude.toFixed(5)}</strong></div>
                            <div>Cryptographic Audit Signature: <strong className="text-emerald-400 font-mono">SHA256: 9f8a...302e</strong></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Evidence & Case Notes */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest">
                    Evidence Notes & Operational Communications
                  </h4>
                  <div className="p-3 bg-brand-dark/85 border border-slate-800 rounded-xl max-h-[220px] overflow-y-auto space-y-2 text-[11px] font-mono text-slate-300">
                    {selectedIncident.evidenceNotes.map((note, idx) => (
                      <div key={idx} className="flex gap-2 border-b border-slate-900 pb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
                        <p>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">
            Awaiting selection from Case Queue.
          </div>
        )}

      </main>

      {/* Designated Learner Safety Intervention & Escalation Modal */}
      {interventionLearner && (
        <LearnerInterventionModal
          learner={interventionLearner}
          isOpen={!!interventionLearner}
          onClose={() => setInterventionLearner(null)}
          onResolveAlert={(learnerId, notes) => {
            onResolveIncident(selectedIncident.id, notes);
            setInterventionLearner(null);
          }}
          onEscalateDispatch={(incident) => {
            onUpdateIncidentStatus(selectedIncident.id, 'Dispatched');
            setInterventionLearner(null);
          }}
        />
      )}
    </div>
  );
}
