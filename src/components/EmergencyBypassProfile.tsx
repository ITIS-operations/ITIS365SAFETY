import React, { useState } from 'react';
import { ShieldAlert, Phone, Heart, Activity, CheckCircle2, User, Landmark, ShieldCheck } from 'lucide-react';
import { Learner } from '../types';

interface EmergencyBypassProfileProps {
  learner: Learner;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Learner['status']) => void;
}

export function EmergencyBypassProfile({ learner, onClose, onUpdateStatus }: EmergencyBypassProfileProps) {
  const [reportedSafe, setReportedSafe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reporterNotes, setReporterNotes] = useState('');

  const handleReportSafe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReportedSafe(true);
      // Update learner status in global state to In School or At Home
      onUpdateStatus(learner.id, 'At Home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-start p-4 sm:p-6" id="emergency-responder-portal">
      {/* High-intensity Red Header Banner */}
      <div className="w-full max-w-2xl bg-red-950 border border-red-500/30 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600/15 border border-red-500 rounded-full flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-sm font-bold font-mono tracking-wide text-white uppercase flex items-center gap-2">
              SAPS / First Responder Emergency Access
              <span className="text-[8px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 uppercase font-mono tracking-widest">POPIA SECURE</span>
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              This medical and contact telemetry is authorized under South African POPI Act Chapter 3, Section 11(1)(f) (Critical Life-Saving Emergency Clause). Unauthorized access is audited.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Card Details */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Profile Card & Vitals */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex gap-4 items-center border-b border-slate-800 pb-4">
            <img 
              src={learner.photoUrl} 
              alt={learner.name} 
              className="w-20 h-20 object-cover border-2 border-brand-gold/50 rounded-xl shadow-lg"
            />
            <div className="space-y-1">
              <span className="text-[9px] font-mono bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 uppercase tracking-wider font-bold">
                {learner.grade}
              </span>
              <h2 className="text-md font-bold text-white">{learner.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-slate-400" />
                {learner.school}
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <h3 className="text-brand-gold font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1">Biometric & Medical Tags</h3>
            
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="block text-[8px] text-slate-500 uppercase">Blood Group</span>
                <strong className="text-red-400 font-bold text-sm block mt-0.5">{learner.bloodGroup}</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="block text-[8px] text-slate-500 uppercase">Device Pulse</span>
                <span className="text-white flex items-center gap-1 font-bold text-sm mt-0.5">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  {learner.heartRate || 74} BPM
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1">
              <span className="block text-[8px] text-slate-500 uppercase">Critical Allergies / Conditions</span>
              <strong className="text-amber-400 font-bold block text-xs leading-relaxed">{learner.medicalConditions}</strong>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1 text-slate-400 text-[10px]">
              <div><strong>Wearable Tracker:</strong> {learner.trackerSerial}</div>
              <div><strong>SIM:</strong> {learner.simNumber}</div>
              <div><strong>Telemetry Area:</strong> {learner.latitude.toFixed(4)} S · {learner.longitude.toFixed(4)} E</div>
            </div>
          </div>
        </div>

        {/* Contact priority list & quick dial */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <h3 className="text-brand-gold font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 pb-1 font-mono">
              Emergency Action Contacts
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Dial parents immediately to report current physical safety state or coordinates.
            </p>

            <div className="space-y-2 pt-1 font-mono">
              {learner.emergencyContacts.map((contactStr, idx) => {
                const parts = contactStr.split('(');
                const contactPhone = parts[0]?.trim() || '';
                const contactName = parts[1]?.replace(')', '').trim() || 'Guardian';
                return (
                  <a
                    key={idx}
                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-between p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-brand-gold/30 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 block">PRIORITY {idx + 1} ({contactName.toUpperCase()})</span>
                      <strong className="text-white text-xs truncate block mt-0.5">{contactPhone}</strong>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-dark transition-colors shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                  </a>
                );
              })}

              <a
                href="tel:10111"
                className="flex items-center justify-between p-3 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-[10px] text-red-400 block font-bold">🚨 SAPS EMERGENCY SERVICES</span>
                  <strong className="text-red-500 text-xs block mt-0.5">Dial 10111</strong>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center gap-2 font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span>Active GPS Tracker Ping: {learner.deviceBattery}% Battery Remaining</span>
          </div>
        </div>
      </div>

      {/* Report Found / Safe Action Form */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        {!reportedSafe ? (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold font-mono text-white">Report Child Handover / Status Safe</h3>
              <p className="text-xs text-slate-400">Directly inform the Command Centre and parents that the child has been located or has safely arrived.</p>
            </div>

            <form onSubmit={handleReportSafe} className="space-y-3.5 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">First Responder / Officer Name</label>
                  <input 
                    type="text" 
                    required
                    value={reporterName} 
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Sgt. J. Molefe"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl focus:border-brand-gold focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Contact Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={reporterPhone} 
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="e.g. +27 82 555 1234"
                    className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl focus:border-brand-gold focus:outline-none text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Safe Handover Notes / Handover Location</label>
                <textarea 
                  rows={2}
                  value={reporterNotes} 
                  onChange={(e) => setReporterNotes(e.target.value)}
                  placeholder="e.g. Child found near Sandton Taxi Rank. Safe and sound. Under custody of Sgt. Molefe at local police desk."
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl focus:border-brand-gold focus:outline-none text-white leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-xl cursor-pointer"
                >
                  Close Profile View
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase rounded-xl cursor-pointer flex items-center justify-center gap-1.5 min-w-[150px]"
                >
                  {loading ? 'Transmitting...' : 'Mark Safe & Dispatch Log'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center p-5 space-y-4">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono text-sm uppercase tracking-wider">Telemetry Dispatched and Status Safe!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Your report has been received by ITIS Command Centre and guardians. Sipho Ndlovu's safety state has been updated successfully.
              </p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 max-w-md mx-auto text-left">
              <strong>LOGGED DISPATCH DETAILS:</strong>
              <div className="mt-1">• Responder: {reporterName} ({reporterPhone})</div>
              <div>• Status: Safe Handover Confirmed</div>
              <div>• Notes: {reporterNotes || "No notes provided."}</div>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded-xl text-xs cursor-pointer"
            >
              Return to Safe Portal
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-[10px] font-mono text-slate-500 space-y-1">
        <div>© 2026 Integrated Technology Intelligence & Safety (ITIS) · Republic of South Africa</div>
        <div>AUTHORIZED AUDIT TRAIL LOGGING ENFORCED</div>
      </div>
    </div>
  );
}
