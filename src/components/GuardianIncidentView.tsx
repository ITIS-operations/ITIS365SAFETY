import React, { useState } from 'react';
import { 
  ShieldAlert, MapPin, Phone, Heart, CheckCircle2, Clock, 
  Send, AlertTriangle, ShieldCheck, ChevronRight, MessageSquare, Info
} from 'lucide-react';
import { IncidentTicket, Learner } from '../types';
import { FamilySafetyTimeline } from './FamilySafetyTimeline';

interface GuardianIncidentViewProps {
  incident: IncidentTicket;
  learner: Learner;
  onUpdateIncident?: (updatedIncident: IncidentTicket) => void;
}

export function GuardianIncidentView({ incident, learner, onUpdateIncident }: GuardianIncidentViewProps) {
  const [guardianNoteInput, setGuardianNoteInput] = useState('');
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);

  if (!incident) return null;

  const handleAddGuardianNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianNoteInput.trim()) return;

    const newNote = `Guardian Note (${new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}): ${guardianNoteInput.trim()}`;
    const updatedNotes = [...(incident.guardianNotes || []), newNote];

    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }), description: `Guardian provided update: "${guardianNoteInput.trim()}"`, roleScope: 'guardian' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      guardianNotes: updatedNotes,
      timeline: updatedTimeline
    };

    if (onUpdateIncident) {
      onUpdateIncident(updated);
    }

    setGuardianNoteInput('');
    setNoteSentSuccess(true);
    setTimeout(() => setNoteSentSuccess(false), 4000);
  };

  // Reassuring stage progress calculation for Guardians
  const isDispatched = incident.status === 'Dispatched' || incident.status === 'On Scene' || incident.status === 'Resolved';
  const isOnScene = incident.status === 'On Scene' || incident.status === 'Resolved';
  const isResolved = incident.status === 'Resolved';

  return (
    <div className="bg-brand-navy p-6 rounded-2xl border-2 border-brand-gold/40 shadow-2xl space-y-6 w-full font-sans text-white" id="guardian-incident-view-panel">
      
      {/* Upper Status Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-950 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-brand-gold text-brand-dark font-mono font-bold px-2 py-0.5 rounded">
                INCIDENT {incident.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                isResolved 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                  : isOnScene 
                  ? 'bg-blue-950 text-blue-300 border border-blue-500/30' 
                  : 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse'
              }`}>
                {isResolved ? 'SITUATION RESOLVED & SAFE' : isOnScene ? 'RESPONDER ON SCENE' : 'DISPATCH ACTIVE'}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              Live Guardian Incident Workspace
            </h2>
            <p className="text-xs text-brand-silver font-mono">
              Synchronized Real-Time Updates from ITIS National Operations Command Centre
            </p>
          </div>
        </div>

        {/* Time Opened & Latest Verified Update */}
        <div className="text-right font-mono text-xs text-slate-300">
          <span className="text-slate-400 block">Time Opened: {incident.time}</span>
          <span className="text-brand-gold font-bold">
            ETA Responder Arrival: {incident.responderEtaMinutes ? `${incident.responderEtaMinutes} Mins` : '4 Mins'}
          </span>
        </div>
      </div>

      {/* Progress Step Bar (Reassuring, Simple) */}
      <div className="p-4 bg-brand-dark/95 rounded-xl border border-brand-gold/20 space-y-3 font-mono">
        <span className="text-xs text-slate-400 uppercase tracking-wider block font-bold">
          Incident Progress & Safety Milestone
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-emerald-300 font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            1. SOS Triggered
          </div>
          <div className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
            isDispatched 
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
              : 'bg-brand-navy text-slate-400 border border-slate-800'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${isDispatched ? 'text-emerald-400' : 'text-slate-600'}`} />
            2. Unit Dispatched
          </div>
          <div className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
            isOnScene 
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
              : 'bg-brand-navy text-slate-400 border border-slate-800'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${isOnScene ? 'text-emerald-400' : 'text-slate-600'}`} />
            3. On Scene Verified
          </div>
          <div className={`p-2.5 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
            isResolved 
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
              : 'bg-brand-navy text-slate-400 border border-slate-800'
          }`}>
            <ShieldCheck className={`w-4 h-4 ${isResolved ? 'text-emerald-400' : 'text-slate-600'}`} />
            4. Resolved / Safe
          </div>
        </div>
      </div>

      {/* Grid: Child Information & Verified Location Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (2 cols): Child Photo, Location & Latest Verified Message */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Child Card */}
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={learner.photoUrl} 
                alt={learner.name} 
                className="w-16 h-16 rounded-xl object-cover border-2 border-brand-gold shadow-md" 
              />
              <div>
                <h3 className="text-lg font-bold text-white font-sans">{learner.name}</h3>
                <span className="text-xs text-brand-gold font-mono block">{learner.school} · {learner.grade}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Device Battery: {incident.deviceBatteryLevel || learner.deviceBattery}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/25 text-right font-mono text-xs">
              <span className="text-slate-400 block text-[10px]">Verified Location</span>
              <span className="text-white font-bold block">{incident.location}</span>
            </div>
          </div>

          {/* Simple Map Placeholder / Coordinates Box */}
          <div className="p-5 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 animate-bounce" />
                <span className="font-bold text-white uppercase">Current Verified Child Location Map</span>
              </div>
              <span className="text-emerald-400 text-[10px] font-bold">
                Live Geofence Locked
              </span>
            </div>

            <div className="h-44 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
              {/* Simple Clean Guardian Map Canvas Simulation */}
              <div className="absolute inset-0 bg-slate-950 opacity-90 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <div className="w-10 h-10 bg-red-600/30 border-2 border-red-500 rounded-full flex items-center justify-center animate-ping">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-xs text-white font-bold font-sans">
                  {learner.name} is located at {incident.location}
                </p>
                <p className="text-[10px] text-brand-gold">
                  GPS Coordinates: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Verified Update Banner */}
          <div className="p-4 bg-brand-dark border-l-4 border-brand-gold rounded-xl space-y-1 font-mono text-xs">
            <span className="text-brand-gold font-bold uppercase text-[10px] flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Latest Verified Operations Update
            </span>
            <p className="text-slate-200 text-sm font-sans font-medium">
              "{incident.latestVerifiedUpdate || 'Command Centre operator is in direct contact with nearby emergency response units. Location is locked and monitored continuously.'}"
            </p>
          </div>

          {/* Reassuring Family Safety Timeline */}
          <FamilySafetyTimeline incident={incident} />

        </div>

        {/* Right Col (1 col): Emergency Contacts, Medical Info, Guardian Notes */}
        <div className="space-y-6 font-mono text-xs">
          
          {/* Emergency Contact Action Bar */}
          <div className="p-4 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-3">
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
              Emergency Contact Buttons
            </span>

            <div className="space-y-2">
              <a 
                href="tel:08000010111" 
                className="w-full p-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Command Centre</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a 
                href="tel:10111" 
                className="w-full p-2.5 bg-brand-navy hover:bg-brand-navy-light border border-slate-800 text-slate-200 font-bold rounded-xl flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>Call SAPS (10111)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a 
                href="tel:10177" 
                className="w-full p-2.5 bg-brand-navy hover:bg-brand-navy-light border border-slate-800 text-slate-200 font-bold rounded-xl flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call EMS Ambulance (10177)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>

              <a 
                href={`tel:${learner.school}`} 
                className="w-full p-2.5 bg-brand-navy hover:bg-brand-navy-light border border-slate-800 text-slate-200 font-bold rounded-xl flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>Call School Admin</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Medical Information */}
          <div className="p-4 bg-brand-dark rounded-xl border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-xs">
              <Heart className="w-4 h-4" />
              Medical Information
            </div>
            <p className="text-slate-300">
              {learner.medicalConditions || 'Asthma (Emergency inhaler in front backpack pocket). O-Positive Blood.'}
            </p>
          </div>

          {/* Guardian Notes Form */}
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold uppercase text-xs">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              Send Note to Command Centre
            </div>

            <form onSubmit={handleAddGuardianNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Type additional information or special instructions for the command centre operator..."
                value={guardianNoteInput}
                onChange={e => setGuardianNoteInput(e.target.value)}
                className="w-full bg-brand-navy border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Send Guardian Note
              </button>
            </form>

            {noteSentSuccess && (
              <p className="text-emerald-400 text-[10px] font-bold text-center">
                ✓ Note transmitted to Command Centre Operator.
              </p>
            )}

            {incident.guardianNotes && incident.guardianNotes.length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] text-slate-400 uppercase block">Your Logged Notes:</span>
                {incident.guardianNotes.map((note, idx) => (
                  <p key={idx} className="p-2 bg-brand-navy rounded text-slate-300 text-[11px]">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
