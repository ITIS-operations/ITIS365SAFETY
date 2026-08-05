import React, { useState } from 'react';
import { 
  Building2, Users, ShieldAlert, CheckSquare, Clock, Camera, 
  Send, Lock, Heart, Phone, FileText, CheckCircle2, AlertTriangle, 
  ChevronRight, UserCheck, Stethoscope, UserPlus, BellRing, Shield, UserX
} from 'lucide-react';
import { IncidentTicket, Learner } from '../types';

interface SchoolIncidentViewProps {
  incident: IncidentTicket;
  learner?: Learner;
  onUpdateIncident: (updatedIncident: IncidentTicket) => void;
  onUpdateLearnerStatus: (id: string, newStatus: Learner['status']) => void;
}

export function SchoolIncidentView({ 
  incident, 
  learner, 
  onUpdateIncident,
  onUpdateLearnerStatus 
}: SchoolIncidentViewProps) {
  const [observationInput, setObservationInput] = useState('');
  const [cctvNoteInput, setCctvNoteInput] = useState('');
  const [cctvCount, setCctvCount] = useState(incident.cctvEvidenceCount || 0);

  if (!incident) return null;

  const handleConfirmAttendance = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School Admin confirmed morning attendance for learner ${incident.learnerName} (Present on campus).`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      latestVerifiedUpdate: `School Admin verified physical attendance on campus for ${incident.learnerName}.`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    if (learner) {
      onUpdateLearnerStatus(learner.id, 'In School');
    }
  };

  const handleConfirmIdentity = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School Admin confirmed physical identity of learner ${incident.learnerName} via photo ID check.`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      latestVerifiedUpdate: `School Admin confirmed physical identity of ${incident.learnerName}. Learner safe in Admin Safe Room.`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    if (learner) {
      onUpdateLearnerStatus(learner.id, 'In School');
    }
  };

  const handleNotifyTeacher = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const teacherName = incident.teacherAssigned || 'Mrs. M. Van Zyl (Grade 9-A)';
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `Grade Teacher ${teacherName} notified of learner welfare status and dispatched to safe room.`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      teacherAssigned: `${teacherName} (Notified & Present)`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
  };

  const handleNotifyPrincipal = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School Principal notified of welfare incident and campus safety protocols activated.`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      principalNotified: true,
      latestVerifiedUpdate: `Principal briefed. Campus welfare protocols actively supervised.`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
  };

  const handleAssignNurse = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School Nurse Sister D. Khumalo assigned to conduct physical welfare check on ${incident.learnerName}.`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      schoolNurseStatus: 'Assigned - Conducting Check',
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
  };

  const handleConfirmPickup = () => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School confirmed authorized guardian pickup of learner ${incident.learnerName}.`, roleScope: 'all' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      parentContactedStatus: 'Contacted & Collected',
      status: 'Resolved',
      latestVerifiedUpdate: `Learner ${incident.learnerName} safely picked up by authorized guardian. Incident closed.`,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    if (learner) {
      onUpdateLearnerStatus(learner.id, 'At Home');
    }
  };

  const handleUpdateLockdownStatus = (status: 'Normal Operations' | 'Precautionary Lockdown' | 'Active Lockdown') => {
    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School Campus Lockdown status updated to: ${status}`, roleScope: 'all' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      schoolLockdownStatus: status,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
  };

  const handleAddObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observationInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const newNote = `[School Obs ${timeStr}]: ${observationInput.trim()}`;
    const updatedObs = [...(incident.schoolObservations || []), newNote];

    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School welfare observation logged: "${observationInput.trim()}"`, roleScope: 'school' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      schoolObservations: updatedObs,
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    setObservationInput('');
  };

  const handleUploadCCTV = (e: React.FormEvent) => {
    e.preventDefault();
    const newCount = cctvCount + 1;
    setCctvCount(newCount);

    const timeStr = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const cctvDetail = cctvNoteInput.trim() || `CCTV Feed Snapshot #${newCount} captured near Gate 1.`;

    const updatedTimeline = [
      ...(incident.timeline || []),
      { time: timeStr, description: `School CCTV Evidence Uploaded: ${cctvDetail}`, roleScope: 'all' }
    ];

    const updated: IncidentTicket = {
      ...incident,
      cctvEvidenceCount: newCount,
      evidenceNotes: [...(incident.evidenceNotes || []), `CCTV Evidence #${newCount}: ${cctvDetail}`],
      timeline: updatedTimeline
    };

    onUpdateIncident(updated);
    setCctvNoteInput('');
  };

  return (
    <div className="bg-brand-navy p-6 rounded-2xl border-2 border-brand-gold/40 shadow-2xl space-y-6 w-full font-sans text-white" id="school-incident-view-panel">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950 border border-blue-500/40 rounded-xl text-blue-300">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-brand-gold text-brand-dark font-mono font-bold px-2 py-0.5 rounded">
                INCIDENT {incident.id}
              </span>
              <span className="text-xs bg-blue-900/80 text-blue-200 border border-blue-400/40 font-mono px-2 py-0.5 rounded uppercase">
                {incident.schoolName}
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono px-2 py-0.5 rounded uppercase font-bold">
                School Welfare Scope
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              School Learner Welfare Incident Workspace
            </h2>
            <p className="text-xs text-brand-silver font-mono">
              Dedicated Campus Learner Welfare & Safety Monitoring · Tactical/Dispatch Controls Restricted
            </p>
          </div>
        </div>

        {/* Welfare Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleConfirmAttendance}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-bold rounded-xl border border-blue-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            CONFIRM ATTENDANCE
          </button>
          <button
            onClick={handleConfirmIdentity}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl border border-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONFIRM IDENTITY
          </button>
          <button
            onClick={handleConfirmPickup}
            className="px-3 py-1.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-dark" />
            CONFIRM SAFE PICKUP
          </button>
        </div>
      </div>

      {/* Primary Welfare Actions Toolbar */}
      <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
        <span className="text-brand-gold font-bold uppercase block text-[11px] border-b border-slate-800 pb-1">
          Learner Welfare Protocol Actions
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            onClick={handleNotifyTeacher}
            className="px-3 py-2 bg-brand-navy hover:bg-brand-navy-light border border-slate-700 text-slate-200 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            Notify Teacher
          </button>

          <button
            onClick={handleNotifyPrincipal}
            className="px-3 py-2 bg-brand-navy hover:bg-brand-navy-light border border-slate-700 text-slate-200 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Notify Principal
          </button>

          <button
            onClick={handleAssignNurse}
            className="px-3 py-2 bg-brand-navy hover:bg-brand-navy-light border border-slate-700 text-slate-200 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            Assign School Nurse
          </button>

          <button
            onClick={handleConfirmPickup}
            className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Confirm Safe Pickup
          </button>
        </div>
      </div>

      {/* Welfare Indicators Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Teacher Assigned</span>
          <span className="text-white font-bold block">{incident.teacherAssigned || 'Mrs. M. Van Zyl (Grade 9-A)'}</span>
        </div>

        <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Principal Briefed</span>
          <span className="text-emerald-400 font-bold block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {incident.principalNotified ? 'YES (CONFIRMED)' : 'NOTIFIED'}
          </span>
        </div>

        <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Parent Contact Status</span>
          <span className="text-brand-gold font-bold block">{incident.parentContactedStatus || 'Contacted'}</span>
        </div>

        <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">School Nurse Status</span>
          <span className="text-white font-bold block">{incident.schoolNurseStatus || 'Sister D. Khumalo (On Standby)'}</span>
        </div>
      </div>

      {/* Campus Lockdown Control Bar */}
      <div className="p-4 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-brand-gold font-bold uppercase flex items-center gap-1.5">
            <Lock className="w-4 h-4" /> Campus Lockdown Status Control
          </span>
          <span className={`px-2.5 py-0.5 rounded font-bold uppercase ${
            incident.schoolLockdownStatus === 'Active Lockdown'
              ? 'bg-red-950 text-red-300 border border-red-500 animate-pulse'
              : incident.schoolLockdownStatus === 'Precautionary Lockdown'
              ? 'bg-amber-950 text-amber-300 border border-amber-500'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
          }`}>
            Current: {incident.schoolLockdownStatus || 'Normal Operations'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleUpdateLockdownStatus('Normal Operations')}
            className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Set Normal Operations
          </button>
          <button
            onClick={() => handleUpdateLockdownStatus('Precautionary Lockdown')}
            className="px-3 py-1.5 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Set Precautionary Lockdown
          </button>
          <button
            onClick={() => handleUpdateLockdownStatus('Active Lockdown')}
            className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Set Active Lockdown
          </button>
        </div>
      </div>

      {/* Grid: Learner Profile & School Observations / CCTV Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Left Col: Learner Profile & Communication Log */}
        <div className="space-y-6">
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={learner?.photoUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face'}
                alt={incident.learnerName}
                className="w-14 h-14 rounded-xl object-cover border-2 border-brand-gold"
              />
              <div>
                <h3 className="font-bold text-white text-base font-sans">{incident.learnerName}</h3>
                <span className="text-slate-400 block">{incident.schoolName}</span>
                <span className="text-brand-gold text-[10px]">Guardian: {incident.guardianName}</span>
              </div>
            </div>

            <div className="p-3 bg-brand-navy rounded-lg border border-slate-800 space-y-1 text-[11px]">
              <span className="text-slate-400 block uppercase">Safe Room Location</span>
              <span className="text-white font-bold">{incident.safeRoomAssignment || 'Admin Safe Room B (West Wing)'}</span>
            </div>
          </div>

          {/* School Communication Log */}
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              School Welfare Communication Log
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(incident.timeline || []).map((t, idx) => (
                <div key={idx} className="p-2 bg-brand-navy/60 rounded-lg border border-slate-800 text-[11px]">
                  <span className="text-brand-gold font-bold">{t.time}</span>
                  <p className="text-slate-300 mt-0.5">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Add School Observations & Upload CCTV Evidence */}
        <div className="space-y-6">
          
          {/* Add Observations Form */}
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-brand-gold" />
              Add School Welfare Observation
            </h4>

            <form onSubmit={handleAddObservation} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Log physical welfare observations, teacher notes, or campus status..."
                value={observationInput}
                onChange={e => setObservationInput(e.target.value)}
                className="w-full bg-brand-navy border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Log Observation
              </button>
            </form>

            {incident.schoolObservations && incident.schoolObservations.length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] text-slate-400 uppercase block">Recorded School Observations:</span>
                {incident.schoolObservations.map((obs, idx) => (
                  <p key={idx} className="p-2 bg-brand-navy rounded text-slate-300 text-[11px]">
                    {obs}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Upload CCTV Evidence */}
          <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-gold" />
                Upload School CCTV Evidence
              </h4>
              <span className="text-[10px] text-brand-gold font-bold">
                Uploaded: {cctvCount} Clips
              </span>
            </div>

            <form onSubmit={handleUploadCCTV} className="space-y-2">
              <input
                type="text"
                placeholder="CCTV description (e.g. Gate 1 Perimeter Camera #3)..."
                value={cctvNoteInput}
                onChange={e => setCctvNoteInput(e.target.value)}
                className="w-full bg-brand-navy border border-slate-800 text-white p-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/40 text-brand-gold font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-3.5 h-3.5" /> Attach CCTV Evidence Snapshot
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

