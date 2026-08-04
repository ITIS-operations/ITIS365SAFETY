import React, { useState } from 'react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, ChevronRight, Phone, Mail, 
  MapPin, Cpu, Lock, AlertTriangle, ArrowRight, Activity, Landmark, FileText, Heart, Sparkles, Navigation
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';

interface LandingPageProps {
  onOpenLogin: (role?: string) => void;
}

export function LandingPage({ onOpenLogin }: LandingPageProps) {
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoOrganization, setDemoOrganization] = useState('');
  const [demoRole, setDemoRole] = useState('School Principal');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail || !demoName) return;
    setDemoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark bg-grid-ambient">
      
      {/* Executive Header Bar */}
      <header className="sticky top-0 z-50 bg-brand-navy-heavy/90 backdrop-blur-md border-b border-brand-gold/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={itisLogo} 
            alt="ITIS Official Shield" 
            className="w-11 h-11 object-cover border-2 border-brand-gold rounded-full shadow-lg glow-gold"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-wider text-white">ITIS GUARDIAN</span>
              <span className="text-[9px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 font-mono uppercase font-semibold">
                Sovereign Safety Infrastructure
              </span>
            </div>
            <p className="text-[10px] text-brand-gold/90 font-mono tracking-widest uppercase">
              Integrated Technology Intelligence & Safety · Republic of South Africa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="#request-demo"
            className="hidden sm:inline-flex items-center px-4 py-2 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all"
          >
            Request Executive Briefing
          </a>
          <button
            onClick={() => onOpenLogin('Parent')}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs font-mono uppercase tracking-wider rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            Portal Login
          </button>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION */}
      <section className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-navy border border-brand-gold/30 rounded-full text-xs font-mono text-brand-gold">
            <Shield className="w-4 h-4 text-brand-gold animate-pulse" />
            <span>National Child Protection & Real-Time Telemetry Initiative</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            National Child Safety & Real-Time Emergency Response Infrastructure
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            ITIS unites schools, law enforcement, guardians, and first responders through sovereign wearable telemetry and automated GIS dispatch to protect learners across South Africa.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#request-demo"
              className="px-6 py-3.5 bg-brand-navy border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-sm font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              Request Demo
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => onOpenLogin('Parent')}
              className="px-6 py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-sm font-mono uppercase tracking-wider rounded-xl shadow-xl transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Portal Login
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-6 border-t border-brand-gold/15 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> POPIA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> MIL-STD-810G Certified</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> SAPS 10111 Dispatch Link</span>
          </div>
        </div>

        {/* Hero Illustration Container */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
          <div className="glass-panel-heavy rounded-2xl p-6 border-2 border-brand-gold/30 shadow-2xl relative glow-gold overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <img src={itisLogo} alt="ITIS Shield" className="w-10 h-10 rounded-full border border-brand-gold" />
                <div>
                  <span className="text-xs font-bold text-white font-mono block">Sovereign Telemetry Console</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Telemetry Lock
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-brand-dark px-2.5 py-1 rounded border border-brand-gold/20 text-brand-silver font-mono">
                ZA-DISPATCH-904
              </span>
            </div>

            {/* Mock Telemetry Visual */}
            <div className="space-y-3">
              <div className="p-3 bg-brand-navy rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    TH
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Thabo Ndlovu (Grade 7)</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Gauteng High School Safe Zone</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded-full font-semibold">
                  In Safe Zone
                </span>
              </div>

              <div className="p-3 bg-brand-navy rounded-xl border border-red-500/30 bg-red-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-950 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
                    SN
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sipho Ndlovu (Grade 10)</h4>
                    <p className="text-[10px] text-red-300 font-mono">Route Departure • M2 Highway</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-red-950/80 text-red-400 border border-red-500/30 text-[10px] font-mono rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> SOS Active
                </span>
              </div>

              {/* Grid graphic */}
              <div className="h-32 bg-brand-dark rounded-xl border border-brand-gold/20 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-ambient opacity-50" />
                <div className="relative z-10 text-center space-y-1">
                  <Navigation className="w-8 h-8 text-brand-gold mx-auto animate-bounce" />
                  <span className="text-[11px] font-mono text-brand-silver block">Automated SAPS Dispatch Vector Active</span>
                  <span className="text-[9px] font-mono text-emerald-400">Response Time: &lt; 2.4 Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — MISSION */}
      <section className="py-20 bg-brand-navy/60 border-y border-brand-gold/15 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Our Sovereign Mandate</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Every Child Deserves a Safe Journey Between Home and Education
          </h2>
          <p className="text-slate-300 text-base max-w-3xl mx-auto leading-relaxed">
            School transport routes, public walkways, and campus perimeters require continuous, non-intrusive protection. ITIS bridges the critical time gap between an emergency occurring and first responders arriving on scene.
          </p>
        </div>
      </section>

      {/* SECTION 3 — HOW ITIS PROTECTS A CHILD */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Lifecycle Protection Arc</span>
          <h2 className="text-3xl font-extrabold text-white">How ITIS Protects a Child in Real Time</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white">Smart IoT Wearable</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Learner wears a durable, tamper-evident device featuring continuous GPS/LBS telemetry and a concealed panic key.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white">Geofence Anomaly</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If a child strays from designated safe routes or presses SOS, the cloud engine detects the anomaly within 1.2 seconds.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white">Multi-Agency Dispatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Alerts simultaneously broadcast to SAPS 10111 command, EMS, school safety officers, and guardian smartphones.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-navy border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-white">Tactical On-Scene Response</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              First responders navigate directly to live coordinates and scan the child's Emergency QR Profile for immediate medical data.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CORE FEATURES */}
      <section className="py-20 bg-brand-navy/40 border-y border-brand-gold/15 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Capabilities</span>
            <h2 className="text-3xl font-extrabold text-white">Enterprise Public Safety Capabilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <Radio className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Multi-Network Cellular Fallback</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatic SIM roaming across MTN, Vodacom, and Telkom ensures telemetry signals transmit even in rural or congested corridors.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <MapPin className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Dynamic Safety Geofencing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schools and guardians define precise polygon safe zones with automated arrival and departure notifications.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <Phone className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">SAPS 10111 Emergency Integration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct API telemetry bridge feeds active emergency coordinates directly into police dispatch consoles.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <FileText className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Emergency Medical QR Profile</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paramedics scan wearable QR codes to view critical medical conditions, blood types, allergies, and emergency contacts.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <Building2 className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">School Attendance & Roll Call</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Principals monitor automated campus entry/exit records, eliminating manual roll-call overhead and unaccounted absences.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-brand-gold/20 space-y-3">
              <Lock className="w-7 h-7 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">POPIA Child Data Encryption</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                AES-256 state encryption ensures strictly authorized access to minor child data in compliance with South African privacy laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — BENEFITS */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Value Proposition</span>
          <h2 className="text-3xl font-extrabold text-white">Measurable Impact Across Key Stakeholders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel-heavy p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-extrabold text-brand-gold font-mono">&lt; 2s</span>
            <h3 className="text-xl font-bold text-white">Sub-Second Dispatch</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminating phone tree delays with instantaneous digital incident broadcasting.
            </p>
          </div>

          <div className="glass-panel-heavy p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-extrabold text-brand-gold font-mono">100%</span>
            <h3 className="text-xl font-bold text-white">POPIA Compliance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict audit logs, role-based encryption, and legal child privacy protections.
            </p>
          </div>

          <div className="glass-panel-heavy p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-extrabold text-brand-gold font-mono">24 / 7</span>
            <h3 className="text-xl font-bold text-white">Continuous Monitoring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uninterrupted real-time telemetry coverage during school journeys, sport travels, and home routes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHO USES ITIS */}
      <section className="py-20 bg-brand-navy/60 border-y border-brand-gold/15 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Ecosystem Stakeholders</span>
            <h2 className="text-3xl font-extrabold text-white">Who Relies on the ITIS Platform</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Users className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Guardians & Parents</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive instant arrival alerts, live map tracking, and direct panic controls on mobile devices.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Building2 className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">School Principals</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manage campus safety perimeters, emergency drills, and parent broadcasts seamlessly.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Shield className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">SAPS & Dispatchers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track live pursuit vectors, dispatch officers, and coordinate multi-jurisdictional emergency responses.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Heart className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">EMS & First Responders</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scan child medical profiles instantly to provide targeted, life-saving triage upon arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PARTNERS */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Interoperable Alliances</span>
        <h3 className="text-xl font-bold text-white">Integrated with Leading Public Safety Institutions</h3>
        
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-brand-gold/20 text-xs font-mono text-slate-300">
            Department of Basic Education (DBE)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-brand-gold/20 text-xs font-mono text-slate-300">
            South African Police Service (SAPS 10111)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-brand-gold/20 text-xs font-mono text-slate-300">
            Emergency Medical Services (EMS 112)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-brand-gold/20 text-xs font-mono text-slate-300">
            Metropolitan Traffic Alliances
          </div>
        </div>
      </section>

      {/* SECTION 8 — GOVERNMENT READINESS */}
      <section className="py-20 bg-brand-navy-heavy border-y border-brand-gold/20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <Landmark className="w-12 h-12 text-brand-gold mx-auto" />
          <h2 className="text-3xl font-extrabold text-white">Government & Institutional Deployment Ready</h2>
          <p className="text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Engineered to meet national public sector security standards with zero external dependencies, sovereign data residency in South Africa, and scale-to-zero Cloud Run container efficiency.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-brand-gold/15">
              <span className="text-xs font-bold text-brand-gold block font-mono">Sovereign Data Storage</span>
              <span className="text-[11px] text-slate-400">All child records hosted locally in RSA datacenters.</span>
            </div>
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-brand-gold/15">
              <span className="text-xs font-bold text-brand-gold block font-mono">Military Standard Hardware</span>
              <span className="text-[11px] text-slate-400">MIL-STD-810G shock and water resistant wearables.</span>
            </div>
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-brand-gold/15">
              <span className="text-xs font-bold text-brand-gold block font-mono">Zero Latency API Bridge</span>
              <span className="text-[11px] text-slate-400">Sub-second WebSocket & REST state synchronization.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — REQUEST DEMO */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full" id="request-demo">
        <div className="glass-panel-heavy p-8 sm:p-12 rounded-3xl border-2 border-brand-gold/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Executive Presentation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Schedule an Institutional Demonstration</h2>
            <p className="text-xs text-slate-300">Request a formal presentation for your School Governing Body, Municipality, or Department.</p>
          </div>

          {demoSubmitted ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Demonstration Request Received</h3>
              <p className="text-xs text-slate-300">
                An ITIS Public Safety Specialist will contact your office within 24 hours to coordinate an executive briefing.
              </p>
              <button 
                onClick={() => setDemoSubmitted(false)}
                className="px-4 py-2 bg-brand-navy border border-brand-gold/30 text-brand-gold text-xs font-mono rounded-lg hover:border-brand-gold"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Dr. Sipho Mthembu"
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Official Email</label>
                  <input 
                    type="email" 
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="s.mthembu@dbe.gov.za"
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Institution / Department</label>
                  <input 
                    type="text" 
                    required
                    value={demoOrganization}
                    onChange={(e) => setDemoOrganization(e.target.value)}
                    placeholder="Gauteng Department of Education"
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Role / Designation</label>
                  <select
                    value={demoRole}
                    onChange={(e) => setDemoRole(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                  >
                    <option>School Principal / SGB Member</option>
                    <option>Government Official / Administrator</option>
                    <option>Police / Public Safety Director</option>
                    <option>EMS / Emergency Coordinator</option>
                    <option>Corporate Partner / Investor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transform active:scale-95 transition-all"
              >
                Submit Briefing Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 10 — CONTACT */}
      <section className="py-16 bg-brand-navy/60 border-t border-brand-gold/15 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">ITIS Executive Safety Directorate</h3>
            <p className="text-xs text-slate-400 font-mono">Pretoria Central Security Complex, Republic of South Africa</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>General: +27 12 555 0199</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span>info@itis.gov.za</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/40 text-red-300 rounded font-bold">
              <span>Emergency Hotline: 10111 / 112</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FOOTER */}
      <footer className="bg-brand-navy-heavy border-t border-brand-gold/20 py-6 px-6 text-center text-xs text-slate-400 font-mono space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <img src={itisLogo} alt="ITIS Logo" className="w-6 h-6 rounded-full border border-brand-gold" />
            <span className="font-bold text-white">Integrated Technology Intelligence & Safety (ITIS)</span>
          </div>
          <span>© 2026 Republic of South Africa Public Safety Consortium</span>
          <span className="text-brand-gold">POPIA & MIL-STD-810G COMPLIANT</span>
        </div>
      </footer>

    </div>
  );
}
