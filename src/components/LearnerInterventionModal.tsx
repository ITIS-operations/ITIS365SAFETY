import React, { useState } from 'react';
import { 
  ShieldAlert, PhoneCall, CheckCircle2, AlertTriangle, Radio, 
  MapPin, Heart, Battery, Signal, User, Shield, Phone, 
  ChevronRight, ArrowRight, X, Clock, FileText, Check, AlertOctagon, Building2
} from 'lucide-react';
import { Learner, SafetyAlert, IncidentTicket } from '../types';

interface LearnerInterventionModalProps {
  learner: Learner;
  isOpen: boolean;
  onClose: () => void;
  onResolveAlert: (learnerId: string, resolutionNotes: string) => void;
  onEscalateDispatch: (incident: IncidentTicket) => void;
}

export function LearnerInterventionModal({
  learner,
  isOpen,
  onClose,
  onResolveAlert,
  onEscalateDispatch
}: LearnerInterventionModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Verification Checks
  const [hasCalledWearable, setHasCalledWearable] = useState(false);
  const [hasContactedGuardian, setHasContactedGuardian] = useState(false);
  const [hasContactedSchool, setHasContactedSchool] = useState(false);
  const [verificationOutcome, setVerificationOutcome] = useState<'pending' | 'false_alarm' | 'confirmed_threat' | 'medical_distress'>('pending');

  // Risk & Escalation Form
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'critical'>('critical');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [selectedAgencies, setSelectedAgencies] = useState<{
    saps: boolean;
    privateSecurity: boolean;
    ems: boolean;
    schoolMarshal: boolean;
  }>({
    saps: true,
    privateSecurity: true,
    ems: false,
    schoolMarshal: true
  });
  const [confirmedHumanCheck, setConfirmedHumanCheck] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !learner) return null;

  // Handle Step 2 Verification Actions
  const handleSimulateCallWearable = () => {
    setHasCalledWearable(true);
    alert(`Initiating priority two-way audio call to Learner Wearable SIM: ${learner.simNumber}...`);
  };

  const handleSimulateCallGuardian = () => {
    setHasContactedGuardian(true);
    alert(`Calling Primary Guardian (${learner.assignedGuardian}): ${learner.emergencyContacts[0] || '+27 82 123 4567'}...`);
  };

  const handleSimulateCallSchool = () => {
    setHasContactedSchool(true);
    alert(`Contacting ${learner.school} Emergency Liaison Officer...`);
  };

  // Handle Resolution as False Alarm (De-escalation)
  const handleResolveFalseAlarm = () => {
    onResolveAlert(learner.id, operatorNotes || 'Human verification completed: Confirmed accidental touch / false alarm. Learner is safe.');
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  // Handle Full Escalation Dispatch
  const handleExecuteDispatch = () => {
    if (!confirmedHumanCheck) {
      alert('Mandatory Safety Policy: You must confirm that human verification was attempted before dispatching emergency teams.');
      return;
    }

    const currentTime = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toISOString().split('T')[0];
    const incidentId = `INC-ESC-${Math.floor(1000 + Math.random() * 9000)}`;

    const dispatchedUnits: string[] = [];
    if (selectedAgencies.saps) dispatchedUnits.push('SAPS Flying Squad (10111)');
    if (selectedAgencies.privateSecurity) dispatchedUnits.push('Gauteng Armed Response Taskforce');
    if (selectedAgencies.ems) dispatchedUnits.push('EMS Triage Ambulance');
    if (selectedAgencies.schoolMarshal) dispatchedUnits.push('School On-Site Safety Marshal');

    const createdIncident: IncidentTicket = {
      id: incidentId,
      date: currentDate,
      time: currentTime,
      location: `Near ${learner.school} (Lat: ${learner.latitude.toFixed(4)}, Lng: ${learner.longitude.toFixed(4)})`,
      latitude: learner.latitude,
      longitude: learner.longitude,
      learnerName: learner.name,
      schoolName: learner.school,
      guardianName: learner.assignedGuardian,
      assignedOfficer: dispatchedUnits.join(' + ') || 'SAPS National Command',
      status: 'Dispatched',
      category: riskLevel === 'critical' ? 'Verified Emergency SOS' : 'Precautionary Security Escort',
      evidenceNotes: [
        `Verified SOS Escalation executed by operator.`,
        `Verification Outcome: ${verificationOutcome.toUpperCase()}`,
        `Notes: ${operatorNotes || 'Confirmed distress signal requiring tactical dispatch.'}`,
        `Wearable Telemetry: Battery ${learner.deviceBattery}%, Pulse ${learner.heartRate || 80} bpm, IMEI ${learner.trackerImei}`
      ],
      timeline: [
        { time: currentTime, description: 'Distress Signal Triggered on Wearable Device' },
        { time: currentTime, description: 'Human Operator Completed Telemetry & Guardian Verification' },
        { time: currentTime, description: `Multi-Agency Tactical Dispatch Engaged: ${dispatchedUnits.join(', ')}` }
      ]
    };

    onEscalateDispatch(createdIncident);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-brand-navy-heavy border-2 border-brand-gold rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative glow-gold flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-brand-navy to-brand-dark p-5 border-b border-brand-gold/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white font-mono font-bold text-[9px] uppercase rounded tracking-wider">
                  NATIONAL CHILD SAFETY INTERVENTION
                </span>
                <span className="text-[10px] font-mono text-brand-gold">POPIA & ISO 27001 AUDITED</span>
              </div>
              <h2 className="text-lg font-extrabold text-white font-mono tracking-tight">
                Designated Safety Escalation Console
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-dark/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator Ribbon */}
        <div className="bg-brand-dark border-b border-brand-gold/20 px-6 py-2 flex items-center justify-between text-[11px] font-mono shrink-0 overflow-x-auto">
          {[
            { step: 1, title: '1. Telemetry Check' },
            { step: 2, title: '2. Human Verification' },
            { step: 3, title: '3. Risk Assessment' },
            { step: 4, title: '4. Verified Dispatch' }
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step as any)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                currentStep === s.step 
                  ? 'bg-brand-gold text-brand-dark font-extrabold shadow-md' 
                  : currentStep > s.step 
                    ? 'text-emerald-400 font-bold' 
                    : 'text-slate-500'
              }`}
            >
              {currentStep > s.step ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          
          {isSubmitted ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Intervention Protocol Recorded</h3>
              <p className="text-slate-300 max-w-md mx-auto">
                Safety logs updated, guardian push notifications transmitted, and official event record sealed in ITIS National Command Audit Vault.
              </p>
            </div>
          ) : (
            <>
              {/* Learner & Telemetry Banner */}
              <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={learner.photoUrl} 
                    alt={learner.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-extrabold text-white font-mono">{learner.name}</h3>
                    <p className="text-brand-gold">{learner.school} · {learner.grade}</p>
                    <p className="text-[10px] text-slate-400">Guardian: {learner.assignedGuardian}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] bg-brand-dark p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400">IMEI: <span className="text-emerald-400 font-bold">{learner.trackerImei}</span></div>
                  <div className="text-slate-400">Battery: <span className="text-white font-bold">{learner.deviceBattery}%</span></div>
                  <div className="text-slate-400">Heart Rate: <span className="text-rose-400 font-bold">{learner.heartRate || 78} bpm</span></div>
                  <div className="text-slate-400">Temp: <span className="text-white font-bold">{learner.temperature || 36.6}°C</span></div>
                </div>
              </div>

              {/* STEP 1: TELEMETRY & SIGNAL CHECK */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold">
                      <AlertOctagon className="w-4 h-4" />
                      Active Distress Signal Received
                    </div>
                    <p className="text-slate-300">
                      Distress button held down on Wearable Band. Real-time GPS coordinates confirm child is located near <span className="text-white font-bold">{learner.school}</span> (Lat: {learner.latitude.toFixed(4)}, Lng: {learner.longitude.toFixed(4)}).
                    </p>
                  </div>

                  <div className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-brand-gold uppercase text-[11px] flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      Live Device Health & APN Diagnostic
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-2.5 bg-brand-navy rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Cellular Network</span>
                        <span className="text-emerald-400 font-bold">Vodacom Safety APN</span>
                      </div>
                      <div className="p-2.5 bg-brand-navy rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">SIM Phone Number</span>
                        <span className="text-white font-bold">{learner.simNumber}</span>
                      </div>
                      <div className="p-2.5 bg-brand-navy rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Wearable Serial</span>
                        <span className="text-brand-gold font-bold">{learner.trackerSerial}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <span>Proceed to Mandatory Verification</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MANDATORY HUMAN VERIFICATION */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      Mandatory Human-in-the-Loop Safeguard
                    </div>
                    <p className="text-slate-300">
                      To prevent accidental emergency dispatch fees or panic alarms, operators must complete at least one verification call before dispatching tactical responders.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-white uppercase text-[11px]">Verification Direct Actions:</h4>

                    <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-400" />
                          Two-Way Audio Call Learner Wearable
                        </div>
                        <div className="text-[10px] text-slate-400">Target: {learner.simNumber}</div>
                      </div>
                      <button 
                        onClick={handleSimulateCallWearable}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                          hasCalledWearable 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark'
                        }`}
                      >
                        {hasCalledWearable ? '✓ Call Connected' : 'Call Wearable'}
                      </button>
                    </div>

                    <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-brand-gold" />
                          Call Primary Guardian ({learner.assignedGuardian})
                        </div>
                        <div className="text-[10px] text-slate-400">Target: {learner.emergencyContacts[0] || '+27 82 123 4567'}</div>
                      </div>
                      <button 
                        onClick={handleSimulateCallGuardian}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                          hasContactedGuardian 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark'
                        }`}
                      >
                        {hasContactedGuardian ? '✓ Guardian Contacted' : 'Call Guardian'}
                      </button>
                    </div>

                    <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          Contact {learner.school} Safety Marshal
                        </div>
                        <div className="text-[10px] text-slate-400">On-site Campus Protection Liaison</div>
                      </div>
                      <button 
                        onClick={handleSimulateCallSchool}
                        className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                          hasContactedSchool 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark'
                        }`}
                      >
                        {hasContactedSchool ? '✓ School Liaison Alerted' : 'Alert School'}
                      </button>
                    </div>
                  </div>

                  {/* Verification Outcome Selector */}
                  <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/30 space-y-3">
                    <label className="block text-brand-gold font-bold uppercase text-[11px]">
                      Select Verification Result:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setVerificationOutcome('false_alarm')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          verificationOutcome === 'false_alarm'
                            ? 'bg-emerald-950 border-emerald-500 text-white'
                            : 'bg-brand-dark border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-emerald-400 text-xs">False Alarm / Safe</div>
                        <div className="text-[10px] text-slate-400 mt-1">Learner confirmed safe. De-escalate alert.</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerificationOutcome('confirmed_threat')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          verificationOutcome === 'confirmed_threat'
                            ? 'bg-rose-950 border-rose-500 text-white'
                            : 'bg-brand-dark border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-rose-400 text-xs">Confirmed Distress</div>
                        <div className="text-[10px] text-slate-400 mt-1">Unresponsive or threat confirmed. Escalation required.</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVerificationOutcome('medical_distress')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          verificationOutcome === 'medical_distress'
                            ? 'bg-amber-950 border-amber-500 text-white'
                            : 'bg-brand-dark border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-amber-400 text-xs">Medical Emergency</div>
                        <div className="text-[10px] text-slate-400 mt-1">Health triage needed (Pulse/Fall anomaly).</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {verificationOutcome === 'false_alarm' ? (
                      <button
                        onClick={handleResolveFalseAlarm}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer uppercase"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolve as Verified False Alarm</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer uppercase ml-auto"
                      >
                        <span>Proceed to Risk & Dispatch Triage</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: RISK ASSESSMENT & NOTES */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-brand-gold font-bold uppercase text-[11px]">
                      Select Verified Threat Severity:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setRiskLevel('low')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          riskLevel === 'low' ? 'bg-amber-950 border-amber-500 text-amber-400' : 'bg-brand-dark border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold">LOW RISK</div>
                        <div className="text-[9px]">Precautionary Guard</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRiskLevel('medium')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          riskLevel === 'medium' ? 'bg-orange-950 border-orange-500 text-orange-400' : 'bg-brand-dark border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold">MEDIUM RISK</div>
                        <div className="text-[9px]">Armed Response Escort</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRiskLevel('critical')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          riskLevel === 'critical' ? 'bg-red-950 border-red-500 text-red-400' : 'bg-brand-dark border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="font-bold">CRITICAL / SOS</div>
                        <div className="text-[9px]">SAPS Flying Squad 10111</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 uppercase text-[10px]">
                      Operator Intervention Notes (Logged to Audit Vault):
                    </label>
                    <textarea 
                      rows={3}
                      placeholder="Enter verification details, e.g. Contacted parent, child unresponsive on wearable call, SAPS 10111 dispatch authorized."
                      value={operatorNotes}
                      onChange={e => setOperatorNotes(e.target.value)}
                      className="w-full bg-brand-dark border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold font-mono text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-brand-navy border border-slate-700 text-slate-300 hover:text-white rounded-xl uppercase"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <span>Proceed to Multi-Agency Dispatch</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: VERIFIED DISPATCH AUTHORIZATION */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-950/60 border border-red-500/60 rounded-xl space-y-3">
                    <h4 className="font-bold text-red-400 uppercase text-[11px] flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Select Dispatch Response Tactical Units:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAgencies.saps}
                          onChange={e => setSelectedAgencies({...selectedAgencies, saps: e.target.checked})}
                          className="w-4 h-4 accent-brand-gold cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-white">SAPS Flying Squad (10111)</div>
                          <div className="text-[10px] text-slate-400">National Police Rapid Dispatch</div>
                        </div>
                      </label>

                      <label className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAgencies.privateSecurity}
                          onChange={e => setSelectedAgencies({...selectedAgencies, privateSecurity: e.target.checked})}
                          className="w-4 h-4 accent-brand-gold cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-white">Gauteng Armed Response</div>
                          <div className="text-[10px] text-slate-400">Private Security Rapid Unit</div>
                        </div>
                      </label>

                      <label className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAgencies.ems}
                          onChange={e => setSelectedAgencies({...selectedAgencies, ems: e.target.checked})}
                          className="w-4 h-4 accent-brand-gold cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-white">EMS Medical Triage Unit</div>
                          <div className="text-[10px] text-slate-400">Paramedic Ambulance Standby</div>
                        </div>
                      </label>

                      <label className="p-3 bg-brand-dark rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAgencies.schoolMarshal}
                          onChange={e => setSelectedAgencies({...selectedAgencies, schoolMarshal: e.target.checked})}
                          className="w-4 h-4 accent-brand-gold cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-white">School Campus Protection</div>
                          <div className="text-[10px] text-slate-400">On-site Gate Marshal Alert</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Mandatory Human Confirmation Checkbox */}
                  <label className="p-4 bg-brand-navy rounded-xl border border-brand-gold/40 flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={confirmedHumanCheck}
                      onChange={e => setConfirmedHumanCheck(e.target.checked)}
                      className="w-5 h-5 accent-brand-gold cursor-pointer shrink-0 mt-0.5"
                    />
                    <div className="text-[11px] text-slate-200">
                      <span className="font-bold text-brand-gold block uppercase">
                        MANDATORY HUMAN-IN-THE-LOOP VERIFICATION CONFIRMATION
                      </span>
                      I certify under National Child Safety Policy E11 that human verification was conducted, coordinates were validated, and emergency escalation dispatch is authorized.
                    </div>
                  </label>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2 bg-brand-navy border border-slate-700 text-slate-300 hover:text-white rounded-xl uppercase"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleExecuteDispatch}
                      disabled={!confirmedHumanCheck}
                      className={`px-6 py-3 font-bold rounded-xl shadow-xl flex items-center gap-2 uppercase transition-all ${
                        confirmedHumanCheck
                          ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer glow-red'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShieldAlert className="w-5 h-5" />
                      <span>Execute Verified Tactical Dispatch</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <div className="bg-brand-dark border-t border-brand-gold/20 p-3 text-center text-[10px] text-slate-500 font-mono shrink-0">
          ITIS Guardian Network · Integrated Technology Intelligence & Safety (ITIS) · POPIA Child Protection Protocol E11 Enforced
        </div>

      </div>
    </div>
  );
}
