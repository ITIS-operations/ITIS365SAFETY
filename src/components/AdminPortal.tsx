import React, { useState } from 'react';
import { 
  Shield, Users, UserPlus, CreditCard, Radio, QrCode, Cpu, Search, 
  Plus, CheckCircle2, AlertTriangle, FileText, Printer, Download, RefreshCw, 
  Trash2, Lock, Smartphone, Check, Eye, ChevronRight, Layers, Building2, 
  Heart, Activity, Hash, Zap, Sparkles, Filter, Mail, Send, Unlock, KeyRound
} from 'lucide-react';
import { 
  Learner, EnrolledUser, DeviceAssignment, SchoolIDCard,
  initialDevices, initialIDCards
} from '../types';
import { authService, ProductionUserRecord } from '../services/authService';
import { EmailInspectorModal } from './EmailInspectorModal';
import { SchoolOnboardingWizard } from './SchoolOnboardingWizard';
import { EmailNotificationFactory } from '../services/emailService';
import { requestPasswordResetLink, unlockAccount, setAccountStatus } from '../services/identityEngine';

interface AdminPortalProps {
  learners: Learner[];
  onAddLearner: (learner: Learner) => void;
  onUpdateLearnerStatus: (learnerId: string, status: Learner['status']) => void;
}

export function AdminPortal({ learners, onAddLearner, onUpdateLearnerStatus }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'orgs' | 'schools' | 'learners' | 'devices' | 'idcards' | 'audit' | 'emails'>('users');
  const [isEmailInspectorOpen, setIsEmailInspectorOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Enrolled Users State from authService
  const [users, setUsers] = useState<ProductionUserRecord[]>(() => authService.getUsers());
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [lastEnrolledToken, setLastEnrolledToken] = useState<{ name: string; email: string; token: string } | null>(null);

  // Organisations & Schools State
  const [organisations, setOrganisations] = useState(() => authService.getOrganisations());
  const [schools, setSchools] = useState(() => authService.getSchools());
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'Government Department', domain: '', contactEmail: '' });
  const [newSchool, setNewSchool] = useState({ schoolName: '', schoolCode: '', province: 'Gauteng', principalName: '' });

  // Audit Logs State
  const [auditSearch, setAuditSearch] = useState('');

  // Device Assignments State
  const [devices, setDevices] = useState<DeviceAssignment[]>(initialDevices);
  const [deviceSearch, setDeviceSearch] = useState('');

  // School ID Cards State
  const [idCards, setIdCards] = useState<SchoolIDCard[]>(initialIDCards);
  const [idCardSearch, setIdCardSearch] = useState('');

  // Modal / Form States
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false);
  const [showPairDeviceModal, setShowPairDeviceModal] = useState(false);
  const [showIssueCardModal, setShowIssueCardModal] = useState(false);
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<SchoolIDCard | null>(initialIDCards[0] || null);

  // New User Form State
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'Parent' as EnrolledUser['role'],
    phone: '',
    rsaIdNumber: '',
    organization: ''
  });

  // New Learner Form State
  const [newLearner, setNewLearner] = useState({
    name: '',
    school: 'Gauteng High School',
    grade: 'Grade 9-A',
    medicalConditions: 'None',
    bloodGroup: 'O-Positive',
    emergencyPhone: '+27 82 000 0000',
    assignedGuardian: 'Thabo Ndlovu',
    trackerImei: `8610${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    trackerSerial: `ITIS-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
    simNumber: `+27 71 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face'
  });

  // New Device Form State
  const [newDevice, setNewDevice] = useState({
    imei: `8610${Math.floor(10000000000 + Math.random() * 90000000000)}`,
    serialNumber: `ITIS-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
    model: 'ITIS Smart Band v4' as DeviceAssignment['model'],
    simIccid: `89270104992${Math.floor(100000000 + Math.random() * 900000000)}`,
    simPhoneNumber: `+27 72 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
    assignedLearnerId: learners[0]?.id || 'l1'
  });

  // New Card Form State
  const [newCardLearnerId, setNewCardLearnerId] = useState<string>(learners[0]?.id || 'l1');

  // Handle Add User / Enrollment
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName || !newUser.email) return;

    const names = newUser.fullName.trim().split(' ');
    const firstName = names[0] || newUser.fullName;
    const lastName = names.slice(1).join(' ') || 'User';

    const res = authService.enrollUser({
      firstName,
      lastName,
      rsaIdNumber: newUser.rsaIdNumber || '9001015800088',
      email: newUser.email,
      phone: newUser.phone || '+27 82 000 0000',
      role: newUser.role as any,
      organization: newUser.organization || 'Gauteng Public Safety Network',
      enrolledBy: 'SYS_ADMIN'
    });

    if (res.success && res.activationToken) {
      setUsers(authService.getUsers());
      setLastEnrolledToken({
        name: newUser.fullName,
        email: newUser.email,
        token: res.activationToken
      });
      setShowAddUserModal(false);
      setNewUser({
        fullName: '',
        email: '',
        role: 'Parent',
        phone: '',
        rsaIdNumber: '',
        organization: ''
      });
    } else {
      alert(res.error || 'Failed to enroll user.');
    }
  };

  // Handle Assign / Revoke Role
  const handleAssignRole = (userId: string, newRole: any) => {
    const res = authService.assignRole(userId, newRole, 'Founder SuperAdmin');
    if (res.success) {
      setUsers(authService.getUsers());
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Handle Account Status Toggle (Suspend / Reactivate)
  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'SUSPENDED' || currentStatus === 'DISABLED' ? 'ACTIVE' : 'SUSPENDED';
    const res = authService.updateUserStatus(userId, nextStatus, 'Founder SuperAdmin');
    if (res.success) {
      setUsers(authService.getUsers());
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Handle Create Organisation
  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrg.name) return;
    const res = authService.createOrganisation({ ...newOrg, operatorName: 'Founder SuperAdmin' });
    if (res.success) {
      setOrganisations(authService.getOrganisations());
      setShowAddOrgModal(false);
      setActionNotice(res.message);
      setNewOrg({ name: '', type: 'Government Department', domain: '', contactEmail: '' });
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Handle Create School
  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.schoolName) return;
    const res = authService.createSchool({ ...newSchool, operatorName: 'Founder SuperAdmin' });
    if (res.success) {
      setSchools(authService.getSchools());
      setShowAddSchoolModal(false);
      setActionNotice(res.message);
      setNewSchool({ schoolName: '', schoolCode: '', province: 'Gauteng', principalName: '' });
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Handle Add Learner
  const handleCreateLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearner.name) return;

    const learnerId = `l${Date.now()}`;
    const createdLearner: Learner = {
      id: learnerId,
      name: newLearner.name,
      photoUrl: newLearner.photoUrl,
      school: newLearner.school,
      grade: newLearner.grade,
      medicalConditions: newLearner.medicalConditions,
      bloodGroup: newLearner.bloodGroup,
      emergencyContacts: [newLearner.emergencyPhone],
      trackerSerial: newLearner.trackerSerial,
      trackerImei: newLearner.trackerImei,
      deviceBattery: 100,
      deviceSignal: 'Strong',
      simNumber: newLearner.simNumber,
      assignedGuardian: newLearner.assignedGuardian,
      attendanceRate: 100,
      safetyScore: 98,
      heartRate: 75,
      temperature: 36.5,
      lastConnection: 'Just now',
      status: 'In School',
      latitude: -26.1952 + (Math.random() - 0.5) * 0.01,
      longitude: 28.0340 + (Math.random() - 0.5) * 0.01
    };

    onAddLearner(createdLearner);

    // Auto-create Device Assignment & ID Card
    const createdDevice: DeviceAssignment = {
      id: `DEV-${Math.floor(10000 + Math.random() * 90000)}`,
      imei: newLearner.trackerImei,
      serialNumber: newLearner.trackerSerial,
      model: 'ITIS Smart Band v4',
      simIccid: `89270104992${Math.floor(100000000 + Math.random() * 900000000)}`,
      simPhoneNumber: newLearner.simNumber,
      assignedLearnerId: learnerId,
      assignedLearnerName: newLearner.name,
      batteryLevel: 100,
      firmwareVersion: 'v4.3.0-RSA',
      pairingStatus: 'Paired & Active',
      lastPing: 'Just now'
    };
    setDevices(prev => [createdDevice, ...prev]);

    const createdCard: SchoolIDCard = {
      cardId: `IDC-${newLearner.school.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      learnerId: learnerId,
      learnerName: newLearner.name,
      schoolName: newLearner.school,
      grade: newLearner.grade,
      photoUrl: newLearner.photoUrl,
      trackerImei: newLearner.trackerImei,
      trackerSerial: newLearner.trackerSerial,
      nfcSerial: `NFC-8809-${Math.floor(100 + Math.random() * 900)}X`,
      bloodGroup: newLearner.bloodGroup,
      emergencyPhone: newLearner.emergencyPhone,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      status: 'Active Issued'
    };
    setIdCards(prev => [createdCard, ...prev]);
    setSelectedCardForPreview(createdCard);

    setShowAddLearnerModal(false);
    setNewLearner({
      name: '',
      school: 'Gauteng High School',
      grade: 'Grade 9-A',
      medicalConditions: 'None',
      bloodGroup: 'O-Positive',
      emergencyPhone: '+27 82 000 0000',
      assignedGuardian: 'Thabo Ndlovu',
      trackerImei: `8610${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      trackerSerial: `ITIS-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      simNumber: `+27 71 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
      photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face'
    });
  };

  // Handle Pair Device
  const handlePairDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find(l => l.id === newDevice.assignedLearnerId);
    
    const created: DeviceAssignment = {
      id: `DEV-${Math.floor(10000 + Math.random() * 90000)}`,
      imei: newDevice.imei,
      serialNumber: newDevice.serialNumber,
      model: newDevice.model,
      simIccid: newDevice.simIccid,
      simPhoneNumber: newDevice.simPhoneNumber,
      assignedLearnerId: newDevice.assignedLearnerId,
      assignedLearnerName: learner ? learner.name : 'Unassigned Learner',
      batteryLevel: 100,
      firmwareVersion: 'v4.3.0-RSA',
      pairingStatus: 'Paired & Active',
      lastPing: 'Just now'
    };

    setDevices(prev => [created, ...prev]);
    setShowPairDeviceModal(false);
  };

  // Handle Issue ID Card
  const handleIssueIDCard = (e: React.FormEvent) => {
    e.preventDefault();
    const learner = learners.find(l => l.id === newCardLearnerId);
    if (!learner) return;

    const created: SchoolIDCard = {
      cardId: `IDC-${learner.school.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      learnerId: learner.id,
      learnerName: learner.name,
      schoolName: learner.school,
      grade: learner.grade,
      photoUrl: learner.photoUrl,
      trackerImei: learner.trackerImei,
      trackerSerial: learner.trackerSerial,
      nfcSerial: `NFC-8809-${Math.floor(100 + Math.random() * 900)}X`,
      bloodGroup: learner.bloodGroup,
      emergencyPhone: learner.emergencyContacts[0] || '+27 82 000 0000',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '2026-12-31',
      status: 'Active Issued'
    };

    setIdCards(prev => [created, ...prev]);
    setSelectedCardForPreview(created);
    setShowIssueCardModal(false);
  };

  // Filtered lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.rsaIdNumber.includes(userSearch);
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredDevices = devices.filter(d => 
    d.imei.includes(deviceSearch) || 
    d.serialNumber.toLowerCase().includes(deviceSearch.toLowerCase()) ||
    d.assignedLearnerName.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  const filteredCards = idCards.filter(c => 
    c.cardId.toLowerCase().includes(idCardSearch.toLowerCase()) ||
    c.learnerName.toLowerCase().includes(idCardSearch.toLowerCase()) ||
    c.trackerImei.includes(idCardSearch)
  );

  return (
    <div className="flex-1 bg-brand-dark overflow-y-auto font-sans p-4 sm:p-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="glass-panel-heavy rounded-2xl p-6 border-2 border-brand-gold/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glow-gold">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[10px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Master Admin Enrollment & Hardware Authority
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase rounded">
              POPIA & ISO 27001 AUDITED
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Admin Infrastructure Enclave
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl font-mono leading-relaxed">
            Centralized enrollment control for all system identities, parent profiles, learners, hardware wearable pairings, and Smart School ID Cards embedded with Tracker IMEI numbers.
          </p>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={() => setShowOnboardingWizard(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-amber-300 text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xl transform active:scale-95 hover:brightness-110"
          >
            <Sparkles className="w-4 h-4 text-brand-dark fill-brand-dark" />
            <span>Launch Pilot School Wizard</span>
          </button>

          <button
            onClick={() => setIsEmailInspectorOpen(true)}
            className="px-3 py-2 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Outbound Email Queue Inspector</span>
          </button>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-3 py-2 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll User</span>
          </button>
          
          <button
            onClick={() => setShowAddLearnerModal(true)}
            className="px-3 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll Child</span>
          </button>

          <button
            onClick={() => setShowPairDeviceModal(true)}
            className="px-3 py-2 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Pair IMEI Tracker</span>
          </button>

          <button
            onClick={() => setShowIssueCardModal(true)}
            className="px-3 py-2 bg-brand-gold/20 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <CreditCard className="w-4 h-4" />
            <span>Issue Smart ID Card</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-brand-navy/80 rounded-2xl border border-brand-gold/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Enrolled Users</span>
            <Users className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-emerald-400 font-mono">100% Identity Verified</div>
        </div>

        <div className="p-4 bg-brand-navy/80 rounded-2xl border border-brand-gold/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Enrolled Children</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{learners.length}</div>
          <div className="text-[10px] text-brand-gold font-mono">Active Geofence Shielding</div>
        </div>

        <div className="p-4 bg-brand-navy/80 rounded-2xl border border-brand-gold/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Paired Trackers (IMEI)</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{devices.length}</div>
          <div className="text-[10px] text-emerald-400 font-mono">Vodacom APN Online</div>
        </div>

        <div className="p-4 bg-brand-navy/80 rounded-2xl border border-brand-gold/20 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Smart School ID Cards</span>
            <CreditCard className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{idCards.length}</div>
          <div className="text-[10px] text-brand-gold font-mono">Embedded IMEI Barcodes</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-brand-gold/20 pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'users' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orgs')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orgs' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organisations ({organisations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schools')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'schools' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Schools ({schools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('learners')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'learners' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Learners & Children ({learners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'devices' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Tracker Devices (IMEI) ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('idcards')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'idcards' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>School ID Cards ({idCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit' 
              ? 'bg-brand-gold text-brand-dark shadow-lg' 
              : 'bg-brand-navy/60 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Audit & Compliance Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`px-4 py-2 rounded-xl font-bold uppercase transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'emails' 
              ? 'bg-emerald-500 text-brand-dark shadow-lg' 
              : 'bg-emerald-950/40 text-emerald-300 hover:text-white border border-emerald-500/30'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>Enterprise Email Queue</span>
        </button>
      </div>

      {/* TAB 1: USERS & PARENT ENROLLMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Enrollment Token Success Banner */}
          {lastEnrolledToken && (
            <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500/60 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    ACCOUNT ENROLLED – ACTIVATION TOKEN GENERATED
                  </span>
                </div>
                <p className="text-xs text-white">
                  User <span className="font-bold text-brand-gold">{lastEnrolledToken.name}</span> ({lastEnrolledToken.email}) enrolled successfully.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-300">One-Time Activation Token:</span>
                  <span className="px-3 py-1 bg-brand-dark text-emerald-400 font-extrabold text-sm rounded border border-emerald-500/40 tracking-widest">
                    {lastEnrolledToken.token}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLastEnrolledToken(null)}
                className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-500/40 cursor-pointer self-end sm:self-center"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-navy/60 p-4 rounded-xl border border-brand-gold/20">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search enrolled users by name, email, or RSA ID..." 
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full bg-brand-dark border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-brand-gold shrink-0" />
              <select 
                value={userRoleFilter} 
                onChange={e => setUserRoleFilter(e.target.value)}
                className="bg-brand-dark border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-brand-gold focus:outline-none focus:border-brand-gold cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="Parent">Parent / Guardian</option>
                <option value="School">School Admin / Principal</option>
                <option value="Command">Command Center Officer</option>
                <option value="Technician">Technician / Field</option>
                <option value="Government">Government Oversight</option>
                <option value="Executive">Executive Partner</option>
                <option value="Admin">System Admin</option>
                <option value="SuperAdmin">SUPER_ADMIN (Founder)</option>
                <option value="Responder">First Responder</option>
              </select>
            </div>
          </div>

          <div className="bg-brand-navy rounded-2xl border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase border-b border-brand-gold/20">
                  <tr>
                    <th className="p-3.5">User Details</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">RSA ID Number</th>
                    <th className="p-3.5">Contact Details</th>
                    <th className="p-3.5">Organization / Family</th>
                    <th className="p-3.5">Activation Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-brand-dark/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs">{user.fullName}</div>
                        <div className="text-[10px] text-slate-400">{user.email}</div>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleAssignRole(user.id, e.target.value as any)}
                          className="bg-brand-dark border border-slate-700 text-brand-gold font-bold text-[10px] rounded px-1.5 py-1 focus:outline-none focus:border-brand-gold cursor-pointer"
                        >
                          <option value="Parent">Parent</option>
                          <option value="School">School</option>
                          <option value="Command">Command</option>
                          <option value="Technician">Technician</option>
                          <option value="Government">Government</option>
                          <option value="Executive">Executive</option>
                          <option value="Admin">Admin</option>
                          <option value="SuperAdmin">SuperAdmin</option>
                          <option value="Responder">Responder</option>
                        </select>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">{user.rsaIdNumber}</td>
                      <td className="p-3.5 text-slate-300 text-[11px]">{user.phone}</td>
                      <td className="p-3.5 text-slate-300 text-[11px]">{user.organization}</td>
                      <td className="p-3.5">
                        {user.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            ACTIVE
                          </span>
                        ) : user.status === 'INVITED' ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3" />
                              INVITED (ACTIVATION PENDING)
                            </span>
                            {user.activationToken && (
                              <div className="text-[10px] text-brand-gold font-bold">
                                Token: <code className="bg-brand-dark px-1 rounded text-white">{user.activationToken}</code>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-950 text-rose-400 border border-rose-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                            {user.status}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={async () => {
                            const actionUrl = `${window.location.origin}/accept-invite?token=${user.activationToken || 'act_token_123'}`;
                            await EmailNotificationFactory.sendInvitationEmail(
                              user.email,
                              user.fullName,
                              user.role,
                              user.activationToken || 'ACT-990812',
                              actionUrl
                            );
                            setActionNotice(`Invitation email re-dispatched to ${user.email}`);
                            setTimeout(() => setActionNotice(null), 3000);
                          }}
                          className="text-brand-gold hover:underline text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Resend Invite
                        </button>

                        <button
                          onClick={async () => {
                            await requestPasswordResetLink(user.email);
                            setActionNotice(`Password reset link dispatched to ${user.email}`);
                            setTimeout(() => setActionNotice(null), 3000);
                          }}
                          className="text-cyan-400 hover:underline text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Force Reset
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`text-[10px] uppercase font-bold cursor-pointer hover:underline ${
                            user.status === 'SUSPENDED' || user.status === 'DISABLED' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {user.status === 'SUSPENDED' || user.status === 'DISABLED' ? 'Reactivate' : 'Suspend'}
                        </button>

                        {user.status === 'LOCKED' && (
                          <button
                            onClick={async () => {
                              await unlockAccount(user.email);
                              setUsers(users.map(u => u.id === user.id ? { ...u, status: 'ACTIVE' } : u));
                              setActionNotice(`Account ${user.fullName} unlocked.`);
                              setTimeout(() => setActionNotice(null), 3000);
                            }}
                            className="text-emerald-400 hover:underline text-[10px] uppercase font-bold cursor-pointer"
                          >
                            Unlock Account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: ORGANISATIONS */}
      {activeTab === 'orgs' && (
        <div className="space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-navy/60 p-4 rounded-xl border border-brand-gold/20">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-gold" />
                Enterprise Organisations & Tenant Governance
              </h3>
              <p className="text-[10px] text-slate-400">Multi-tenant isolated government departments, private networks, and municipal emergency services.</p>
            </div>
            <button
              onClick={() => setShowAddOrgModal(true)}
              className="px-3.5 py-2 bg-brand-gold text-brand-dark hover:bg-amber-400 font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Organisation</span>
            </button>
          </div>

          <div className="bg-brand-navy rounded-2xl border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase border-b border-brand-gold/20">
                  <tr>
                    <th className="p-3.5">Organisation Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Tenant ID</th>
                    <th className="p-3.5">Domain</th>
                    <th className="p-3.5">Contact Email</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {organisations.map((org) => (
                    <tr key={org.id} className="hover:bg-brand-dark/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{org.name}</td>
                      <td className="p-3.5 text-slate-400">{org.type}</td>
                      <td className="p-3.5 text-brand-gold font-bold">{org.tenantId}</td>
                      <td className="p-3.5 text-slate-300">{org.domain}</td>
                      <td className="p-3.5 text-slate-400">{org.contactEmail}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase">
                          {org.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SCHOOLS */}
      {activeTab === 'schools' && (
        <div className="space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-navy/60 p-4 rounded-xl border border-brand-gold/20">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                Registered Safety Schools & EMIS Directory
              </h3>
              <p className="text-[10px] text-slate-400">South African Department of Basic Education registered schools with embedded child safety shielding.</p>
            </div>
            <button
              onClick={() => setShowAddSchoolModal(true)}
              className="px-3.5 py-2 bg-brand-gold text-brand-dark hover:bg-amber-400 font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create School</span>
            </button>
          </div>

          <div className="bg-brand-navy rounded-2xl border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase border-b border-brand-gold/20">
                  <tr>
                    <th className="p-3.5">School Name</th>
                    <th className="p-3.5">EMIS Code</th>
                    <th className="p-3.5">Province</th>
                    <th className="p-3.5">Principal</th>
                    <th className="p-3.5">Created Date</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {schools.map((s) => (
                    <tr key={s.id} className="hover:bg-brand-dark/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{s.schoolName}</td>
                      <td className="p-3.5 text-brand-gold font-bold">{s.schoolCode}</td>
                      <td className="p-3.5 text-slate-300">{s.province}</td>
                      <td className="p-3.5 text-slate-400">{s.principalName}</td>
                      <td className="p-3.5 text-slate-400">{s.createdAt}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEARNERS & CHILDREN ENROLLMENT */}
      {activeTab === 'learners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learners.map((learner) => (
              <div key={learner.id} className="bg-brand-navy p-5 rounded-2xl border border-brand-gold/20 space-y-4 hover:border-brand-gold/50 transition-all shadow-xl">
                <div className="flex items-start gap-3">
                  <img 
                    src={learner.photoUrl} 
                    alt={learner.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold shadow-md"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base font-mono">{learner.name}</h3>
                      <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded border uppercase ${
                        learner.status === 'In School' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' :
                        learner.status === 'En Route' ? 'bg-amber-950 text-amber-400 border-amber-500/30' :
                        'bg-rose-950 text-rose-400 border-rose-500/30 animate-pulse'
                      }`}>
                        {learner.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-gold font-mono">{learner.school} · {learner.grade}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Guardian: {learner.assignedGuardian}</p>
                  </div>
                </div>

                {/* Tracker IMEI Box */}
                <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Radio className="w-3 h-3 animate-pulse" /> Tracker IMEI:
                    </span>
                    <span className="text-brand-gold font-bold">{learner.trackerSerial}</span>
                  </div>
                  <div className="text-xs font-bold text-white tracking-widest bg-brand-navy/60 px-2 py-1 rounded border border-slate-800 text-center">
                    {learner.trackerImei}
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                    <span>SIM: {learner.simNumber}</span>
                    <span>Battery: {learner.deviceBattery}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800">
                  <span>Medical: {learner.medicalConditions}</span>
                  <span className="text-brand-gold font-bold">Blood: {learner.bloodGroup}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRACKER DEVICES & IMEI PAIRING */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-navy/60 p-4 rounded-xl border border-brand-gold/20">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Tracker IMEI, Serial Number, or Learner..." 
                value={deviceSearch}
                onChange={e => setDeviceSearch(e.target.value)}
                className="w-full bg-brand-dark border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              onClick={() => setShowPairDeviceModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pair New Tracker IMEI</span>
            </button>
          </div>

          <div className="bg-brand-navy rounded-2xl border border-brand-gold/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase border-b border-brand-gold/20">
                  <tr>
                    <th className="p-3.5">Tracker IMEI Number</th>
                    <th className="p-3.5">Serial Number</th>
                    <th className="p-3.5">Device Hardware Model</th>
                    <th className="p-3.5">Assigned Learner</th>
                    <th className="p-3.5">SIM ICCID & APN Phone</th>
                    <th className="p-3.5">Battery & Firmware</th>
                    <th className="p-3.5">Pairing Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-brand-dark/40 transition-colors">
                      <td className="p-3.5 font-bold text-emerald-400 tracking-wider font-mono text-xs">
                        {device.imei}
                      </td>
                      <td className="p-3.5 text-brand-gold text-[11px] font-bold">{device.serialNumber}</td>
                      <td className="p-3.5 text-white font-bold text-[11px]">{device.model}</td>
                      <td className="p-3.5 text-slate-200 font-bold text-[11px]">{device.assignedLearnerName}</td>
                      <td className="p-3.5 text-[10px] text-slate-400">
                        <div>ICCID: {device.simIccid}</div>
                        <div className="text-emerald-400">{device.simPhoneNumber} (Vodacom)</div>
                      </td>
                      <td className="p-3.5 text-[10px]">
                        <div className="text-slate-200 font-bold">Battery: {device.batteryLevel}%</div>
                        <div className="text-slate-500">{device.firmwareVersion}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          {device.pairingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SMART SCHOOL ID CARDS WITH TRACKER IMEI */}
      {activeTab === 'idcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Issued ID Cards List & Issuer Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-4 bg-brand-navy/60 p-4 rounded-xl border border-brand-gold/20">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search ID Cards by Card ID, Learner Name, or Tracker IMEI..." 
                  value={idCardSearch}
                  onChange={e => setIdCardSearch(e.target.value)}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <button
                onClick={() => setShowIssueCardModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Issue New Smart ID Card</span>
              </button>
            </div>

            <div className="bg-brand-navy rounded-2xl border border-brand-gold/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-brand-dark/90 text-brand-gold text-[10px] uppercase border-b border-brand-gold/20">
                    <tr>
                      <th className="p-3.5">Card ID</th>
                      <th className="p-3.5">Learner & School</th>
                      <th className="p-3.5">Tracker IMEI Barcode</th>
                      <th className="p-3.5">NFC Tag</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Preview / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredCards.map((card) => (
                      <tr 
                        key={card.cardId} 
                        className={`hover:bg-brand-dark/40 transition-colors cursor-pointer ${
                          selectedCardForPreview?.cardId === card.cardId ? 'bg-brand-dark/60 border-l-4 border-brand-gold' : ''
                        }`}
                        onClick={() => setSelectedCardForPreview(card)}
                      >
                        <td className="p-3.5 font-bold text-brand-gold font-mono text-xs">
                          {card.cardId}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white text-xs">{card.learnerName}</div>
                          <div className="text-[10px] text-slate-400">{card.schoolName} · {card.grade}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-emerald-400 font-bold font-mono text-xs tracking-wider">{card.trackerImei}</div>
                          <div className="text-[9px] text-slate-500">Serial: {card.trackerSerial}</div>
                        </td>
                        <td className="p-3.5 text-[10px] text-slate-300 font-mono">{card.nfcSerial}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            {card.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCardForPreview(card);
                            }}
                            className="px-2.5 py-1 bg-brand-dark border border-brand-gold/40 text-brand-gold rounded hover:bg-brand-gold hover:text-brand-dark text-[10px] uppercase font-bold transition-all"
                          >
                            Inspect Badge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Live Printable Smart ID Card Badge Preview */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-brand-gold flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Interactive Smart School ID Card Display
            </h3>

            {selectedCardForPreview ? (
              <div className="space-y-4">
                {/* Physical Printable ID Badge Container */}
                <div id="smart-id-card-print-target" className="bg-gradient-to-b from-brand-navy-heavy to-brand-dark p-5 rounded-2xl border-2 border-brand-gold shadow-2xl space-y-4 relative overflow-hidden glow-gold">
                  
                  {/* Watermark Logo */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Header Badge Strip */}
                  <div className="flex items-center justify-between border-b border-brand-gold/30 pb-3">
                    <div>
                      <h4 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">
                        {selectedCardForPreview.schoolName}
                      </h4>
                      <p className="text-[9px] text-brand-gold font-mono tracking-widest uppercase">
                        ITIS SMART SAFETY SCHOOL IDENTITY CARD
                      </p>
                    </div>
                    <span className="text-[8px] bg-brand-gold text-brand-dark font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">
                      OFFICIAL PVC
                    </span>
                  </div>

                  {/* Learner Info Body */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={selectedCardForPreview.photoUrl} 
                      alt={selectedCardForPreview.learnerName} 
                      className="w-20 h-24 rounded-xl object-cover border-2 border-brand-gold shadow-md"
                    />
                    <div className="space-y-1 font-mono text-xs flex-1">
                      <div className="font-extrabold text-white text-base leading-tight">
                        {selectedCardForPreview.learnerName}
                      </div>
                      <div className="text-brand-gold font-bold text-xs">{selectedCardForPreview.grade}</div>
                      <div className="text-[10px] text-slate-300">Blood Group: <span className="text-white font-bold">{selectedCardForPreview.bloodGroup}</span></div>
                      <div className="text-[10px] text-slate-300">Emergency Contact: <span className="text-white">{selectedCardForPreview.emergencyPhone}</span></div>
                      <div className="text-[9px] text-slate-400 pt-1">ID Card No: {selectedCardForPreview.cardId}</div>
                    </div>
                  </div>

                  {/* PROMINENT TRACKER IMEI BARCODE BOX */}
                  <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/40 space-y-2 text-center font-mono">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">TRACKER IMEI NUMBER:</span>
                      <span className="text-emerald-400 font-bold uppercase">GPS LIVE ACTIVE</span>
                    </div>
                    
                    <div className="text-sm sm:text-base font-extrabold text-white tracking-widest bg-brand-navy p-2 rounded border border-brand-gold/30 text-emerald-400 font-mono shadow-inner">
                      {selectedCardForPreview.trackerImei}
                    </div>

                    {/* Simulated SVG Barcode representation */}
                    <div className="h-9 bg-white p-1 rounded flex items-center justify-center gap-0.5 opacity-90">
                      {[1,2,1,3,1,1,2,3,1,2,1,1,3,2,1,2,1,3,1,2,1,3,2,1,1,2,3,1,2,1,3].map((width, idx) => (
                        <div key={idx} className="bg-black h-full" style={{ width: `${width * 2}px` }} />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>Serial: {selectedCardForPreview.trackerSerial}</span>
                      <span>NFC Tag: {selectedCardForPreview.nfcSerial}</span>
                    </div>
                  </div>

                  {/* Bottom Verification Ribbon */}
                  <div className="flex items-center justify-between pt-1 text-[8px] font-mono text-slate-400 border-t border-slate-800">
                    <span>Issued: {selectedCardForPreview.issueDate}</span>
                    <span>Valid Thru: {selectedCardForPreview.expiryDate}</span>
                    <span className="text-brand-gold font-bold">POPIA VERIFIED</span>
                  </div>

                </div>

                {/* Badge Actions */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button 
                    onClick={() => alert(`Printing Official PVC ID Card Badge for ${selectedCardForPreview.learnerName} (Tracker IMEI: ${selectedCardForPreview.trackerImei})...`)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print PVC Badge</span>
                  </button>

                  <button 
                    onClick={() => alert(`Digital Smart Pass exported for ${selectedCardForPreview.learnerName}!`)}
                    className="py-2.5 px-3 bg-brand-navy border border-brand-gold/40 hover:border-brand-gold text-brand-gold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer uppercase text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Pass</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-brand-navy rounded-2xl border border-slate-800 text-center font-mono text-slate-500 text-xs">
                Select a card from the table to preview badge details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-brand-navy p-6 rounded-2xl border border-brand-gold/20 space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-gold" />
              POPIA Data Privacy & System Identity Audit Directory
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              AUDIT TRAIL UNTAMPERABLE
            </span>
          </div>

          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter audit logs by action, user name, role, or details..." 
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              className="w-full bg-brand-dark border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="space-y-2 text-xs">
            {authService.getAuditLogs()
              .filter(log => {
                if (!auditSearch) return true;
                const query = auditSearch.toLowerCase();
                return (
                  log.action.toLowerCase().includes(query) ||
                  log.userName.toLowerCase().includes(query) ||
                  log.role.toLowerCase().includes(query) ||
                  log.details.toLowerCase().includes(query)
                );
              })
              .map((log) => (
                <div key={log.id} className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-300">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-gold font-bold">{log.action}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                        log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                        log.status === 'DENIED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                        'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-400">({log.role})</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">{log.details}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 sm:text-right shrink-0">
                    <div className="text-slate-400 font-bold">{log.userName}</div>
                    <div>{log.timestamp}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 6: ENTERPRISE OUTBOUND EMAIL QUEUE & SERVICE INSPECTOR */}
      {activeTab === 'emails' && (
        <div className="bg-brand-navy-heavy border border-emerald-500/40 rounded-2xl p-6 space-y-6 font-mono shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                  Outbound SMTP / Transactional Email Queue
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Integrated Email Notification Factory for invitation dispatches, POPIA account activations, password resets, and automated guardian alert digests.
              </p>
            </div>

            <button
              onClick={() => setIsEmailInspectorOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Launch Full Modal Queue Inspector</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-brand-dark/80 rounded-xl border border-emerald-500/30 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Queue Delivery Status</span>
              <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>ACTIVE / ONLINE</span>
              </div>
              <p className="text-[10px] text-slate-400">Zero-latency dispatch simulation pipeline active</p>
            </div>

            <div className="p-4 bg-brand-dark/80 rounded-xl border border-brand-gold/30 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Registered Target Accounts</span>
              <div className="text-xl font-extrabold text-brand-gold">{users.length} Enrolled Users</div>
              <p className="text-[10px] text-slate-400">Guardian emails, School Admins & Command Dispatchers</p>
            </div>

            <div className="p-4 bg-brand-dark/80 rounded-xl border border-cyan-500/30 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Supported Token Flows</span>
              <div className="text-xs text-cyan-300 font-bold space-y-0.5">
                <div>• User Activation & Onboarding</div>
                <div>• Emergency Guardian Invite</div>
                <div>• Self-Service Password Reset</div>
                <div>• Account Lockout Unlock Links</div>
              </div>
            </div>
          </div>

          {/* Quick Dispatch Controls for Admin */}
          <div className="p-4 bg-brand-dark/90 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Admin Direct Action Link Generator</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Select an enrolled user from the list below to trigger immediate email notification dispatch or copy their action token:
            </p>

            <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              {users.map(u => (
                <div key={u.id} className="p-3 bg-brand-navy/40 hover:bg-brand-navy flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{u.fullName}</span>
                      <span className="px-1.5 py-0.5 bg-brand-gold/20 text-brand-gold rounded text-[10px]">{u.role}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        const actionUrl = `${window.location.origin}/accept-invite?token=${u.activationToken || 'act_token_123'}`;
                        await EmailNotificationFactory.sendInvitationEmail(
                          u.email,
                          u.fullName,
                          u.role,
                          u.activationToken || 'ACT-990812',
                          actionUrl
                        );
                        setIsEmailInspectorOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3 h-3 text-emerald-400" />
                      <span>Dispatch & Inspect</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-brand-gold" />
                Enroll System User / Guardian
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sipho Mokoena" 
                  value={newUser.fullName}
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. mthokozisi@live.co.za" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Role Identity</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as EnrolledUser['role']})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-brand-gold focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Parent">Parent / Guardian</option>
                    <option value="School">School Admin / Principal</option>
                    <option value="Command">Command Center Operator</option>
                    <option value="Technician">Field Technician</option>
                    <option value="Government">Government Official</option>
                    <option value="Executive">Executive Partner</option>
                    <option value="Admin">System Admin</option>
                    <option value="SuperAdmin">SUPER_ADMIN (Founder)</option>
                    <option value="Responder">First Responder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="+27 82 000 0000" 
                    value={newUser.phone}
                    onChange={e => setNewUser({...newUser, phone: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">RSA ID / Passport</label>
                  <input 
                    type="text" 
                    placeholder="8501015800088" 
                    value={newUser.rsaIdNumber}
                    onChange={e => setNewUser({...newUser, rsaIdNumber: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Organization</label>
                  <input 
                    type="text" 
                    placeholder="Mokoena Family" 
                    value={newUser.organization}
                    onChange={e => setNewUser({...newUser, organization: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ENROLL CHILD / LEARNER MODAL */}
      {showAddLearnerModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-gold" />
                Enroll New Child & Auto-Pair Tracker IMEI
              </h3>
              <button onClick={() => setShowAddLearnerModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateLearner} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Child / Learner Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lesedi Mokoena" 
                  value={newLearner.name}
                  onChange={e => setNewLearner({...newLearner, name: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">School Name</label>
                  <select 
                    value={newLearner.school}
                    onChange={e => setNewLearner({...newLearner, school: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Gauteng High School">Gauteng High School</option>
                    <option value="Parktown Girls Primary">Parktown Girls Primary</option>
                    <option value="Parktown Boys High">Parktown Boys High</option>
                    <option value="Soweto Comprehensive High">Soweto Comprehensive High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Grade</label>
                  <input 
                    type="text" 
                    placeholder="Grade 8-B" 
                    value={newLearner.grade}
                    onChange={e => setNewLearner({...newLearner, grade: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Guardian</label>
                  <input 
                    type="text" 
                    placeholder="Parent / Guardian Name" 
                    value={newLearner.assignedGuardian}
                    onChange={e => setNewLearner({...newLearner, assignedGuardian: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Emergency Phone</label>
                  <input 
                    type="text" 
                    placeholder="0624304906" 
                    value={newLearner.emergencyPhone}
                    onChange={e => setNewLearner({...newLearner, emergencyPhone: e.target.value})}
                    className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Hardware Tracker Auto-Generated Box */}
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-2">
                <div className="text-[10px] text-brand-gold font-bold uppercase flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" /> Hardware Tracker IMEI Provisioned
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Tracker IMEI:</span>
                    <span className="text-emerald-400 font-bold">{newLearner.trackerImei}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Serial Number:</span>
                    <span className="text-white font-bold">{newLearner.trackerSerial}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddLearnerModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Enroll Child & Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAIR DEVICE MODAL */}
      {showPairDeviceModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Pair Hardware Tracker IMEI
              </h3>
              <button onClick={() => setShowPairDeviceModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">✕</button>
            </div>

            <form onSubmit={handlePairDevice} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Tracker IMEI Number (15 Digits)</label>
                <input 
                  type="text" 
                  required
                  value={newDevice.imei}
                  onChange={e => setNewDevice({...newDevice, imei: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold tracking-widest focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assign to Enrolled Learner</label>
                <select 
                  value={newDevice.assignedLearnerId}
                  onChange={e => setNewDevice({...newDevice, assignedLearnerId: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                >
                  {learners.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.school})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hardware Model</label>
                <select 
                  value={newDevice.model}
                  onChange={e => setNewDevice({...newDevice, model: e.target.value as DeviceAssignment['model']})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                >
                  <option value="ITIS Smart Band v4">ITIS Smart Band v4</option>
                  <option value="ITIS GeoPendant Pro">ITIS GeoPendant Pro</option>
                  <option value="ITIS Beacon Tag x1">ITIS Beacon Tag x1</option>
                  <option value="ITIS Smart Card Badge">ITIS Smart Card Badge</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowPairDeviceModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Complete IMEI Pairing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ISSUE ID CARD MODAL */}
      {showIssueCardModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-gold" />
                Issue Smart School ID Card (with IMEI Barcode)
              </h3>
              <button onClick={() => setShowIssueCardModal(false)} className="text-slate-400 hover:text-white font-mono text-xs">✕</button>
            </div>

            <form onSubmit={handleIssueIDCard} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Select Learner</label>
                <select 
                  value={newCardLearnerId}
                  onChange={e => setNewCardLearnerId(e.target.value)}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                >
                  {learners.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} - {l.school} (IMEI: {l.trackerImei})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20 text-[10px] text-slate-300 space-y-1">
                <p className="text-brand-gold font-bold uppercase">Card Specification:</p>
                <p>• High-density PVC card with embedded NFC chip</p>
                <p>• High-contrast optical Tracker IMEI barcode</p>
                <p>• Encrypted QR Code linked to Emergency Medical Profile</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowIssueCardModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Issue & Preview Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ORGANISATION */}
      {showAddOrgModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-gold" />
                Register Enterprise Organisation
              </h3>
              <button onClick={() => setShowAddOrgModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Organisation Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. City of Tshwane Emergency Services" 
                  value={newOrg.name}
                  onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Organisation Type</label>
                <select 
                  value={newOrg.type}
                  onChange={e => setNewOrg({...newOrg, type: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-brand-gold focus:outline-none focus:border-brand-gold"
                >
                  <option value="Government Department">Government Department</option>
                  <option value="Municipal Dispatch">Municipal Dispatch</option>
                  <option value="Private Security Network">Private Security Network</option>
                  <option value="Educational District">Educational District</option>
                  <option value="Founder Security Enclave">Founder Security Enclave</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Domain Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. tshwane.gov.za" 
                  value={newOrg.domain}
                  onChange={e => setNewOrg({...newOrg, domain: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. admin@tshwane.gov.za" 
                  value={newOrg.contactEmail}
                  onChange={e => setNewOrg({...newOrg, contactEmail: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddOrgModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Register Organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SCHOOL */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-navy-heavy border-2 border-brand-gold/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                Register Safety School (EMIS)
              </h3>
              <button onClick={() => setShowAddSchoolModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">School Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Pretoria Boys High School" 
                  value={newSchool.schoolName}
                  onChange={e => setNewSchool({...newSchool, schoolName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EMIS School Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. EMIS-700103" 
                  value={newSchool.schoolCode}
                  onChange={e => setNewSchool({...newSchool, schoolCode: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Province</label>
                <select 
                  value={newSchool.province}
                  onChange={e => setNewSchool({...newSchool, province: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-brand-gold focus:outline-none focus:border-brand-gold"
                >
                  <option value="Gauteng">Gauteng</option>
                  <option value="Western Cape">Western Cape</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Principal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Principal D. Marais" 
                  value={newSchool.principalName}
                  onChange={e => setNewSchool({...newSchool, principalName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-4 py-2 bg-brand-dark border border-slate-800 text-slate-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl uppercase tracking-wider"
                >
                  Register School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Service Inspector Modal */}
      <EmailInspectorModal
        isOpen={isEmailInspectorOpen}
        onClose={() => setIsEmailInspectorOpen(false)}
      />

      {/* Guided School Onboarding Wizard Modal */}
      {showOnboardingWizard && (
        <SchoolOnboardingWizard
          onClose={() => setShowOnboardingWizard(false)}
          onComplete={() => {
            setUsers(authService.getUsers());
            setOrganisations(authService.getOrganisations());
            setSchools(authService.getSchools());
          }}
        />
      )}

    </div>
  );
}
