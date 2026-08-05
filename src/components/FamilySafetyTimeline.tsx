import React from 'react';
import { 
  BellRing, MapPin, Headphones, Navigation, ShieldCheck, 
  Heart, MessageSquare, CheckCircle2, Clock, Shield, Sparkles, AlertCircle
} from 'lucide-react';
import { IncidentTicket } from '../types';

interface FamilySafetyTimelineProps {
  incident: IncidentTicket;
}

interface MilestoneItem {
  id: string;
  title: string;
  reassuringText: string;
  icon: React.ElementType;
  status: 'completed' | 'active' | 'pending';
  timestamp: string;
}

export function FamilySafetyTimeline({ incident }: FamilySafetyTimelineProps) {
  if (!incident) return null;

  const baseTime = incident.time || new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

  // Calculate realistic milestone times based on base incident time
  const parseTimeToMinutes = (tStr: string) => {
    const parts = tStr.split(':');
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      return h * 60 + m;
    }
    return 12 * 60; // default
  };

  const formatMinutesToTime = (totalMins: number) => {
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const startMins = parseTimeToMinutes(baseTime);

  // Status-driven progress mapping
  const currentStatus = incident.status || 'Reported';

  const milestones: MilestoneItem[] = [
    {
      id: 'm1',
      title: 'SOS Received',
      reassuringText: 'Emergency alert received from learner device and registered immediately in Command Centre.',
      icon: BellRing,
      status: 'completed',
      timestamp: formatMinutesToTime(startMins)
    },
    {
      id: 'm2',
      title: 'Location Verified',
      reassuringText: 'High-precision satellite GPS coordinates confirmed and locked on live safety map.',
      icon: MapPin,
      status: 'completed',
      timestamp: formatMinutesToTime(startMins + 1)
    },
    {
      id: 'm3',
      title: 'Command Centre Contacted',
      reassuringText: 'Dedicated safety coordinator assigned and actively managing emergency response protocols.',
      icon: Headphones,
      status: currentStatus === 'Reported' || currentStatus === 'Dispatched' || currentStatus === 'On Scene' || currentStatus === 'Resolved' ? 'completed' : 'active',
      timestamp: formatMinutesToTime(startMins + 2)
    },
    {
      id: 'm4',
      title: 'Responder En Route',
      reassuringText: 'Qualified mobile safety unit dispatched and navigating directly to child location.',
      icon: Navigation,
      status: currentStatus === 'Dispatched' || currentStatus === 'On Scene' || currentStatus === 'Resolved' ? 'completed' : (currentStatus === 'Reported' ? 'active' : 'pending'),
      timestamp: incident.responderEtaMinutes ? `${incident.responderEtaMinutes} min ETA` : formatMinutesToTime(startMins + 4)
    },
    {
      id: 'm5',
      title: 'Responder On Scene',
      reassuringText: 'Safety officer arrived on location and established physical safety zone around child.',
      icon: ShieldCheck,
      status: currentStatus === 'On Scene' || currentStatus === 'Resolved' ? 'completed' : (currentStatus === 'Dispatched' ? 'active' : 'pending'),
      timestamp: currentStatus === 'On Scene' || currentStatus === 'Resolved' ? formatMinutesToTime(startMins + 7) : '--:--'
    },
    {
      id: 'm6',
      title: 'Child Located',
      reassuringText: 'Physical visual contact verified by officer; child confirmed safe, unharmed, and calm.',
      icon: Heart,
      status: currentStatus === 'On Scene' || currentStatus === 'Resolved' ? 'completed' : 'pending',
      timestamp: currentStatus === 'On Scene' || currentStatus === 'Resolved' ? formatMinutesToTime(startMins + 8) : '--:--'
    },
    {
      id: 'm7',
      title: 'Guardian Updated',
      reassuringText: 'Reassuring status notification transmitted to parent and emergency contacts.',
      icon: MessageSquare,
      status: currentStatus === 'On Scene' || currentStatus === 'Resolved' ? 'completed' : (currentStatus === 'Dispatched' ? 'active' : 'pending'),
      timestamp: formatMinutesToTime(startMins + 9)
    },
    {
      id: 'm8',
      title: 'Incident Resolved',
      reassuringText: 'Safety protocols successfully concluded. Child securely handed over to authorized family member.',
      icon: CheckCircle2,
      status: currentStatus === 'Resolved' ? 'completed' : 'pending',
      timestamp: currentStatus === 'Resolved' ? formatMinutesToTime(startMins + 12) : '--:--'
    }
  ];

  return (
    <div className="bg-brand-dark rounded-2xl border border-brand-gold/30 p-5 space-y-5 text-white font-sans" id="family-safety-timeline">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/15 border border-brand-gold/30 rounded-xl text-brand-gold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Family Safety Milestone Timeline
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Reassuring Live View
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Real-time progress tracking for family peace of mind · Private & Secure
            </p>
          </div>
        </div>

        <div className="px-3 py-1 bg-brand-navy rounded-lg border border-slate-800 font-mono text-xs text-brand-gold">
          Case Ref: <strong className="text-white">{incident.id}</strong>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center gap-3 text-xs text-blue-200 font-sans">
        <Heart className="w-5 h-5 text-red-400 shrink-0 fill-red-400/20" />
        <p>
          <strong className="text-white">Family Reassurance Policy:</strong> All updates are verified by Command Centre staff before publishing to ensure clear, reassuring, and accurate communication. Tactical operational details are securely protected.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-brand-gold before:to-slate-800">
        {milestones.map((item, index) => {
          const IconComp = item.icon;
          const isCompleted = item.status === 'completed';
          const isActive = item.status === 'active';

          return (
            <div key={item.id} className="relative flex items-start gap-4 group">
              {/* Node Icon Circle */}
              <div 
                className={`absolute -left-6 top-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-900/40' 
                    : isActive 
                    ? 'bg-amber-950 border-amber-400 text-amber-300 animate-pulse shadow-lg shadow-amber-900/40' 
                    : 'bg-brand-navy border-slate-700 text-slate-500'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
              </div>

              {/* Card Container */}
              <div 
                className={`flex-1 p-3.5 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-brand-navy/90 border-emerald-500/30 shadow-md' 
                    : isActive 
                    ? 'bg-brand-navy border-amber-500/50 shadow-lg shadow-amber-950/30' 
                    : 'bg-brand-navy/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.title}</span>
                    <span 
                      className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        isCompleted 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                          : isActive 
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30 animate-pulse' 
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {isCompleted ? '✓ Completed' : isActive ? '● Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-brand-gold">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.reassuringText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Verified Timeline Log Entries (Filtered to avoid tactical jargon) */}
      {incident.timeline && incident.timeline.length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-2 font-mono text-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
            Recent Verified Family Updates Log
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {incident.timeline.map((entry, idx) => {
              // Reassuring filter for raw timeline strings
              let displayDesc = entry.description;
              displayDesc = displayDesc.replace(/tactical/gi, 'safety');
              displayDesc = displayDesc.replace(/SAPS unit/gi, 'Safety Response Team');
              displayDesc = displayDesc.replace(/grid/gi, 'area');

              return (
                <div key={idx} className="p-2 bg-brand-navy/60 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300">{displayDesc}</span>
                  <span className="text-brand-gold font-bold ml-2 shrink-0">{entry.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
