import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, Phone, Shield, ShieldAlert, Heart, X, Radio, Volume2, Landmark, Navigation, MapPin } from 'lucide-react';
import { Learner, IncidentTicket } from '../types';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';

interface PanicConsoleProps {
  learner: Learner;
  onCancel: () => void;
  onLoggedIncident: (newIncident: IncidentTicket) => void;
}

export function PanicConsole({ learner, onCancel, onLoggedIncident }: PanicConsoleProps) {
  const [countdown, setCountdown] = useState(5);
  const [isCounting, setIsCounting] = useState(true);
  const [isTriggered, setIsTriggered] = useState(false);
  const [dispatcherLogs, setDispatcherLogs] = useState<string[]>([]);
  const [audioStreamActive, setAudioStreamActive] = useState(false);
  const [audioBars, setAudioBars] = useState<number[]>([10, 20, 15, 30, 25, 45, 12, 18, 40, 50, 10, 22]);

  const soundTimer = useRef<NodeJS.Timeout | null>(null);

  // Countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isCounting) {
      setIsCounting(false);
      triggerEmergency();
    }
    return () => clearInterval(interval);
  }, [countdown, isCounting]);

  // Audio waveform animation
  useEffect(() => {
    let anim: NodeJS.Timeout;
    if (audioStreamActive) {
      anim = setInterval(() => {
        setAudioBars(Array.from({ length: 15 }, () => Math.floor(Math.random() * 60) + 10));
      }, 150);
    }
    return () => clearInterval(anim);
  }, [audioStreamActive]);

  const triggerEmergency = () => {
    setIsTriggered(true);
    setAudioStreamActive(true);
    
    // Build real Incident Ticket
    const incidentNum = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentTime = new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toISOString().split('T')[0];

    const logs = [
      `[${currentTime}] EMERGENCY SOS SIGNALS ESTABLISHED FROM DEVICE SERIAL: ${learner.trackerSerial}`,
      `[${currentTime}] GPS COORDINATES BROADCASTING LIVE: Lat: ${learner.latitude}, Lng: ${learner.longitude}`,
      `[${currentTime}] ITIS NATIONAL COMMAND CENTER ACQUIRED CARRIER CONNECTION`,
      `[${currentTime}] AUTOMATED TAMPER & AUDIO CAPTURE PROTOCOL INITIATED`,
      `[${currentTime}] EMERGENCY SMS BROADCAST DISPATCHED TO REGISTERED GUARDIANS`,
      `[${currentTime}] ROUTING ALERT DIRECT TO SAPS TACTICAL DISPATCH & MILPARK PATROL UNIT`,
      `[${currentTime}] WEARABLE DIAGNOSTICS: Battery: ${learner.deviceBattery}%, Pulse rate: ${learner.heartRate || 85} bpm, Temp: ${learner.temperature || 36.7}°C`
    ];
    setDispatcherLogs(logs);

    // After 4 seconds, add SAPS dispatched log
    setTimeout(() => {
      setDispatcherLogs(prev => [
        ...prev,
        `[${currentTime}] SAPS UNIT J212 DISPATCHED FROM MILPARK POLICE STATION (ETA 4.5 MINS)`
      ]);
    }, 3000);

    // After 8 seconds, add medical unit log
    setTimeout(() => {
      setDispatcherLogs(prev => [
        ...prev,
        `[${currentTime}] JOINT AMBULANCE / FIRE BRIGADE STANDBY ALERT CONFIRMED AT CO-ORDINATE JUNCTION`
      ]);
    }, 6500);

    // Register this newly generated ticket inside global state
    const generatedTicket: IncidentTicket = {
      id: incidentNum,
      date: currentDate,
      time: currentTime,
      location: `Smit St & Rissik St (Near ${learner.school})`,
      latitude: learner.latitude,
      longitude: learner.longitude,
      learnerName: learner.name,
      schoolName: learner.school,
      guardianName: learner.assignedGuardian,
      assignedOfficer: 'SAPS Joint Tactical Taskforce Unit J212',
      status: 'Dispatched',
      category: 'SOS Emergency Activation',
      evidenceNotes: [
        'Panic button triggered by device.',
        'Continuous remote environment audio streaming active.',
        'Guaranteed live routing active.'
      ],
      timeline: [
        { time: currentTime, description: 'Panic Beacon Received' },
        { time: 'Immediate', description: 'ITIS Command and SAPS dispatch alerted' }
      ]
    };

    onLoggedIncident(generatedTicket);
  };

  const handleCancelCountdown = () => {
    setIsCounting(false);
    onCancel();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 font-sans select-none overflow-y-auto"
      id="panic-full-screen-overlay"
    >
      {/* Alarm Flashing Gradient Background */}
      <div className={`absolute inset-0 bg-radial from-red-600/30 via-slate-950 to-slate-950 pointer-events-none ${isTriggered ? 'animate-pulse' : ''}`} />
      
      {/* Decorative Grid Line */}
      <div className="absolute inset-0 bg-grid-ambient opacity-25 pointer-events-none" />

      {/* Header telemetry ribbon */}
      <div className="relative w-full py-3 bg-red-950/80 border-b border-red-500/40 px-6 flex items-center justify-between text-white font-mono text-[10px] uppercase tracking-widest z-10">
        <span className="flex items-center gap-2">
          <img 
            src={itisLogo} 
            alt="ITIS Badge Logo" 
            className="w-6 h-6 object-cover border border-brand-gold rounded-full shadow"
          />
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          ITIS SECURE CHANNEL · LIVE BROADCAST
        </span>
        <span className="text-red-400 font-bold">STATE: EXTREME SOS CRITICAL</span>
      </div>

      <div className="relative flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col items-center justify-center z-10">
        {isCounting ? (
          /* COUNTDOWN SCREEN */
          <div className="w-full max-w-md text-center flex flex-col items-center" id="panic-countdown-view">
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              {/* Spinning alert circles */}
              <div className="absolute inset-0 border-4 border-dashed border-red-500/30 rounded-full animate-spin duration-1000" />
              <div className="absolute inset-2 border-2 border-red-500 rounded-full animate-ping opacity-75" />
              <div className="absolute inset-4 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center">
                <span className="text-6xl font-bold font-mono text-red-500">{countdown}</span>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-wide mb-2">
              INITIATING PANIC RESPONDERS
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mb-8 leading-relaxed">
              ITIS Command Centre and <strong className="text-red-400">SAPS Armed Emergency Units</strong> will be dispatched to <strong className="text-white">{learner.name}</strong>'s coordinate point immediately.
            </p>

            <button
              onClick={handleCancelCountdown}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-brand-gold text-brand-gold font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer shadow-lg active:scale-95 transition-all"
              id="panic-cancel-btn"
            >
              Cancel Countdown (False Alarm)
            </button>
          </div>
        ) : (
          /* ACTIVE SOS MONITORING ROOM */
          <div className="w-full space-y-6" id="panic-triggered-view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Target Learner Details & Wearable Telemetry */}
              <div className="glass-panel border-red-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={learner.photoUrl} 
                      alt={learner.name}
                      className="w-14 h-14 rounded-full border-2 border-red-500 object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{learner.name}</h3>
                      <p className="text-xs text-red-400 font-mono">{learner.trackerSerial}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Assigned School</span>
                      <strong className="text-slate-200">{learner.school} ({learner.grade})</strong>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Medical Emergency Code</span>
                      <strong className="text-red-300">{learner.medicalConditions} ({learner.bloodGroup})</strong>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">Guardian Contacts Paged</span>
                      <strong className="text-slate-200 font-mono">{learner.emergencyContacts.join(', ')}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Battery Level</span>
                    <strong className="text-red-400 font-mono">{learner.deviceBattery}%</strong>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${learner.deviceBattery}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-red-500/10 font-mono">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      {learner.heartRate || 78} BPM
                    </span>
                    <span>36.6 °C</span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Live GPS Interactive Simulation */}
              <div className="md:col-span-2 glass-panel border-red-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="relative flex-1 bg-slate-900 border border-red-500/20 rounded-xl overflow-hidden min-h-[220px] flex items-center justify-center">
                  
                  {/* Mock Satellite Map Art */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')` }} />
                  
                  {/* Pulsing Target Ring */}
                  <div className="absolute flex items-center justify-center">
                    <div className="w-24 h-24 border border-red-500 rounded-full animate-ping opacity-60 absolute" />
                    <div className="w-12 h-12 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center relative glow-red">
                      <MapPin className="w-6 h-6 text-red-500 animate-bounce" />
                    </div>
                  </div>

                  {/* Compass Telemetry HUD Overlay */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-red-500/30 rounded p-2 text-[9px] font-mono text-red-400 space-y-0.5">
                    <div>LAT: {learner.latitude}</div>
                    <div>LNG: {learner.longitude}</div>
                    <div>COGNITIVE ACCURACY: &lt; 2.5m (MIL)</div>
                  </div>

                  <div className="absolute top-3 right-3 bg-red-950 border border-red-500 rounded px-2.5 py-1 text-[9px] font-mono text-white tracking-widest uppercase">
                    LIVE TRACKING GPS HIGH FREQUENCY
                  </div>
                </div>

                {/* Ambient Microphone Recording Stream */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-red-400 font-mono tracking-wider flex items-center gap-1.5 uppercase">
                      <Volume2 className="w-3.5 h-3.5 text-red-500 animate-bounce" />
                      Live Audio Recording Stream (Wearable Mic Active)
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">DECRYPTED RSA-2048</span>
                  </div>
                  <div className="flex items-end justify-center gap-1.5 h-10 px-2">
                    {audioBars.map((bar, i) => (
                      <div 
                        key={i} 
                        className="bg-gradient-to-t from-red-600 to-red-400 w-1.5 rounded-full transition-all"
                        style={{ height: `${bar}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Joint Emergency Dispatch Timeline (Live Feed logs) */}
            <div className="glass-panel border-red-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  ITIS Command Centre Incident Logs (Case ID: INC-2026-PENDING)
                </h4>
                <span className="px-2 py-0.5 bg-red-900/60 text-red-300 border border-red-500/40 rounded text-[9px] font-mono uppercase font-bold animate-pulse">
                  Dispatching SAPS Tactical Responder
                </span>
              </div>
              
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[10px] text-slate-300" id="panic-timeline-logs">
                {dispatcherLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-red-500">▶</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Close / Resolved Emergency Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={onCancel}
                className="px-6 py-3.5 bg-green-900 hover:bg-green-800 text-green-200 border border-green-500/40 hover:border-green-500 rounded-xl text-xs font-mono uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-green-500/10 transition-all"
                id="panic-resolve-btn"
              >
                <Shield className="w-4 h-4 text-green-400" />
                MARK EMERGENCY AS UNDER CONTROL (RESOLVE SOS)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto py-4 text-center text-[9px] text-slate-500 font-mono bg-slate-950/80 border-t border-slate-900">
        ITIS COGNITIVE CLOUD NETWORKS · SOUTH AFRICA PUBLIC SAFETY ALLIANCE COOPERATING
      </div>
    </div>
  );
}
