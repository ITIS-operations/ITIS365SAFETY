import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, Phone, Mail, 
  MapPin, Lock, ArrowRight, Landmark, FileText, Heart,
  Maximize2, ShieldCheck, ChevronDown, ChevronRight,
  AlertTriangle, Send, Sparkles, Award, Eye, Clock, HelpCircle,
  Briefcase, GraduationCap, Scale, Stethoscope, Compass, ExternalLink, Check
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
  const [demoNotes, setDemoNotes] = useState('');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Progressive Disclosure Accordion State:
  // Only one section is expanded at a time (null = all collapsed)
  const [expandedSection, setExpandedSection] = useState<string | null>('who-we-are');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail || !demoName) return;
    setDemoSubmitted(true);
  };

  const scrollToDiscover = (sectionToOpen?: string) => {
    if (sectionToOpen) {
      setExpandedSection(sectionToOpen);
    }
    const element = document.getElementById('discover-itis');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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

        {/* Quick Actions in Header */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scrollToDiscover('request-demo')}
            className="hidden sm:inline-flex items-center px-4 py-2 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            Request Demonstration
          </button>
          <button
            onClick={() => onOpenLogin('Parent')}
            className="px-4.5 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs rounded-lg shadow-md transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>Portal Login</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION - Permanently Visible */}
      <section id="home" className="relative pt-10 pb-14 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10 overflow-hidden">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-navy border border-brand-gold/30 rounded-full text-xs font-medium text-brand-gold shadow-sm">
            <Heart className="w-4 h-4 text-brand-gold fill-brand-gold/20" />
            <span>Trusted National Child Safety Network</span>
          </div>

          {/* Core Tagline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight uppercase font-mono">
              Protecting Every Learner.
            </h1>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-gold leading-tight tracking-tight uppercase font-mono">
              Every Journey.
            </h1>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-400 leading-tight tracking-tight uppercase font-mono">
              Every Second.
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
            ITIS connects parents, schools, transport operators, and emergency responders through one unified child safety platform — ensuring every child's journey is monitored with care, verified arrival, and dedicated safety team support.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => scrollToDiscover('request-demo')}
              className="px-6 py-3.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-sm rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Request Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenLogin('Parent')}
              className="px-6 py-3.5 bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Portal Login</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> POPIA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Secure Emergency Alerts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Dedicated Safety Team</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete Activity Records</span>
          </div>

          {/* Smooth Scroll Indicator Button */}
          <div className="pt-2 flex justify-center lg:justify-start">
            <button
              onClick={() => scrollToDiscover('who-we-are')}
              className="px-5 py-2.5 bg-brand-navy/90 hover:bg-brand-navy border border-brand-gold/40 text-brand-gold rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-105"
            >
              <ChevronDown className="w-4 h-4 animate-bounce" />
              <span>Explore Discover ITIS</span>
            </button>
          </div>
        </div>

        {/* Command Centre Preview Card */}
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
                24/7 Safety Standard
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
                className="w-full h-60 sm:h-68 object-cover transform group-hover:scale-103 transition-transform duration-500"
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
                    Dedicated Safety Support
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
                24/7 Safety team support for every alert
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

      {/* DISCOVER ITIS — PROGRESSIVE DISCLOSURE ACCORDIONS */}
      <section id="discover-itis" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-navy border border-brand-gold/30 rounded-full text-xs font-mono text-brand-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLORE ITIS CHILD PROTECTION</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wider font-mono">
            DISCOVER ITIS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Tap any section below to learn how ITIS protects learners on every route and campus.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">

          {/* SECTION 1: WHO ITIS IS */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('who-we-are')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Who ITIS Is</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      National Safety Network
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    South Africa's Premier Child Protection Network
                  </p>
                </div>
              </div>
              
              <motion.div 
                animate={{ rotate: expandedSection === 'who-we-are' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 rounded-xl border border-brand-gold/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'who-we-are' && (
                <motion.div
                  key="content-who-we-are"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-brand-gold" />
                        <span>National Child Safety Network</span>
                      </h4>
                      <p>
                        <strong>ITIS (Integrated Technology Intelligence & Safety)</strong> is South Africa's premier child safety and emergency response network. Built specifically for local transport routes, school campus attendance, and family peace of mind, ITIS connects parents, schools, and emergency services into a complete protection net.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-brand-gold" /> 24/7 Dedicated Safety Officers
                        </span>
                        <p className="text-xs text-slate-300">
                          Every panic alert or route delay is evaluated by trained South African safety coordinators at our 24/7 Command Centre before emergency escalation.
                        </p>
                      </div>

                      <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Landmark className="w-4 h-4 text-brand-gold" /> Institutional Alliances
                        </span>
                        <p className="text-xs text-slate-300">
                          Collaborating with the Department of Basic Education (DBE), SAPS, Emergency Medical Services (EMS), and municipal transport authorities.
                        </p>
                      </div>

                      <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-brand-gold" /> Strict Privacy & Protection
                        </span>
                        <p className="text-xs text-slate-300">
                          100% POPIA compliant with strict South African privacy standards, protected accounts, and complete safety records.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 bg-brand-navy-heavy rounded-xl border border-brand-gold/30 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Empowering every parent, school principal, transport operator, and emergency responder with trusted real-time visibility.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 2: THE CHILD SAFETY CHALLENGE */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('the-challenge')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-300 transition-colors flex items-center gap-2">
                    <span>The Child Safety Challenge</span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30 hidden sm:inline-block">
                      Daily Commute Blindspots
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Closing the critical gaps in daily learner transit & attendance
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'the-challenge' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-red-400 p-2 bg-brand-dark/70 rounded-xl border border-red-500/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'the-challenge' && (
                <motion.div
                  key="content-the-challenge"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-red-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <span>The Vulnerability of Daily Learner Transit</span>
                      </h4>
                      <p>
                        Millions of South African school children travel daily via private scholar vans, public buses, or walking routes without verified tracking. When delays, vehicle breakdowns, or emergencies occur, parents and school administrators often remain unaware for hours.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 bg-red-950/30 rounded-xl border border-red-500/30 space-y-1.5">
                        <span className="font-bold text-red-300 block">1. Unmonitored Transit</span>
                        <p className="text-slate-400">Absence of verified boarding and drop-off logs for scholar transport vans and buses.</p>
                      </div>
                      <div className="p-4 bg-red-950/30 rounded-xl border border-red-500/30 space-y-1.5">
                        <span className="font-bold text-red-300 block">2. Delayed Emergency Action</span>
                        <p className="text-slate-400">Panic situations rely on phone calls instead of live GPS coordinates and medical profiles sent to responders.</p>
                      </div>
                      <div className="p-4 bg-red-950/30 rounded-xl border border-red-500/30 space-y-1.5">
                        <span className="font-bold text-red-300 block">3. Administrative Overhead</span>
                        <p className="text-slate-400">Manual paper roll calls delay discovery of absent children until late in the afternoon.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong>The Solution Needed:</strong> An intelligent, dedicated safety network that connects parents, principals, and first responders to eliminate blindspots and ensure instantaneous care.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: HOW ITIS PROTECTS EVERY JOURNEY */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('how-itis-protects')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span>How ITIS Protects Every Journey</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 hidden sm:inline-block">
                      7-Step Safety Shield
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    The 7-Step Protected Journey & Smart Companion Wearables
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'how-itis-protects' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-emerald-400 p-2 bg-brand-dark/70 rounded-xl border border-emerald-500/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'how-itis-protects' && (
                <motion.div
                  key="content-how-itis-protects"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-emerald-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>The 7-Step Protected Journey</span>
                      </h4>
                      <p>
                        ITIS wraps each child's routine in a 7-stage complete protection ring. From morning departure to afternoon return, every key milestone is verified:
                      </p>
                    </div>

                    {/* 7 Step Lifecycle Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                      {[
                        { step: '1', title: 'Child Departs', desc: 'Companion wearable active', icon: '🏠' },
                        { step: '2', title: 'Transport Verified', desc: 'Boarding confirmed', icon: '🚌' },
                        { step: '3', title: 'Parent Notified', desc: 'Instant app sync', icon: '📱' },
                        { step: '4', title: 'Campus Arrival', desc: 'Campus location verified', icon: '🏫' },
                        { step: '5', title: 'Attendance Logged', desc: 'Roll call confirmed', icon: '✅' },
                        { step: '6', title: 'Afternoon Return', desc: 'Bus route tracked', icon: '🚸' },
                        { step: '7', title: 'Safe at Home', desc: 'Parent arrival alert', icon: '🏡' },
                      ].map((s) => (
                        <div key={s.step} className="p-3 bg-brand-navy/70 rounded-xl border border-slate-800 flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-brand-gold bg-brand-dark px-1.5 py-0.5 rounded border border-brand-gold/20">Step {s.step}</span>
                            <span className="text-base">{s.icon}</span>
                          </div>
                          <span className="text-xs font-bold text-white block mt-1">{s.title}</span>
                          <span className="text-[10px] text-slate-400">{s.desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Radio className="w-4 h-4" /> Wearable Panic & QR Profile
                        </span>
                        <p className="text-xs text-slate-300">
                          Water-resistant companion wearables feature a single-touch emergency button and a secure QR code for first responder medical access.
                        </p>
                      </div>
                      <div className="p-4 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> Campus & Home Safe Zones
                        </span>
                        <p className="text-xs text-slate-300">
                          Automatic location boundaries around home, school grounds, and sports fields trigger calm status updates to guardians.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 4: WHY SCHOOLS, PARENTS AND GOVERNMENT TRUST ITIS */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('why-trust-itis')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  04
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Why Schools, Parents and Government Trust ITIS</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Multi-Stakeholder
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    POPIA Compliance, Zero Cost to Public Schools & Government Readiness
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'why-trust-itis' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 rounded-xl border border-brand-gold/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'why-trust-itis' && (
                <motion.div
                  key="content-why-trust-itis"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    
                    {/* Top Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-brand-navy/60 rounded-xl border border-brand-gold/30 space-y-2">
                        <span className="text-2xl font-black text-brand-gold font-mono">100%</span>
                        <h5 className="font-bold text-white">POPIA & Child Privacy</h5>
                        <p className="text-xs text-slate-300">Full compliance with minor data protection regulations, role-based encryption, and sovereign local storage.</p>
                      </div>
                      <div className="p-5 bg-brand-navy/60 rounded-xl border border-brand-gold/30 space-y-2">
                        <span className="text-2xl font-black text-brand-gold font-mono">0 RAND</span>
                        <h5 className="font-bold text-white">School Budget Impact</h5>
                        <p className="text-xs text-slate-300">Free platform access for public schools, subsidized via public-private safety partnerships.</p>
                      </div>
                      <div className="p-5 bg-brand-navy/60 rounded-xl border border-brand-gold/30 space-y-2">
                        <span className="text-2xl font-black text-brand-gold font-mono">24 / 7</span>
                        <h5 className="font-bold text-white">Continuous Oversight</h5>
                        <p className="text-xs text-slate-300">Human command centre oversight during daily commutes, school excursions, and sports events.</p>
                      </div>
                    </div>

                    {/* Dedicated Stakeholder Value Breakdown */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-bold text-brand-gold uppercase tracking-wider font-mono">
                        Tailored Value for Every Partner
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-brand-gold" /> Parents & Guardians
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Real-time peace of mind, arrival notifications, and immediate emergency SOS dispatch.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-brand-gold" /> School Principals & Teachers
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Automated digital attendance, zero budget impact, and instant campus alert broadcasts.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-brand-gold" /> Provincial Education Depts
                          </span>
                          <p className="text-[11px] text-slate-400">
                            District-wide safety reports, compliance logs, and protected student records.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-brand-gold" /> Municipalities & Transit
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Scholar transport tracking, driver credential verification, and route safety monitoring.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-red-400" /> SAPS & First Responders
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Precise GPS coordinates, wearable QR medical profiles, and verified incident escalation.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-brand-gold" /> Corporate Partners & Investors
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Measurable community impact, high security standards, and positive social outcome.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 5: HOW A DEMONSTRATION WORKS */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('request-demo')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  05
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                    <span>How a Demonstration Works</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30 hidden sm:inline-block">
                      Executive Briefings
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Schedule an executive briefing for your school, municipality, or department
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'request-demo' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-purple-400 p-2 bg-brand-dark/70 rounded-xl border border-purple-500/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'request-demo' && (
                <motion.div
                  key="content-request-demo"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-purple-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    
                    {/* Demonstration Explanation Steps */}
                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span>What Happens During an Executive Demonstration</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        Our Child Safety Specialists conduct tailored virtual or in-person briefings for School Governing Bodies (SGB), Municipalities, or Provincial Education Departments:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="p-3.5 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-purple-300 block">1. Security Needs Review</span>
                          <p className="text-[11px] text-slate-400">Analyzing learner transport routes, school gate entry points, and attendance protocols.</p>
                        </div>
                        <div className="p-3.5 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-purple-300 block">2. Live Simulation</span>
                          <p className="text-[11px] text-slate-400">Simulating wearable panic alerts, driver route tracking, and instant parent app notifications.</p>
                        </div>
                        <div className="p-3.5 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-purple-300 block">3. Rollout & Funding Plan</span>
                          <p className="text-[11px] text-slate-400">Reviewing POPIA compliance, zero-cost public school subsidies, and onboarding timelines.</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Section */}
                    <div className="pt-2">
                      {demoSubmitted ? (
                        <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3 max-w-lg mx-auto">
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
                        <form onSubmit={handleDemoSubmit} className="space-y-4 max-w-xl mx-auto bg-brand-navy/40 p-5 rounded-2xl border border-purple-500/20">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider text-center font-mono">
                            Request Executive Presentation
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                              <input 
                                type="text" 
                                required
                                value={demoName}
                                onChange={(e) => setDemoName(e.target.value)}
                                placeholder="Dr. Sipho Mthembu"
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
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
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
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
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">Role / Designation</label>
                              <select
                                value={demoRole}
                                onChange={(e) => setDemoRole(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
                              >
                                <option>School Principal / SGB Member</option>
                                <option>Government Official / Administrator</option>
                                <option>Public Safety Coordinator</option>
                                <option>Emergency Services Coordinator</option>
                                <option>Corporate Partner / Investor</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Additional Notes (Optional)</label>
                            <textarea
                              rows={2}
                              value={demoNotes}
                              onChange={(e) => setDemoNotes(e.target.value)}
                              placeholder="e.g., Requesting briefing for 1,200 learners across 3 campuses..."
                              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-sans resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transform active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Submit Executive Briefing Request</span>
                          </button>
                        </form>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 6: PORTAL ACCESS */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('portal-access')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  06
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Portal Access</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Authorized Login
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Access parent, school principal, command center, or responder portals
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'portal-access' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 rounded-xl border border-brand-gold/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'portal-access' && (
                <motion.div
                  key="content-portal-access"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    <div className="text-center space-y-1.5 max-w-xl mx-auto">
                      <h4 className="text-base font-bold text-white">Select Your Dedicated Stakeholder Workspace</h4>
                      <p className="text-xs text-slate-400">
                        Each stakeholder accesses a secure portal tailored to their specific safety responsibilities:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                      <button
                        onClick={() => onOpenLogin('Parent')}
                        className="p-5 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold rounded-2xl text-left space-y-3 hover:bg-brand-navy-heavy transition-all cursor-pointer group shadow-lg"
                      >
                        <Users className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-white block text-sm">Parent / Guardian</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Child location tracking & notification portal</span>
                        </div>
                        <div className="text-[10px] text-brand-gold font-mono flex items-center gap-1 font-bold pt-1">
                          <span>Enter Portal</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>

                      <button
                        onClick={() => onOpenLogin('School')}
                        className="p-5 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold rounded-2xl text-left space-y-3 hover:bg-brand-navy-heavy transition-all cursor-pointer group shadow-lg"
                      >
                        <Building2 className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-white block text-sm">School Principal</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Campus attendance & roll call workspace</span>
                        </div>
                        <div className="text-[10px] text-brand-gold font-mono flex items-center gap-1 font-bold pt-1">
                          <span>Enter Portal</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>

                      <button
                        onClick={() => onOpenLogin('Command')}
                        className="p-5 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold rounded-2xl text-left space-y-3 hover:bg-brand-navy-heavy transition-all cursor-pointer group shadow-lg"
                      >
                        <Shield className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-white block text-sm">Safety Coordinator</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">24/7 Command Centre live operations map</span>
                        </div>
                        <div className="text-[10px] text-brand-gold font-mono flex items-center gap-1 font-bold pt-1">
                          <span>Enter Portal</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>

                      <button
                        onClick={() => onOpenLogin('Technician')}
                        className="p-5 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold rounded-2xl text-left space-y-3 hover:bg-brand-navy-heavy transition-all cursor-pointer group shadow-lg"
                      >
                        <Phone className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="font-bold text-white block text-sm">First Responder</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">Emergency dispatch & QR medical profile</span>
                        </div>
                        <div className="text-[10px] text-red-400 font-mono flex items-center gap-1 font-bold pt-1">
                          <span>Enter Portal</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* FOOTER & INSTITUTIONAL ADDRESS */}
      <footer className="bg-brand-navy-heavy border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-400 font-sans space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
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
