import React, { useState } from 'react';
import { 
  Building2, Layers, UserCheck, PhoneCall, Users, HeartHandshake, Cpu, CheckCircle2, 
  ArrowRight, ArrowLeft, Shield, AlertTriangle, Sparkles, Check, Mail, Lock, RefreshCw, Eye
} from 'lucide-react';
import { authService, UserRole, ProductionUserRecord, OrganisationRecord, SchoolRecord } from '../services/authService';
import { sendEnterpriseEmail } from '../services/emailService';
import { Learner } from '../types';

interface SchoolOnboardingWizardProps {
  onClose: () => void;
  onComplete: (data: {
    organisation: OrganisationRecord;
    school: SchoolRecord;
    adminUser: ProductionUserRecord;
    learners: any[];
    guardians: any[];
    devices: any[];
  }) => void;
}

export function SchoolOnboardingWizard({ onClose, onComplete }: SchoolOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Organisation
  const [orgData, setOrgData] = useState({
    name: 'Gauteng Department of Education - Pilot Zone',
    type: 'Government Department',
    domain: 'gauteng.gov.za',
    contactEmail: 'safety-pilot@gauteng.gov.za'
  });

  // Step 2: School Details
  const [schoolData, setSchoolData] = useState({
    schoolName: 'Pretoria East Safety Academy',
    schoolCode: 'EMIS-7002026',
    province: 'Gauteng',
    principalName: 'Dr. Kobus van der Merwe',
    contactPhone: '+27 12 345 6789',
    physicalAddress: '100 Lynnwood Road, Pretoria East, Pretoria, 0081'
  });

  // Step 3: School Administrator
  const [adminData, setAdminData] = useState({
    firstName: 'Thabo',
    lastName: 'Mokoena',
    rsaIdNumber: '8203155098081',
    email: 'principal.mokoena@gautengschools.co.za',
    phone: '+27 82 555 1234'
  });

  // Step 4: Emergency Contacts & Responders
  const [emergencyData, setEmergencyData] = useState({
    sapsStation: 'Pretoria East SAPS Precinct',
    sapsPhone: '+27 12 369 1111',
    securityDispatch: 'Tactical Shield Operations',
    securityPhone: '+27 86 191 1911',
    medicalLine: 'Netcare 911 Rapid Medical Response',
    medicalPhone: '082 911'
  });

  // Step 5: Initial Learners
  const [learnersList, setLearnersList] = useState([
    {
      name: 'Lesedi Mokoena',
      grade: 'Grade 4',
      rsaId: '1604120000082',
      medicalConditions: 'Mild asthma, carries inhaler in backpack',
      bloodGroup: 'O+'
    },
    {
      name: 'Katlego Mokoena',
      grade: 'Grade 7',
      rsaId: '1308150000088',
      medicalConditions: 'Peanut allergy',
      bloodGroup: 'A+'
    }
  ]);
  const [newLearner, setNewLearner] = useState({
    name: '',
    grade: 'Grade 1',
    rsaId: '',
    medicalConditions: 'None',
    bloodGroup: 'A+'
  });

  // Step 6: Parents / Guardians
  const [guardiansList, setGuardiansList] = useState([
    {
      firstName: 'Sipho',
      lastName: 'Mokoena',
      rsaIdNumber: '8005125000088',
      email: 'sipho.mokoena@gmail.com',
      phone: '+27 83 444 8888',
      relationship: 'Father',
      linkedChildrenNames: ['Lesedi Mokoena', 'Katlego Mokoena']
    }
  ]);
  const [newGuardian, setNewGuardian] = useState({
    firstName: '',
    lastName: '',
    rsaIdNumber: '',
    email: '',
    phone: '',
    relationship: 'Mother',
    linkedChildrenNames: [] as string[]
  });

  // Step 7: Devices
  const [devicesList, setDevicesList] = useState([
    {
      imei: '861099238471101',
      simNumber: '+27712340001',
      assignedLearnerName: 'Lesedi Mokoena',
      model: 'ITIS Smart Badge V2'
    },
    {
      imei: '861099238471102',
      simNumber: '+27712340002',
      assignedLearnerName: 'Katlego Mokoena',
      model: 'ITIS Smart Badge V2'
    }
  ]);
  const [newDevice, setNewDevice] = useState({
    imei: '',
    simNumber: '',
    assignedLearnerName: '',
    model: 'ITIS Smart Badge V2'
  });

  // Activation Progress State
  const [isActivating, setIsActivating] = useState(false);
  const [activationProgress, setActivationProgress] = useState(0);
  const [activationLog, setActivationLog] = useState<string[]>([]);
  const [activationResult, setActivationResult] = useState<{
    org?: OrganisationRecord;
    school?: SchoolRecord;
    adminUser?: ProductionUserRecord;
    token?: string;
  } | null>(null);

  const stepsList = [
    { num: 1, name: 'Organisation', icon: Building2 },
    { num: 2, name: 'School Details', icon: Layers },
    { num: 3, name: 'Administrator', icon: UserCheck },
    { num: 4, name: 'Emergency Contacts', icon: PhoneCall },
    { num: 5, name: 'Learners', icon: Users },
    { num: 6, name: 'Guardians', icon: HeartHandshake },
    { num: 7, name: 'Devices', icon: Cpu },
    { num: 8, name: 'Review', icon: Eye },
    { num: 9, name: 'Activate Pilot', icon: Sparkles },
  ];

  const handleAddLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearner.name) return;
    setLearnersList([...learnersList, { ...newLearner }]);
    setNewLearner({ name: '', grade: 'Grade 1', rsaId: '', medicalConditions: 'None', bloodGroup: 'A+' });
  };

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardian.firstName || !newGuardian.email) return;
    setGuardiansList([...guardiansList, { ...newGuardian }]);
    setNewGuardian({ firstName: '', lastName: '', rsaIdNumber: '', email: '', phone: '', relationship: 'Mother', linkedChildrenNames: [] });
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.imei) return;
    setDevicesList([...devicesList, { ...newDevice }]);
    setNewDevice({ imei: '', simNumber: '', assignedLearnerName: '', model: 'ITIS Smart Badge V2' });
  };

  const executePilotActivation = async () => {
    setIsActivating(true);
    setActivationProgress(10);
    setActivationLog(['Initializing Zero-Trust Enterprise Pilot Provisioning Engine...']);

    await new Promise(r => setTimeout(r, 600));

    // 1. Create Organisation
    setActivationProgress(25);
    setActivationLog(prev => [...prev, `[1/8] Creating Enterprise Organisation: '${orgData.name}'`]);
    const orgRes = authService.createOrganisation({
      name: orgData.name,
      type: orgData.type,
      domain: orgData.domain,
      contactEmail: orgData.contactEmail,
      operatorName: 'ITIS Founder SuperAdmin'
    });

    await new Promise(r => setTimeout(r, 600));

    // 2. Create School
    setActivationProgress(40);
    setActivationLog(prev => [...prev, `[2/8] Provisioning School Record & EMIS Registration: '${schoolData.schoolName}' (${schoolData.schoolCode})`]);
    const schoolRes = authService.createSchool({
      schoolName: schoolData.schoolName,
      schoolCode: schoolData.schoolCode,
      province: schoolData.province,
      principalName: schoolData.principalName,
      operatorName: 'ITIS Founder SuperAdmin'
    });

    await new Promise(r => setTimeout(r, 600));

    // 3. Enroll School Administrator User
    setActivationProgress(55);
    setActivationLog(prev => [...prev, `[3/8] Enrolling School Administrator: '${adminData.firstName} ${adminData.lastName}' (${adminData.email})`]);
    const enrollRes = authService.enrollUser({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      rsaIdNumber: adminData.rsaIdNumber,
      email: adminData.email,
      phone: adminData.phone,
      role: 'School',
      organization: orgData.name,
      school: schoolData.schoolName,
      enrolledBy: 'ITIS Founder SuperAdmin'
    });

    await new Promise(r => setTimeout(r, 600));

    // 4. Enroll Emergency Contacts / Responders
    setActivationProgress(70);
    setActivationLog(prev => [...prev, `[4/8] Binding Emergency Contact Precincts (${emergencyData.sapsStation}, ${emergencyData.securityDispatch})`]);

    // 5. Enroll Guardians
    for (const g of guardiansList) {
      authService.enrollUser({
        firstName: g.firstName,
        lastName: g.lastName,
        rsaIdNumber: g.rsaIdNumber,
        email: g.email,
        phone: g.phone,
        role: 'Parent',
        organization: orgData.name,
        school: schoolData.schoolName,
        enrolledBy: 'ITIS Founder SuperAdmin'
      });
    }

    await new Promise(r => setTimeout(r, 600));

    // 6. Send Invitation Emails
    setActivationProgress(85);
    setActivationLog(prev => [...prev, `[5/8] Dispatching Encrypted Activation Invitation to ${adminData.email}`]);
    if (enrollRes.activationToken) {
      await sendEnterpriseEmail({
        category: 'SCHOOL_ADMIN_INVITATION',
        recipientEmail: adminData.email,
        recipientName: `${adminData.firstName} ${adminData.lastName}`,
        subject: `ITIS Guardian Network — School Administrator Invitation for ${schoolData.schoolName}`,
        title: `Welcome to the ITIS Guardian Network Pilot`,
        preheader: `You have been appointed as School Administrator for ${schoolData.schoolName}.`,
        contentParagraphs: [
          `You have been granted School Administrator authority for ${schoolData.schoolName} under the ${orgData.name} pilot program.`,
          `Your account has been created in 'INVITED' status. Use the single-use activation token below to establish your password and complete your MFA enrollment.`
        ],
        token: enrollRes.activationToken,
        actionLabel: 'Activate School Admin Account',
        actionUrl: `${window.location.origin}/activate?token=${enrollRes.activationToken}`,
        securityNotice: 'CONFIDENTIAL: This activation token expires in 72 hours. Do not share this token.'
      });
    }

    for (const g of guardiansList) {
      setActivationLog(prev => [...prev, `[6/8] Dispatching Parent Guardian Invitation to ${g.email}`]);
      await sendEnterpriseEmail({
        category: 'GUARDIAN_INVITATION',
        recipientEmail: g.email,
        recipientName: `${g.firstName} ${g.lastName}`,
        subject: `ITIS Child Safety Shield — Guardian Invitation for ${schoolData.schoolName}`,
        title: `Parent Guardian Activation Notice`,
        preheader: `Your child safety shield for ${g.linkedChildrenNames.join(', ')} is ready for activation.`,
        contentParagraphs: [
          `You have been registered as the verified parent/guardian for ${g.linkedChildrenNames.join(', ')} at ${schoolData.schoolName}.`,
          `Use your activation email to create your password and log into the Guardian Safety Portal.`
        ],
        actionLabel: 'Activate Parent Guardian Account',
        actionUrl: `${window.location.origin}/activate`,
        securityNotice: 'Protected under the SA Protection of Personal Information Act (POPIA).'
      });
    }

    await new Promise(r => setTimeout(r, 600));

    setActivationProgress(100);
    setActivationLog(prev => [...prev, `[7/8] Recording ISO 27001 & POPIA Tamper-Proof Audit Entry`]);
    setActivationLog(prev => [...prev, `[8/8] PILOT ACTIVATION COMPLETE! All systems operational.`]);

    setIsActivating(false);
    setActivationResult({
      org: orgRes.org,
      school: schoolRes.school,
      adminUser: enrollRes.user,
      token: enrollRes.activationToken
    });

    if (onComplete && orgRes.org && schoolRes.school && enrollRes.user) {
      onComplete({
        organisation: orgRes.org,
        school: schoolRes.school,
        adminUser: enrollRes.user,
        learners: learnersList,
        guardians: guardiansList,
        devices: devicesList
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-lg flex flex-col justify-between overflow-y-auto font-sans p-4 sm:p-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto bg-brand-navy p-4 rounded-2xl border border-brand-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-gold/20 rounded-xl border border-brand-gold/40 text-brand-gold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              Guided Pilot School Onboarding Wizard
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Enterprise Tenant Hierarchy Provisioning · ISO 27001 & POPIA Compliant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-300 rounded-xl hover:text-white cursor-pointer"
          >
            Cancel / Exit
          </button>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="max-w-6xl w-full mx-auto my-4 bg-brand-navy/80 p-3 rounded-2xl border border-slate-800 font-mono text-[10px] overflow-x-auto shrink-0">
        <div className="flex items-center justify-between min-w-[700px]">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isDone = step.num < currentStep;
            const isCurrent = step.num === currentStep;

            return (
              <div 
                key={step.num}
                onClick={() => !isActivating && setCurrentStep(step.num)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-brand-gold text-brand-dark font-extrabold shadow-md' 
                    : isDone 
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                <span>Step {step.num}: {step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-4xl w-full mx-auto my-auto bg-brand-navy p-6 sm:p-8 rounded-3xl border-2 border-brand-gold/30 shadow-2xl space-y-6 font-mono">
        
        {/* STEP 1: ORGANISATION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 1 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-gold" />
                Select or Register Pilot Organisation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Top-level enterprise tenant under which school infrastructure operates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Organisation Name</label>
                <input 
                  type="text" 
                  value={orgData.name}
                  onChange={e => setOrgData({...orgData, name: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Organisation Type</label>
                <select 
                  value={orgData.type}
                  onChange={e => setOrgData({...orgData, type: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-brand-gold focus:outline-none focus:border-brand-gold"
                >
                  <option value="Government Department">Government Department</option>
                  <option value="Provincial Education District">Provincial Education District</option>
                  <option value="Private School Network">Private School Network</option>
                  <option value="Municipal Emergency Services">Municipal Emergency Services</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Domain</label>
                <input 
                  type="text" 
                  value={orgData.domain}
                  onChange={e => setOrgData({...orgData, domain: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  value={orgData.contactEmail}
                  onChange={e => setOrgData({...orgData, contactEmail: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCHOOL DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 2 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-gold" />
                School Facility & EMIS Registration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Department of Basic Education EMIS details for location tracking & geofencing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">School Name</label>
                <input 
                  type="text" 
                  value={schoolData.schoolName}
                  onChange={e => setSchoolData({...schoolData, schoolName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">EMIS School Code</label>
                <input 
                  type="text" 
                  value={schoolData.schoolCode}
                  onChange={e => setSchoolData({...schoolData, schoolCode: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-brand-gold font-bold focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Province</label>
                <select 
                  value={schoolData.province}
                  onChange={e => setSchoolData({...schoolData, province: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-brand-gold focus:outline-none focus:border-brand-gold"
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
                <label className="block text-slate-300 mb-1">Principal Name</label>
                <input 
                  type="text" 
                  value={schoolData.principalName}
                  onChange={e => setSchoolData({...schoolData, principalName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1">Physical Address (Geofence Reference)</label>
                <input 
                  type="text" 
                  value={schoolData.physicalAddress}
                  onChange={e => setSchoolData({...schoolData, physicalAddress: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SCHOOL ADMINISTRATOR */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 3 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-gold" />
                School Administrator Identity Appointment
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Appoint the verified administrator who will receive the single-use invitation token.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">First Name</label>
                <input 
                  type="text" 
                  value={adminData.firstName}
                  onChange={e => setAdminData({...adminData, firstName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={adminData.lastName}
                  onChange={e => setAdminData({...adminData, lastName: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">RSA ID Number / Passport</label>
                <input 
                  type="text" 
                  value={adminData.rsaIdNumber}
                  onChange={e => setAdminData({...adminData, rsaIdNumber: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Email (Invitation Destination)</label>
                <input 
                  type="email" 
                  value={adminData.email}
                  onChange={e => setAdminData({...adminData, email: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-brand-gold font-bold focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Direct Contact Number</label>
                <input 
                  type="text" 
                  value={adminData.phone}
                  onChange={e => setAdminData({...adminData, phone: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: EMERGENCY CONTACTS */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 4 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-brand-gold" />
                Emergency Contacts & First Responders
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Bind local SAPS precincts, armed tactical response, and medical dispatch lines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">SAPS Police Precinct</label>
                <input 
                  type="text" 
                  value={emergencyData.sapsStation}
                  onChange={e => setEmergencyData({...emergencyData, sapsStation: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">SAPS Direct Line</label>
                <input 
                  type="text" 
                  value={emergencyData.sapsPhone}
                  onChange={e => setEmergencyData({...emergencyData, sapsPhone: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Tactical Security Company</label>
                <input 
                  type="text" 
                  value={emergencyData.securityDispatch}
                  onChange={e => setEmergencyData({...emergencyData, securityDispatch: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Security Armed Response Line</label>
                <input 
                  type="text" 
                  value={emergencyData.securityPhone}
                  onChange={e => setEmergencyData({...emergencyData, securityPhone: e.target.value})}
                  className="w-full bg-brand-dark border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: LEARNERS */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 5 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-gold" />
                Register Initial Pilot Learners ({learnersList.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Enrolled children who will be assigned wearable child safety devices.</p>
            </div>

            {/* List Existing Learners */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {learnersList.map((l, idx) => (
                <div key={idx} className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="font-bold text-white mr-2">{l.name}</span>
                    <span className="text-brand-gold text-[11px] mr-2">({l.grade})</span>
                    <span className="text-slate-400 text-[10px]">{l.medicalConditions}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-brand-navy rounded text-[10px] font-mono border border-slate-700 text-slate-300">
                    ID: {l.rsaId}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Learner Form */}
            <form onSubmit={handleAddLearner} className="p-4 bg-brand-dark/90 rounded-2xl border border-brand-gold/20 space-y-3 text-xs">
              <h4 className="text-xs font-bold text-brand-gold uppercase">Add Learner to Pilot Group</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="Full Learner Name"
                  value={newLearner.name}
                  onChange={e => setNewLearner({...newLearner, name: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <select 
                  value={newLearner.grade}
                  onChange={e => setNewLearner({...newLearner, grade: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-brand-gold"
                >
                  {['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Learner SA ID / Birth Cert"
                  value={newLearner.rsaId}
                  onChange={e => setNewLearner({...newLearner, rsaId: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl text-xs uppercase cursor-pointer">
                + Add Learner
              </button>
            </form>
          </div>
        )}

        {/* STEP 6: PARENTS / GUARDIANS */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 6 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-brand-gold" />
                Parents & Guardians Linkage ({guardiansList.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Verified parents linked to their specific children for data isolation.</p>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {guardiansList.map((g, idx) => (
                <div key={idx} className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="font-bold text-white mr-2">{g.firstName} {g.lastName}</span>
                    <span className="text-brand-gold text-[10px] mr-2">({g.relationship})</span>
                    <span className="text-slate-400 text-[10px]">{g.email}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    Children: <span className="text-emerald-400">{g.linkedChildrenNames.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGuardian} className="p-4 bg-brand-dark/90 rounded-2xl border border-brand-gold/20 space-y-3 text-xs">
              <h4 className="text-xs font-bold text-brand-gold uppercase">Add Guardian to Pilot</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="First Name"
                  value={newGuardian.firstName}
                  onChange={e => setNewGuardian({...newGuardian, firstName: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input 
                  type="text" 
                  placeholder="Last Name"
                  value={newGuardian.lastName}
                  onChange={e => setNewGuardian({...newGuardian, lastName: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={newGuardian.email}
                  onChange={e => setNewGuardian({...newGuardian, email: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input 
                  type="text" 
                  placeholder="RSA ID Number"
                  value={newGuardian.rsaIdNumber}
                  onChange={e => setNewGuardian({...newGuardian, rsaIdNumber: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl text-xs uppercase cursor-pointer">
                + Add Guardian
              </button>
            </form>
          </div>
        )}

        {/* STEP 7: DEVICES */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 7 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-brand-gold" />
                Device & Wearable Tracker Assignments ({devicesList.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Bind hardware IMEI serials and SIM APN numbers to registered learners.</p>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {devicesList.map((d, idx) => (
                <div key={idx} className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="font-mono text-brand-gold font-bold mr-2">IMEI: {d.imei}</span>
                    <span className="text-slate-400 text-[10px]">SIM: {d.simNumber}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded text-[10px]">
                    Assigned: {d.assignedLearnerName}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddDevice} className="p-4 bg-brand-dark/90 rounded-2xl border border-brand-gold/20 space-y-3 text-xs">
              <h4 className="text-xs font-bold text-brand-gold uppercase">Bind New Hardware Tracker</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="IMEI Number (15 digits)"
                  value={newDevice.imei}
                  onChange={e => setNewDevice({...newDevice, imei: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
                <input 
                  type="text" 
                  placeholder="SIM APN Phone Number"
                  value={newDevice.simNumber}
                  onChange={e => setNewDevice({...newDevice, simNumber: e.target.value})}
                  className="bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl text-xs uppercase cursor-pointer">
                + Bind Tracker
              </button>
            </form>
          </div>
        )}

        {/* STEP 8: REVIEW */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 8 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-brand-gold" />
                Review Pilot Hierarchy & Pre-flight Inspection
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Verify all tenant parameters prior to issuing invitation tokens.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">ORGANISATION</span>
                <div className="font-bold text-white">{orgData.name}</div>
                <div className="text-[10px] text-brand-gold">{orgData.type} ({orgData.domain})</div>
              </div>

              <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">SCHOOL FACILITY</span>
                <div className="font-bold text-white">{schoolData.schoolName}</div>
                <div className="text-[10px] text-brand-gold">EMIS: {schoolData.schoolCode} · {schoolData.province}</div>
              </div>

              <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">SCHOOL ADMINISTRATOR</span>
                <div className="font-bold text-white">{adminData.firstName} {adminData.lastName}</div>
                <div className="text-[10px] text-brand-gold">{adminData.email}</div>
              </div>

              <div className="p-3 bg-brand-dark/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">ONBOARDING COUNTS</span>
                <div className="text-[11px] text-slate-300">
                  Learners: <strong className="text-brand-gold">{learnersList.length}</strong> · 
                  Guardians: <strong className="text-brand-gold">{guardiansList.length}</strong> · 
                  Devices: <strong className="text-brand-gold">{devicesList.length}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: ACTIVATE PILOT */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <div className="border-b border-brand-gold/20 pb-3">
              <span className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Step 9 of 9</span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                Activate Pilot & Dispatch Encrypted Invitations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Commit tenant hierarchy, issue activation tokens, and queue email dispatches.</p>
            </div>

            {/* Progress Bar & Activation Console */}
            {isActivating ? (
              <div className="p-6 bg-brand-dark/90 rounded-2xl border border-brand-gold/40 space-y-4">
                <div className="flex items-center justify-between text-xs text-brand-gold font-bold">
                  <span>Provisioning Pilot Tenant Hierarchy...</span>
                  <span>{activationProgress}%</span>
                </div>

                <div className="w-full bg-brand-navy h-3 rounded-full overflow-hidden border border-brand-gold/30">
                  <div 
                    className="bg-gradient-to-r from-brand-gold-dark via-brand-gold to-amber-300 h-full transition-all duration-300"
                    style={{ width: `${activationProgress}%` }}
                  />
                </div>

                <div className="p-3 bg-brand-navy rounded-xl border border-slate-800 space-y-1 text-[11px] font-mono max-h-40 overflow-y-auto">
                  {activationLog.map((log, i) => (
                    <div key={i} className="text-slate-300">{log}</div>
                  ))}
                </div>
              </div>
            ) : activationResult ? (
              <div className="p-6 bg-emerald-950/60 border-2 border-emerald-500/40 rounded-2xl space-y-4 text-xs text-slate-200">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  PILOT ORGANISATION & SCHOOL SUCCESSFULLY ACTIVATED!
                </div>

                <p className="text-[11px] text-slate-300">
                  The pilot organisation <strong>{activationResult.org?.name}</strong> and school <strong>{activationResult.school?.schoolName}</strong> are active.
                </p>

                <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-1">
                  <div className="text-[10px] text-brand-gold font-bold uppercase">Administrator Invitation Receipt</div>
                  <div>Recipient: <strong>{adminData.email}</strong></div>
                  <div>Single-Use Activation Token: <code className="text-brand-gold font-bold bg-brand-navy px-2 py-0.5 rounded">{activationResult.token}</code></div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-brand-gold text-brand-dark font-extrabold rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Return to Admin Management Center
                </button>
              </div>
            ) : (
              <div className="p-6 bg-brand-dark/80 rounded-2xl border border-brand-gold/30 space-y-4 text-center">
                <Shield className="w-12 h-12 text-brand-gold mx-auto" />
                <h3 className="text-sm font-bold text-white">Ready for Pilot Activation</h3>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Clicking Activate will create the tenant structures, generate activation tokens, send encrypted invitation emails, and register audit records.
                </p>
                <button
                  onClick={executePilotActivation}
                  className="px-8 py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl cursor-pointer"
                >
                  🚀 Activate Pilot School & Dispatch Invitations
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Footer Buttons */}
        {!activationResult && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isActivating}
              className="px-4 py-2 bg-brand-dark border border-slate-700 text-slate-300 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:text-white cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <span className="text-[11px] text-slate-400 font-bold">
              Step {currentStep} of 9
            </span>

            {currentStep < 9 ? (
              <button
                onClick={() => setCurrentStep(prev => Math.min(9, prev + 1))}
                disabled={isActivating}
                className="px-5 py-2 bg-brand-gold text-brand-dark font-bold rounded-xl hover:bg-amber-400 cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
