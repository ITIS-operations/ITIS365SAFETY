import React, { useState } from 'react';
import { 
  Building2, Users, AlertTriangle, Radio, Send, CheckSquare, Calendar, Bus, Watch, Search, PlusCircle, Volume2, ShieldAlert 
} from 'lucide-react';
import { Learner, SafetyAlert, IncidentTicket } from '../types';
import { LearnerInterventionModal } from './LearnerInterventionModal';
import { SchoolIncidentView } from './SchoolIncidentView';

interface SchoolPortalProps {
  learners: Learner[];
  alerts: SafetyAlert[];
  incidents?: IncidentTicket[];
  onTriggerSOS: (learner: Learner) => void;
  onUpdateLearnerStatus: (id: string, newStatus: 'In School' | 'En Route' | 'At Home' | 'Emergency') => void;
  onAddAlert: (newAlert: SafetyAlert) => void;
  onUpdateIncident?: (updatedIncident: IncidentTicket) => void;
}

export function SchoolPortal({ 
  learners, 
  alerts, 
  incidents = [],
  onTriggerSOS, 
  onUpdateLearnerStatus, 
  onAddAlert,
  onUpdateIncident
}: SchoolPortalProps) {
  const [selectedLearnerForIntervention, setSelectedLearnerForIntervention] = useState<Learner | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'present' | 'absent' | 'late'>>({
    'l1': 'present',
    'l2': 'late'
  });

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [isDrillActive, setIsDrillActive] = useState(false);

  const toggleAttendance = (learnerId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [learnerId]: status
    }));

    // If marked absent, update learner status to reflect delay
    if (status === 'absent') {
      onUpdateLearnerStatus(learnerId, 'En Route');
    } else if (status === 'present') {
      onUpdateLearnerStatus(learnerId, 'In School');
    }
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeMessage) return;

    const newAlert: SafetyAlert = {
      id: `school-notice-${Date.now()}`,
      type: 'Weather Alert',
      severity: 'low',
      message: `[Gauteng High Notice]: ${noticeMessage}`,
      time: new Date().toISOString(),
      resolved: false
    };

    onAddAlert(newAlert);
    setNoticeTitle('');
    setNoticeMessage('');
    alert("Notice successfully broadcast to all registered Guardians and parents!");
  };

  const handleTriggerDrill = () => {
    setIsDrillActive(prev => !prev);
    
    // Dispatch system alerts on drill trigger
    const newAlert: SafetyAlert = {
      id: `drill-${Date.now()}`,
      type: 'Weather Alert',
      severity: isDrillActive ? 'low' : 'high',
      message: isDrillActive 
        ? "ITIS School Alert: Drill completed successfully. All learners safe & accounted for."
        : "⚠️ ITIS School Alert: Active emergency evacuation drill initialized at Gauteng High School.",
      time: new Date().toISOString(),
      resolved: isDrillActive
    };

    onAddAlert(newAlert);
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-brand-dark overflow-y-auto" id="school-portal-container">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-navy-light pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans tracking-wide text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-gold animate-pulse" /> School Management Terminal
          </h2>
          <p className="text-xs text-brand-silver">
            Gauteng High & Associated Primary campuses · Safety Command Link
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleTriggerDrill}
            className={`px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-xl uppercase transition-all flex items-center gap-2 ${isDrillActive ? 'bg-red-600 animate-pulse text-white' : 'bg-brand-navy border border-brand-gold/30 text-brand-gold hover:border-brand-gold'}`}
          >
            <Radio className="w-4 h-4" />
            {isDrillActive ? 'STOP EMERGENCY DRILL' : 'INITIATE SECURITY DRILL'}
          </button>
        </div>
      </div>

      {/* Synchronized School Learner Welfare Incident Workspace */}
      {(() => {
        const activeSchoolInc = incidents.find(inc => inc.status !== 'Resolved') || incidents[0];
        if (activeSchoolInc && onUpdateIncident) {
          const matchedL = learners.find(l => l.name === activeSchoolInc.learnerName) || learners[0];
          return (
            <SchoolIncidentView
              incident={activeSchoolInc}
              learner={matchedL}
              onUpdateIncident={onUpdateIncident}
              onUpdateLearnerStatus={onUpdateLearnerStatus}
            />
          );
        }
        return null;
      })()}

      {/* School KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="school-stats-kpi">
        <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10">
          <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest">Attendance Status</span>
          <strong className="text-2xl text-white font-mono">94.8%</strong>
          <p className="text-[10px] text-slate-500 mt-1">Average roll-call checkin</p>
        </div>
        <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10">
          <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest">Missing Learners</span>
          <strong className="text-2xl text-red-400 font-mono">1</strong>
          <p className="text-[10px] text-red-500 mt-1">Late / En Route over limit</p>
        </div>
        <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10">
          <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest">Active Devices Online</span>
          <strong className="text-2xl text-emerald-400 font-mono">418</strong>
          <p className="text-[10px] text-slate-500 mt-1">98.2% tracker sync OK</p>
        </div>
        <div className="p-4 bg-brand-navy rounded-2xl border border-brand-gold/10">
          <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-widest">Active Drills</span>
          <strong className="text-2xl text-brand-gold font-mono">{isDrillActive ? '1 Active' : '0'}</strong>
          <p className="text-[10px] text-slate-500 mt-1">SAPS / EMS sync ready</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: Teacher / Class Attendance Sheet */}
        <div className="md:col-span-2 glass-panel p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-gold" /> Class Attendance Roll-Call Terminals
            </h3>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-brand-dark border border-brand-gold/25 rounded px-2 py-1 text-[11px] text-brand-silver font-mono focus:outline-none"
            >
              <option value="All">All Grades</option>
              <option value="Grade 9-A">Grade 9-A</option>
              <option value="Grade 5-B">Grade 5-B</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {learners
              .filter(l => selectedGrade === 'All' || l.grade === selectedGrade)
              .map((l) => (
                <div 
                  key={l.id} 
                  className="p-3 bg-brand-navy-light/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={l.photoUrl} alt={l.name} className="w-10 h-10 rounded-full object-cover border border-brand-gold/10" />
                    <div>
                      <strong className="text-white block">{l.name}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{l.grade} · GPS Status: {l.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleAttendance(l.id, 'present')}
                      className={`px-2.5 py-1.5 rounded font-mono text-[10px] uppercase font-bold transition-colors ${attendanceRecords[l.id] === 'present' ? 'bg-emerald-900 text-emerald-300' : 'bg-brand-dark/50 hover:bg-slate-800 text-slate-400'}`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => toggleAttendance(l.id, 'late')}
                      className={`px-2.5 py-1.5 rounded font-mono text-[10px] uppercase font-bold transition-colors ${attendanceRecords[l.id] === 'late' ? 'bg-brand-gold text-brand-dark' : 'bg-brand-dark/50 hover:bg-slate-800 text-slate-400'}`}
                    >
                      Late
                    </button>
                    <button
                      onClick={() => toggleAttendance(l.id, 'absent')}
                      className={`px-2.5 py-1.5 rounded font-mono text-[10px] uppercase font-bold transition-colors ${attendanceRecords[l.id] === 'absent' ? 'bg-red-950 text-red-300 border border-red-500/20' : 'bg-brand-dark/50 hover:bg-slate-800 text-slate-400'}`}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => setSelectedLearnerForIntervention(l)}
                      title="Initiate Safety Intervention"
                      className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-[10px] uppercase font-bold rounded flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>Intervene</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right column: Broadcast Notice to parents & School notices */}
        <div className="space-y-6">
          
          {/* Dispatch Announcement to Parents */}
          <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-gold space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Send className="w-4 h-4 text-brand-gold" /> Push Safety Notice to Parents
            </h3>

            <form onSubmit={handlePostNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Weather Alert - Heavy Rains"
                  className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Notification Message</label>
                <textarea 
                  required
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="e.g. Buses will have delayed departure from Sandton junction due to local robot malfunction."
                  className="w-full bg-brand-dark border border-brand-gold/20 rounded px-2.5 py-2 text-white focus:outline-none focus:border-brand-gold text-xs leading-normal font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded text-xs uppercase cursor-pointer"
              >
                Broadcast Notice Live
              </button>
            </form>
          </div>

          {/* School transport monitoring status */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-brand-gold" /> Active School Bus Journeys
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-brand-navy-light/40 rounded-xl space-y-1">
                <div className="flex justify-between font-mono font-semibold">
                  <span>Bus 10A (Soweto Route)</span>
                  <span className="text-emerald-400 font-normal">ON PATH</span>
                </div>
                <div className="text-[10px] text-slate-400">Driver: Enoch Khumalo · 18 Learners onboard</div>
              </div>

              <div className="p-3 bg-brand-navy-light/40 rounded-xl space-y-1 border border-brand-gold/20 animate-pulse">
                <div className="flex justify-between font-mono font-semibold">
                  <span>Bus 12C (Sandton Route)</span>
                  <span className="text-brand-gold font-normal">DELAYED</span>
                </div>
                <div className="text-[10px] text-slate-400">Driver: Peter Naidoo · Smit St heavy congestion</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Designated Learner Safety Intervention & Escalation Modal */}
      {selectedLearnerForIntervention && (
        <LearnerInterventionModal
          learner={selectedLearnerForIntervention}
          isOpen={!!selectedLearnerForIntervention}
          onClose={() => setSelectedLearnerForIntervention(null)}
          onResolveAlert={(learnerId, notes) => {
            onAddAlert({
              id: `school-res-${Date.now()}`,
              type: 'School Intervention Resolved',
              severity: 'low',
              message: notes,
              time: new Date().toISOString(),
              learnerId,
              resolved: true
            });
            setSelectedLearnerForIntervention(null);
          }}
          onEscalateDispatch={(incident) => {
            onTriggerSOS(selectedLearnerForIntervention);
            setSelectedLearnerForIntervention(null);
          }}
        />
      )}

    </div>
  );
}
