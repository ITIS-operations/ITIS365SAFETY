import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Radio, Users, Building2, CheckCircle2, Phone, Mail, 
  MapPin, Lock, ArrowRight, Landmark, FileText, Heart,
  Maximize2, ShieldCheck, ChevronDown, ChevronRight,
  AlertTriangle, Send, Sparkles, Award, Eye, Clock, HelpCircle,
  Briefcase, GraduationCap, Scale, Stethoscope, Compass, ExternalLink, Check,
  Newspaper, FileCheck, X, Search, Globe, ShieldAlert, BookOpen, Tag, Bell, Building, AlertCircle, Download, Target
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

  // Controls visibility of lower discovery section (hidden by default on landing)
  const [isDiscoverExpanded, setIsDiscoverExpanded] = useState(false);

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
    setIsDiscoverExpanded(true);
    if (sectionToOpen) {
      setExpandedSection(sectionToOpen);
    }
    setTimeout(() => {
      const targetId = sectionToOpen ? `accordion-card-${sectionToOpen}` : 'discover-itis';
      const element = document.getElementById(targetId) || document.getElementById('discover-itis');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
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
              <span className="text-base sm:text-xl font-extrabold tracking-wide text-white">ITIS Guardian Network</span>
              <span className="hidden md:inline-block text-[10px] bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/30 font-medium">
                National Protection Ecosystem
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Integrated Technology Intelligence & Safety (ITIS) · Republic of South Africa
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
            <span>South Africa's Intelligent Child Protection Network</span>
          </div>

          {/* Core Tagline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-brand-gold leading-tight tracking-tight uppercase font-mono">
              ITIS Guardian Network
            </h1>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase font-mono">
              Protecting Every Learner.
            </h2>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-gold leading-tight tracking-tight uppercase font-mono">
              Every Journey.
            </h2>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-400 leading-tight tracking-tight uppercase font-mono">
              Every Second.
            </h2>
          </div>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
            ITIS Guardian Network brings together families, schools, emergency responders, and government into one intelligent child protection network that helps prevent kidnappings, disappearances, violence, and other high-risk incidents while enabling rapid, coordinated emergency response.
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
              onClick={() => scrollToDiscover('portal-access')}
              className="px-6 py-3.5 bg-brand-navy border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Portal Access</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> POPIA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Secure Emergency Alerts</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Dedicated Safety Team</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete Activity Records</span>
          </div>

          {/* Smooth Scroll & Discovery Toggle Button */}
          <div className="pt-2 flex justify-center lg:justify-start">
            <button
              onClick={() => setIsDiscoverExpanded(prev => !prev)}
              aria-expanded={isDiscoverExpanded}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-md ${
                isDiscoverExpanded 
                  ? 'bg-brand-gold/15 border-2 border-brand-gold text-brand-gold shadow-brand-gold/20 ring-1 ring-brand-gold/30' 
                  : 'bg-brand-navy/90 hover:bg-brand-navy border border-brand-gold/40 text-brand-gold hover:border-brand-gold hover:scale-105'
              }`}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDiscoverExpanded ? 'rotate-180 text-brand-gold' : 'animate-bounce'}`} />
              <span>{isDiscoverExpanded ? 'Collapse the ITIS Guardian Network' : 'Explore the ITIS Guardian Network'}</span>
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

      {/* MASTER ACCORDION — WELCOME TO ITIS */}
      <section id="discover-itis" className="py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="bg-brand-navy border border-brand-gold/40 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          
          {/* MASTER ACCORDION HEADER (Always visible, collapsed ~90-110px, sticky when expanded) */}
          <button
            id="master-accordion-header"
            aria-expanded={isDiscoverExpanded}
            aria-controls="master-accordion-content"
            onClick={() => {
              setIsDiscoverExpanded(prev => !prev);
              if (!isDiscoverExpanded) {
                setTimeout(() => {
                  const el = document.getElementById('discover-itis');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 60);
              }
            }}
            className={`w-full py-5 px-5 sm:px-8 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
              isDiscoverExpanded 
                ? 'sticky top-16 z-30 bg-brand-navy-heavy/95 backdrop-blur-md border-b border-brand-gold/30 shadow-md' 
                : 'bg-brand-navy hover:bg-brand-navy/90'
            }`}
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-brand-gold/15 border border-brand-gold/30 rounded-full text-[11px] font-mono font-bold text-brand-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXECUTIVE BRIEFING & PLATFORM DISCOVERY</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wider font-mono group-hover:text-brand-gold transition-colors flex items-center gap-2">
                <span>WELCOME TO ITIS</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans font-medium">
                Everything you need to know about South Africa's Intelligent Child Protection Network.
              </p>
              <span className="text-[11px] font-mono text-slate-400 block pt-0.5">
                {isDiscoverExpanded ? 'Tap to collapse executive briefing panel' : 'Tap to discover how ITIS protects every learner.'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <span className="px-3.5 py-1.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full text-xs font-mono font-bold group-hover:bg-brand-gold/20 transition-colors">
                {isDiscoverExpanded ? 'Collapse' : 'Explore'}
              </span>
              <motion.div
                animate={{ rotate: isDiscoverExpanded ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-2 bg-brand-dark/90 rounded-xl border border-brand-gold/40 group-hover:border-brand-gold transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </button>

          {/* MASTER ACCORDION EXPANDABLE CONTENT */}
          <AnimatePresence initial={false}>
            {isDiscoverExpanded && (
              <motion.div
                key="master-content"
                id="master-accordion-content"
                role="region"
                aria-labelledby="master-accordion-header"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden bg-brand-dark/60 p-4 sm:p-6 space-y-6"
              >

        {/* 30-SECOND EXECUTIVE OVERVIEW (ANSWERS ALL 7 QUESTIONS IN UNDER 30 SECONDS) */}
        <div className="bg-brand-navy/90 rounded-2xl p-5 sm:p-6 border border-brand-gold/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-brand-gold/20 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-gold/15 px-2.5 py-0.5 rounded-full border border-brand-gold/30 uppercase">
                30-Second Executive Briefing
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white font-mono mt-1">
                7 Core Questions Answered
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Instant Answers for Guardians, Principals & Government
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Q1: Who is ITIS? */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-1.5 flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Question 01</span>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Who is ITIS?</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Integrated Technology Intelligence & Safety (ITIS) Guardian Network is South Africa's national child protection ecosystem.
                </p>
              </div>
              <button
                onClick={() => scrollToDiscover('who-we-are')}
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1 pt-1 font-semibold cursor-pointer"
              >
                <span>Read Full Mission & Vision</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Q2: Why does it exist? */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-1.5 flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Question 02</span>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Why does it exist?</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  To eliminate transit safety blindspots, prevent disappearances and kidnappings, and safeguard every learner from departure to home return.
                </p>
              </div>
              <button
                onClick={() => scrollToDiscover('who-we-are')}
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1 pt-1 font-semibold cursor-pointer"
              >
                <span>Read Purpose & Core Mandate</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Q3: What problem does it solve? */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-1.5 flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Question 03</span>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>What problem does it solve?</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Delayed emergency response, unmonitored transit corridors, unreported absenteeism, and fragmented emergency communication.
                </p>
              </div>
              <button
                onClick={() => scrollToDiscover('the-challenge')}
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1 pt-1 font-semibold cursor-pointer"
              >
                <span>Read Threat & Vulnerability Analysis</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Q4: How does it protect children? */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-1.5 flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Question 04</span>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>How does it protect children?</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Through a 7-step verified journey, smart companion wearables with SOS panic buttons, geofenced campus safe zones, and 24/7 command center dispatch.
                </p>
              </div>
              <button
                onClick={() => scrollToDiscover('how-itis-protects')}
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1 pt-1 font-semibold cursor-pointer"
              >
                <span>View 7-Step Journey & Products</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Q5: Why should I trust it? */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-1.5 flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Question 05</span>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Why should I trust it?</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  POPIA Act compliance (Act 4 of 2013), bank-grade AES-256 encryption, 30-day automatic data purge, and certified human-in-the-loop decision making.
                </p>
              </div>
              <button
                onClick={() => scrollToDiscover('why-trust-itis')}
                className="text-[10px] font-mono text-brand-gold hover:underline flex items-center gap-1 pt-1 font-semibold cursor-pointer"
              >
                <span>Read 9 Institutional Trust Pillars</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Q6 & Q7: How to Request Demo & Access Portal */}
            <div className="p-3.5 bg-brand-dark/90 rounded-xl border border-brand-gold/25 space-y-2 flex flex-col justify-between hover:border-brand-gold/50 transition-colors col-span-1 md:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-wider block">Questions 06 & 07</span>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Demo & Portal Access</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    Schedule an executive presentation for your school or municipality, or access your authorized portal.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  onClick={() => scrollToDiscover('request-demo')}
                  className="w-full py-1.5 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-center"
                >
                  Request Demonstration Form
                </button>
                <button
                  onClick={() => onOpenLogin()}
                  className="w-full py-1.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark rounded-lg text-[10px] font-mono font-extrabold transition-all cursor-pointer text-center shadow-md"
                >
                  Portal Login Gateway
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-2.5">

          {/* SECTION 01: WHO ITIS IS */}
          <div 
            id="accordion-card-who-we-are"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'who-we-are'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-who-we-are"
              aria-expanded={expandedSection === 'who-we-are'}
              aria-controls="accordion-content-who-we-are"
              onClick={() => toggleSection('who-we-are')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  01
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Who We Are</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      National Ecosystem
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    South Africa's Intelligent Child Protection Network
                  </p>
                </div>
              </div>
              
              <motion.div 
                animate={{ rotate: expandedSection === 'who-we-are' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-3">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                        <span>South Africa's Intelligent Child Protection Network</span>
                      </h4>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                        <strong className="text-white font-semibold">ITIS Guardian Network</strong> is an integrated national child protection ecosystem developed to help safeguard learners from kidnapping, disappearances, violence, medical emergencies, and other high-risk incidents.
                      </p>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        By securely connecting parents, schools, emergency responders, and government agencies, ITIS provides real-time situational awareness, verified emergency coordination, and human-centred protection throughout every learner's day.
                      </p>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Every alert is supported by intelligent technology, but every critical decision remains under trained human supervision.
                      </p>
                    </div>

                    {/* Mission & Vision Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="p-4 bg-brand-navy/80 rounded-xl border border-brand-gold/30 space-y-2">
                        <div className="flex items-center gap-2 text-brand-gold font-mono font-bold text-xs uppercase tracking-wider">
                          <Target className="w-4 h-4 text-brand-gold shrink-0" />
                          <span>Our Mission</span>
                        </div>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                          Protecting every learner through intelligent technology, trusted partnerships, and coordinated emergency response that helps prevent kidnapping, disappearances, violence, injuries, and other high-risk incidents.
                        </p>
                      </div>

                      <div className="p-4 bg-brand-navy/80 rounded-xl border border-brand-gold/30 space-y-2">
                        <div className="flex items-center gap-2 text-brand-gold font-mono font-bold text-xs uppercase tracking-wider">
                          <Eye className="w-4 h-4 text-brand-gold shrink-0" />
                          <span>Our Vision</span>
                        </div>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                          To become Africa's most trusted child protection network, ensuring every learner can travel, learn, and return home safely through intelligent technology, coordinated emergency response, and human-centred protection.
                        </p>
                      </div>
                    </div>

                    {/* Core Values */}
                    <div className="space-y-2.5 pt-1">
                      <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Our Core Values</span>
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Every Learner',
                          'Human First',
                          'Integrity',
                          'Accountability',
                          'Rapid Response',
                          'Innovation',
                          'Partnership',
                          'Privacy',
                          'Trust',
                          'Continuous Protection'
                        ].map((val) => (
                          <span 
                            key={val} 
                            className="px-3 py-1 bg-brand-navy/90 text-slate-200 rounded-lg border border-brand-gold/30 text-xs font-medium hover:border-brand-gold/60 transition-colors"
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-brand-navy-heavy rounded-xl border border-brand-gold/40 text-center space-y-1 shadow-inner">
                      <p className="text-brand-gold font-mono font-bold text-xs sm:text-sm tracking-wider uppercase">
                        Protecting Every Learner. Every Journey. Every Second.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 02: THE CHILD SAFETY CHALLENGE */}
          <div 
            id="accordion-card-the-challenge"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'the-challenge'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-the-challenge"
              aria-expanded={expandedSection === 'the-challenge'}
              aria-controls="accordion-content-the-challenge"
              onClick={() => toggleSection('the-challenge')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  02
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>The Child Protection Imperative</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      National Ecosystem
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    Closing critical safety blindspots through early detection & human verification
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'the-challenge' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                        <span>High-Risk Threats & Critical Vulnerabilities</span>
                      </h4>
                      <p className="text-slate-300 text-xs sm:text-sm">
                        Every day, millions of South African school children face acute risks during daily transit and school attendance. Without coordinated situational awareness, critical minutes are lost during life-threatening emergencies.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-brand-gold" /> Kidnappings & Disappearances
                        </span>
                        <p className="text-slate-400 text-[11px]">Unmonitored transit routes create dangerous blindspots where children can go missing without immediate detection.</p>
                      </div>

                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" /> Unreported Absenteeism
                        </span>
                        <p className="text-slate-400 text-[11px]">Manual paper roll calls mean parents and principals only discover a child hasn't arrived safely hours after school starts.</p>
                      </div>

                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-brand-gold" /> Medical & Violence Emergencies
                        </span>
                        <p className="text-slate-400 text-[11px]">Accidents, medical episodes, or violence near schools suffer delayed dispatch when responders lack precise live coordinates.</p>
                      </div>

                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-brand-gold" /> Communication Breakdown
                        </span>
                        <p className="text-slate-400 text-[11px]">Panic situations cause fragmented phone calls between panic-stricken parents, confused drivers, and busy schools.</p>
                      </div>

                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-gold" /> Child Exploitation & Bullying
                        </span>
                        <p className="text-slate-400 text-[11px]">Off-campus transport stops without verified adult supervision increase exposure to exploitation or violence.</p>
                      </div>

                      <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-brand-gold" /> Lack of Coordinated Response
                        </span>
                        <p className="text-slate-400 text-[11px]">Fragmented security providers lack a central, human-verified dispatch standard dedicated strictly to child protection.</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/30 text-xs text-slate-200">
                      <strong className="text-brand-gold">The Solution ITIS Delivers:</strong> An intelligent national network connecting parents, principals, SAPS, and EMS to eliminate transit blindspots and mobilize instant emergency response when every second matters.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 03: HOW ITIS PROTECTS EVERY JOURNEY */}
          <div 
            id="accordion-card-how-itis-protects"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'how-itis-protects'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-how-itis-protects"
              aria-expanded={expandedSection === 'how-itis-protects'}
              aria-controls="accordion-content-how-itis-protects"
              onClick={() => toggleSection('how-itis-protects')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  03
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>How ITIS Protects Every Journey</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      7-Step Safety Shield
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    The 7-Step Protected Journey & Smart Companion Wearables
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'how-itis-protects' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
                        <span>The 7-Step Protected Journey</span>
                      </h4>
                      <p className="text-slate-300 text-xs sm:text-sm">
                        ITIS wraps each child's routine in a 7-stage complete protection ring. From morning departure to afternoon return, every key milestone is verified:
                      </p>
                    </div>

                    {/* 7 Step Lifecycle Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                      {[
                        { step: '1', title: 'Child Departs', desc: 'Wearable active', icon: '🏠' },
                        { step: '2', title: 'Transport Verified', desc: 'Boarding confirmed', icon: '🚌' },
                        { step: '3', title: 'Parent Notified', desc: 'Instant app sync', icon: '📱' },
                        { step: '4', title: 'Campus Arrival', desc: 'Location verified', icon: '🏫' },
                        { step: '5', title: 'Attendance Logged', desc: 'Roll call confirmed', icon: '✅' },
                        { step: '6', title: 'Afternoon Return', desc: 'Bus route tracked', icon: '🚸' },
                        { step: '7', title: 'Safe at Home', desc: 'Parent alert', icon: '🏡' },
                      ].map((s) => (
                        <div key={s.step} className="p-2.5 bg-brand-navy/60 rounded-lg border border-slate-800 flex flex-col justify-between space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-brand-gold bg-brand-dark px-1.5 py-0.5 rounded border border-brand-gold/20">Step {s.step}</span>
                            <span className="text-sm">{s.icon}</span>
                          </div>
                          <span className="text-[11px] font-bold text-white block mt-0.5">{s.title}</span>
                          <span className="text-[10px] text-slate-400">{s.desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-brand-gold" /> Wearable Panic & QR Profile
                        </span>
                        <p className="text-[11px] text-slate-300">
                          Water-resistant companion wearables feature a single-touch emergency button and a secure QR code for first responder medical access.
                        </p>
                      </div>
                      <div className="p-3.5 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-xs font-bold text-brand-gold flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold" /> Campus & Home Safe Zones
                        </span>
                        <p className="text-[11px] text-slate-300">
                          Automatic location boundaries around home, school grounds, and sports fields trigger calm status updates to guardians.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 04: UNIFIED ITIS PRODUCT ARCHITECTURE */}
          <div 
            id="accordion-card-product-architecture"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'product-architecture'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-product-architecture"
              aria-expanded={expandedSection === 'product-architecture'}
              aria-controls="accordion-content-product-architecture"
              onClick={() => toggleSection('product-architecture')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  04
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>ITIS Product Architecture</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Unified Product Suite
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    Master Brand, Platform & Unified Product Suite
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'product-architecture' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {expandedSection === 'product-architecture' && (
                <motion.div
                  key="content-product-architecture"
                  id="accordion-content-product-architecture"
                  role="region"
                  aria-labelledby="accordion-header-product-architecture"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    {/* Master Brand & Platform Box */}
                    <div className="p-4 bg-brand-navy/90 rounded-xl border border-brand-gold/40 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold block font-bold">
                            Master Brand
                          </span>
                          <h4 className="text-xl font-black text-white font-mono flex items-center gap-2">
                            <span>ITIS</span>
                            <span className="text-xs font-sans text-slate-300 font-normal">
                              (Integrated Technology Intelligence & Safety)
                            </span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            The official national umbrella standard for South Africa's public safety technology.
                          </p>
                        </div>

                        <div className="space-y-1 border-t md:border-t-0 md:border-l border-brand-gold/20 pt-3 md:pt-0 md:pl-4">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-gold block font-bold">
                            Ecosystem Platform
                          </span>
                          <h4 className="text-xl font-black text-brand-gold font-mono flex items-center gap-2">
                            <span>ITIS Guardian Network</span>
                          </h4>
                          <p className="text-xs text-slate-300">
                            The central protective cloud intelligence layer unifying families, schools, first responders, and government.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products Grid Header */}
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span>Unified Products Suite</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        All products share one enterprise design system, consistent typography, and unified role-based navigation.
                      </p>
                    </div>

                    {/* 9 Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        {
                          name: 'ITIS Parent',
                          role: 'Family Protection Portal',
                          desc: 'Real-time learner tracking, geofence boundary alerts, arrival notifications, and instant emergency panic triggering for guardians.',
                          icon: Heart
                        },
                        {
                          name: 'ITIS School',
                          role: 'Campus Safety & Roll-Call',
                          desc: 'Automated digital attendance, campus visitor QR scanning, excursion safety logs, and principal-to-parent broadcasts.',
                          icon: GraduationCap
                        },
                        {
                          name: 'ITIS Command',
                          role: '24/7 Central Dispatch Console',
                          desc: 'Sub-second spatial GIS telemetry, 15-second alarm triage, operator verification, and multi-agency escalation.',
                          icon: Radio
                        },
                        {
                          name: 'ITIS Responder',
                          role: 'Tactical Field Unit Dispatch',
                          desc: 'Field emergency navigation, live coordinates relay, wearable medical QR scanning, and tactical scene management.',
                          icon: Stethoscope
                        },
                        {
                          name: 'ITIS Intelligence',
                          role: 'Predictive Threat Analysis',
                          desc: 'Route risk analysis, threat pattern modeling, early-intervention risk algorithms, and automated anomaly detection.',
                          icon: Globe
                        },
                        {
                          name: 'ITIS Verify',
                          role: 'Zero-Trust Identity & Vetting',
                          desc: 'POPIA-compliant child profile verification, driver vetting, role-based access tokens, and cryptographic security.',
                          icon: Lock
                        },
                        {
                          name: 'ITIS Academy',
                          role: 'Safety Officer Accreditation',
                          desc: 'Accredited child protection training modules, emergency response simulations, and campus safety officer certifications.',
                          icon: BookOpen
                        },
                        {
                          name: 'ITIS Analytics',
                          role: 'Executive Public Safety Reporting',
                          desc: 'Provincial executive scorecards, district safety compliance metrics, SLA response time tracking, and government audit reporting.',
                          icon: ShieldCheck
                        },
                        {
                          name: 'ITIS Operations',
                          role: 'Fleet & Wearables Lifecycle',
                          desc: 'Scholar transport fleet telemetry, wearable device pairing, SIM card lifecycle tracking, and hardware maintenance.',
                          icon: Building2
                        }
                      ].map((product) => {
                        const IconComp = product.icon;
                        return (
                          <div 
                            key={product.name}
                            className="p-3.5 bg-brand-navy/70 rounded-xl border border-brand-gold/25 hover:border-brand-gold/60 transition-all space-y-1.5 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs sm:text-sm font-mono group-hover:text-brand-gold transition-colors flex items-center gap-1.5">
                                <IconComp className="w-4 h-4 text-brand-gold shrink-0" />
                                {product.name}
                              </span>
                              <span className="text-[9px] font-mono text-brand-gold bg-brand-dark/90 px-2 py-0.5 rounded border border-brand-gold/30 uppercase">
                                Product
                              </span>
                            </div>
                            <span className="text-[10px] text-brand-gold/90 font-medium block">
                              {product.role}
                            </span>
                            <p className="text-[11px] text-slate-300 leading-snug">
                              {product.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Shared Design System Footer Commitment */}
                    <div className="p-3.5 bg-brand-navy-heavy rounded-xl border border-brand-gold/30 text-center space-y-1">
                      <p className="text-xs text-slate-200">
                        <strong className="text-white font-semibold">One Enterprise Design System:</strong> Every product in the ITIS architecture shares identical typography standards, visual hierarchies, color palettes, and security rules — ensuring seamless operational continuity across every stakeholder portal.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 05: WHY SCHOOLS, FAMILIES AND GOVERNMENT TRUST ITIS */}
          <div 
            id="accordion-card-why-trust-itis"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'why-trust-itis'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-why-trust-itis"
              aria-expanded={expandedSection === 'why-trust-itis'}
              aria-controls="accordion-content-why-trust-itis"
              onClick={() => toggleSection('why-trust-itis')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  05
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Why Schools, Families and Government Trust ITIS</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Institutional Trust & Compliance
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    Human Verification, POPIA Compliance, End-to-End Security & Emergency Coordination
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'why-trust-itis' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    {/* Header Intro */}
                    <div className="space-y-1 border-b border-slate-800 pb-3">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-mono">
                        <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>Why Schools, Families and Government Trust ITIS</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        ITIS Guardian Network operates under rigorous institutional governance, legal data protection standards, and human-supervised operational protocols designed for maximum safety, transparency, and accountability.
                      </p>
                    </div>

                    {/* 9 Trust Pillars Grid */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono">
                        Core Pillars of Institutional Trust
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Human Verified Emergency Decisions</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Every panic alert or route anomaly is evaluated in real time by trained safety officers before dispatching emergency services, preventing false alarms and ensuring accurate incident response.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Scale className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>POPIA Compliant</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Fully compliant with South Africa’s Protection of Personal Information Act (Act 4 of 2013), safeguarding all minor data with local sovereign hosting and strict data privacy protocols.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Lock className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>End-to-End Encryption</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            All location telemetry, communication feeds, and student profile records are encrypted both in transit and at rest using bank-grade cryptographic standards.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Users className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>Role-Based Access</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Cryptographically enforced permissions ensure parents view only their children, school administrators view only enrolled campus learners, and emergency responders access data strictly during active dispatches.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <FileCheck className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>Immutable Audit Trail</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Every system interaction, location check, and emergency dispatch is permanently recorded in a tamper-proof audit log for regulatory compliance, administrative transparency, and legal review.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Radio className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>24/7 Operations Centre</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Our centralized command center operates continuously year-round, monitoring transit routes, school excursions, and high-risk incidents across the country.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Landmark className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>National Emergency Coordination</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Integrated operational workflows connect school leadership, the South African Police Service (SAPS), Emergency Medical Services (EMS), and accredited private security units.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>AI-Assisted Human Decision Making</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Intelligent telemetry algorithms process spatial data and detect potential anomalies, while certified human operators retain final review and decision-making authority for every critical action.
                          </p>
                        </div>

                        <div className="p-3.5 bg-brand-navy/80 rounded-xl border border-brand-gold/25 space-y-1 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                            <Shield className="w-4 h-4 text-brand-gold shrink-0" />
                            <span>Trusted Partnerships</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Established operational frameworks built in alignment with educational authorities, municipal transport departments, law enforcement agencies, and accredited public safety bodies.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dedicated Stakeholder Value Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono">
                        Tailored Value for Every Stakeholder
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-brand-gold" /> Families & Guardians
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Real-time peace of mind, arrival notifications, and immediate emergency SOS dispatch.
                          </p>
                        </div>

                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-brand-gold" /> School Principals & Teachers
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Automated digital attendance, zero budget impact, and instant campus alert broadcasts.
                          </p>
                        </div>

                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-brand-gold" /> Government & Education Departments
                          </span>
                          <p className="text-[11px] text-slate-400">
                            District-wide safety reports, compliance logs, and protected student records.
                          </p>
                        </div>

                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-brand-gold" /> Municipalities & Transit
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Scholar transport tracking, driver credential verification, and route safety monitoring.
                          </p>
                        </div>

                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-brand-gold" /> SAPS & First Responders
                          </span>
                          <p className="text-[11px] text-slate-400">
                            Precise GPS coordinates, wearable QR medical profiles, and verified incident escalation.
                          </p>
                        </div>

                        <div className="p-3 bg-brand-navy/40 rounded-xl border border-slate-800 space-y-0.5">
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

          {/* SECTION 06: HOW A DEMONSTRATION WORKS */}
          <div 
            id="accordion-card-request-demo"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'request-demo'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-request-demo"
              aria-expanded={expandedSection === 'request-demo'}
              aria-controls="accordion-content-request-demo"
              onClick={() => toggleSection('request-demo')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  06
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>How a Demonstration Works</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Executive Briefings
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    Schedule an executive briefing for your school, municipality, or department
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'request-demo' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    
                    {/* Demonstration Explanation Steps */}
                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span>What Happens During an Executive Demonstration</span>
                      </h4>
                      <p className="text-xs text-slate-300">
                        Our Child Safety Specialists conduct tailored virtual or in-person briefings for School Governing Bodies (SGB), Municipalities, or Provincial Education Departments:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-brand-gold block">1. Security Needs Review</span>
                          <p className="text-[11px] text-slate-400">Analyzing learner transport routes, school gate entry points, and attendance protocols.</p>
                        </div>
                        <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-brand-gold block">2. Live Simulation</span>
                          <p className="text-[11px] text-slate-400">Simulating wearable panic alerts, driver route tracking, and instant parent app notifications.</p>
                        </div>
                        <div className="p-3 bg-brand-navy/60 rounded-xl border border-slate-800 space-y-0.5">
                          <span className="text-xs font-bold text-brand-gold block">3. Rollout & Funding Plan</span>
                          <p className="text-[11px] text-slate-400">Reviewing POPIA compliance, zero-cost public school subsidies, and onboarding timelines.</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Section */}
                    <div className="pt-1">
                      {demoSubmitted ? (
                        <div className="p-5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center space-y-2 max-w-lg mx-auto">
                          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                          <h3 className="text-base font-bold text-white">Demonstration Request Received</h3>
                          <p className="text-xs text-slate-300">
                            An ITIS Child Safety Specialist will contact your office within 24 hours to coordinate a formal presentation.
                          </p>
                          <button 
                            onClick={() => setDemoSubmitted(false)}
                            className="px-3.5 py-1.5 bg-brand-dark border border-brand-gold/30 text-brand-gold text-xs rounded-lg hover:border-brand-gold cursor-pointer"
                          >
                            Submit Another Request
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleDemoSubmit} className="space-y-3 max-w-xl mx-auto bg-brand-navy/50 p-4 sm:p-5 rounded-xl border border-brand-gold/25">
                          <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider text-center font-mono">
                            Request Executive Presentation
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
                              <input 
                                type="text" 
                                required
                                value={demoName}
                                onChange={(e) => setDemoName(e.target.value)}
                                placeholder="Dr. Sipho Mthembu"
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">Official Email</label>
                              <input 
                                type="email" 
                                required
                                value={demoEmail}
                                onChange={(e) => setDemoEmail(e.target.value)}
                                placeholder="mthokozisi@live.co.za"
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">Institution / Department</label>
                              <input 
                                type="text" 
                                required
                                value={demoOrganization}
                                onChange={(e) => setDemoOrganization(e.target.value)}
                                placeholder="Gauteng Department of Education"
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-medium text-slate-300 mb-1">Role / Designation</label>
                              <select
                                value={demoRole}
                                onChange={(e) => setDemoRole(e.target.value)}
                                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
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
                            <label className="block text-[11px] font-medium text-slate-300 mb-1">Additional Notes (Optional)</label>
                            <textarea
                              rows={2}
                              value={demoNotes}
                              onChange={(e) => setDemoNotes(e.target.value)}
                              placeholder="e.g., Requesting briefing for 1,200 learners across 3 campuses..."
                              className="w-full bg-brand-dark border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold font-sans resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer transform active:scale-98 transition-all flex items-center justify-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
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

          {/* SECTION 07: PORTAL ACCESS */}
          <div 
            id="accordion-card-portal-access"
            className={`rounded-xl overflow-hidden transition-all duration-300 ${
              expandedSection === 'portal-access'
                ? 'bg-brand-navy border border-brand-gold/60 shadow-lg ring-1 ring-brand-gold/20'
                : 'bg-brand-navy/60 border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-navy/80'
            }`}
          >
            <button
              id="accordion-header-portal-access"
              aria-expanded={expandedSection === 'portal-access'}
              aria-controls="accordion-content-portal-access"
              onClick={() => toggleSection('portal-access')}
              className="w-full py-3.5 px-4 sm:px-5 text-left flex items-center justify-between gap-3 bg-brand-navy-heavy hover:bg-brand-navy transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                  07
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    <span>Portal Access</span>
                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 hidden sm:inline-block">
                      Authorized Login
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-sans">
                    Access parent, school principal, command center, or responder portals
                  </p>
                </div>
              </div>

              <motion.div 
                animate={{ rotate: expandedSection === 'portal-access' ? 180 : 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="text-brand-gold p-1.5 bg-brand-dark/80 group-hover:bg-brand-dark rounded-lg border border-brand-gold/30 shrink-0 group-hover:border-brand-gold/50 transition-colors"
              >
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-5 sm:p-6 bg-brand-dark/95 border-t border-brand-gold/20 space-y-5 font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <div className="max-w-xl mx-auto text-center space-y-4 py-1">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[11px] font-mono text-brand-gold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AUTHORIZED STAKEHOLDER PORTAL</span>
                        </div>
                        <h4 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
                          Unified Safety Gateway
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Secure portal access for authorized parents, school principals, command centre coordinators, and emergency responders.
                        </p>
                      </div>

                      <div className="pt-1 pb-1">
                        <button
                          onClick={() => onOpenLogin()}
                          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-brand-gold/20 transform active:scale-98 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-brand-dark" />
                          <span>Portal Login</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 bg-brand-navy-heavy/80 rounded-lg border border-brand-gold/20 text-[11px] text-slate-400 font-sans space-y-0.5">
                        <span className="font-semibold text-slate-300 block">Role-Based Access Control (RBAC)</span>
                        <p>
                          Protected by zero-trust identity & multi-factor authentication (MFA). Authorized credentials automatically route users to their designated workspace upon login.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* EXECUTIVE TRUST CENTRE & FOOTER */}
      <footer className="bg-brand-navy-heavy border-t border-brand-gold/30 font-sans">
        
        {/* TOP TRUST & COMPLIANCE BADGE STRIP */}
        <div className="border-b border-brand-gold/20 bg-brand-navy/90 py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center md:text-left">
              <img src={itisLogo} alt="ITIS Official Shield" className="w-12 h-12 rounded-full border-2 border-brand-gold shadow-xl glow-gold shrink-0 object-cover" />
              <div>
                <span className="font-bold text-white text-base block font-mono">ITIS Guardian Network</span>
                <span className="text-xs text-brand-gold font-sans font-medium block">Integrated Technology Intelligence & Safety</span>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5 font-medium">
                  Protecting Every Learner. Every Journey. Every Second.
                </p>
              </div>
            </div>

            {/* Organizational Compliance Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> POPIA Compliant (Act 4 of 2013)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/60 border border-purple-500/30 text-purple-300 rounded-full font-medium">
                <Radio className="w-3.5 h-3.5 text-purple-300" /> 24/7 Operations Centre
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 border border-blue-500/30 text-blue-300 rounded-full font-medium">
                <Users className="w-3.5 h-3.5 text-blue-300" /> Human-Verified Operations
              </span>
            </div>
          </div>
        </div>

        {/* 5-COLUMN MAIN FOOTER NAVIGATION */}
        <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs text-slate-300">
          
          {/* COLUMN 1: ABOUT ITIS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-brand-gold/20 pb-2">
              <Shield className="w-4 h-4 text-brand-gold" /> About ITIS
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              South Africa's national child protection ecosystem, uniting families, schools, emergency services, and law enforcement in continuous learner safety.
            </p>
            <ul className="space-y-2 pt-1 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => scrollToDiscover('who-we-are')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Mission, Vision & Values
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToDiscover('why-trust-itis')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Institutional Governance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCareersTab('explore');
                    setIsCareersOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium"
                >
                  <Briefcase className="w-3.5 h-3.5 text-brand-gold" /> Careers & Talent
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: GUARDIAN NETWORK */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-brand-gold/20 pb-2">
              <Building2 className="w-4 h-4 text-brand-gold" /> Guardian Network
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => scrollToDiscover('portal-access')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium group"
                >
                  <Shield className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" />
                  <span>Authorized Portal Access</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToDiscover('product-architecture')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" />
                  <span>Product Suite Architecture</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToDiscover('how-itis-protects')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" />
                  <span>7-Step Protected Journey</span>
                </button>
              </li>
              <li className="pt-1">
                <button 
                  onClick={() => scrollToDiscover('request-demo')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded-lg hover:bg-purple-900/80 transition-colors cursor-pointer font-mono text-[11px]"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Request Institutional Briefing
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-brand-gold/20 pb-2">
              <Newspaper className="w-4 h-4 text-brand-gold" /> Resources
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('all');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-white font-medium"
                >
                  <Newspaper className="w-3.5 h-3.5 text-brand-gold" /> News & Media Kit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setNewsCategory('community');
                    setIsNewsOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Emergency Response Protocols
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToDiscover('the-challenge')}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> National Safety Context
                </button>
              </li>
              <li className="pt-1">
                <div className="p-2.5 bg-brand-navy-heavy rounded-xl border border-brand-gold/20 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono uppercase">Operational Readiness</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>24/7/365 Command Centre</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LEGAL */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-brand-gold/20 pb-2">
              <Scale className="w-4 h-4 text-brand-gold" /> Legal
            </h4>
            <ul className="space-y-2 font-sans text-slate-300">
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('popia');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-emerald-400 font-medium"
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
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Child Data Protection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('terms');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-3 h-3 text-brand-gold" /> Terms of Governance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('security');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <Lock className="w-3.5 h-3.5 text-brand-gold" /> Security & Data Safeguards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('ai-ethics');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Responsible Technology Ethics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setSelectedLegalDoc('accessibility');
                    setIsLegalOpen(true);
                  }}
                  className="hover:text-brand-gold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-400"
                >
                  <Globe className="w-3.5 h-3.5" /> Accessibility Commitment
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: CONTACT */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-brand-gold/20 pb-2">
              <Phone className="w-4 h-4 text-brand-gold" /> Contact
            </h4>
            <div className="space-y-2.5 font-sans text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  National HQ: Pretoria West & Sandton Campus, Gauteng, Republic of South Africa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a href="tel:0624304906" className="font-mono text-white font-bold text-[11px] hover:text-brand-gold transition-colors">0624304906</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="mailto:mthokozisi@live.co.za" className="font-mono text-brand-gold text-[11px] hover:underline">mthokozisi@live.co.za</a>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                <span>Emergency Command Centre: Operating 24/7/365</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div className="border-t border-slate-800/80 bg-brand-dark py-5 px-6 text-[11px] text-slate-400 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>© 2026 ITIS Guardian Network · Integrated Technology Intelligence & Safety (ITIS). Republic of South Africa Public Safety Consortium. All Rights Reserved.</span>
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
                          For press interviews, broadcast assets, or provincial safety data briefs, contact <a href="mailto:mthokozisi@live.co.za" className="text-brand-gold font-mono hover:underline">mthokozisi@live.co.za</a> or call <a href="tel:0624304906" className="text-brand-gold font-mono hover:underline">0624304906</a>.
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
