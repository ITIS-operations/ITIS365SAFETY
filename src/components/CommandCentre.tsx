import React, { useState } from 'react';
import { 
  Shield, Map, Radio, AlertOctagon, Heart, Server, Globe2, Activity, ShieldAlert,
  Sliders, MessageSquare, CornerDownRight, ThumbsUp, Landmark, Calendar, MapPin, Eye, Play, Search, CloudSun, Navigation
} from 'lucide-react';
import { Learner, IncidentTicket, NationalStats, mockNationalStats, SafeZone, SafetyAlert } from '../types';
import { LivePursuitNavigation } from './LivePursuitNavigation';

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
  const [activeSubTab, setActiveSubTab] = useState<'incidents' | 'national' | 'risk'>('incidents');
  const [isLivePursuitActive, setIsLivePursuitActive] = useState(false);

  // Filtered list
  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0];

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !resolutionInput.trim()) return;

    onResolveIncident(selectedIncident.id, resolutionInput.trim());
    setResolutionInput('');
    alert(`Case ${selectedIncident.id} successfully marked as RESOLVED.`);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-brand-dark min-h-screen text-slate-100" id="command-centre-layout">
      
      {/* Sidebar: Incident Case list & search */}
      <aside className="w-full md:w-80 bg-brand-navy border-r border-brand-gold/15 flex flex-col" id="command-centre-sidebar">
        {/* Toggle between incident active feeds and national metrics */}
        <div className="grid grid-cols-3 border-b border-brand-gold/15 text-[11px] font-mono font-bold tracking-wider uppercase text-center bg-brand-dark/40">
          <button 
            onClick={() => setActiveSubTab('incidents')}
            className={`py-3 ${activeSubTab === 'incidents' ? 'bg-brand-gold text-brand-dark' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            Live Cases
          </button>
          <button 
            onClick={() => setActiveSubTab('national')}
            className={`py-3 ${activeSubTab === 'national' ? 'bg-brand-gold text-brand-dark' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            National Stats
          </button>
          <button 
            onClick={() => setActiveSubTab('risk')}
            className={`py-3 ${activeSubTab === 'risk' ? 'bg-brand-gold text-brand-dark' : 'text-brand-silver hover:bg-brand-navy-light'}`}
          >
            AI Risks
          </button>
        </div>

        {activeSubTab === 'incidents' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-brand-gold/10">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-brand-gold/60" />
                <input
                  type="text"
                  placeholder="Search Incident Cases..."
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
                .map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedIncidentId === inc.id ? 'bg-brand-navy-light/80 border-brand-gold glow-gold' : 'bg-brand-dark/50 border-slate-800/80 hover:border-slate-700'}`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-brand-gold">{inc.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${
                        inc.status === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                        inc.status === 'Reported' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' :
                        'bg-red-950 text-red-400 border border-red-500/30 animate-pulse'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <strong className="text-white text-xs block truncate">{inc.learnerName}</strong>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
                      <span>Category: {inc.category}</span>
                      <span>{inc.time}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {activeSubTab === 'national' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono" id="command-national-stats">
            <h4 className="text-[10px] uppercase text-brand-gold tracking-widest border-b border-slate-800 pb-2">National Executive Feed</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Connected Wearables</span>
                <strong className="text-md text-slate-200">{mockNationalStats.totalLearnersConnected.toLocaleString()} Devices</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Joint Active Schools</span>
                <strong className="text-md text-slate-200">{mockNationalStats.schoolsConnectedCount} online</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Emergency Dispatch ETA</span>
                <strong className="text-md text-emerald-400">{mockNationalStats.avgResponseTimeMin} minutes (Joint Avg)</strong>
              </div>
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/10">
                <span className="block text-[9px] text-slate-500">Incident Recovery Rate</span>
                <strong className="text-md text-emerald-400">{mockNationalStats.recoveryRatePercent}% Successful</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h5 className="text-[9px] text-brand-gold uppercase tracking-widest mb-2">Provincial Ranking Rating</h5>
              <div className="space-y-2 text-[10px] text-brand-silver">
                {mockNationalStats.provinceRankings.map((prov, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-900 pb-1">
                    <span>{prov.province}</span>
                    <span className="font-bold text-slate-300">{prov.activeDevices.toLocaleString()} devs ({prov.rating}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'risk' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans" id="command-ai-risks">
            <h4 className="text-[10px] uppercase text-brand-gold tracking-widest border-b border-slate-800 pb-2 font-mono">Cognitive Threat Prediction</h4>
            
            <div className="space-y-2.5">
              <div className="p-3 bg-yellow-950/20 border border-yellow-500/30 rounded-xl space-y-1">
                <strong className="text-yellow-400 text-xs flex items-center gap-1">
                  ⚠️ Heavy Traffic Congestion: Smit St
                </strong>
                <p className="text-[10px] text-slate-300">Congestion increases pedestrian delays near Gauteng High. Tracking coordinates alert on delayed arrivals.</p>
              </div>

              <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-1">
                <strong className="text-blue-400 text-xs flex items-center gap-1">
                  ⛈ Storm Front: Johannesburg South
                </strong>
                <p className="text-[10px] text-slate-300">Weather radar signals high rain probability between 14:00 - 17:00. High safety scoring buffer active on transit buses.</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6" id="command-centre-main">
        
        {/* Workspace telemetry ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
          <div>
            <h2 className="text-xl font-bold font-sans tracking-wide text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-gold" /> Joint Operations Command Centre
            </h2>
            <p className="text-xs text-brand-silver">
              National Security Portal · Coordinating <strong className="text-brand-gold">SAPS Tactical Units</strong> and <strong className="text-brand-gold">Emergency Responders</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-brand-navy border border-brand-gold/20 px-4 py-2.5 rounded-xl text-xs font-mono text-brand-silver">
            <CloudSun className="w-4 h-4 text-brand-gold" />
            <span>Johannesburg weather: <strong className="text-white font-bold">18°C · Rainy</strong></span>
          </div>
        </div>

        {/* Selected Incident Details view */}
        {selectedIncident ? (
          <div className="space-y-6" id="incident-workspace-detail">
            
            {/* Header detail card */}
            <div className="glass-panel-heavy p-5 rounded-2xl relative border-t-2 border-brand-gold space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="font-mono text-xs text-brand-gold uppercase tracking-widest">Selected Incident Case File</span>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
                    {selectedIncident.id} · {selectedIncident.category}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Reported at: {selectedIncident.date} {selectedIncident.time}</p>
                </div>

                {/* Case status buttons */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-bold uppercase">
                  {(['Reported', 'Dispatched', 'On Scene', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateIncidentStatus(selectedIncident.id, st)}
                      className={`px-2.5 py-1.5 rounded transition-colors ${selectedIncident.status === st ? 'bg-brand-gold text-brand-dark' : 'bg-brand-navy hover:bg-brand-navy-light text-slate-400 border border-slate-800'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Case metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Target Learner</span>
                  <strong className="text-white text-xs">{selectedIncident.learnerName}</strong>
                </div>
                <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Assigned Campus</span>
                  <strong className="text-white text-xs">{selectedIncident.schoolName}</strong>
                </div>
                <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Registered Guardian</span>
                  <strong className="text-white text-xs">{selectedIncident.guardianName}</strong>
                </div>
                <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Assigned Officer</span>
                  <strong className="text-white text-xs">{selectedIncident.assignedOfficer}</strong>
                </div>
              </div>

              {/* Map header switcher */}
              <div className="flex justify-between items-center mt-4 mb-2">
                <h4 className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest">
                  {isLivePursuitActive ? '🛰️ Active Turn-By-Turn Intercept Radar' : '🗺️ Incident Tactical Location'}
                </h4>
                <button
                  onClick={() => setIsLivePursuitActive(!isLivePursuitActive)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isLivePursuitActive 
                      ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-lg glow-gold' 
                      : 'bg-brand-navy-heavy hover:bg-brand-navy border-brand-gold/20 text-brand-gold'
                  }`}
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLivePursuitActive ? 'animate-spin' : ''}`} style={isLivePursuitActive ? { animationDuration: '6s' } : undefined} />
                  <span>{isLivePursuitActive ? 'Show Incident Location Map' : 'Launch Live Pursuit Guidance'}</span>
                </button>
              </div>

              {isLivePursuitActive ? (
                <div className="bg-brand-dark border border-brand-gold/15 p-4 rounded-xl shadow-2xl">
                  <LivePursuitNavigation 
                    learners={learners}
                    safeZones={safeZones}
                    alerts={alerts}
                    onTriggerSOS={onTriggerSOS}
                    initialSelectedLearnerId={learners.find(l => l.name === selectedIncident?.learnerName)?.id || learners[0]?.id}
                  />
                </div>
              ) : (
                /* Geographic Live Map */
                <div className="relative bg-brand-dark border border-slate-800 rounded-xl h-56 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')` }} />
                  
                  {/* Target Pin HUD */}
                  <div className="absolute flex flex-col items-center">
                    <div className="w-10 h-10 bg-red-600/20 border-2 border-red-500 rounded-full animate-ping absolute" />
                    <div className="w-7 h-7 bg-red-600 border border-red-400 rounded-full flex items-center justify-center shadow-2xl relative glow-red">
                      <AlertOctagon className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-slate-950 border border-red-500/40 text-red-300 px-2 py-0.5 rounded text-[9px] font-mono mt-1">
                      Live Broadcast location: {selectedIncident.location}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-brand-navy-heavy p-2 rounded text-[9px] font-mono text-brand-silver">
                    CO-ORDINATE: {selectedIncident.latitude.toFixed(5)}, {selectedIncident.longitude.toFixed(5)}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Case Timeline Logs */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest">Incident Timeline Logs</h4>
                  <div className="space-y-2 border-l-2 border-brand-gold/25 ml-2.5 pl-4 py-1.5 text-xs font-mono">
                    {selectedIncident.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 bg-brand-gold rounded-full border border-brand-navy" />
                        <div>
                          <strong className="text-white">{item.time}</strong> — <span className="text-slate-300">{item.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence & Case logs collection */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono font-bold text-brand-gold tracking-widest">Evidence Notes & Communications</h4>
                  <div className="p-3 bg-brand-dark/85 border border-slate-800 rounded-xl max-h-[140px] overflow-y-auto space-y-2 text-[11px] font-mono text-slate-300">
                    {selectedIncident.evidenceNotes.map((note, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-brand-gold">✓</span>
                        <p>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Case resolution log dispatcher */}
              {selectedIncident.status !== 'Resolved' && (
                <div className="pt-4 border-t border-slate-800">
                  <form onSubmit={handleResolveSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={resolutionInput}
                      onChange={(e) => setResolutionInput(e.target.value)}
                      placeholder="Enter resolution notes, evidence findings, or closure status..."
                      className="flex-1 bg-brand-dark border border-brand-gold/25 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-gold text-white font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold text-xs uppercase rounded cursor-pointer"
                    >
                      RESOLVE CASE
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">
            Awaiting selection from Case File Feed.
          </div>
        )}

      </main>
    </div>
  );
}
