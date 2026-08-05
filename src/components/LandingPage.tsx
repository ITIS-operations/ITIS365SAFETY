import React, { useState } from 'react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, Phone, Mail, 
  MapPin, Lock, ArrowRight, Landmark, FileText, Heart,
  Maximize2, ShieldCheck
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
      
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-brand-navy-heavy/95 backdrop-blur-md border-b border-brand-gold/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={itisLogo} 
            alt="ITIS Official Shield" 
            className="w-10 h-10 object-cover border-2 border-brand-gold rounded-full shadow-lg glow-gold"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-wide text-white">ITIS Child Safety Platform</span>
              <span className="hidden md:inline-block text-[10px] bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/30 font-medium">
                National Protection Service
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Integrated Technology Intelligence & Safety · Republic of South Africa
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#home" className="hover:text-brand-gold transition-colors">Home</a>
          <a href="#safety-journey" className="hover:text-brand-gold transition-colors">Safety Journey</a>
          <a href="#solutions" className="hover:text-brand-gold transition-colors">Solutions</a>
          <a href="#how-it-works" className="hover:text-brand-gold transition-colors">Who We Serve</a>
          <a href="#partners" className="hover:text-brand-gold transition-colors">Partners</a>
          <a href="#contact" className="hover:text-brand-gold transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="#request-demo"
            className="hidden sm:inline-flex items-center px-4 py-2 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-lg text-xs font-medium transition-all"
          >
            Request Demonstration
          </a>
          <button
            onClick={() => onOpenLogin('Parent')}
            className="px-4.5 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs rounded-lg shadow-md transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Portal Login</span>
          </button>
        </div>
      </header>

      {/* SECTION 1 — HERO SECTION */}
      <section id="home" className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-navy border border-brand-gold/30 rounded-full text-xs font-medium text-brand-gold shadow-sm">
            <Heart className="w-4 h-4 text-brand-gold fill-brand-gold/20" />
            <span>Trusted by Schools and Families</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Protecting Every Learner on Every Journey
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            ITIS connects parents, schools, transport operators, and emergency responders through one unified child safety platform — ensuring every child's journey is monitored with care, verified arrival, and human-guided coordination.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#request-demo"
              className="px-6 py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-sm rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Request Demonstration
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => onOpenLogin('Parent')}
              className="px-6 py-3.5 bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Portal Login</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> POPIA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Encrypted Communications</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Human-Verified Workflow</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Role-Based Security</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Audit Trail Enabled</span>
          </div>
        </div>

        {/* Command Centre Preview */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
          <div className="bg-brand-navy/90 rounded-2xl p-4 border border-brand-gold/30 shadow-2xl relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img src={itisLogo} alt="ITIS Shield" className="w-8 h-8 rounded-full border border-brand-gold" />
                <div>
                  <span className="text-xs font-bold text-white block">Command Centre Safety Operations</span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Safety Assistance
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-brand-dark px-2.5 py-1 rounded-full border border-brand-gold/20 text-brand-gold font-medium">
                Human Verification Standard
              </span>
            </div>

            {/* Command Centre Image Feature */}
            <div 
              className="relative rounded-xl overflow-hidden border border-brand-gold/20 group cursor-pointer shadow-lg"
              onClick={() => setShowImageModal(true)}
            >
              <img 
                src={itisCommandCentre} 
                alt="ITIS Safety Command Centre" 
                className="w-full h-64 sm:h-72 object-cover transform group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
              
              <div className="absolute top-3 right-3 bg-brand-navy-heavy/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-brand-gold/40 text-[10px] text-brand-gold flex items-center gap-1.5 shadow-md">
                <Maximize2 className="w-3 h-3" />
                <span>View Full Screen</span>
              </div>

              {/* Reassuring Capability Preview */}
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-brand-navy-heavy/90 backdrop-blur-md rounded-xl border border-brand-gold/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    Human-Verified Coordination
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
                    Active Operations
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                  <div className="bg-brand-dark/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">Live Coordination</span>
                    <span className="font-semibold text-emerald-400">Map Assisted</span>
                  </div>
                  <div className="bg-brand-dark/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">Learner Welfare</span>
                    <span className="font-semibold text-white">Active Monitoring</span>
                  </div>
                  <div className="bg-brand-dark/80 p-2 rounded-lg border border-slate-800 text-center">
                    <span className="text-slate-400 block text-[9px]">Family Alerts</span>
                    <span className="font-semibold text-brand-gold">Instant Sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Banner Guarantee */}
            <div className="p-2.5 bg-brand-dark/80 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-gold" />
                Human coordinator oversight for every alert
              </span>
              <span className="text-emerald-400 font-semibold text-[10px]">Verified Safe</span>
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
          <div className="relative max-w-5xl w-full bg-brand-navy-heavy border border-brand-gold/40 rounded-2xl overflow-hidden shadow-2xl p-3 space-y-3">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <img src={itisLogo} alt="Logo" className="w-7 h-7 rounded-full border border-brand-gold" />
                <span className="text-xs font-bold text-white">ITIS Safety Command Centre Overview</span>
              </div>
              <button 
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1 bg-brand-dark border border-slate-700 text-brand-gold text-xs rounded hover:bg-brand-gold hover:text-brand-dark transition-colors cursor-pointer"
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
      <section className="py-16 bg-brand-navy/60 border-y border-slate-800/80 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Our Mission</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Every Child Deserves a Safe Journey Between Home and School
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed font-normal">
            By connecting parents, school leaders, transport drivers, and emergency services into one gentle, human-verified safety network, ITIS gives families total confidence in their children's daily journeys.
          </p>
        </div>
      </section>

      {/* SECTION 3 — CHILD SAFETY STORY (THE PROTECTED JOURNEY) */}
      <section id="safety-journey" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Child Safety Story</span>
          <h2 className="text-3xl font-extrabold text-white">The Protected Journey</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            A step-by-step, reassuring experience designed for complete peace of mind from morning departure to evening return.
          </p>
        </div>

        {/* 7-Step Protected Day Lifecycle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {[
            { step: '1', title: 'Child Leaves Home', desc: 'Child departs home with wearable companion active.', icon: '🏠' },
            { step: '2', title: 'Transport Verified', desc: 'Boarding school transport automatically confirmed.', icon: '🚌' },
            { step: '3', title: 'Parent Notified', desc: 'Instant notification delivered to parent phone.', icon: '📱' },
            { step: '4', title: 'School Arrival', desc: 'Campus arrival verified as child enters school grounds.', icon: '🏫' },
            { step: '5', title: 'Safe Attendance', desc: 'Attendance confirmed in morning roll call.', icon: '✅' },
            { step: '6', title: 'Departure Verified', desc: 'Afternoon departure logged safely on afternoon route.', icon: '🚸' },
            { step: '7', title: 'Arrives Home Safely', desc: 'Final notification confirms child is safely back home.', icon: '🏡' },
          ].map((item) => (
            <div key={item.step} className="bg-brand-navy/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2 hover:border-brand-gold/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-brand-gold bg-brand-dark px-2 py-0.5 rounded border border-brand-gold/20">Step {item.step}</span>
                  <span className="text-lg">{item.icon}</span>
                </div>
                <strong className="text-xs font-bold text-white block">{item.title}</strong>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Human-Verified Coordination Story */}
        <div className="pt-8">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Careful Coordination</span>
            <h3 className="text-2xl font-bold text-white">How ITIS Responds with Care</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-brand-navy/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                01
              </div>
              <h4 className="text-base font-bold text-white">Wearable Companion</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Learners carry a gentle, durable safety device with an easy-access help button for immediate assistance.
              </p>
            </div>

            <div className="bg-brand-navy/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                02
              </div>
              <h4 className="text-base font-bold text-white">Smart Safe Zones</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If a child strays from their usual route, the system gently alerts safety coordinators to verify their position.
              </p>
            </div>

            <div className="bg-brand-navy/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                03
              </div>
              <h4 className="text-base font-bold text-white">Human Verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trained coordinators double-check every alert before notifying guardians and local emergency teams.
              </p>
            </div>

            <div className="bg-brand-navy/60 p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-dark border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                04
              </div>
              <h4 className="text-base font-bold text-white">Reassuring Assistance</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Safety personnel locate the child directly, access emergency medical details if needed, and confirm safe return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CORE SOLUTIONS & CAPABILITIES */}
      <section id="solutions" className="py-20 bg-brand-navy/40 border-y border-slate-800 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Platform Features</span>
            <h2 className="text-3xl font-extrabold text-white">Thoughtfully Designed for Child Safety</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <Radio className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">Reliable Nationwide Connectivity</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamless multi-network coverage ensures signal availability across urban corridors, suburbs, and rural communities.
              </p>
            </div>

            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <MapPin className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">Smart Safe Geofencing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Custom safe boundaries around schools, homes, and sports grounds automatically update guardians on arrival and departure.
              </p>
            </div>

            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <Phone className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">Emergency Coordination Link</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct connections to emergency services ensure immediate assistance when human coordinators verify an alert.
              </p>
            </div>

            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <FileText className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">Emergency Medical QR Profile</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                First responders scan a secure wearable QR code for essential blood type, allergy, and emergency contact info.
              </p>
            </div>

            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <Building2 className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">School Attendance Workspace</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Principals and teachers manage automated campus arrival logs, eliminating administrative overhead and unaccounted absences.
              </p>
            </div>

            <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 space-y-3">
              <Lock className="w-7 h-7 text-brand-gold" />
              <h3 className="text-base font-bold text-white">POPIA Child Data Protection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strict data encryption and role-based access control safeguard minor child records in full compliance with privacy laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — VALUE PROPOSITION */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Impact & Reassurance</span>
          <h2 className="text-3xl font-extrabold text-white">Built on Trust, Precision, and Care</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brand-navy/80 p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-bold text-brand-gold">Calm & Rapid</span>
            <h3 className="text-lg font-bold text-white">Human-Verified Response</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trained safety personnel confirm alert details before notifying families and emergency teams.
            </p>
          </div>

          <div className="bg-brand-navy/80 p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-bold text-brand-gold">100%</span>
            <h3 className="text-lg font-bold text-white">Privacy Compliance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full POPIA compliance with secure role-based permissions and strict audit trail logging.
            </p>
          </div>

          <div className="bg-brand-navy/80 p-8 rounded-2xl border border-brand-gold/30 space-y-4">
            <span className="text-3xl font-bold text-brand-gold">24 / 7</span>
            <h3 className="text-lg font-bold text-white">Continuous Protection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uninterrupted safety monitoring during school travel, sports outings, and home trips.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHO USES ITIS (STAKEHOLDERS) */}
      <section id="how-it-works" className="py-20 bg-brand-navy/60 border-y border-slate-800 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Who We Serve</span>
            <h2 className="text-3xl font-extrabold text-white">Unified Support for Every Role</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Users className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Parents & Guardians</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive instant arrival alerts, live map updates, and direct peace-of-mind communication on mobile devices.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Building2 className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">School Principals</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Monitor campus arrival records, verify student welfare, and coordinate school safety seamlessly.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Shield className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">Safety Coordinators</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manage live safety map coordination, verify alerts, and guide assistance with human care.
              </p>
            </div>

            <div className="p-6 bg-brand-dark rounded-2xl border border-slate-800 space-y-3">
              <Heart className="w-8 h-8 text-brand-gold" />
              <h3 className="text-lg font-bold text-white">First Responders</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Access verified location guidance and medical QR profiles for immediate, gentle assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PARTNERS */}
      <section id="partners" className="py-16 px-6 max-w-7xl mx-auto w-full text-center space-y-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Public Sector Integration</span>
        <h3 className="text-xl font-bold text-white">Collaborating with Key Public Safety Institutions</h3>
        
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-80">
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
            Department of Basic Education (DBE)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
            South African Police Service (SAPS)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
            Emergency Medical Services (EMS)
          </div>
          <div className="px-5 py-3 bg-brand-navy rounded-xl border border-slate-800 text-xs font-medium text-slate-300">
            Municipal Public Safety Alliances
          </div>
        </div>
      </section>

      {/* SECTION 8 — GOVERNMENT & INSTITUTIONAL READINESS */}
      <section className="py-20 bg-brand-navy-heavy border-y border-slate-800 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Landmark className="w-10 h-10 text-brand-gold mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Government & Institutional Deployment Ready</h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Designed to meet national public sector data security standards with local data residency in South Africa and dependable cloud infrastructure.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-brand-gold block">Sovereign Data Storage</span>
              <span className="text-[11px] text-slate-400">All child records stored securely in South Africa.</span>
            </div>
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-brand-gold block">Durable Wearable Devices</span>
              <span className="text-[11px] text-slate-400">Water-resistant, tamper-evident hardware.</span>
            </div>
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-brand-gold block">Instant Status Sync</span>
              <span className="text-[11px] text-slate-400">Real-time status updates across all portals.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — REQUEST DEMO FORM */}
      <section className="py-20 px-6 max-w-3xl mx-auto w-full" id="request-demo">
        <div className="bg-brand-navy/90 p-8 sm:p-10 rounded-3xl border border-brand-gold/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">Executive Presentation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Schedule an Institutional Demonstration</h2>
            <p className="text-xs text-slate-300">Request a presentation for your School Governing Body, Municipality, or Department.</p>
          </div>

          {demoSubmitted ? (
            <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Demonstration Request Received</h3>
              <p className="text-xs text-slate-300">
                An ITIS Child Safety Specialist will contact your office within 24 hours to coordinate a formal presentation.
              </p>
              <button 
                onClick={() => setDemoSubmitted(false)}
                className="px-4 py-2 bg-brand-dark border border-brand-gold/30 text-brand-gold text-xs rounded-lg hover:border-brand-gold cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="Dr. Sipho Mthembu"
                    className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Official Email</label>
                  <input 
                    type="email" 
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="mthokozisi@live.co.za"
                    className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Institution / Department</label>
                  <input 
                    type="text" 
                    required
                    value={demoOrganization}
                    onChange={(e) => setDemoOrganization(e.target.value)}
                    placeholder="Gauteng Department of Education"
                    className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role / Designation</label>
                  <select
                    value={demoRole}
                    onChange={(e) => setDemoRole(e.target.value)}
                    className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  >
                    <option>School Principal / SGB Member</option>
                    <option>Government Official / Administrator</option>
                    <option>Public Safety Coordinator</option>
                    <option>Emergency Services Coordinator</option>
                    <option>Corporate Partner / Investor</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transform active:scale-95 transition-all"
              >
                Submit Briefing Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 10 — CONTACT */}
      <section id="contact" className="py-16 bg-brand-navy/60 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">ITIS Child Safety Directorate</h3>
            <p className="text-xs text-slate-400 font-sans">Pretoria Security Complex, Republic of South Africa</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>General: 0624304906</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span>mthokozisi@live.co.za</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-500/30 text-red-300 rounded-lg font-medium">
              <span>Emergency Hotline: 0624304906 / 10111</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FOOTER */}
      <footer className="bg-brand-navy-heavy border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-400 font-sans space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <img src={itisLogo} alt="ITIS Logo" className="w-6 h-6 rounded-full border border-brand-gold" />
            <span className="font-semibold text-white">Integrated Technology Intelligence & Safety (ITIS)</span>
          </div>
          <span>© 2026 Republic of South Africa Public Safety Consortium</span>
          <span className="text-brand-gold font-medium">POPIA COMPLIANT</span>
        </div>
      </footer>

    </div>
  );
}

