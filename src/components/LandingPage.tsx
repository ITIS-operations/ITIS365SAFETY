import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, Phone, Mail, 
  MapPin, Lock, ArrowRight, Landmark, FileText, Heart,
  Maximize2, ShieldCheck, ChevronDown, ChevronRight,
  AlertTriangle, Send, Sparkles, Award, Eye, Clock, HelpCircle,
  Briefcase, GraduationCap, Scale, Stethoscope, Compass, ExternalLink, Check,
  Newspaper, FileCheck, X, Search, Globe, ShieldAlert, BookOpen, Tag, Bell, Building, AlertCircle, Download
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import itisCommandCentre from '../assets/images/itis_command_centre_1785899117210.jpg';
import { CareersCentre } from './CareersCentre';

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

  // Careers Centre Modal State
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [careersTab, setCareersTab] = useState<'explore' | 'why-itis' | 'programmes' | 'ats'>('explore');

  // News & Media Modal State
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [newsCategory, setNewsCategory] = useState<'all' | 'press' | 'partnerships' | 'product' | 'community' | 'awards'>('all');
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<any | null>(null);

  // Legal & POPIA Trust Centre Modal State
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<'popia' | 'privacy' | 'terms' | 'security' | 'ai-ethics' | 'accessibility'>('popia');

  // Progressive Disclosure Accordion State:
  // Only one section is expanded at a time (null = all collapsed)
  const [expandedSection, setExpandedSection] = useState<string | null>('who-we-are');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => (prev === sectionId ? null : sectionId));
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
        <div className="flex items-center gap-3.5">
          <img 
            src={itisLogo} 
            alt="ITIS Official Shield" 
            className="w-14 h-14 sm:w-16 sm:h-16 object-cover border-2 border-brand-gold rounded-full shadow-2xl glow-gold shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-extrabold tracking-wide text-white">ITIS Child Safety Platform</span>
              <span className="hidden md:inline-block text-[10px] bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/30 font-medium">
                National Protection Service
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Integrated Technology Intelligence & Safety · Republic of South Africa
            </p>
          </div>
        </div>

        {/* Quick Actions in Header Navigation (Rebalanced without Careers) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => scrollToDiscover('request-demo')}
            className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            Request Demonstration
          </button>

          <button
            onClick={() => onOpenLogin('Parent')}
            className="px-5 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-extrabold text-xs rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
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
          <div 
            id="accordion-card-who-we-are"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'who-we-are'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-2xl ring-1 ring-brand-gold/30'
                : 'bg-brand-navy/70 border border-brand-gold/25 hover:border-brand-gold/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-who-we-are"
              aria-expanded={expandedSection === 'who-we-are'}
              aria-controls="accordion-content-who-we-are"
              onClick={() => toggleSection('who-we-are')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'who-we-are' && (
                <motion.div
                  key="content-who-we-are"
                  id="accordion-content-who-we-are"
                  role="region"
                  aria-labelledby="accordion-header-who-we-are"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 2: THE CHILD SAFETY CHALLENGE */}
          <div 
            id="accordion-card-the-challenge"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'the-challenge'
                ? 'bg-brand-navy border border-red-500/60 shadow-2xl ring-1 ring-red-500/30'
                : 'bg-brand-navy/70 border border-red-500/25 hover:border-red-500/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-the-challenge"
              aria-expanded={expandedSection === 'the-challenge'}
              aria-controls="accordion-content-the-challenge"
              onClick={() => toggleSection('the-challenge')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-red-400 p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-red-500/30 shrink-0 group-hover:border-red-500/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'the-challenge' && (
                <motion.div
                  key="content-the-challenge"
                  id="accordion-content-the-challenge"
                  role="region"
                  aria-labelledby="accordion-header-the-challenge"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-red-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: HOW ITIS PROTECTS EVERY JOURNEY */}
          <div 
            id="accordion-card-how-itis-protects"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'how-itis-protects'
                ? 'bg-brand-navy border border-emerald-500/60 shadow-2xl ring-1 ring-emerald-500/30'
                : 'bg-brand-navy/70 border border-emerald-500/25 hover:border-emerald-500/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-how-itis-protects"
              aria-expanded={expandedSection === 'how-itis-protects'}
              aria-controls="accordion-content-how-itis-protects"
              onClick={() => toggleSection('how-itis-protects')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-emerald-400 p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-emerald-500/30 shrink-0 group-hover:border-emerald-500/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'how-itis-protects' && (
                <motion.div
                  key="content-how-itis-protects"
                  id="accordion-content-how-itis-protects"
                  role="region"
                  aria-labelledby="accordion-header-how-itis-protects"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-emerald-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
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
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 4: WHY SCHOOLS, PARENTS AND GOVERNMENT TRUST ITIS */}
          <div 
            id="accordion-card-why-trust-itis"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'why-trust-itis'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-2xl ring-1 ring-brand-gold/30'
                : 'bg-brand-navy/70 border border-brand-gold/25 hover:border-brand-gold/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-why-trust-itis"
              aria-expanded={expandedSection === 'why-trust-itis'}
              aria-controls="accordion-content-why-trust-itis"
              onClick={() => toggleSection('why-trust-itis')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'why-trust-itis' && (
                <motion.div
                  key="content-why-trust-itis"
                  id="accordion-content-why-trust-itis"
                  role="region"
                  aria-labelledby="accordion-header-why-trust-itis"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
                    
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

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 5: HOW A DEMONSTRATION WORKS */}
          <div 
            id="accordion-card-request-demo"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'request-demo'
                ? 'bg-brand-navy border border-purple-500/60 shadow-2xl ring-1 ring-purple-500/30'
                : 'bg-brand-navy/70 border border-purple-500/25 hover:border-purple-500/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-request-demo"
              aria-expanded={expandedSection === 'request-demo'}
              aria-controls="accordion-content-request-demo"
              onClick={() => toggleSection('request-demo')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-purple-400 p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-purple-500/30 shrink-0 group-hover:border-purple-500/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'request-demo' && (
                <motion.div
                  key="content-request-demo"
                  id="accordion-content-request-demo"
                  role="region"
                  aria-labelledby="accordion-header-request-demo"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-purple-500/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
                    
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

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 6: CAREERS & TALENT CENTRE */}
          <div 
            id="accordion-card-careers-centre"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'careers-centre'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-2xl ring-1 ring-brand-gold/30'
                : 'bg-brand-navy/70 border border-brand-gold/25 hover:border-brand-gold/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-careers-centre"
              aria-expanded={expandedSection === 'careers-centre'}
              aria-controls="accordion-content-careers-centre"
              onClick={() => toggleSection('careers-centre')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  06
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Careers & Talent Opportunities</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 hidden sm:inline-block">
                      Recruitment Portal
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Join South Africa's premier public safety technology and emergency engineering team
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'careers-centre' ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'careers-centre' && (
                <motion.div
                  key="content-careers-centre"
                  id="accordion-content-careers-centre"
                  role="region"
                  aria-labelledby="accordion-header-careers-centre"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-brand-navy border border-brand-gold/30 rounded-2xl">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/15 text-brand-gold text-xs font-mono font-bold rounded-full">
                          <Briefcase className="w-3.5 h-3.5" /> ITIS Careers Centre
                        </div>
                        <h4 className="text-lg font-bold text-white">Protecting Every Learner Requires World-Class Talent</h4>
                        <p className="text-xs text-slate-300 max-w-xl">
                          We are hiring across Executive Leadership, Command Centre Dispatch, GIS Telemetry, Full-Stack Software Engineering, Fleet Operations, Cybersecurity, Emergency Coordination, Marketing, and Youth Graduate Programmes.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        <button
                          onClick={() => {
                            setCareersTab('explore');
                            setIsCareersOpen(true);
                          }}
                          className="px-5 py-3 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl shadow-lg hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>View All Open Positions</span>
                        </button>

                        <button
                          onClick={() => {
                            setCareersTab('programmes');
                            setIsCareersOpen(true);
                          }}
                          className="px-5 py-3 bg-brand-navy border border-brand-gold/40 text-brand-gold font-bold text-xs rounded-xl hover:bg-brand-navy-heavy transition-all cursor-pointer flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>Graduate & Youth Programmes</span>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 7: PORTAL ACCESS */}
          <div 
            id="accordion-card-portal-access"
            className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
              expandedSection === 'portal-access'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-2xl ring-1 ring-brand-gold/30'
                : 'bg-brand-navy/70 border border-brand-gold/25 hover:border-brand-gold/45 hover:bg-brand-navy/90'
            }`}
          >
            <button
              id="accordion-header-portal-access"
              aria-expanded={expandedSection === 'portal-access'}
              aria-controls="accordion-content-portal-access"
              onClick={() => toggleSection('portal-access')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  07
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
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 group-hover:bg-brand-dark rounded-xl border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/60 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'portal-access' && (
                <motion.div
                  key="content-portal-access"
                  id="accordion-content-portal-access"
                  role="region"
                  aria-labelledby="accordion-header-portal-access"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: 0.03, ease: "easeOut" }}
                    className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed"
                  >
                    
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

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 6: CAREERS & TALENT CENTRE */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('careers-centre')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  06
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Careers & Talent Opportunities</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 hidden sm:inline-block">
                      Recruitment Portal
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Join South Africa's premier public safety technology and emergency engineering team
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'careers-centre' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/70 rounded-xl border border-brand-gold/30 shrink-0"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'careers-centre' && (
                <motion.div
                  key="content-careers-centre"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="p-6 sm:p-8 bg-brand-dark/95 border-t border-brand-gold/20 space-y-6 font-sans text-sm text-slate-300 leading-relaxed">
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-brand-navy border border-brand-gold/30 rounded-2xl">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/15 text-brand-gold text-xs font-mono font-bold rounded-full">
                          <Briefcase className="w-3.5 h-3.5" /> ITIS Careers Centre
                        </div>
                        <h4 className="text-lg font-bold text-white">Protecting Every Learner Requires World-Class Talent</h4>
                        <p className="text-xs text-slate-300 max-w-xl">
                          We are hiring across Executive Leadership, Command Centre Dispatch, GIS Telemetry, Full-Stack Software Engineering, Fleet Operations, Cybersecurity, Emergency Coordination, Marketing, and Youth Graduate Programmes.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                        <button
                          onClick={() => {
                            setCareersTab('explore');
                            setIsCareersOpen(true);
                          }}
                          className="px-5 py-3 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl shadow-lg hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center gap-2"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>View All Open Positions</span>
                        </button>

                        <button
                          onClick={() => {
                            setCareersTab('programmes');
                            setIsCareersOpen(true);
                          }}
                          className="px-5 py-3 bg-brand-navy border border-brand-gold/40 text-brand-gold font-bold text-xs rounded-xl hover:bg-brand-navy-heavy transition-all cursor-pointer flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>Graduate & Youth Programmes</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 7: PORTAL ACCESS */}
          <div className="bg-brand-navy/80 border border-brand-gold/30 rounded-2xl overflow-hidden shadow-xl transition-all">
            <button
              onClick={() => toggleSection('portal-access')}
              className="w-full min-h-[56px] py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  07
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

      {/* EXECUTIVE TRUST CENTRE & FOOTER */}
      <footer className="bg-brand-navy-heavy border-t border-brand-gold/30 font-sans">
        
        {/* TOP TRUST & COMPLIANCE BADGE STRIP */}
        <div className="border-b border-brand-gold/20 bg-brand-navy/90 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img src={itisLogo} alt="ITIS Official Shield" className="w-12 h-12 rounded-full border-2 border-brand-gold shadow-xl glow-gold shrink-0 object-cover" />
              <div>
                <span className="font-bold text-white text-sm block">Integrated Technology Intelligence & Safety (ITIS)</span>
                <span className="text-[11px] text-slate-400 font-sans block">Protecting Every Learner. Every Journey. Every Second.</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> POPIA Compliant (Act 4 of 2013)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/60 border border-purple-500/30 text-purple-300 rounded-full">
                <Radio className="w-3.5 h-3.5 text-purple-300" /> 24/7 Command Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/60 border border-blue-500/30 text-blue-300 rounded-full">
                <Users className="w-3.5 h-3.5 text-blue-300" /> Human-Verified AI
              </span>
            </div>
          </div>
        </div>

        {/* 5-COLUMN MAIN FOOTER NAVIGATION */}
        <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-slate-300">
          
          {/* COLUMN 1: ABOUT ITIS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-gold" /> About ITIS
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ITIS is South Africa's national child safety technology platform, providing real-time telemetry, scholar transit geofencing, and emergency dispatch for over 2.4 million learners.
            </p>
            <ul className="space-y-2 pt-1 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('accordion-card-who-we-are');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Our Mission & Vision
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('accordion-card-why-trust-itis');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Public Safety Consortium
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('why-itis');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Executive Governance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('popia');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer text-brand-gold font-medium"
                >
                  <ShieldCheck className="w-3 h-3" /> Child Protection Mandate
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: PLATFORM & PORTALS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-gold" /> Platform & Portals
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => onOpenLogin('Guardian')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium group"
                >
                  <Heart className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" /> Parent & Guardian Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLogin('School')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium group"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" /> School Principal Workspace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLogin('Command')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium group"
                >
                  <Shield className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" /> National Command Centre
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLogin('Technician')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium group"
                >
                  <Phone className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" /> Emergency Responder Portal
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => {
                    const el = document.getElementById('accordion-card-request-demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded-lg hover:bg-purple-900/80 transition-colors cursor-pointer font-mono text-[11px]"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Request Executive Briefing
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: NEWS & MEDIA HUB */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Newspaper className="w-4 h-4 text-brand-gold" /> News & Media Hub
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('press');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Official Press Releases
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('partnerships');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> School & Dept Partnerships
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('product');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> GIS Telemetry & V2.4 Updates
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('community');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Emergency Safety Guides
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('all');
                    setIsNewsOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-brand-gold font-bold hover:underline pt-1 cursor-pointer"
                >
                  <span>Explore Newsroom & Media Kit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CAREERS & TALENT */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-gold" /> Careers & Talent
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('explore');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium"
                >
                  <span>View All Open Vacancies</span>
                  <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/30">14 Active</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('why-itis');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Life at ITIS Safety Labs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('programmes');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Youth & Graduate Academy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('ats');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer text-emerald-400 font-medium"
                >
                  <FileCheck className="w-3.5 h-3.5" /> HR Recruitment Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('explore');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer text-slate-400 text-[11px]"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Join Talent Network
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: LEGAL, POPIA & COMPLIANCE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-brand-gold" /> Legal & Governance
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('popia');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer text-emerald-400 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> POPIA Act Compliance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('privacy');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Privacy & Child Protection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('terms');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Terms of Service & SLA
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('security');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-brand-gold" /> Security & Cryptography
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('ai-ethics');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Responsible AI Ethics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('accessibility');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1 cursor-pointer text-slate-400"
                >
                  <Globe className="w-3.5 h-3.5" /> Accessibility Statement
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* NATIONAL OPERATIONS HEADQUARTERS & DIRECT CONTACT BANNER */}
        <div className="border-t border-brand-gold/15 bg-brand-navy/60 py-6 px-6 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-white block text-xs">National Command Headquarters</span>
                <p className="text-[11px] text-slate-400">
                  ITIS Public Safety Building, Pretoria West & Sandton Campus, Gauteng, Republic of South Africa
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 shrink-0">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">24/7 Dispatch Hotline</span>
                  <span className="font-mono font-bold text-white text-xs">0800 365 911 / +27 11 365 0000</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Official Enquiries</span>
                  <span className="font-mono text-brand-gold text-xs">support@itis.gov.za</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Operations Status</span>
                  <span className="font-mono text-emerald-400 text-xs">24/7/365 Continuous Live</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="border-t border-slate-800 bg-brand-dark py-5 px-6 text-[11px] text-slate-400 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>© 2026 Integrated Technology Intelligence & Safety (ITIS). Republic of South Africa Public Safety Consortium. All Rights Reserved.</span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
              <button onClick={() => { setSelectedLegalDoc('popia'); setIsLegalOpen(true); }} className="hover:text-brand-gold cursor-pointer">POPIA</button>
              <span>•</span>
              <button onClick={() => { setSelectedLegalDoc('privacy'); setIsLegalOpen(true); }} className="hover:text-brand-gold cursor-pointer">Privacy</button>
              <span>•</span>
              <button onClick={() => { setSelectedLegalDoc('terms'); setIsLegalOpen(true); }} className="hover:text-brand-gold cursor-pointer">Terms</button>
              <span>•</span>
              <button onClick={() => { setSelectedLegalDoc('security'); setIsLegalOpen(true); }} className="hover:text-brand-gold cursor-pointer">Security</button>
              <span>•</span>
              <button onClick={() => { setSelectedLegalDoc('accessibility'); setIsLegalOpen(true); }} className="hover:text-brand-gold cursor-pointer">Accessibility</button>
            </div>
          </div>
        </div>

      </footer>

      {/* Careers Centre Component Modal */}
      <CareersCentre
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
        initialTab={careersTab}
      />

      {/* NEWS & MEDIA HUB MODAL */}
      <AnimatePresence>
        {isNewsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-4xl bg-brand-navy border border-brand-gold/40 rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 bg-brand-navy-heavy border-b border-brand-gold/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold rounded-2xl">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>ITIS Newsroom & Media Hub</span>
                      <span className="px-2 py-0.5 bg-brand-gold/15 text-brand-gold text-[10px] font-mono rounded-full border border-brand-gold/30">
                        Official Communications
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      Press releases, provincial partnerships, telemetry updates, and community child safety news
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsNewsOpen(false);
                    setSelectedNewsArticle(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-brand-dark rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
                
                {selectedNewsArticle ? (
                  /* Single Article Reader View */
                  <div className="space-y-6">
                    <button
                      onClick={() => setSelectedNewsArticle(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-gold hover:underline cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" /> Back to Newsroom List
                    </button>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-mono text-[10px] rounded-full uppercase">
                          {selectedNewsArticle.category}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" /> {selectedNewsArticle.date}
                        </span>
                        <span className="text-xs text-slate-500">• {selectedNewsArticle.readTime}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {selectedNewsArticle.title}
                      </h2>

                      <p className="text-xs text-brand-gold/90 font-mono">
                        Issued by: {selectedNewsArticle.author}
                      </p>
                    </div>

                    <div className="p-4 bg-brand-dark/80 rounded-2xl border border-brand-gold/20 text-xs text-slate-300 leading-relaxed space-y-3">
                      <p className="font-semibold text-white">
                        {selectedNewsArticle.summary}
                      </p>
                      <p className="text-slate-300">
                        {selectedNewsArticle.content}
                      </p>
                    </div>

                    <div className="p-4 bg-brand-navy-heavy/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verified Official Statement • Reference: ITIS-PR-2026-08</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => alert("Official press release document downloaded (PDF).")}
                          className="px-3 py-1.5 bg-brand-dark border border-brand-gold/30 text-brand-gold rounded-lg hover:bg-brand-navy transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                        >
                          <Download className="w-3.5 h-3.5" /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* News List View */
                  <div className="space-y-6">
                    
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
                      {[
                        { id: 'all', label: 'All News & Updates' },
                        { id: 'press', label: 'Press Releases' },
                        { id: 'partnerships', label: 'School Partnerships' },
                        { id: 'product', label: 'GIS & V2.4 Updates' },
                        { id: 'community', label: 'Safety Guides' },
                        { id: 'awards', label: 'Awards & Summit' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setNewsCategory(cat.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                            newsCategory === cat.id
                              ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                              : 'bg-brand-dark/80 text-slate-300 border border-slate-800 hover:border-brand-gold/40'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: 1,
                          category: 'partnerships',
                          categoryLabel: 'School Partnerships',
                          date: 'August 4, 2026',
                          readTime: '3 min read',
                          author: 'ITIS Communications Directorate',
                          title: 'Gauteng Education Department Expands ITIS Smart Learner Safety Network to 450 Additional Schools',
                          summary: 'A joint announcement with the Provincial Department confirms immediate rollout of ITIS telemetry gateways across Johannesburg and Tshwane scholar transit corridors.',
                          content: 'Johannesburg, South Africa — The Gauteng Department of Education in partnership with the Integrated Technology Intelligence & Safety (ITIS) Consortium has announced the second phase expansion of its public school safety telemetry system. Covering over 380,000 learners, the expansion deploys 2,400 IoT transport gateways and provides instant panic SOS wearables to scholar transport drivers and school monitors. Phase 1 metrics demonstrated a 94.2% reduction in unauthorized route deviations and sub-180-second response dispatch times by SAPS and local EMS units.'
                        },
                        {
                          id: 2,
                          category: 'product',
                          categoryLabel: 'GIS & V2.4 Updates',
                          date: 'July 28, 2026',
                          readTime: '4 min read',
                          author: 'ITIS Engineering & GIS Labs',
                          title: 'ITIS Unveils Version 2.4 Command Centre Engine with Real-Time Route Anomaly Detection',
                          summary: 'The upgraded command centre platform introduces sub-second geofence deviation detection and human-verified automated emergency escalation.',
                          content: 'Pretoria — ITIS Enterprise Platform V2.4 introduces machine-learning route predictive analysis specifically tuned for South African road networks and informal scholar transport corridors. The system cross-references municipal traffic telemetry, weather radar, and vehicle diagnostic sensors to predict potential transit delays or unauthorized stops before they turn into critical incidents.'
                        },
                        {
                          id: 3,
                          category: 'awards',
                          categoryLabel: 'Awards & Summit',
                          date: 'July 15, 2026',
                          readTime: '2 min read',
                          author: 'Public Technology Awards Board',
                          title: 'National Child Safety Award Presented to ITIS Consortium at RSA Public Innovation Summit',
                          summary: 'Recognized for pioneering zero-data-monetization child safety infrastructure and POPIA-compliant real-time emergency dispatch.',
                          content: 'Cape Town — The ITIS Enterprise Platform was awarded the 2026 RSA Public Innovation Trophy for Excellence in Digital Governance and Child Protection Technology. Judges praised ITIS\'s strict POPIA data isolation framework, ensuring zero commercial exploitation of learner telemetry while delivering military-grade emergency dispatch capabilities.'
                        },
                        {
                          id: 4,
                          category: 'community',
                          categoryLabel: 'Safety Guides',
                          date: 'June 30, 2026',
                          readTime: '3 min read',
                          author: 'ITIS Talent & Community Division',
                          title: 'ITIS Launches 2027 Youth Graduate Technology & Emergency Operations Academy',
                          summary: '120 fully funded graduate positions opened for South African university graduates in GIS telemetry, cybersecurity, and emergency dispatch.',
                          content: 'Sandton — As part of its social impact mandate, ITIS has opened applications for its 12-month paid Graduate Acceleration Programme. Selected candidates will gain hands-on experience in mission-critical public safety engineering, real-time command centre operations, and ISO 27001 cybersecurity defense.'
                        },
                        {
                          id: 5,
                          category: 'press',
                          categoryLabel: 'Press Releases',
                          date: 'May 19, 2026',
                          readTime: '5 min read',
                          author: 'Office of the Information Security Officer',
                          title: 'Official Press Release: ITIS Reaffirms Strict Zero-Data-Selling Policy and Immutable POPIA Guarantee',
                          summary: 'ITIS publishes its biannual independent cybersecurity audit report, confirming 100% compliance with POPIA Act 4 of 2013.',
                          content: 'Centurion — In response to growing public concern around digital tracking technologies, ITIS has published its complete independent cryptographic audit logs. All learner tracking data is strictly purged after 30 days unless subject to an active law enforcement incident investigation.'
                        }
                      ]
                        .filter(a => newsCategory === 'all' || a.category === newsCategory)
                        .map((article) => (
                          <div 
                            key={article.id}
                            onClick={() => setSelectedNewsArticle(article)}
                            className="p-5 bg-brand-dark/80 hover:bg-brand-navy border border-slate-800 hover:border-brand-gold/40 rounded-2xl transition-all cursor-pointer space-y-3 group shadow-md"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="px-2 py-0.5 bg-brand-gold/15 text-brand-gold rounded border border-brand-gold/30 uppercase font-bold">
                                {article.categoryLabel}
                              </span>
                              <span className="text-slate-400">{article.date}</span>
                            </div>

                            <h4 className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                              {article.title}
                            </h4>

                            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                              {article.summary}
                            </p>

                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                              <span className="text-slate-400 font-mono text-[10px]">{article.author}</span>
                              <span className="text-brand-gold font-mono font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Read Article <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Media Contact & Alerts Box */}
                    <div className="p-5 bg-brand-navy-heavy border border-brand-gold/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-brand-gold" /> Media & Official Enquiries
                        </span>
                        <p className="text-xs text-slate-300">
                          For press interviews, broadcast assets, or provincial safety data briefs, contact media@itis.org.za
                        </p>
                      </div>
                      <button
                        onClick={() => alert("Subscribed to ITIS Media Alerts.")}
                        className="px-4 py-2.5 bg-brand-gold text-brand-dark font-bold text-xs rounded-xl hover:bg-brand-gold-dark transition-all shrink-0 cursor-pointer"
                      >
                        Subscribe to Media Alerts
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LEGAL, POPIA & TRUST CENTRE MODAL */}
      <AnimatePresence>
        {isLegalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-5xl bg-brand-navy border border-brand-gold/40 rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="p-6 bg-brand-navy-heavy border-b border-brand-gold/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-2xl">
                    <Scale className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>ITIS Legal & Compliance Trust Centre</span>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded-full border border-emerald-500/30">
                        IR-RSA-2026-ITIS Registered
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      POPIA Act 4 of 2013 compliance, child data privacy safeguards, SLA guarantees, and AI ethics
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLegalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-brand-dark rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body with Sidebar Navigation */}
              <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
                
                {/* Left Sidebar Tabs */}
                <div className="p-4 bg-brand-navy-heavy/80 border-r border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-3 py-1 font-bold">
                    Official Documents
                  </span>

                  {[
                    { id: 'popia', label: 'POPIA Act Framework', icon: ShieldCheck, badge: 'RSA Act 4' },
                    { id: 'privacy', label: 'Child Privacy Policy', icon: Lock, badge: '30-Day Purge' },
                    { id: 'terms', label: 'Terms of Service & SLA', icon: FileText, badge: '99.95% SLA' },
                    { id: 'security', label: 'Security & Encryption', icon: Shield, badge: 'AES-256' },
                    { id: 'ai-ethics', label: 'Responsible AI Principles', icon: Sparkles, badge: 'Human-in-Loop' },
                    { id: 'accessibility', label: 'Accessibility Statement', icon: Globe, badge: 'WCAG 2.1 AA' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedLegalDoc === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedLegalDoc(item.id as any)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-sans transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                            : 'text-slate-300 hover:bg-brand-dark hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-dark' : 'text-brand-gold'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-brand-dark text-brand-gold' : 'bg-brand-dark text-slate-400 border border-slate-800'
                        }`}>
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Document Display Area */}
                <div className="md:col-span-3 p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto font-sans text-xs text-slate-300 leading-relaxed bg-brand-dark/95">
                  
                  {/* Document Header Metadata */}
                  <div className="p-4 bg-brand-navy border border-brand-gold/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                        • Republic of South Africa Information Regulator Aligned
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase font-mono">
                        {selectedLegalDoc === 'popia' && 'POPIA Compliance Framework (Act 4 of 2013)'}
                        {selectedLegalDoc === 'privacy' && 'Child Data Privacy & Telemetry Safeguards Policy'}
                        {selectedLegalDoc === 'terms' && 'Master Terms of Service & Municipal SLA Standards'}
                        {selectedLegalDoc === 'security' && 'Cryptographic Security & Zero-Trust Architecture'}
                        {selectedLegalDoc === 'ai-ethics' && 'Responsible AI & Emergency Dispatch Ethics Code'}
                        {selectedLegalDoc === 'accessibility' && 'National Accessibility & Multi-Lingual Statement'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Doc ID: ITIS-GOV-2026-v3.2 • Effective Date: 1 January 2026
                      </p>
                    </div>

                    <button
                      onClick={() => alert(`Downloaded official document: ${selectedLegalDoc.toUpperCase()}-ITIS-2026.pdf`)}
                      className="px-3.5 py-2 bg-brand-dark border border-brand-gold/40 text-brand-gold text-xs rounded-xl hover:bg-brand-navy transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 font-mono"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>

                  {/* Document Content Sections */}
                  {selectedLegalDoc === 'popia' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Legislative Mandate & Registration</h5>
                      <p>
                        The Integrated Technology Intelligence & Safety (ITIS) platform is registered under the Protection of Personal Information Act (Act 4 of 2013) with the Information Regulator of South Africa.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Lawful Basis for Processing Children's Information</h5>
                      <p>
                        Under Section 26 and Section 35 of POPIA, personal information concerning children constitutes Special Personal Information. ITIS processes learner location telemetry and school transit data strictly under lawful consent provided by verified Parents, Legal Guardians, or designated School Principals acting in <em>loco parentis</em>.
                      </p>

                      <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 rounded-xl space-y-2">
                        <span className="font-bold text-emerald-400 block text-xs">Zero-Data Monetization Guarantee</span>
                        <p className="text-slate-300 text-[11px]">
                          ITIS guarantees that no learner telemetry, route history, medical profile, or attendance log is ever commercialized, sold, rented, or exposed to third-party ad networks under any circumstances.
                        </p>
                      </div>

                      <h5 className="text-sm font-bold text-white">3. Data Retention & 30-Day Expiration Policy</h5>
                      <p>
                        GPS coordinates, route history, and panic button signal telemetry are encrypted and retained for a maximum of 30 days before automated cryptographic purging, unless explicitly flagged by SAPS or Law Enforcement under an active missing child investigation.
                      </p>
                    </div>
                  )}

                  {selectedLegalDoc === 'privacy' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Child Data Minimization Standard</h5>
                      <p>
                        ITIS collects only the minimum necessary telemetry parameters required to ensure child safety: GPS coordinates, scholar transit vehicle ID, school gate RFID scan timestamps, and panic button status. No voice recording, facial recognition, or web browsing data is collected.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Parental Access & Right to Deletion</h5>
                      <p>
                        Parents and legal guardians retain full ownership over their child's profile. Through the Parent Portal, parents can request complete data export or instant profile deactivation at any time.
                      </p>

                      <h5 className="text-sm font-bold text-white">3. QR Emergency Medical Profile Privacy</h5>
                      <p>
                        Emergency medical notes stored on learner wearable badges are encrypted. They are strictly decryptable by certified EMS paramedics during a active panic SOS emergency session using single-use session keys.
                      </p>
                    </div>
                  )}

                  {selectedLegalDoc === 'terms' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Service Level Agreement (SLA)</h5>
                      <p>
                        ITIS guarantees 99.95% continuous infrastructure availability across all provincial scholar transport corridors. In the event of network disruption, local gateway devices cache telemetry offline and re-sync instantly upon signal restoration.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Emergency Escalation Latency</h5>
                      <p>
                        Panic button triggers activate command centre operator consoles within less than 2.5 seconds of trigger, automatically dispatching localized SMS and push alerts to parents and designated school safety officers.
                      </p>
                    </div>
                  )}

                  {selectedLegalDoc === 'security' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Zero-Trust Cryptographic Architecture</h5>
                      <p>
                        All ITIS server communications utilize TLS 1.3 encryption in transit and AES-256-GCM encryption at rest. Telemetry streams are cryptographically signed at the IoT gateway hardware layer to prevent spoofing.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Role-Based Access Control (RBAC)</h5>
                      <p>
                        Strict cryptographically enforced user permissions ensure that parents can only view their own child, school principals can only view their registered campus, and first responders receive access strictly during active emergency dispatches.
                      </p>
                    </div>
                  )}

                  {selectedLegalDoc === 'ai-ethics' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Human-in-the-Loop Emergency Authority</h5>
                      <p>
                        Artificial Intelligence models on the ITIS platform are strictly advisory. Machine learning algorithms analyze route deviations and speed anomalies, but all emergency dispatch decisions require human operator verification at the National Command Centre.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Algorithmic Non-Discrimination</h5>
                      <p>
                        Anomaly detection models operate exclusively on spatial geofence boundaries, vehicle speed vectors, and signal diagnostics. The algorithms do not process demographic, economic, or personal identity traits.
                      </p>
                    </div>
                  )}

                  {selectedLegalDoc === 'accessibility' && (
                    <div className="space-y-4">
                      <h5 className="text-sm font-bold text-white">1. Universal Public Safety Access</h5>
                      <p>
                        ITIS is committed to ensuring full accessibility for all parents, educators, and responders, compliant with WCAG 2.1 Level AA standards.
                      </p>

                      <h5 className="text-sm font-bold text-white">2. Multi-Lingual Support</h5>
                      <p>
                        Emergency panic alerts, parent notifications, and school SMS updates are rendered across South Africa's official languages including English, isiZulu, Afrikaans, and Sesotho.
                      </p>
                    </div>
                  )}

                  {/* Document Footer Audit Seal */}
                  <div className="p-4 bg-brand-navy border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" /> Information Regulator RSA Seal Verified
                    </span>
                    <span>Audit Log ID: #2026-GOV-SAFE-992</span>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
