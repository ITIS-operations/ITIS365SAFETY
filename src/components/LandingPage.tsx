import React, { useState } from 'react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, ChevronRight, Phone, Mail, 
  MapPin, Cpu, Lock, AlertTriangle, ArrowRight, Activity, Landmark, FileText, Heart, Sparkles, Navigation,
  Clock, Battery, Bus, UserCheck, Smartphone, Bell, Eye, Check, Maximize2
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import itisCommandCentre from '../assets/images/itis_command_centre_1785899117210.jpg';

interface LandingPageProps {
  onOpenLogin: (role?: string) => void;
}

export function LandingPage({ onOpenLogin }: LandingPageProps) {
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoOrganization, setDemoOrganization] = useState('');
  const [demoRole, setDemoRole] = useState('School Principal');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail || !demoName) return;
    setDemoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark bg-grid-ambient">
      
      {/* Executive Header Bar */}
      <header className="sticky top-0 z-50 bg-brand-navy-heavy/95 backdrop-blur-md border-b border-brand-gold/20 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={itisLogo} 
            alt="ITIS Official Shield" 
            className="w-10 h-10 object-cover border-2 border-brand-gold rounded-full shadow-lg glow-gold"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-wider text-white">ITIS CHILD SAFETY PLATFORM</span>
              <span className="hidden md:inline-block text-[9px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 font-mono uppercase font-semibold">
                National Child Safety Infrastructure
              </span>
            </div>
            <p className="text-[10px] text-brand-gold/90 font-mono tracking-widest uppercase hidden sm:block">
              Integrated Technology Intelligence & Safety · Republic of South Africa
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300">
          <a href="#home" className="hover:text-brand-gold transition-colors">Home</a>
          <a href="#solutions" className="hover:text-brand-gold transition-colors">Solutions</a>
          <a href="#how-it-works" className="hover:text-brand-gold transition-colors">How IT Works</a>
          <a href="#safety-journey" className="hover:text-brand-gold transition-colors">Safety Journey</a>
          <a href="#partners" className="hover:text-brand-gold transition-colors">Partners</a>
          <a href="#contact" className="hover:text-brand-gold transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a 
            href="#request-demo"
            className="hidden sm:inline-flex items-center px-3.5 py-2 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all"
          >
            Request Demo
          </a>
          <button
            onClick={() => onOpenLogin('Parent')}
            className="px-4 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs font-mono uppercase tracking-wider rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Portal Login</span>
          </button>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION */}
      <section id="home" className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-navy border border-brand-gold/30 rounded-full text-xs font-mono text-brand-gold shadow-md">
            <Shield className="w-4 h-4 text-brand-gold animate-pulse" />
            <span>Trusted by Schools, Parents & Emergency Responders</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Protecting Every Learner. Every Journey. Every Second.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            ITIS connects parents, schools, transport operators, and emergency responders through one unified child safety platform—combining non-intrusive wearable telemetry with human-verified GIS dispatch across South Africa.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#request-demo"
              className="px-6 py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-sm font-mono uppercase tracking-wider rounded-xl shadow-xl transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Request Demonstration
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => onOpenLogin('Parent')}
              className="px-6 py-3.5 bg-brand-navy border border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-sm font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Portal Login</span>
            </button>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-6 border-t border-brand-gold/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> POPIA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Encrypted Comms</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Human-Verified Workflow</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Audit Trail Enabled</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Role-Based Security</span>
          </div>
        </div>

        {/* Hero Illustration / National Operations Command Centre Photo */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
          <div className="glass-panel-heavy rounded-2xl p-4 border-2 border-brand-gold/30 shadow-2xl relative glow-gold overflow-hidden space-y-3">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-2.5 border-b border-brand-gold/20">
              <div className="flex items-center gap-2.5">
                <img src={itisLogo} alt="ITIS Shield" className="w-8 h-8 rounded-full border border-brand-gold" />
                <div>
                  <span className="text-xs font-bold text-white font-mono block">National Operations Command Centre</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 24/7 Active Tactical Monitoring
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-brand-dark px-2 py-1 rounded border border-brand-gold/20 text-brand-silver font-mono">
                SAPS-EMS-LINKED
              </span>
            </div>

            {/* National Command Centre Photo Feature */}
            <div 
              className="relative rounded-xl overflow-hidden border border-brand-gold/30 group cursor-pointer shadow-xl"
              onClick={() => setShowImageModal(true)}
            >
              <img 
                src={itisCommandCentre} 
                alt="ITIS National Operations Command Centre" 
                className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute top-3 right-3 bg-brand-navy-heavy/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-gold/40 text-[10px] font-mono text-brand-gold flex items-center gap-1.5 shadow-md">
                <Maximize2 className="w-3 h-3" />
                <span>Expand Feed</span>
              </div>

              {/* Live Overlay Stats Banner */}
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-brand-navy-heavy/90 backdrop-blur-md rounded-xl border border-brand-gold/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    INTEGRATED SAFETY COMMAND
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-dark px-2 py-0.5 rounded border border-brand-gold/30">
                    SLA &lt; 2.4 MIN
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-slate-300">
                  <div className="bg-brand-dark/80 p-1.5 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[8px]">Active Telemetry</span>
                    <span className="font-bold text-emerald-400">124 Units</span>
                  </div>
                  <div className="bg-brand-dark/80 p-1.5 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[8px]">GIS Coverage</span>
                    <span className="font-bold text-white">National RSA</span>
                  </div>
                  <div className="bg-brand-dark/80 p-1.5 rounded border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[8px]">Dispatch</span>
                    <span className="font-bold text-brand-gold">Human Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Banner Guarantee */}
            <div className="p-2.5 bg-brand-navy rounded-xl border border-brand-gold/25 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-gold" />
                Human Operator Verification Mandatory Before Dispatch
              </span>
              <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-5xl w-full bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl overflow-hidden shadow-2xl p-2 space-y-3">
            <div className="flex items-center justify-between px-4 py-2 border-b border-brand-gold/20">
              <div className="flex items-center gap-2">
                <img src={itisLogo} alt="Logo" className="w-7 h-7 rounded-full border border-brand-gold" />
                <span className="text-xs font-bold font-mono text-white">ITIS National Operations Command Centre · High-Resolution Feed</span>
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1 bg-brand-dark border border-brand-gold/30 text-brand-gold text-xs font-mono rounded hover:bg-brand-gold hover:text-brand-dark transition-colors"
              >
                Close ✕
              </button>
            </div>
            <img 
              src={itisCommandCentre} 
              alt="ITIS Command Centre Full Size" 
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl border border-slate-800"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* SECTION 2 — MISSION */}
      <section className="py-16 bg-brand-navy/60 border-y border-brand-gold/15 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Sovereign Protection Mandate</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Every Child Deserves a Safe Journey Between Home and Education
          </h2>
          <p className="text-slate-300 text-base max-w-3xl mx-auto leading-relaxed">
            School transport routes, public walkways, and campus perimeters require continuous, non-intrusive protection. ITIS bridges the critical time gap between an emergency occurring and first responders arriving on scene.
          </p>
        </div>
      </section>

      {/* SECTION 3 — HOW ITIS PROTECTS A CHILD: A DAY PROTECTED BY ITIS */}
      <section id="safety-journey" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Child Safety Storytelling</span>
          <h2 className="text-3xl font-extrabold text-white">A Day Protected by ITIS</h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            From morning departure to evening return, ITIS monitors every step to guarantee child safety and parental peace of mind.
          </p>
        </div>

        {/* 7-Step Protected Day Lifecycle Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[
            { step: '01', title: 'Home Departure', desc: 'Child leaves home with active wearable telemetry.', icon: '🏠' },
            { step: '02', title: 'Transport Verified', desc: 'Boarding bus or transport geofence confirmed.', icon: '🚌' },
            { step: '03', title: 'Parent Notified', desc: 'Instant push alert sent to guardian smartphone.', icon: '📱' },
            { step: '04', title: 'School Arrival', desc: 'Campus perimeter sensor logs child entry.', icon: '🏫' },
            { step: '05', title: 'Safe Attendance', desc: 'Automated roll call confirms active class state.', icon: '✅' },
            { step: '06', title: 'Departure Verified', desc: 'Afternoon bell exit logged with route lock.', icon: '🚸' },
            { step: '07', title: 'Arrives Home', desc: 'Safe arrival broadcast completes daily arc.', icon: '🏡' },
          ].map((item) => (
            <div key={item.step} className="glass-panel p-4 rounded-xl border border-brand-gold/20 flex flex-col justify-between space-y-2 hover:border-brand-gold/50 transition-all">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-navy px-2 py-0.5 rounded border border-brand-gold/30">{item.step}</span>
                  <span className="text-base">{item.icon}</span>
                </div>
                <strong className="text-xs font-bold text-white block">{item.title}</strong>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Incident Lifecycle Arc</span>
            <h3 className="text-xl font-bold text-white">Emergency Response in 4 Seconds</h3>
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
              <h3 className="text-base font-bold text-white">Human Operator Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alerts present to dispatch operators who verify signal, call guardian, and authorize SAPS/EMS response.
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
        </div>
      </section>

      {/* SECTION 4 — CORE SOLUTIONS & CAPABILITIES */}
      <section id="solutions" className="py-20 bg-brand-navy/40 border-y border-brand-gold/15 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Solutions</span>
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
              <h3 className="text-lg font-bold text-white">SAPS 10111 & EMS Integration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct API telemetry bridge feeds active emergency coordinates into command consoles with human operator approval.
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

      {/* SECTION 5 — VALUE PROPOSITION */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Value Proposition</span>
          <h2 className="text-3xl font-extrabold text-white">Measurable Impact Across Key Stakeholders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel-heavy p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-extrabold text-brand-gold font-mono">&lt; 2.4 min</span>
            <h3 className="text-xl font-bold text-white">Human-Verified Dispatch SLA</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Operator verification and dispatch recommendation target completed in under 2.4 minutes.
            </p>
          </div>

          <div className="glass-panel-heavy p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-extrabold text-brand-gold font-mono">100%</span>
            <h3 className="text-xl font-bold text-white">POPIA & Audit Compliance</h3>
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

      {/* SECTION 6 — WHO USES ITIS (HOW IT WORKS) */}
      <section id="how-it-works" className="py-20 bg-brand-navy/60 border-y border-brand-gold/15 px-6">
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
      <section id="partners" className="py-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Interoperable Alliances</span>
        <h3 className="text-xl font-bold text-white">Integrated with Leading Public Safety Institutions</h3>
        
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-80">
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

      {/* SECTION 8 — GOVERNMENT READINESS & TRUST */}
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
      <section id="contact" className="py-16 bg-brand-navy/60 border-t border-brand-gold/15 px-6">
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
