import React, { useState } from 'react';
import { 
  Navigation, MapPin, ShieldAlert, CheckCircle2, Phone, AlertTriangle, 
  Camera, CheckSquare, Clock, FileText, ArrowUpRight, ChevronRight, UserCheck, Shield
} from 'lucide-react';
import { IncidentTicket, Learner } from '../types';

interface ResponderViewProps {
  incident: IncidentTicket;
  learner?: Learner;
  onUpdateIncident: (updatedIncident: IncidentTicket) => void;
}

export function ResponderView({ incident, learner, onUpdateIncident }: ResponderViewProps) {
  const [evidenceNoteInput, setEvidenceNoteInput] = useState('');
  const [capturedEvidenceList, setCapturedEvidenceList] = useState(incident.capturedEvidence || []);
  const [isNavigating, setIsNavigating] = useState(true);

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        No active incident assigned to responder unit.
      </div>
    );
  }

  const isArrivalConfirmed = incident.responderArrivalConfirmed || incident.status === 'On Scene' || incident.status === 'Resolved';

  const handleConfirmArrival = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: 'Responder Unit arrived on scene at GPS coordinates.', roleScope: 'all' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      status: 'On Scene',
      responderArrivalConfirmed: true,
      latestVerifiedUpdate: 'Emergency responder has arrived on scene. Assessing learner safety.',
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
  };

  const handleToggleSceneItem = (itemId: string) => {
    const defaultScene = [
      { id: 'sc1', label: 'Verify physical safety of learner', completed: false },
      { id: 'sc2', label: 'Contact Command Centre on radio', completed: false },
      { id: 'sc3', label: 'Establish secure perimeter', completed: false }
    ];
    const currentList: { id: string; label: string; completed: boolean }[] = 
      Array.isArray(incident.sceneChecklist) ? incident.sceneChecklist : defaultScene;

    const updatedChecklist = currentList.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updated: IncidentTicket = {
      ...incident,
      sceneChecklist: updatedChecklist
    };

    onUpdateIncident(updated);
  };

  const handleToggleResolutionItem = (itemId: string) => {
    const defaultResolution = [
      { id: 'rc1', label: 'Learner handed over to authorized guardian/school', completed: false },
      { id: 'rc2', label: 'Incident summary signed off by SAPS officer', completed: false }
    ];
    const currentList: { id: string; label: string; completed: boolean }[] = 
      Array.isArray(incident.resolutionChecklist) ? incident.resolutionChecklist : defaultResolution;

    const updatedChecklist = currentList.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const allCompleted = updatedChecklist.every(i => i.completed);

    const updated: IncidentTicket = {
      ...incident,
      resolutionChecklist: updatedChecklist,
      status: allCompleted ? 'Resolved' : incident.status
    };

    onUpdateIncident(updated);
  };

  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceNoteInput.trim()) return;

    const newEvidence = {
      id: `ev-${Date.now()}`,
      description: evidenceNoteInput.trim(),
      timestamp: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedEvidence = [...capturedEvidenceList, newEvidence];
    setCapturedEvidenceList(updatedEvidence);

    const updated: IncidentTicket = {
      ...incident,
      capturedEvidence: updatedEvidence,
      evidenceNotes: [...(incident.evidenceNotes || []), evidenceNoteInput.trim()]
    };

    onUpdateIncident(updated);
    setEvidenceNoteInput('');
  };

  return (
    <div className="bg-brand-dark p-6 space-y-6 w-full font-sans text-white border border-brand-gold/20 rounded-2xl shadow-2xl" id="responder-view-workspace">
      
      {/* Header Bar */}
      <div className="bg-brand-navy border-2 border-brand-gold/40 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-950 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-red-600 text-white font-mono px-2 py-0.5 rounded font-bold uppercase">
                {incident.priority || 'CRITICAL'} PRIORITY DISPATCH
              </span>
              <span className="text-xs bg-brand-gold/20 text-brand-gold border border-brand-gold/40 font-mono px-2 py-0.5 rounded uppercase">
                {incident.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Assigned: {incident.assignedOfficer || 'SAPS Unit 4B'}
              </span>
            </div>
            <h2 className="text-xl font-bold font-sans mt-1 text-white">
              Tactical Field Responder Workspace
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Synchronized Live Navigation & On-Scene Operations · Zero Commercial Exposure
            </p>
          </div>
        </div>

        {/* Arrival Confirmation CTA */}
        <div>
          {!isArrivalConfirmed ? (
            <button
              onClick={handleConfirmArrival}
              className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-mono font-bold text-xs uppercase rounded-xl shadow-lg border border-emerald-400 flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              CONFIRM SCENE ARRIVAL
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              RESPONDER ON SCENE (GPS VERIFIED)
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Navigation & Learner Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Turn-by-Turn Navigation & GPS Destination */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-navy p-5 rounded-xl border border-brand-navy-light space-y-4">
            <div className="flex items-center justify-between border-b border-brand-navy-light pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-brand-gold animate-pulse" />
                <h3 className="font-bold text-white uppercase text-sm font-mono">
                  GPS Destination & Tactical Route Guidance
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                ETA: {incident.responderEtaMinutes || 4} MINS · GPS Accuracy: ±{incident.gpsAccuracyMeters || 4}m
              </span>
            </div>

            {/* Destination Coordinates Card */}
            <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/30 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white">{incident.location}</span>
                <span className="text-slate-400">({incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)})</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${incident.latitude},${incident.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
              >
                External GPS Nav <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            {/* Interactive Turn-by-Turn Simulation Panel */}
            <div className="p-4 bg-brand-dark/95 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase">
                <span>Active Routing Engine</span>
                <span className="text-brand-gold">Vodacom Sovereign APN Grid</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-brand-navy rounded-lg border-l-4 border-brand-gold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-brand-gold transform rotate-45" />
                    <span className="text-white font-bold">In 350m: Turn Right onto Empire Road (M71)</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">1.2 km remaining</span>
                </div>
                <div className="p-2 bg-brand-navy/60 rounded-lg flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                    <span>Proceed 800m towards Parktown Campus Gate 2</span>
                  </div>
                  <span className="text-[10px]">400m remaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scene & Resolution Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Scene Checklist */}
            <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckSquare className="w-4 h-4 text-brand-gold" />
                <h4 className="font-bold text-white uppercase text-xs">
                  Scene Assessment Checklist
                </h4>
              </div>
              <div className="space-y-2">
                {(Array.isArray(incident.sceneChecklist) ? incident.sceneChecklist : [
                  { id: 'sc1', label: 'Verify physical safety of learner', completed: false },
                  { id: 'sc2', label: 'Contact Command Centre on radio', completed: false },
                  { id: 'sc3', label: 'Establish secure perimeter', completed: false }
                ]).map((item: { id: string; label: string; completed: boolean }) => (
                  <label 
                    key={item.id}
                    onClick={() => handleToggleSceneItem(item.id)}
                    className="flex items-center gap-2 p-2 bg-brand-dark rounded-lg border border-slate-800 hover:border-brand-gold/40 cursor-pointer transition-all"
                  >
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      readOnly 
                      className="accent-brand-gold rounded" 
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resolution Checklist */}
            <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white uppercase text-xs">
                  Resolution & Handover Checklist
                </h4>
              </div>
              <div className="space-y-2">
                {(Array.isArray(incident.resolutionChecklist) ? incident.resolutionChecklist : [
                  { id: 'rc1', label: 'Learner handed over to authorized guardian/school', completed: false },
                  { id: 'rc2', label: 'Incident summary signed off by SAPS officer', completed: false }
                ]).map((item: { id: string; label: string; completed: boolean }) => (
                  <label 
                    key={item.id}
                    onClick={() => handleToggleResolutionItem(item.id)}
                    className="flex items-center gap-2 p-2 bg-brand-dark rounded-lg border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
                  >
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      readOnly 
                      className="accent-emerald-400 rounded" 
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Evidence Capture Form */}
          <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Camera className="w-4 h-4 text-brand-gold" />
              <h4 className="font-bold text-white uppercase text-xs">
                Field Evidence & Photo Note Capture
              </h4>
            </div>

            <form onSubmit={handleAddEvidence} className="flex gap-2">
              <input
                type="text"
                placeholder="Log field observation or evidence detail..."
                value={evidenceNoteInput}
                onChange={e => setEvidenceNoteInput(e.target.value)}
                className="flex-1 bg-brand-dark border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-gold text-brand-dark font-bold uppercase rounded-xl hover:bg-brand-gold-light transition-all cursor-pointer"
              >
                Log Evidence
              </button>
            </form>

            {capturedEvidenceList.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-slate-400 uppercase block">Captured Evidence Audit Entries:</span>
                {capturedEvidenceList.map(item => (
                  <div key={item.id} className="p-2 bg-brand-dark rounded-lg border border-slate-800 text-slate-300 flex items-center justify-between">
                    <span>• {item.description}</span>
                    <span className="text-[10px] text-brand-gold">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 col): Learner Description & Emergency Contacts */}
        <div className="space-y-6">
          
          {/* Learner Card */}
          <div className="bg-brand-navy p-5 rounded-xl border border-brand-gold/30 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={learner?.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face'}
                alt={incident.learnerName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-brand-gold shadow-md"
              />
              <div>
                <h3 className="font-bold text-lg text-white font-sans">{incident.learnerName}</h3>
                <span className="text-xs text-brand-gold font-mono block">{incident.schoolName}</span>
                <span className="text-[10px] text-slate-400 font-mono">Tracker: {learner?.trackerSerial || 'ITIS-TRK-99081'}</span>
              </div>
            </div>

            {/* Medical Warnings */}
            <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl space-y-1 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                Medical Warnings
              </div>
              <p className="text-slate-200">
                {learner?.medicalConditions || 'Asthma (Inhaler in front backpack pocket). O-Positive Blood.'}
              </p>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-2 pt-2 border-t border-brand-navy-light font-mono text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Direct Emergency Contacts
              </span>

              <a
                href={`tel:${incident.guardianName}`}
                className="p-2.5 bg-brand-dark hover:bg-brand-dark/80 border border-slate-800 hover:border-brand-gold/40 rounded-xl flex items-center justify-between text-slate-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block text-xs">{incident.guardianName}</span>
                    <span className="text-[10px] text-slate-400">Guardian Contact</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href={`tel:${incident.schoolName}`}
                className="p-2.5 bg-brand-dark hover:bg-brand-dark/80 border border-slate-800 hover:border-brand-gold/40 rounded-xl flex items-center justify-between text-slate-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <div>
                    <span className="font-bold text-white block text-xs">{incident.schoolName} Admin</span>
                    <span className="text-[10px] text-slate-400">School Safety Officer</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Operational Timeline Milestones */}
          <div className="bg-brand-navy p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              Responder Operational Milestones
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {(incident.timeline || []).map((t, idx) => (
                <div key={idx} className="p-2 bg-brand-dark rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-brand-gold font-bold">{t.time}</span>
                  <p className="text-slate-300 mt-0.5">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
