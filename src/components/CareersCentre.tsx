/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Search, MapPin, Building2, Calendar, DollarSign, CheckCircle2,
  Users, Award, Shield, FileText, ChevronRight, X, Upload, Send, Sparkles,
  Heart, GraduationCap, Clock, AlertTriangle, ArrowRight, UserCheck, Star,
  PlusCircle, Download, MessageSquare, Eye, Filter, Lock, Check, ShieldCheck
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import { 
  careersService, Vacancy, JobApplication, JobDepartment, 
  JobProvince, EmploymentType, ApplicationStatus 
} from '../services/careersService';

interface CareersCentreProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'explore' | 'why-itis' | 'programmes' | 'ats';
}

export function CareersCentre({ isOpen, onClose, initialTab = 'explore' }: CareersCentreProps) {
  const [activeTab, setActiveTab] = useState<'explore' | 'why-itis' | 'programmes' | 'ats'>(initialTab);

  // Search & Filter state for Careers Explore
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');

  // Selected vacancy for detailed modal
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  
  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [rsaIdNumber, setRsaIdNumber] = useState('');
  const [applicantProvince, setApplicantProvince] = useState<JobProvince>('Gauteng');
  const [qualification, setQualification] = useState('');
  const [yearsExperience, setYearsExperience] = useState('1-3 Years');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [simulatedCvName, setSimulatedCvName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [popiaAccepted, setPopiaAccepted] = useState(false);

  // Application Submission Result
  const [applicationSuccess, setApplicationSuccess] = useState<{
    applicationId: string;
    message: string;
    vacancyTitle: string;
  } | null>(null);

  // HR ATS Dashboard states
  const [atsApplications, setAtsApplications] = useState<JobApplication[]>(careersService.getApplications());
  const [atsStageFilter, setAtsStageFilter] = useState<string>('All');
  const [atsSearchKeyword, setAtsSearchKeyword] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [candidateRating, setCandidateRating] = useState<number>(5);

  // Post New Vacancy Modal state
  const [isNewVacancyModalOpen, setIsNewVacancyModalOpen] = useState(false);
  const [newVacTitle, setNewVacTitle] = useState('');
  const [newVacDept, setNewVacDept] = useState<JobDepartment>('Engineering');
  const [newVacProvince, setNewVacProvince] = useState<JobProvince>('Gauteng');
  const [newVacType, setNewVacType] = useState<EmploymentType>('Full-Time');
  const [newVacClosing, setNewVacClosing] = useState('2026-10-15');
  const [newVacSalary, setNewVacSalary] = useState('Market Related');
  const [newVacDesc, setNewVacDesc] = useState('');
  const [newVacQuals, setNewVacQuals] = useState('Relevant Degree / Diploma\n3+ Years Industry Experience');
  const [newVacResps, setNewVacResps] = useState('Lead daily operations\nEnsure 100% compliance');

  if (!isOpen) return null;

  // Filtered vacancies list
  const filteredVacancies = careersService.getVacancies({
    keyword: searchKeyword,
    department: selectedDept,
    province: selectedProvince,
    type: selectedType
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancy) return;
    if (!popiaAccepted) {
      alert("Please accept POPIA data processing consent to proceed.");
      return;
    }

    const res = careersService.submitApplication({
      vacancyId: selectedVacancy.id,
      vacancyTitle: selectedVacancy.title,
      department: selectedVacancy.department,
      applicantName,
      applicantEmail,
      applicantPhone,
      rsaIdNumber,
      province: applicantProvince,
      qualification,
      yearsExperience,
      cvFileName: simulatedCvName || (cvFile ? cvFile.name : `${applicantName.replace(/\s+/g, '_')}_CV.pdf`),
      coverLetterText: coverLetter
    });

    setApplicationSuccess({
      applicationId: res.applicationId,
      message: res.message,
      vacancyTitle: selectedVacancy.title
    });

    // Refresh ATS list
    setAtsApplications(careersService.getApplications());
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCvFile(file);
      setSimulatedCvName(file.name);
    }
  };

  const resetApplyForm = () => {
    setApplicantName('');
    setApplicantEmail('');
    setApplicantPhone('');
    setRsaIdNumber('');
    setQualification('');
    setCvFile(null);
    setSimulatedCvName('');
    setCoverLetter('');
    setPopiaAccepted(false);
    setApplicationSuccess(null);
    setIsApplyModalOpen(false);
  };

  const handleUpdateAtsStatus = (appId: string, newStatus: ApplicationStatus) => {
    careersService.updateApplicationStatus(appId, newStatus);
    setAtsApplications(careersService.getApplications());
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(careersService.getApplications().find(a => a.id === appId) || null);
    }
  };

  const handleAddNoteToCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteText.trim()) return;

    careersService.addHrNote(selectedCandidate.id, newNoteText, candidateRating);
    setNewNoteText('');
    setAtsApplications(careersService.getApplications());
    setSelectedCandidate(careersService.getApplications().find(a => a.id === selectedCandidate.id) || null);
  };

  const handleCreateNewVacancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    careersService.createVacancy({
      title: newVacTitle,
      department: newVacDept,
      province: newVacProvince,
      employmentType: newVacType,
      closingDate: newVacClosing,
      salary: newVacSalary,
      description: newVacDesc,
      requiredQualifications: newVacQuals.split('\n').filter(q => q.trim().length > 0),
      responsibilities: newVacResps.split('\n').filter(r => r.trim().length > 0),
      status: 'Open'
    });

    setIsNewVacancyModalOpen(false);
    setNewVacTitle('');
    setNewVacDesc('');
    alert("New job vacancy successfully published to the live ITIS Careers Centre!");
  };

  const filteredAtsApps = atsApplications.filter(app => {
    const matchesStage = atsStageFilter === 'All' || app.status === atsStageFilter;
    const matchesKw = !atsSearchKeyword || 
      app.applicantName.toLowerCase().includes(atsSearchKeyword.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(atsSearchKeyword.toLowerCase()) ||
      app.vacancyTitle.toLowerCase().includes(atsSearchKeyword.toLowerCase()) ||
      app.rsaIdNumber.includes(atsSearchKeyword);
    return matchesStage && matchesKw;
  });

  const departmentList: JobDepartment[] = [
    'Executive Positions', 'Engineering', 'Operations', 'Command Centre',
    'Sales', 'Customer Success', 'GIS Specialists', 'Fleet Operations',
    'Emergency Coordinators', 'Technical Support', 'Security Operations',
    'Marketing', 'Finance', 'Graduate Programme', 'Internship Programme',
    'Learnership Programme', 'Volunteer Programme'
  ];

  const provinceList: JobProvince[] = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
    'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape', 'National / Remote'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex flex-col font-sans text-slate-100">
      
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-brand-navy-heavy border-b border-brand-gold/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <img src={itisLogo} alt="ITIS Logo" className="w-10 h-10 object-cover border-2 border-brand-gold rounded-full glow-gold" />
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wide font-mono flex items-center gap-2">
              <span>ITIS GUARDIAN NETWORK CAREERS CENTRE</span>
              <span className="text-[10px] bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 uppercase hidden sm:inline-block">
                National Public Safety Recruitment
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Integrated Technology Intelligence & Safety · Protecting Every Learner. Every Journey. Every Second.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 bg-brand-navy border border-slate-700 hover:border-brand-gold text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
            title="Close Careers Centre"
          >
            <X className="w-5 h-5 text-brand-gold" />
            <span className="hidden sm:inline">Return to Main Platform</span>
          </button>
        </div>
      </header>

      {/* Main Navigation Tabs Bar */}
      <div className="bg-brand-dark/95 border-b border-brand-gold/15 px-4 sm:px-8 py-2.5 flex items-center justify-between overflow-x-auto whitespace-nowrap shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-brand-gold text-brand-dark shadow-lg font-extrabold'
                : 'bg-brand-navy/60 text-slate-300 hover:text-white hover:bg-brand-navy'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Open Vacancies ({filteredVacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('why-itis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'why-itis'
                ? 'bg-brand-gold text-brand-dark shadow-lg font-extrabold'
                : 'bg-brand-navy/60 text-slate-300 hover:text-white hover:bg-brand-navy'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
            <span>Why Work at ITIS & Culture</span>
          </button>

          <button
            onClick={() => setActiveTab('programmes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'programmes'
                ? 'bg-brand-gold text-brand-dark shadow-lg font-extrabold'
                : 'bg-brand-navy/60 text-slate-300 hover:text-white hover:bg-brand-navy'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Graduate & Youth Programmes</span>
          </button>

          <button
            onClick={() => setActiveTab('ats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'ats'
                ? 'bg-emerald-500 text-brand-dark border-emerald-400 font-extrabold shadow-lg'
                : 'bg-brand-navy/60 text-emerald-400 border-emerald-500/30 hover:bg-brand-navy'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>HR ATS Pipeline ({atsApplications.length})</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Equal Opportunity Employer
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-brand-gold">POPIA Recruiter Protocol Active</span>
        </div>
      </div>

      {/* BODY CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* TAB 1: EXPLORE OPEN VACANCIES */}
        {activeTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Hero Card Banner */}
            <div className="relative p-6 sm:p-10 bg-gradient-to-r from-brand-navy-heavy via-brand-navy to-brand-navy-heavy border border-brand-gold/30 rounded-3xl overflow-hidden shadow-2xl space-y-4">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-grid-ambient pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/15 border border-brand-gold/30 rounded-full text-xs font-mono text-brand-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BUILDING SOVEREIGN CHILD SAFETY INFRASTRUCTURE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-3xl font-mono">
                Join the Team Safeguarding <span className="text-brand-gold underline decoration-brand-gold/40">Every Learner</span> Across South Africa
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                From 24/7 Command Centre dispatch controllers to spatial telemetry engineers and school liaisons, your work directly protects children on their daily journeys. Discover your place in South Africa's leading public safety technology team.
              </p>

              {/* Filter & Search Bar */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Keyword Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search title, role, skill..."
                    className="w-full bg-brand-dark/90 border border-brand-gold/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {/* Department Filter */}
                <div>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-brand-dark/90 border border-brand-gold/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="All">All Departments ({departmentList.length})</option>
                    {departmentList.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Province Filter */}
                <div>
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-brand-dark/90 border border-brand-gold/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="All">All Provinces (9 RSA + Remote)</option>
                    {provinceList.map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-brand-dark/90 border border-brand-gold/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="All">All Employment Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Graduate Programme">Graduate Programme</option>
                    <option value="Internship">Internship</option>
                    <option value="Learnership">Learnership</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Vacancies List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-gold" />
                  <span>Available Career Opportunities</span>
                  <span className="text-xs bg-brand-gold/20 text-brand-gold px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                    {filteredVacancies.length} Open Positions
                  </span>
                </h3>

                {(selectedDept !== 'All' || selectedProvince !== 'All' || selectedType !== 'All' || searchKeyword) && (
                  <button
                    onClick={() => {
                      setSelectedDept('All');
                      setSelectedProvince('All');
                      setSelectedType('All');
                      setSearchKeyword('');
                    }}
                    className="text-xs text-brand-gold hover:underline flex items-center gap-1 cursor-pointer font-mono"
                  >
                    <X className="w-3.5 h-3.5" /> Clear Search Filters
                  </button>
                )}
              </div>

              {filteredVacancies.length === 0 ? (
                <div className="p-12 text-center bg-brand-navy/40 rounded-2xl border border-slate-800 space-y-3">
                  <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-white font-bold text-sm">No open positions matching your search filters.</p>
                  <p className="text-slate-400 text-xs">Try selecting 'All Departments' or 'All Provinces' to see all available roles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredVacancies.map((vacancy) => (
                    <div
                      key={vacancy.id}
                      className="p-5 bg-brand-navy/80 border border-slate-800 hover:border-brand-gold/50 rounded-2xl space-y-4 hover:bg-brand-navy transition-all flex flex-col justify-between shadow-lg group"
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/20 font-bold">
                            {vacancy.department}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
                            {vacancy.employmentType}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                          {vacancy.title}
                        </h4>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {vacancy.province}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {vacancy.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Closes {vacancy.closingDate}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                          {vacancy.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {vacancy.id}</span>
                        
                        <button
                          onClick={() => setSelectedVacancy(vacancy)}
                          className="px-4 py-2 bg-brand-gold text-brand-dark hover:bg-brand-gold-dark font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                        >
                          <span>View Details & Apply</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: WHY WORK AT ITIS & CULTURE */}
        {activeTab === 'why-itis' && (
          <div className="space-y-8">
            <div className="p-8 bg-brand-navy border border-brand-gold/30 rounded-3xl space-y-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
                <div>
                  <h3 className="text-xl font-bold text-white font-mono">Why Work at ITIS?</h3>
                  <p className="text-xs text-slate-400">South Africa's Premier Child Protection & Emergency Engineering Team</p>
                </div>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                At ITIS, every software commit, every dispatch call, every GIS polygon, and every school liaison directly safeguards young lives. We believe that technology without human coordination is incomplete — which is why our 24/7 Command Centre, field liaisons, and engineers work as one unified team to ensure no child is left unaccounted for.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-brand-dark/80 rounded-2xl border border-slate-800 space-y-2">
                  <Shield className="w-6 h-6 text-brand-gold" />
                  <h4 className="text-sm font-bold text-white">Our Mission</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Protecting every learner through intelligent technology, trusted partnerships, and coordinated emergency response that helps prevent kidnapping, disappearances, violence, injuries, and other high-risk incidents.
                  </p>
                </div>

                <div className="p-5 bg-brand-dark/80 rounded-2xl border border-slate-800 space-y-2">
                  <Award className="w-6 h-6 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Our Vision</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To become Africa's most trusted child protection network, ensuring every learner can travel, learn, and return home safely through intelligent technology, coordinated emergency response, and human-centred protection.
                  </p>
                </div>
              </div>

              {/* Core Values Grid */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-brand-gold font-mono uppercase tracking-wider">Our Core Values</h4>
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
                      className="px-3.5 py-1.5 bg-brand-dark/90 text-slate-200 rounded-xl border border-brand-gold/30 text-xs font-medium hover:border-brand-gold/60 transition-colors"
                    >
                      {val}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: GRADUATE & YOUTH PROGRAMMES */}
        {activeTab === 'programmes' && (
          <div className="space-y-6">
            <div className="p-6 bg-brand-navy border border-brand-gold/30 rounded-3xl space-y-3">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
                <span>Empowering the Next Generation of South African Public Safety Innovators</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                ITIS offers structured entry-level programmes designed to bridge academia and real-world emergency tech impact. All programmes include competitive stipends, mentorship, and clear career progression pathways.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Graduate Programme */}
              <div className="p-6 bg-brand-navy/80 border border-brand-gold/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full border border-brand-gold/30">
                    18-Month Structured Rotation
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">Graduate Stipend</span>
                </div>
                <h4 className="text-base font-bold text-white">2027 Graduate Development Programme</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Designed for recent graduates in Computer Science, Geoinformatics, Public Management, and Data Science. Rotations across Software Engineering, GIS Analytics, Command Operations, and Product Design.
                </p>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>• Mentorship from senior public safety architects</li>
                  <li>• Real-world production code deployments</li>
                  <li>• Full-time placement opportunity upon completion</li>
                </ul>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedType('Graduate Programme');
                  }}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for Graduate Programme</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Internship Programme */}
              <div className="p-6 bg-brand-navy/80 border border-brand-gold/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    12-Month Paid Practical
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">Paid Internship</span>
                </div>
                <h4 className="text-base font-bold text-white">GIS & Control Room Internship</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gain hands-on practical workplace experience in spatial mapping, geofencing validation, and live emergency telemetry monitoring in Cape Town and Johannesburg.
                </p>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>• Direct experience with spatial databases (PostGIS)</li>
                  <li>• Command centre emergency protocol training</li>
                  <li>• Monthly performance stipend</li>
                </ul>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedType('Internship');
                  }}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for Internship</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Learnership Programme */}
              <div className="p-6 bg-brand-navy/80 border border-brand-gold/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full border border-brand-gold/30">
                    NQF Level 4/5 SETA Accredited
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">SETA Allowance</span>
                </div>
                <h4 className="text-base font-bold text-white">IT Technical Support Learnership</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Combines formal classroom theory with practical campus attendance hardware and scanner support across rural Limpopo, Eastern Cape, and KZN schools.
                </p>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>• Formal MICT SETA accredited qualification</li>
                  <li>• Hardware diagnostic & IoT equipment training</li>
                  <li>• Monthly SETA stipend provided</li>
                </ul>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedType('Learnership');
                  }}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for Learnership</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Volunteer Programme */}
              <div className="p-6 bg-brand-navy/80 border border-brand-gold/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                    Community Safety Champions
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Out-of-Pocket Stipend</span>
                </div>
                <h4 className="text-base font-bold text-white">Community Child Protection Volunteer</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join parent liaisons, retired educators, and walking bus monitors who assist at school gates during peak morning and afternoon transit hours.
                </p>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>• Background vetting & child safety screening</li>
                  <li>• First aid & emergency drill facilitation</li>
                  <li>• Community recognition & honorarium</li>
                </ul>
                <button
                  onClick={() => {
                    setActiveTab('explore');
                    setSelectedType('Volunteer');
                  }}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl hover:bg-brand-gold-dark transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Register as Volunteer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: HR APPLICANT TRACKING SYSTEM (ATS) PIPELINE */}
        {activeTab === 'ats' && (
          <div className="space-y-6">
            
            {/* ATS Header & Quick Actions */}
            <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-brand-navy to-brand-navy-heavy border border-emerald-500/30 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-lg font-extrabold text-white font-mono flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-emerald-400" />
                  <span>HR APPLICANT TRACKING SYSTEM (ATS)</span>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    Internal HR Management View
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Review applicant profiles, manage pipeline stages, log HR notes, and publish new vacancies.
                </p>
              </div>

              <button
                onClick={() => setIsNewVacancyModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 font-mono"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Job Vacancy</span>
              </button>
            </div>

            {/* Stage Counters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 text-center font-mono text-xs">
              {[
                { stage: 'All', label: 'All Candidates', count: atsApplications.length, color: 'text-white' },
                { stage: 'New Applications', label: 'New Apps', count: atsApplications.filter(a => a.status === 'New Applications').length, color: 'text-brand-gold' },
                { stage: 'Shortlisted', label: 'Shortlisted', count: atsApplications.filter(a => a.status === 'Shortlisted').length, color: 'text-blue-400' },
                { stage: 'Interview', label: 'Interview', count: atsApplications.filter(a => a.status === 'Interview').length, color: 'text-purple-400' },
                { stage: 'Offer', label: 'Offer Sent', count: atsApplications.filter(a => a.status === 'Offer').length, color: 'text-amber-400' },
                { stage: 'Hired', label: 'Hired', count: atsApplications.filter(a => a.status === 'Hired').length, color: 'text-emerald-400' },
                { stage: 'Rejected', label: 'Declined', count: atsApplications.filter(a => a.status === 'Rejected').length, color: 'text-rose-400' },
              ].map(item => (
                <button
                  key={item.stage}
                  onClick={() => setAtsStageFilter(item.stage)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                    atsStageFilter === item.stage
                      ? 'bg-brand-navy border-brand-gold shadow-lg ring-1 ring-brand-gold'
                      : 'bg-brand-dark/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`text-lg font-extrabold ${item.color}`}>{item.count}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>

            {/* ATS Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={atsSearchKeyword}
                  onChange={(e) => setAtsSearchKeyword(e.target.value)}
                  placeholder="Filter candidate name, ID, email..."
                  className="w-full bg-brand-dark border border-brand-gold/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Showing {filteredAtsApps.length} of {atsApplications.length} Candidates</span>
                <button
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," + 
                      "ID,Name,Email,Phone,Vacancy,Status,AppliedDate\n" +
                      atsApplications.map(a => `${a.id},"${a.applicantName}",${a.applicantEmail},${a.applicantPhone},"${a.vacancyTitle}",${a.status},${a.appliedDate}`).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `ITIS_Recruitment_Candidates_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-brand-navy border border-slate-700 hover:border-brand-gold text-brand-gold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* ATS Candidates Table */}
            <div className="bg-brand-navy/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-brand-navy-heavy text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Ref & Candidate</th>
                      <th className="p-3">Vacancy Applied</th>
                      <th className="p-3">Province</th>
                      <th className="p-3">Applied Date</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredAtsApps.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No candidates found matching the selected stage filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAtsApps.map((app) => (
                        <tr key={app.id} className="hover:bg-brand-dark/50 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white">{app.applicantName}</div>
                            <div className="text-[10px] text-slate-400">{app.applicantEmail} · {app.id}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-slate-200 line-clamp-1 max-w-xs">{app.vacancyTitle}</div>
                            <div className="text-[10px] text-brand-gold">{app.department}</div>
                          </td>
                          <td className="p-3 text-slate-300">{app.province}</td>
                          <td className="p-3 text-slate-400">{app.appliedDate}</td>
                          <td className="p-3">
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < app.rating ? 'fill-amber-400' : 'text-slate-600'}`} 
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              app.status === 'New Applications' ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/30' :
                              app.status === 'Shortlisted' ? 'bg-blue-950 text-blue-400 border-blue-500/30' :
                              app.status === 'Interview' ? 'bg-purple-950 text-purple-400 border-purple-500/30' :
                              app.status === 'Offer' ? 'bg-amber-950 text-amber-400 border-amber-500/30' :
                              app.status === 'Hired' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' :
                              'bg-rose-950 text-rose-400 border-rose-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedCandidate(app)}
                              className="px-3 py-1 bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-dark rounded-lg font-bold transition-all cursor-pointer text-[10px]"
                            >
                              Review Candidate
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* VACANCY DETAIL MODAL */}
      <AnimatePresence>
        {selectedVacancy && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-navy border border-brand-gold/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedVacancy(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-brand-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
                    {selectedVacancy.department}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {selectedVacancy.employmentType}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{selectedVacancy.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-gold" /> {selectedVacancy.province}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {selectedVacancy.salary}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Closes {selectedVacancy.closingDate}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 text-xs text-slate-300">
                <div>
                  <h4 className="font-bold text-white uppercase font-mono text-[11px] text-brand-gold mb-1">Role Description</h4>
                  <p className="leading-relaxed">{selectedVacancy.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase font-mono text-[11px] text-brand-gold mb-1">Required Qualifications & Experience</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {selectedVacancy.requiredQualifications.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white uppercase font-mono text-[11px] text-brand-gold mb-1">Key Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {selectedVacancy.responsibilities.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedVacancy(null)}
                  className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-300 text-xs rounded-xl font-mono cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setIsApplyModalOpen(true);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark font-extrabold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply for this Position</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION FORM MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && selectedVacancy && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-navy border border-brand-gold/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            >
              <button
                onClick={resetApplyForm}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-brand-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {!applicationSuccess ? (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-brand-gold uppercase">Application Form</span>
                    <h3 className="text-lg font-bold text-white">{selectedVacancy.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Ref: {selectedVacancy.id} · {selectedVacancy.department}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Mthokozisi Cele"
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="e.g. mthokozisi@live.co.za"
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+27 82 123 4567"
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">RSA ID or Passport No. *</label>
                      <input
                        type="text"
                        required
                        value={rsaIdNumber}
                        onChange={(e) => setRsaIdNumber(e.target.value)}
                        placeholder="13-Digit RSA ID Number"
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Province of Residence *</label>
                      <select
                        value={applicantProvince}
                        onChange={(e) => setApplicantProvince(e.target.value as JobProvince)}
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      >
                        {provinceList.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Years of Relevant Experience *</label>
                      <select
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(e.target.value)}
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      >
                        <option value="Graduate / No Experience">Graduate / Entry Level</option>
                        <option value="1-3 Years">1 - 3 Years</option>
                        <option value="4-7 Years">4 - 7 Years</option>
                        <option value="8+ Years">8+ Years Senior</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Highest Qualification Obtained *</label>
                    <input
                      type="text"
                      required
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. BSc Computer Science / National Diploma in Logistics"
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  {/* Simulated CV File Upload */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Attach Curriculum Vitae (CV) *</label>
                    <div className="border-2 border-dashed border-slate-700 hover:border-brand-gold/50 rounded-2xl p-4 text-center bg-brand-dark/60 cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleSimulatedFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-brand-gold mx-auto mb-1" />
                      <p className="text-xs text-slate-300 font-medium">
                        {simulatedCvName ? (
                          <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> {simulatedCvName} (Attached)
                          </span>
                        ) : (
                          "Click to browse or drag & drop your CV (PDF, DOCX max 10MB)"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Cover Letter / Statement of Motivation</label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly explain why you are passionate about protecting children and why you fit this role..."
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                    ></textarea>
                  </div>

                  {/* POPIA Consent */}
                  <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="popiaConsent"
                      checked={popiaAccepted}
                      onChange={(e) => setPopiaAccepted(e.target.checked)}
                      className="mt-1 accent-brand-gold cursor-pointer"
                    />
                    <label htmlFor="popiaConsent" className="text-[11px] text-slate-300 leading-snug cursor-pointer">
                      <strong>POPIA Consent:</strong> I hereby grant permission to Integrated Technology Intelligence & Safety (ITIS) to process my personal information solely for recruitment, background verification, and vetting purposes under POPIA standards.
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetApplyForm}
                      className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-300 text-xs rounded-xl font-mono cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!popiaAccepted}
                      className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-extrabold text-xs rounded-xl shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Application Now</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 glow-gold">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30 uppercase">
                      Application Submitted
                    </span>
                    <h3 className="text-xl font-extrabold text-white pt-2 font-mono">Reference #{applicationSuccess.applicationId}</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      {applicationSuccess.message}
                    </p>
                  </div>

                  <div className="p-4 bg-brand-dark/90 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-2 max-w-md mx-auto">
                    <div className="text-brand-gold font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Next Recruitment Steps:
                    </div>
                    <p className="text-slate-300 text-[11px]">1. Automated email confirmation delivered to your inbox.</p>
                    <p className="text-slate-300 text-[11px]">2. Shortlisting review by the HR Talent Acquisition team within 5 working days.</p>
                    <p className="text-slate-300 text-[11px]">3. Background screening & interview scheduling via the ITIS Identity Platform.</p>
                  </div>

                  <button
                    onClick={() => {
                      resetApplyForm();
                      setSelectedVacancy(null);
                    }}
                    className="px-6 py-2.5 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANDIDATE REVIEW MODAL (HR ATS VIEW) */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-navy border border-brand-gold/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-brand-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1 border-b border-slate-800 pb-4">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-500/30 uppercase">
                  Candidate Profile Review
                </span>
                <h3 className="text-xl font-bold text-white">{selectedCandidate.applicantName}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Applied for <span className="text-brand-gold font-bold">{selectedCandidate.vacancyTitle}</span> · Ref: {selectedCandidate.id}
                </p>
              </div>

              {/* Status Pipeline Transition Bar */}
              <div className="p-4 bg-brand-dark/90 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-[10px] font-mono text-slate-400 uppercase">Update Application Pipeline Stage</label>
                <div className="flex flex-wrap items-center gap-2">
                  {(['New Applications', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'] as ApplicationStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateAtsStatus(selectedCandidate.id, st)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        selectedCandidate.status === st
                          ? 'bg-emerald-500 text-brand-dark border-emerald-400 shadow-md'
                          : 'bg-brand-navy text-slate-300 border-slate-700 hover:border-brand-gold'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-300 bg-brand-dark/50 p-4 rounded-2xl border border-slate-800">
                <div><strong className="text-slate-400 uppercase text-[10px] block">Email:</strong> {selectedCandidate.applicantEmail}</div>
                <div><strong className="text-slate-400 uppercase text-[10px] block">Phone:</strong> {selectedCandidate.applicantPhone}</div>
                <div><strong className="text-slate-400 uppercase text-[10px] block">RSA ID:</strong> {selectedCandidate.rsaIdNumber}</div>
                <div><strong className="text-slate-400 uppercase text-[10px] block">Province:</strong> {selectedCandidate.province}</div>
                <div className="col-span-2"><strong className="text-slate-400 uppercase text-[10px] block">Qualification:</strong> {selectedCandidate.qualification}</div>
                <div className="col-span-2"><strong className="text-slate-400 uppercase text-[10px] block">CV Document:</strong> <span className="text-emerald-400 underline">{selectedCandidate.cvFileName}</span></div>
              </div>

              {/* Cover Letter */}
              {selectedCandidate.coverLetterText && (
                <div>
                  <h4 className="text-[10px] font-mono text-slate-400 uppercase mb-1">Cover Letter Statement</h4>
                  <p className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                    "{selectedCandidate.coverLetterText}"
                  </p>
                </div>
              )}

              {/* Internal HR Notes & Rating */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
                  <span>HR Evaluation Notes & Ratings</span>
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    Rating: {selectedCandidate.rating} / 5
                  </span>
                </h4>

                <form onSubmit={handleAddNoteToCandidate} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add evaluation note or interview feedback..."
                    className="flex-1 bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                  <select
                    value={candidateRating}
                    onChange={(e) => setCandidateRating(Number(e.target.value))}
                    className="bg-brand-dark border border-slate-700 text-amber-400 text-xs rounded-xl px-2 font-mono"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-gold text-brand-dark font-extrabold text-xs rounded-xl cursor-pointer"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedCandidate.hrNotes.map((note, idx) => (
                    <div key={idx} className="p-2 bg-brand-dark/60 rounded-lg text-[11px] text-slate-300 font-mono border border-slate-800">
                      {note}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POST NEW VACANCY MODAL (HR ADMIN) */}
      <AnimatePresence>
        {isNewVacancyModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-navy border border-brand-gold/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
            >
              <button
                onClick={() => setIsNewVacancyModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-brand-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">HR Recruitment Tool</span>
                <h3 className="text-lg font-bold text-white">Publish New Career Vacancy</h3>
              </div>

              <form onSubmit={handleCreateNewVacancySubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newVacTitle}
                    onChange={(e) => setNewVacTitle(e.target.value)}
                    placeholder="e.g. Senior Incident Investigation Officer"
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Department</label>
                    <select
                      value={newVacDept}
                      onChange={(e) => setNewVacDept(e.target.value as JobDepartment)}
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      {departmentList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Province</label>
                    <select
                      value={newVacProvince}
                      onChange={(e) => setNewVacProvince(e.target.value as JobProvince)}
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      {provinceList.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Employment Type</label>
                    <select
                      value={newVacType}
                      onChange={(e) => setNewVacType(e.target.value as EmploymentType)}
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Graduate Programme">Graduate Programme</option>
                      <option value="Internship">Internship</option>
                      <option value="Learnership">Learnership</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Closing Date</label>
                    <input
                      type="date"
                      required
                      value={newVacClosing}
                      onChange={(e) => setNewVacClosing(e.target.value)}
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newVacSalary}
                    onChange={(e) => setNewVacSalary(e.target.value)}
                    placeholder="e.g. R 35,000 - R 45,000 / month"
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Job Summary Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newVacDesc}
                    onChange={(e) => setNewVacDesc(e.target.value)}
                    placeholder="Overview of the vacancy..."
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewVacancyModalOpen(false)}
                    className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-300 text-xs rounded-xl font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold text-xs rounded-xl cursor-pointer shadow-lg"
                  >
                    Publish Position Live
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
