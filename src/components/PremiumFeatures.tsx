import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Phone, Mail, FileText, QrCode, Clock, Bell, Settings, ArrowUp, ArrowDown, 
  Trash2, Plus, Download, Send, CheckCircle2, AlertTriangle, Play, HelpCircle, Shield,
  CreditCard, Loader2, Sparkles, MapPin, Activity, Calendar, Search, Share2, Printer, Check, User
} from 'lucide-react';
import { Learner, SafeZone, SafetyAlert, SubscriptionPlan, IncidentTicket } from '../types';

interface PremiumFeaturesProps {
  learners: Learner[];
  safeZones: SafeZone[];
  alerts: SafetyAlert[];
  onTriggerSOS: (learner: Learner) => void;
  onAddAlert: (alert: SafetyAlert) => void;
  onAddIncident: (incident: IncidentTicket) => void;
  language: 'en' | 'zu' | 'xh' | 'af' | 'so';
}

// Draggable/sortable emergency contact type
interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  priority: number;
  channels: { sms: boolean; whatsapp: boolean; voice: boolean };
}

// Audit log entry type
interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  category: 'SECURITY' | 'SYSTEM' | 'AUTH' | 'GEOFENCE' | 'BILLING';
  action: string;
  ipAddress: string;
}

export function PremiumFeatures({ 
  learners, 
  safeZones, 
  alerts, 
  onTriggerSOS, 
  onAddAlert,
  onAddIncident,
  language 
}: PremiumFeaturesProps) {
  
  const [activeSubTab, setActiveSubTab] = useState<
    'wizard' | 'gateway' | 'escalation' | 'contacts' | 'idcard' | 'scheduler' | 'risk' | 'billing' | 'audit'
  >('wizard');

  const currentLearner = learners[0] || null;

  // Local state for translations
  const t = {
    en: {
      wizard: "Missing Child Wizard",
      gateway: "Communications Gateway",
      escalation: "Escalation Rules",
      contacts: "Contact Priority",
      idcard: "QR ID Card",
      scheduler: "Weekly Reports",
      risk: "Predictive Risk AI",
      billing: "Tiers & Upgrades",
      audit: "System Audit Logs",
      heading: "ITIS Premium Tactical Safety Engine",
      subheading: "Advanced protocols and response pipelines built to military standards."
    },
    zu: {
      wizard: "I-Wizard Yengane Edukayo",
      gateway: "Isango Lezokuxhumana",
      escalation: "Imithetho Yokukhuphula",
      contacts: "Okubalulekile Koxhumana",
      idcard: "Ikhadi le-QR ID",
      scheduler: "Imibiko Yamasonto onke",
      risk: "Ukuhlaziya Ubungozi be-AI",
      billing: "Amanani Nokuthuthukiswa",
      audit: "Amalogi Wokuhlola we-System",
      heading: "ITIS Premium Tactical Safety Engine (Isizulu)",
      subheading: "Izivumelwano ezithuthukisiwe namaphayiphi okuphendula akhiwe ngokwamazinga wezempi."
    },
    xh: {
      wizard: "I-Wizard Yomntwana Olahlekileyo",
      gateway: "Isango LazoNxibelelwano",
      escalation: "Imigaqo Yokunyusa Alerts",
      contacts: "Ingcaciso Yokubaluleka",
      idcard: "Ikhadi le-QR ID",
      scheduler: "Iingxelo Veeveki zonke",
      risk: "Uhlalutyo Lomngcipheko we-AI",
      billing: "Amanqanaba & Nokuphucula",
      audit: "Iilog ze-Audit ye-Sistim",
      heading: "ITIS Premium Tactical Safety Engine (Isixhosa)",
      subheading: "Izivumelwano eziphambili kunye nemibhobho yokusabela eyakhelwe kumgangatho wempi."
    },
    af: {
      wizard: "Vermiste Kind Assistent",
      gateway: "Kommunikasie-portaal",
      escalation: "Eskalasie Reëls",
      contacts: "Kontak Prioriteit",
      idcard: "QR-Identifikasiekaart",
      scheduler: "Weeklikse Verslae",
      risk: "Voorspellende AI-Risiko",
      billing: "Planne & Opgraderings",
      audit: "Stelsel-ouditlogs",
      heading: "ITIS Premium Taktiese Veiligheidsenjin",
      subheading: "Gevorderde protokolle en reaksie-pyplyne gebou volgens militêre standaarde."
    },
    so: {
      wizard: "Wizard ea Ngoana ea Lahlehileng",
      gateway: "Heke ea Likhokahano",
      escalation: "Melao ea Keketseho",
      contacts: "Tsamaiso ea Boitsebiso",
      idcard: "Karete ea QR ID",
      scheduler: "Litlaleho tsa Beke le Beke",
      risk: "Tlhahlobo ea Likotsi ea AI",
      billing: "Mekhahlelo & Lintlafatso",
      audit: "Litlaleho tsa Tlhahlobo ea Sistimi",
      heading: "ITIS Premium Tactical Safety Engine (Sotho)",
      subheading: "Melao e tsoetseng pele le liphaephe tsa karabelo tse hahiloeng ho latela maemo a sesole."
    }
  }[language] || {
    wizard: "Missing Child Wizard",
    gateway: "Communications Gateway",
    escalation: "Escalation Rules",
    contacts: "Contact Priority",
    idcard: "QR ID Card",
    scheduler: "Weekly Reports",
    risk: "Predictive Risk AI",
    billing: "Tiers & Upgrades",
    audit: "System Audit Logs",
    heading: "ITIS Premium Tactical Safety Engine",
    subheading: "Advanced protocols and response pipelines built to military standards."
  };

  // ==========================================
  // MODULE 1: MISSING CHILD WIZARD & SAPS REPORT
  // ==========================================
  const [wizardStep, setWizardStep] = useState(1);
  const [missingChildName, setMissingChildName] = useState(currentLearner?.name || '');
  const [missingPhysicalDesc, setMissingPhysicalDesc] = useState('Height: 1.45m, slender build, black hair. Wearing Gauteng High uniform: blue blazer, khaki trousers.');
  const [missingLastSeenPlace, setMissingLastSeenPlace] = useState('Sandton Taxi Rank intersection, GP');
  const [missingLastSeenTime, setMissingLastSeenTime] = useState('14:45 Yesterday');
  const [missingAdditionalInfo, setMissingAdditionalInfo] = useState('Left school early to take public transport. Phone went offline at Smit St.');
  const [isWizardSubmitted, setIsWizardSubmitted] = useState(false);
  const [isNccNotified, setIsNccNotified] = useState(false);

  const handleNextStep = () => setWizardStep(prev => Math.min(prev + 1, 3));
  const handlePrevStep = () => setWizardStep(prev => Math.max(prev - 1, 1));
  
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWizardSubmitted(true);
    
    // Auto trigger alert
    const newAlert: SafetyAlert = {
      id: `missing-report-${Date.now()}`,
      type: 'Police Alert',
      severity: 'critical',
      message: `🚨 SAPS RECON DOSSIER GENERATED FOR ${missingChildName.toUpperCase()}. Broadcast pushed to Joint Command Responders near ${missingLastSeenPlace}.`,
      time: new Date().toISOString(),
      resolved: false
    };
    onAddAlert(newAlert);

    // Create Incident ticket
    const newIncident: IncidentTicket = {
      id: `INC-SAPS-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-ZA').slice(0, 5),
      location: missingLastSeenPlace,
      latitude: currentLearner?.latitude || -26.1952,
      longitude: currentLearner?.longitude || 28.0340,
      learnerName: missingChildName,
      schoolName: currentLearner?.school || 'ITIS Shared Network',
      guardianName: currentLearner?.assignedGuardian || 'Registered Guardian',
      assignedOfficer: 'SAPS Joint Search Command Unit 7',
      status: 'Reported',
      category: 'Critical Missing Child Dossier',
      evidenceNotes: [
        `Last seen location: ${missingLastSeenPlace}`,
        `Physical description: ${missingPhysicalDesc}`,
        `Broadcast parameters dispatched to all local responders.`
      ],
      timeline: [
        { time: 'Immediate', description: 'Missing person wizard dossier generated by guardian' },
        { time: '1 min', description: 'ITIS Command Center validated and formatted dossier' }
      ]
    };
    onAddIncident(newIncident);
    setIsNccNotified(true);
    
    addAuditLog('SECURITY', `Missing Child Dossier compiled and broadcast for ${missingChildName}`);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setIsWizardSubmitted(false);
    setIsNccNotified(false);
  };

  // ==========================================
  // MODULE 2: COMMUNICATIONS GATEWAY & BROWSER NOTIFICATIONS
  // ==========================================
  const [hasNotificationPermission, setHasNotificationPermission] = useState('default');
  const [outboundLogs, setOutboundLogs] = useState<Array<{ id: string; time: string; type: 'SMS' | 'WHATSAPP' | 'PUSH'; status: 'DELIVERED' | 'DISPATCHED' | 'FAILED'; text: string; recipient: string }>>([
    { id: 'log-1', time: '13:02:11', type: 'PUSH', status: 'DELIVERED', text: 'Sipho Ndlovu has entered Home (Randburg) safe zone.', recipient: 'Parent Device Applet' },
    { id: 'log-2', time: '11:15:32', type: 'SMS', status: 'DELIVERED', text: '[ITIS Guardian] ALERT: Tracker battery at 15%. Please charge immediately.', recipient: '+27 82 123 4567' },
    { id: 'log-3', time: '07:38:12', type: 'WHATSAPP', status: 'DELIVERED', text: '✅ Gauteng High School Arrival confirmed for learner Sipho Ndlovu at 07:38.', recipient: '+27 83 765 4321' }
  ]);
  const [smsTestNumber, setSmsTestNumber] = useState('+27 82 123 4567');
  const [smsGatewayProvider, setSmsGatewayProvider] = useState<'AfricaTalking' | 'BulkSMS' | 'Simulated'>('AfricaTalking');
  const [isSendingTestSMS, setIsSendingTestSMS] = useState(false);
  const [whatsappSimulationMessage, setWhatsappSimulationMessage] = useState('🚨 [ITIS Emergency] IMMEDIATE ACTION REQUIRED. Sipho Ndlovu has triggered an SOS alert. Click to track live.');

  useEffect(() => {
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasNotificationPermission(permission);
      addAuditLog('SYSTEM', `Browser Push permission requested. User selected: ${permission.toUpperCase()}`);
    } else {
      alert("Browser push notifications are not supported by this device.");
    }
  };

  const triggerTestPushNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification("📢 ITIS Guardian System Sync", {
        body: "Real-time push channel confirmed. Test broadcast completed successfully.",
        icon: "/src/assets/images/itis_logo_1783562386226.jpg",
        tag: "itis-test-alert"
      });
      addLogEntry('PUSH', 'DELIVERED', 'Real-time push channel confirmed. Test broadcast completed successfully.', 'Web Browser Desktop');
    } else {
      // simulated browser visual alert
      const testAlert: SafetyAlert = {
        id: `push-test-${Date.now()}`,
        type: 'School Arrival',
        severity: 'low',
        message: '🔔 [SIMULATED PUSH] Real-time push channel confirmed. Test broadcast completed successfully.',
        time: new Date().toISOString(),
        resolved: true
      };
      onAddAlert(testAlert);
      addLogEntry('PUSH', 'DELIVERED', 'Simulated push fallback successfully displayed on panel.', 'Web View Sandbox');
      alert("Push permissions are not granted. Standard in-app fallback displayed instead.");
    }
  };

  const addLogEntry = (type: 'SMS' | 'WHATSAPP' | 'PUSH', status: 'DELIVERED' | 'DISPATCHED' | 'FAILED', text: string, recipient: string) => {
    setOutboundLogs(prev => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toTimeString().split(' ')[0],
        type,
        status,
        text,
        recipient
      },
      ...prev
    ]);
  };

  const handleSendTestSMS = () => {
    setIsSendingTestSMS(true);
    setTimeout(() => {
      setIsSendingTestSMS(false);
      addLogEntry('SMS', 'DELIVERED', `[ITIS Portal] Test SMS dispatch using ${smsGatewayProvider} gateway API: Sync OK.`, smsTestNumber);
      addAuditLog('SYSTEM', `Outbound test SMS dispatch to ${smsTestNumber} via ${smsGatewayProvider}`);
    }, 1200);
  };

  const handleSendTestWhatsapp = () => {
    addLogEntry('WHATSAPP', 'DELIVERED', whatsappSimulationMessage, '+27 82 123 4567 (Primary Guardian)');
    addAuditLog('SYSTEM', `Outbound WhatsApp broadcast simulation dispatched successfully.`);
  };

  // ==========================================
  // MODULE 3: ALERT ESCALATION RULES
  // ==========================================
  const [escalationPath, setEscalationPath] = useState<Array<{ minutes: number; action: string; target: string; enabled: boolean }>>([
    { minutes: 0, action: 'Trigger Browser Push & In-app Alert', target: 'All Guardians', enabled: true },
    { minutes: 3, action: 'Send Fallback SMS & WhatsApp Alert', target: 'Mother & Father', enabled: true },
    { minutes: 8, action: 'Initiate Automated Smart Voice Call', target: 'Father Mobile', enabled: true },
    { minutes: 15, action: 'Escalate to National Command Centre Dispatch', target: 'SAPS Joint Taskforce Hub', enabled: true }
  ]);
  const [escalationSlider, setEscalationSlider] = useState(5);
  const [activeEscalationRuleId, setActiveEscalationRuleId] = useState<number | null>(null);

  const toggleEscalationRule = (idx: number) => {
    setEscalationPath(prev => prev.map((rule, i) => i === idx ? { ...rule, enabled: !rule.enabled } : rule));
    addAuditLog('SECURITY', `Escalation rule timing parameters modified by authorized parent.`);
  };

  const updateEscalationMinutes = (idx: number, mins: number) => {
    setEscalationPath(prev => prev.map((rule, i) => i === idx ? { ...rule, minutes: mins } : rule));
  };

  // ==========================================
  // MODULE 4: EMERGENCY CONTACT PRIORITIES DRAG/SORT
  // ==========================================
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: 'c1', name: 'Lerato Ndlovu', relation: 'Mother', phone: '+27 82 123 4567', priority: 1, channels: { sms: true, whatsapp: true, voice: true } },
    { id: 'c2', name: 'Thabo Ndlovu', relation: 'Father', phone: '+27 83 765 4321', priority: 2, channels: { sms: true, whatsapp: true, voice: false } },
    { id: 'c3', name: 'Aunt Sibongile', relation: 'Aunt / Alternate', phone: '+27 71 888 9911', priority: 3, channels: { sms: true, whatsapp: false, voice: false } },
    { id: 'c4', name: 'SAPS National Command', relation: 'Emergency Desk', phone: '10111', priority: 4, channels: { sms: false, whatsapp: false, voice: true } }
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Guardian');
  const [newContactPhone, setNewContactPhone] = useState('');

  const moveContact = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= emergencyContacts.length) return;

    const list = [...emergencyContacts];
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;

    // re-assign priorities
    const updated = list.map((item, idx) => ({ ...item, priority: idx + 1 }));
    setEmergencyContacts(updated);
    addAuditLog('SECURITY', `Emergency call routing sequence prioritized.`);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newContact: EmergencyContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      relation: newContactRelation,
      phone: newContactPhone,
      priority: emergencyContacts.length + 1,
      channels: { sms: true, whatsapp: true, voice: false }
    };

    setEmergencyContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    addAuditLog('SECURITY', `Added emergency routing contact: ${newContactName}`);
  };

  const handleDeleteContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id).map((c, idx) => ({ ...c, priority: idx + 1 })));
    addAuditLog('SECURITY', `Emergency contact deleted from call-sequence rules.`);
  };

  const toggleContactChannel = (id: string, channel: 'sms' | 'whatsapp' | 'voice') => {
    setEmergencyContacts(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          channels: { ...c.channels, [channel]: !c.channels[channel] }
        };
      }
      return c;
    }));
  };

  // ==========================================
  // MODULE 5: QR ID CARD GENERATOR & REAL PRINTING
  // ==========================================
  const [qrColorTheme, setQrColorTheme] = useState<'gold' | 'navy' | 'stealth'>('gold');
  const [downloadingCard, setDownloadingCard] = useState(false);

  const handlePrintCard = () => {
    if (!currentLearner) {
      alert("No child record active to print ID card.");
      return;
    }
    
    setDownloadingCard(true);
    
    // Create an elegant printable layout in a hidden iframe to bypass parent sandboxing issues
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (!doc) {
      setDownloadingCard(false);
      return;
    }

    const bypassUrl = `${window.location.origin}?bypass=true&learnerId=${currentLearner.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(bypassUrl)}`;

    // Build theme values
    let gradientStart = '#0b1528';
    let gradientEnd = '#030712';
    let borderStyle = '1px solid #d97706';
    if (qrColorTheme === 'navy') {
      gradientStart = '#1e1b4b';
      gradientEnd = '#0f172a';
      borderStyle = '1px solid #3b82f6';
    } else if (qrColorTheme === 'stealth') {
      gradientStart = '#0f172a';
      gradientEnd = '#020617';
      borderStyle = '1px solid #475569';
    }

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ITIS ID Card - ${currentLearner.name}</title>
          <style>
            @page {
              size: 85.6mm 54mm; /* Standard card size */
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background: #020617;
              color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .card {
              width: 85.6mm;
              height: 54mm;
              box-sizing: border-box;
              border: ${borderStyle};
              border-radius: 8px;
              padding: 10px;
              background: linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              position: relative;
              overflow: hidden;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 3px;
              margin-bottom: 3px;
            }
            .header-title {
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .header-subtitle {
              font-size: 5px;
              color: #94a3b8;
            }
            .blood-badge {
              font-size: 6px;
              background: #450a0a;
              color: #fca5a5;
              padding: 1px 3px;
              border-radius: 3px;
              font-weight: bold;
              border: 1px solid rgba(239, 68, 68, 0.2);
            }
            .middle {
              display: flex;
              gap: 8px;
              align-items: center;
              flex: 1;
            }
            .photo {
              width: 44px;
              height: 44px;
              border-radius: 4px;
              border: 1px solid rgba(255, 255, 255, 0.15);
              object-fit: cover;
            }
            .info {
              flex: 1;
              min-width: 0;
              font-size: 7px;
              line-height: 1.1;
            }
            .name {
              font-size: 9px;
              font-weight: bold;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .school {
              color: #cbd5e1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-size: 7px;
            }
            .serial {
              font-size: 5px;
              color: #94a3b8;
              font-family: monospace;
            }
            .medical {
              font-size: 6px;
              color: #f87171;
              font-weight: bold;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .qr-container {
              width: 44px;
              height: 44px;
              background: #ffffff;
              padding: 2px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
            }
            .qr-img {
              width: 40px;
              height: 40px;
            }
            .footer {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding-top: 3px;
              display: flex;
              justify-content: space-between;
              font-size: 5.5px;
              color: #94a3b8;
              font-family: monospace;
              line-height: 1.1;
            }
            .footer-strong {
              color: #ffffff;
              font-weight: bold;
            }
            .footer-gold {
              color: #f59e0b;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <div class="header-title">ITIS Guardian Profile</div>
                <div class="header-subtitle">SOUTH AFRICA EMERGENCY LINK</div>
              </div>
              <div class="blood-badge">BLOOD: ${currentLearner.bloodGroup}</div>
            </div>
            <div class="middle">
              <img class="photo" src="${currentLearner.photoUrl}" />
              <div class="info">
                <div class="name">${currentLearner.name}</div>
                <div class="school">${currentLearner.school}</div>
                <div class="serial">SERIAL: ${currentLearner.trackerImei.slice(0, 7)}</div>
                <div class="medical">${currentLearner.medicalConditions}</div>
              </div>
              <div class="qr-container">
                <img class="qr-img" src="${qrUrl}" />
              </div>
            </div>
            <div class="footer">
              <div>
                <span>EMERGENCY CONTACTS:</span><br/>
                <span class="footer-strong">Mother: +27 82 123 4567</span>
              </div>
              <div style="text-align: right;">
                <span>HOTLINE DISPATCH:</span><br/>
                <span class="footer-gold">SAPS Desk: 10111</span>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.frameElement.parentNode.removeChild(window.frameElement);
                }, 1000);
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(printHtml);
    doc.close();

    setTimeout(() => {
      setDownloadingCard(false);
      addAuditLog('SECURITY', `Child biometric QR safety card printed successfully.`);
    }, 1500);
  };

  // ==========================================
  // MODULE 6: WEEKLY REPORTS SCHEDULER
  // ==========================================
  const [reportEmail, setReportEmail] = useState('parent.ndlovu@itismail.co.za');
  const [reportDay, setReportDay] = useState<'Monday' | 'Friday' | 'Sunday'>('Monday');
  const [reportIncludedMetrics, setReportIncludedMetrics] = useState({
    gpsBreadcrumbs: true,
    attendance: true,
    heartRate: true,
    speedAlerts: true
  });
  const [isSchedulerSaved, setIsSchedulerSaved] = useState(false);

  const handleSaveScheduler = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSchedulerSaved(true);
    setTimeout(() => setIsSchedulerSaved(false), 3000);
    addAuditLog('SYSTEM', `Weekly report delivery parameters configured for ${reportEmail} every ${reportDay}`);
  };

  // ==========================================
  // MODULE 7: PREDICTIVE RISK AI & NEIGHBOURHOOD DIGEST
  // ==========================================
  const [riskMetrics, setRiskMetrics] = useState({
    overallSafetyIndex: 94,
    routeDeviationScore: 97, // % normal
    speedAnomalies: 0,
    safeZoneCurfewMatch: 98, // % punctual
    dwelAnomaliesCount: 0,
    riskZoneEncounterIndex: 'Low Risk'
  });

  const [neighborhoodIncidents, setNeighborhoodIncidents] = useState<Array<{ id: string; location: string; category: string; severity: 'low' | 'medium' | 'high'; distance: string; timeAgo: string }>>([
    { id: 'nh-1', location: 'Smit St Taxi Intersection', category: 'Pedestrian Congestion', severity: 'low', distance: '1.2 km', timeAgo: '2 hours ago' },
    { id: 'nh-2', location: 'Beyers Naude Dr Route', category: 'Heavy Traffic Congestion', severity: 'medium', distance: '3.4 km', timeAgo: '4 hours ago' },
    { id: 'nh-3', location: 'Hillbrow Ridge Crossing', category: 'Authorized SAPS Active Incident', severity: 'high', distance: '0.9 km', timeAgo: '12 hours ago' }
  ]);

  const [aiAnalysisParagraph, setAiAnalysisParagraph] = useState(
    "Sipho Ndlovu shows an exceptionally stable transit envelope. Over the past 14 days, the tracker recorded 0 route anomalies and 98.2% curfew punctuality. Travel velocity is consistent with school bus timelines. No high-risk deviations detected."
  );

  // ==========================================
  // MODULE 8: TIERS & BILLING UPGRADE
  // ==========================================
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [billingPlanSelected, setBillingPlanSelected] = useState('sub-premium');
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [isProcessingBilling, setIsProcessingBilling] = useState(false);

  const handleCheckoutSimulator = () => {
    setIsProcessingBilling(true);
    setTimeout(() => {
      setIsProcessingBilling(false);
      setIsUpgraded(true);
      addAuditLog('BILLING', `Secure checkout pipeline success: Upgraded to ITIS Guardian Pro`);
    }, 2000);
  };

  // ==========================================
  // MODULE 9: AUDIT LOGS
  // ==========================================
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    { id: 'aud-1', timestamp: '2026-07-13 22:15:30', operator: 'Thabo Ndlovu (Parent)', category: 'AUTH', action: 'Biometric authorization success: Login completed', ipAddress: '197.185.22.41 (Vodacom GP)' },
    { id: 'aud-2', timestamp: '2026-07-13 22:18:12', operator: 'Thabo Ndlovu (Parent)', category: 'GEOFENCE', action: 'Custom safe geofence Home (Randburg) configured radius=150m', ipAddress: '197.185.22.41 (Vodacom GP)' },
    { id: 'aud-3', timestamp: '2026-07-13 22:24:05', operator: 'ITIS Automated Guard', category: 'SECURITY', action: 'Diagnostic battery ping returned optimal status (82%)', ipAddress: '10.230.14.9' },
    { id: 'aud-4', timestamp: '2026-07-13 22:30:11', operator: 'Thabo Ndlovu (Parent)', category: 'SYSTEM', action: 'Push notification credentials validated successfully', ipAddress: '197.185.22.41' }
  ]);

  const addAuditLog = (category: AuditLogEntry['category'], action: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: 'Thabo Ndlovu (Parent)',
      category,
      action,
      ipAddress: '197.185.22.41 (Vodacom SA)'
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const [auditSearch, setAuditSearch] = useState('');

  const exportAuditCSV = () => {
    const headers = "ID,Timestamp,Operator,Category,Action,IP_Address\n";
    const rows = auditLogs.map(log => `"${log.id}","${log.timestamp}","${log.operator}","${log.category}","${log.action}","${log.ipAddress}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ITIS-Guardian-Audit-Logs-${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6" id="itis-premium-panel">
      
      {/* Dynamic Translated Header */}
      <div className="p-5 bg-gradient-to-r from-brand-navy to-brand-navy-light rounded-2xl border border-brand-gold/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1">
          <h2 className="text-md font-bold font-sans tracking-wide text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
            {t.heading}
            <span className="text-[8px] bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30 font-mono uppercase tracking-widest">TACTICAL SHIELD</span>
          </h2>
          <p className="text-xs text-brand-silver">
            {t.subheading}
          </p>
        </div>

        <div className="flex bg-brand-dark border border-brand-gold/20 p-0.5 rounded-lg text-[10px] font-mono shrink-0">
          <span className="px-2 py-1 text-brand-gold">POPIA: ENABLED</span>
          <span className="px-2 py-1 bg-brand-gold/10 border-l border-brand-gold/20 text-white font-bold">MIL-SPEC SECURITY</span>
        </div>
      </div>

      {/* Premium Horizontal Navigation */}
      <div className="flex bg-brand-navy border border-brand-gold/10 p-1 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
        <button
          onClick={() => setActiveSubTab('wizard')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'wizard' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.wizard}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('gateway')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'gateway' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{t.gateway}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('escalation')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'escalation' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.escalation}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('contacts')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'contacts' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{t.contacts}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('idcard')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'idcard' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{t.idcard}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('scheduler')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'scheduler' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.scheduler}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('risk')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'risk' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t.risk}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('billing')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'billing' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{t.billing}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${activeSubTab === 'audit' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white hover:bg-brand-navy-light'}`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{t.audit}</span>
        </button>
      </div>

      {/* Dynamic Content Views */}
      <div className="bg-brand-navy/30 border border-brand-gold/10 p-5 rounded-2xl shadow-xl min-h-[350px]">
        
        {/* ==================== SUBTAB: WIZARD ==================== */}
        {activeSubTab === 'wizard' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> SAPS-Ready Missing Child Dossier Compiler
                </h3>
                <p className="text-[10px] text-slate-400">Structured legal document and telemetry package assembled instantly during critical delays.</p>
              </div>
              <button 
                onClick={resetWizard}
                className="px-2 py-1 bg-brand-navy text-[9px] text-brand-gold hover:text-white font-mono border border-brand-gold/20 rounded cursor-pointer"
              >
                Reset Wizard
              </button>
            </div>

            {!isWizardSubmitted ? (
              <form onSubmit={handleWizardSubmit} className="space-y-4 text-xs font-sans">
                {/* Step indicator */}
                <div className="flex justify-between items-center bg-brand-dark p-2 rounded border border-slate-800 text-[10px] font-mono">
                  <span>STEP {wizardStep} OF 3</span>
                  <div className="flex gap-1">
                    <span className={`w-3 h-1 rounded ${wizardStep >= 1 ? 'bg-brand-gold' : 'bg-slate-700'}`} />
                    <span className={`w-3 h-1 rounded ${wizardStep >= 2 ? 'bg-brand-gold' : 'bg-slate-700'}`} />
                    <span className={`w-3 h-1 rounded ${wizardStep >= 3 ? 'bg-brand-gold' : 'bg-slate-700'}`} />
                  </div>
                </div>

                {wizardStep === 1 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">1. Personal & Biometric Information</h4>
                    <div>
                      <label className="block text-slate-400 mb-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        required
                        value={missingChildName} 
                        onChange={(e) => setMissingChildName(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/20 px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Authorized School</label>
                      <input 
                        type="text" 
                        disabled
                        value={currentLearner?.school || 'Gauteng High School'} 
                        className="w-full bg-brand-navy-light/40 border border-slate-850 px-3 py-2 rounded text-slate-300 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Blood Type</label>
                        <input 
                          type="text" 
                          disabled
                          value={currentLearner?.bloodGroup || 'O-Positive'} 
                          className="w-full bg-brand-navy-light/40 border border-slate-850 px-3 py-2 rounded text-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Medical Conditions</label>
                        <input 
                          type="text" 
                          disabled
                          value={currentLearner?.medicalConditions || 'Asthma (Inhaler in backpack)'} 
                          className="w-full bg-brand-navy-light/40 border border-slate-850 px-3 py-2 rounded text-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">2. Last Seen & Routing Context</h4>
                    <div>
                      <label className="block text-slate-400 mb-1">Last Known Geographic Area</label>
                      <input 
                        type="text" 
                        required
                        value={missingLastSeenPlace} 
                        onChange={(e) => setMissingLastSeenPlace(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/20 px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Last Contact Timestamp</label>
                        <input 
                          type="text" 
                          required
                          value={missingLastSeenTime} 
                          onChange={(e) => setMissingLastSeenTime(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-gold/20 px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Assigned Tracker Serial</label>
                        <input 
                          type="text" 
                          disabled
                          value={currentLearner?.trackerSerial || 'ITIS-TRK-99081'} 
                          className="w-full bg-brand-navy-light/40 border border-slate-850 px-3 py-2 rounded text-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">3. Physical Markers & Wardrobe</h4>
                    <div>
                      <label className="block text-slate-400 mb-1">Wardrobe & Distinguishing Physical Characteristics</label>
                      <textarea 
                        rows={3}
                        required
                        value={missingPhysicalDesc} 
                        onChange={(e) => setMissingPhysicalDesc(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/20 px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white text-xs font-sans leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Additional Information (Transportation details, companions etc)</label>
                      <textarea 
                        rows={2}
                        value={missingAdditionalInfo} 
                        onChange={(e) => setMissingAdditionalInfo(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/20 px-3 py-2 rounded focus:border-brand-gold focus:outline-none text-white text-xs font-sans leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                  {wizardStep > 1 ? (
                    <button 
                      type="button" 
                      onClick={handlePrevStep}
                      className="px-3.5 py-2 bg-brand-navy hover:bg-slate-800 text-white font-mono rounded cursor-pointer"
                    >
                      Back
                    </button>
                  ) : <div />}

                  {wizardStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={handleNextStep}
                      className="px-3.5 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-bold font-mono rounded cursor-pointer"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold font-mono rounded uppercase tracking-wider animate-pulse cursor-pointer shadow-lg glow-red"
                    >
                      🚨 BROADCAST TO EMERGENCY DESK
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="space-y-4 p-4 bg-brand-dark rounded-xl border border-red-500/30 text-xs">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
                  <div className="w-10 h-10 bg-red-600/10 border border-red-500 rounded-full flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
                  </div>
                  <div>
                    <strong className="text-white text-sm uppercase block tracking-wider font-mono">Dossier Dispatched to SAPS Joint Search Desk</strong>
                    <span className="text-[10px] text-slate-400">Case registered successfully under POPIA Safety Emergency protocols.</span>
                  </div>
                </div>

                <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/15 space-y-2 text-slate-300 font-mono leading-relaxed text-[11px]">
                  <h5 className="text-white font-bold border-b border-slate-800 pb-1 text-brand-gold">SAPS DOSSIER SUMMARY: REPORTED STATE</h5>
                  <div><strong>Full Name:</strong> {missingChildName}</div>
                  <div><strong>Assigned Tracker:</strong> {currentLearner?.trackerSerial} (IMEI: {currentLearner?.trackerImei})</div>
                  <div><strong>Physical Description:</strong> {missingPhysicalDesc}</div>
                  <div><strong>Last Seen location:</strong> {missingLastSeenPlace}</div>
                  <div><strong>Last Communication Time:</strong> {missingLastSeenTime}</div>
                  <div><strong>Dossier Metadata status:</strong> Broadcast live to Joint Patrol units within 5km radius.</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                  <button
                    onClick={() => {
                      alert("Generating SAPS Joint-Search Form PDF... Saved to device download folder.");
                    }}
                    className="flex-1 py-2 bg-brand-navy hover:bg-brand-navy-light text-brand-gold border border-brand-gold/30 rounded-lg font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Dossier PDF
                  </button>
                  <button
                    onClick={resetWizard}
                    className="flex-1 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-bold font-mono rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Acknowledge Case
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SUBTAB: GATEWAY ==================== */}
        {activeSubTab === 'gateway' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-brand-gold" /> Africa's Talking & WhatsApp API Gateway Diagnostics
                </h3>
                <p className="text-[10px] text-slate-400">Configure outbound channels and test delivery webhooks instantly.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">GATEWAYS ONLINE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* SMS Config & Test */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">SMS Gateway Portal (Africa's Talking API)</h4>
                
                <div>
                  <label className="block text-slate-400 mb-1">API Provider</label>
                  <select 
                    value={smsGatewayProvider} 
                    onChange={(e: any) => setSmsGatewayProvider(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-gold/25 px-2.5 py-1.5 rounded text-white font-mono text-xs focus:outline-none focus:border-brand-gold"
                  >
                    <option value="AfricaTalking">Africa's Talking (Johannesburg server)</option>
                    <option value="BulkSMS">BulkSMS South Africa</option>
                    <option value="Simulated">ITIS Offline-Secure Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Parent Test Recipient</label>
                  <input 
                    type="text" 
                    value={smsTestNumber}
                    onChange={(e) => setSmsTestNumber(e.target.value)}
                    placeholder="+27 Mobile number"
                    className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-xs font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSendTestSMS}
                    disabled={isSendingTestSMS}
                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                  >
                    {isSendingTestSMS ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending payload via Africa's Talking...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Test Alert SMS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* WhatsApp Config & Test */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">WhatsApp Business API Webhook Simulation</h4>
                
                <div>
                  <label className="block text-slate-400 mb-1">WhatsApp Broadcast Template</label>
                  <textarea 
                    rows={2}
                    value={whatsappSimulationMessage}
                    onChange={(e) => setWhatsappSimulationMessage(e.target.value)}
                    className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-[11px] font-sans leading-normal"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleSendTestWhatsapp}
                    className="flex-1 py-2 bg-brand-navy hover:bg-brand-navy-light text-brand-gold border border-brand-gold/30 rounded font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Send WhatsApp Alert
                  </button>
                </div>

                <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded text-[10px] text-emerald-300 font-mono">
                  ✨ <strong>WhatsApp Sandbox Status:</strong> Synchronized. Active callbacks will ping instantly to linked mobile nodes.
                </div>
              </div>
            </div>

            {/* Notification API control & permissions */}
            <div className="p-4 bg-brand-dark/40 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-brand-gold" /> Native Browser Push Notifications (OS-level alerts)
              </h4>
              <p className="text-slate-300">
                Push notifications allow the ITIS Guardian platform to trigger instant desktop and mobile banners when an SOS fires, even if the browser tab is backgrounded.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-navy p-3 rounded-xl">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono">Notification Status</span>
                  <strong className="text-white font-mono uppercase">
                    {hasNotificationPermission === 'granted' ? '✅ PERMISSION GRANTED' : hasNotificationPermission === 'denied' ? '❌ BLOCKED' : '⏳ AWAITING AUTHORIZATION'}
                  </strong>
                </div>

                <div className="flex gap-2">
                  {hasNotificationPermission !== 'granted' && (
                    <button
                      onClick={requestNotificationPermission}
                      className="px-3 py-1.5 bg-brand-gold text-brand-dark font-bold font-mono rounded text-[11px] uppercase cursor-pointer hover:bg-brand-gold-dark"
                    >
                      Authorize Push API
                    </button>
                  )}
                  <button
                    onClick={triggerTestPushNotification}
                    className="px-3 py-1.5 bg-brand-navy-light hover:bg-slate-800 text-brand-gold border border-brand-gold/20 font-bold font-mono rounded text-[11px] uppercase cursor-pointer"
                  >
                    Test Push Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Active Logs */}
            <div className="space-y-2">
              <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider">Outbound Delivery Audit logs</h4>
              <div className="bg-brand-dark/90 border border-slate-800 rounded-xl divide-y divide-slate-850 max-h-[140px] overflow-y-auto font-mono text-[10px]">
                {outboundLogs.map((log) => (
                  <div key={log.id} className="p-2.5 flex items-start justify-between gap-3 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{log.time}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${log.type === 'SMS' ? 'bg-amber-950 text-amber-300 border border-amber-500/20' : log.type === 'WHATSAPP' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-sky-950 text-sky-400 border border-sky-500/20'}`}>
                        {log.type}
                      </span>
                      <span className="text-slate-400 truncate max-w-[200px]">{log.recipient}:</span>
                      <span className="text-white truncate max-w-[280px]">{log.text}</span>
                    </div>

                    <span className="text-emerald-400 font-bold font-mono text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: ESCALATION ==================== */}
        {activeSubTab === 'escalation' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-gold" /> Automated Alert Escalation Pipelines
              </h3>
              <p className="text-[10px] text-slate-400">Establish automated safety protocols to escalate unacknowledged high-severity critical alerts systematically.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* Settings list */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Configure Escalation Sequence</h4>
                
                <div className="space-y-2.5">
                  {escalationPath.map((rule, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border transition-all ${rule.enabled ? 'bg-brand-dark/90 border-brand-gold/20' : 'bg-brand-dark/20 border-slate-850 opacity-55'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={rule.enabled} 
                            onChange={() => toggleEscalationRule(idx)}
                            className="w-4 h-4 accent-brand-gold rounded cursor-pointer"
                          />
                          <span className="font-mono text-brand-gold font-bold">LEVEL {idx + 1}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">Delay:</span>
                          <input 
                            type="number" 
                            disabled={idx === 0}
                            value={rule.minutes}
                            onChange={(e) => updateEscalationMinutes(idx, Number(e.target.value))}
                            className="w-12 bg-brand-navy border border-slate-800 text-center text-white px-1.5 py-0.5 rounded font-mono focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 font-mono">mins</span>
                        </div>
                      </div>

                      <div className="mt-2 text-slate-300 grid grid-cols-2 gap-2 text-[11px]">
                        <div>Action: <strong className="text-white">{rule.action}</strong></div>
                        <div>Target Segment: <strong className="text-white">{rule.target}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation panel */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-4">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Active Escalation Simulator</h4>
                <p className="text-slate-400 text-[11px]">Trigger a simulated critical alert to watch how the escalation timer runs, dispatching fallback channels as delays exceed limits.</p>

                <div className="space-y-3.5 bg-brand-navy p-3.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-white font-mono text-[10px] uppercase tracking-widest text-slate-400">UNACKNOWLEDGED TIMER</div>
                  <strong className="text-3xl font-mono text-red-500 block animate-pulse">00:{escalationSlider < 10 ? `0${escalationSlider}` : escalationSlider}</strong>
                  <div className="text-[10px] text-slate-300">Curfew delay threshold reached for Zama Dlamini.</div>

                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    value={escalationSlider}
                    onChange={(e) => setEscalationSlider(Number(e.target.value))}
                    className="w-full accent-red-500 bg-slate-800 h-1 rounded cursor-pointer mt-2"
                  />

                  <div className="text-[9px] text-slate-500 font-mono flex justify-between">
                    <span>0 mins</span>
                    <span>10 mins</span>
                    <span>20 mins (SAPS)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-brand-dark rounded border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
                  <span className="text-brand-gold font-bold block uppercase tracking-wider text-[8px]">SIMULATOR LOG</span>
                  <div>• [0 mins]: Push notification sent to Mother.</div>
                  {escalationSlider >= 3 && <div className="text-amber-300">• [3 mins]: Mother unacknowledged. SMS & WhatsApp fallback sent.</div>}
                  {escalationSlider >= 8 && <div className="text-amber-500">• [8 mins]: Automated voice synthesizer call triggered to Father mobile.</div>}
                  {escalationSlider >= 15 && <div className="text-red-400 font-bold animate-pulse">• [15 mins]: Immediate Joint SAPS Despatch ticket spawned in NCC desk!</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: CONTACTS ==================== */}
        {activeSubTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-brand-gold animate-pulse" /> Draggable Call Sequence & Emergency Contacts
                </h3>
                <p className="text-[10px] text-slate-400">Prioritize emergency contact profiles. In an SOS event, ITIS calling servers ring contacts strictly in this sequence.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              
              {/* Form to add */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3 h-fit">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Add Emergency Profile</h4>
                
                <form onSubmit={handleAddContact} className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={newContactName} 
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="e.g. Grandma Ndlovu"
                      className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Relation / Role</label>
                    <input 
                      type="text" 
                      required
                      value={newContactRelation} 
                      onChange={(e) => setNewContactRelation(e.target.value)}
                      placeholder="e.g. Aunt / Primary Neighbor"
                      className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Mobile Contact Phone (+27)</label>
                    <input 
                      type="text" 
                      required
                      value={newContactPhone} 
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="+27 82 111 2222"
                      className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-xs font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded text-xs uppercase cursor-pointer"
                  >
                    Add to Call list
                  </button>
                </form>
              </div>

              {/* Priorities list */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Emergency Contact Order of Precedence</h4>
                
                <div className="space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <div 
                      key={contact.id} 
                      className="p-3 bg-brand-navy-light/30 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition-all hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-1.5 p-1 bg-brand-dark/80 rounded border border-slate-800 text-[10px]">
                          <button 
                            onClick={() => moveContact(index, 'up')}
                            disabled={index === 0}
                            className="text-slate-400 hover:text-brand-gold disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-brand-gold">{contact.priority}</span>
                          <button 
                            onClick={() => moveContact(index, 'down')}
                            disabled={index === emergencyContacts.length - 1}
                            className="text-slate-400 hover:text-brand-gold disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div>
                          <strong className="text-white block font-sans">{contact.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{contact.relation} · {contact.phone}</span>
                        </div>
                      </div>

                      {/* Communications checkboxes */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] font-mono">
                          <label className="flex items-center gap-1 text-slate-400">
                            <input 
                              type="checkbox" 
                              checked={contact.channels.sms} 
                              onChange={() => toggleContactChannel(contact.id, 'sms')}
                              className="accent-brand-gold"
                            />
                            <span>SMS</span>
                          </label>
                          <label className="flex items-center gap-1 text-slate-400">
                            <input 
                              type="checkbox" 
                              checked={contact.channels.whatsapp} 
                              onChange={() => toggleContactChannel(contact.id, 'whatsapp')}
                              className="accent-brand-gold"
                            />
                            <span>WA</span>
                          </label>
                          <label className="flex items-center gap-1 text-slate-400">
                            <input 
                              type="checkbox" 
                              checked={contact.channels.voice} 
                              onChange={() => toggleContactChannel(contact.id, 'voice')}
                              className="accent-brand-gold"
                            />
                            <span>VOICE</span>
                          </label>
                        </div>

                        {contact.id !== 'c4' && (
                          <button 
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-1.5 bg-red-950/20 border border-red-500/10 hover:border-red-500 text-red-400 rounded transition-colors cursor-pointer"
                            title="Delete contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: IDCARD ==================== */}
        {activeSubTab === 'idcard' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-brand-gold" /> Printable Physical QR Child ID Card Generator
                </h3>
                <p className="text-[10px] text-slate-400">Generate a wallet-sized security card containing offline credentials, emergency contacts, and encrypted profile link.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Theme Settings */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3 h-fit">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Aesthetic Theme configuration</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Color Theme Preset</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setQrColorTheme('gold')}
                        className={`py-2 px-3 rounded font-mono font-bold text-[10px] uppercase border transition-all ${qrColorTheme === 'gold' ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-lg glow-gold' : 'bg-brand-navy border-slate-800 text-slate-300'}`}
                      >
                        🥇 Gold Accent
                      </button>
                      <button 
                        onClick={() => setQrColorTheme('navy')}
                        className={`py-2 px-3 rounded font-mono font-bold text-[10px] uppercase border transition-all ${qrColorTheme === 'navy' ? 'bg-brand-navy-light text-white border-brand-gold/30 shadow-lg' : 'bg-brand-navy border-slate-800 text-slate-300'}`}
                      >
                        ⚓ Royal Navy
                      </button>
                      <button 
                        onClick={() => setQrColorTheme('stealth')}
                        className={`py-2 px-3 rounded font-mono font-bold text-[10px] uppercase border transition-all ${qrColorTheme === 'stealth' ? 'bg-slate-900 text-slate-200 border-slate-600 shadow-md' : 'bg-brand-navy border-slate-800 text-slate-300'}`}
                      >
                        🥷 Stealth Grey
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-slate-400">Card Properties</span>
                    <div className="bg-brand-navy p-2.5 rounded border border-slate-800 text-[10px] text-slate-300 space-y-1">
                      <div>• Scannable QR: Linked to secure POPIA telemetry bypass.</div>
                      <div>• High Contrast design: Optimal for emergency responders.</div>
                      <div>• Includes critical blood type and respiratory tags.</div>
                    </div>
                  </div>

                  <button
                    onClick={handlePrintCard}
                    disabled={downloadingCard}
                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
                  >
                    {downloadingCard ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Compiling vector assets...</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print / Download QR ID Card</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW DESIGN */}
              <div className="flex justify-center items-center">
                <div 
                  className={`w-full max-w-[340px] h-[210px] rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative border overflow-hidden ${
                    qrColorTheme === 'gold' 
                      ? 'bg-gradient-to-br from-brand-navy-light to-brand-dark border-brand-gold/40 glow-gold' 
                      : qrColorTheme === 'navy'
                      ? 'bg-gradient-to-br from-indigo-950 to-brand-navy border-brand-gold/20'
                      : 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-750'
                  }`}
                  id="printable-qr-child-id-card"
                >
                  {/* Decorative background logo underlay */}
                  <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />

                  {/* Top row badge */}
                  <div className="flex items-center justify-between border-b border-brand-gold/15 pb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-brand-gold/20 border border-brand-gold rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-brand-gold">🛡️</span>
                      </div>
                      <div>
                        <h4 className="text-[9px] font-bold font-sans tracking-wide text-white uppercase">ITIS Guardian Profile</h4>
                        <span className="text-[6px] text-slate-400 block font-mono">SOUTH AFRICA EMERGENCY LINK</span>
                      </div>
                    </div>
                    <span className="text-[7px] font-mono bg-red-950 text-red-300 px-1 py-0.5 rounded border border-red-500/20 font-bold">BLOOD: {currentLearner?.bloodGroup || 'O+'}</span>
                  </div>

                  {/* Middle row child info */}
                  <div className="flex gap-3 my-2 items-center">
                    <img 
                      src={currentLearner?.photoUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face"} 
                      alt="Child photo" 
                      className="w-14 h-14 object-cover border border-brand-gold/30 rounded-lg shadow"
                    />

                    <div className="flex-1 space-y-0.5 min-w-0 text-[10px]">
                      <strong className="text-white text-[11px] block truncate font-sans">{currentLearner?.name || 'Sipho Ndlovu'}</strong>
                      <div className="text-slate-300 truncate">{currentLearner?.school || 'Gauteng High School'}</div>
                      <div className="text-slate-400 text-[8px] font-mono">SERIAL: {currentLearner?.trackerImei?.slice(0, 7) || 'ITIS-TRK'}</div>
                      <div className="text-red-400 font-medium text-[8px] truncate">{currentLearner?.medicalConditions || 'No critical allergies logged'}</div>
                    </div>

                    {/* Sim QR code */}
                    <div className="w-14 h-14 bg-white p-1 rounded-lg border border-brand-gold flex items-center justify-center shrink-0 overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          currentLearner 
                            ? `${window.location.origin}?bypass=true&learnerId=${currentLearner.id}` 
                            : `${window.location.origin}?bypass=true&learnerId=l1`
                        )}`}
                        alt="Live scannable QR" 
                        className="w-12 h-12 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Bottom contacts row */}
                  <div className="border-t border-brand-gold/15 pt-2 flex justify-between items-center text-[8px] font-mono text-slate-400">
                    <div>
                      <span className="block text-[6px]">EMERGENCY CONTACTS:</span>
                      <span className="text-white">Mother: +27 82 123 4567</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[6px]">HOTLINE DISPATCH:</span>
                      <strong className="text-brand-gold font-bold">SAPS Desk: 10111</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: SCHEDULER ==================== */}
        {activeSubTab === 'scheduler' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-gold" /> Scheduled Weekly Safety Auto-Reports
                </h3>
                <p className="text-[10px] text-slate-400">Configure delivery rules to receive complete, detailed PDF safety history summaries automatically in your inbox.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
              
              {/* Form to configure */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Delivery Settings</h4>
                
                <form onSubmit={handleSaveScheduler} className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Guardian Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={reportEmail} 
                      onChange={(e) => setReportEmail(e.target.value)}
                      className="w-full bg-brand-navy border border-brand-gold/20 px-3 py-1.5 rounded focus:border-brand-gold focus:outline-none text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Dispatch Day</label>
                      <select 
                        value={reportDay} 
                        onChange={(e: any) => setReportDay(e.target.value)}
                        className="w-full bg-brand-navy border border-brand-gold/20 px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-brand-gold"
                      >
                        <option value="Monday">Every Monday morning</option>
                        <option value="Friday">Every Friday afternoon</option>
                        <option value="Sunday">Every Sunday evening</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Next Delivery Date</label>
                      <input 
                        type="text" 
                        disabled
                        value="Monday, 20 July (08:00)" 
                        className="w-full bg-brand-navy-light/40 border border-slate-850 px-3 py-1.5 rounded text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="block text-slate-400">Report Inclusions</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                      <label className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={reportIncludedMetrics.gpsBreadcrumbs}
                          onChange={() => setReportIncludedMetrics(p => ({ ...p, gpsBreadcrumbs: !p.gpsBreadcrumbs }))}
                          className="accent-brand-gold"
                        />
                        <span>GPS Route History Trails</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={reportIncludedMetrics.attendance}
                          onChange={() => setReportIncludedMetrics(p => ({ ...p, attendance: !p.attendance }))}
                          className="accent-brand-gold"
                        />
                        <span>School Attendance Rolls</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={reportIncludedMetrics.heartRate}
                          onChange={() => setReportIncludedMetrics(p => ({ ...p, heartRate: !p.heartRate }))}
                          className="accent-brand-gold"
                        />
                        <span>Body Vitals & HR Records</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          checked={reportIncludedMetrics.speedAlerts}
                          onChange={() => setReportIncludedMetrics(p => ({ ...p, speedAlerts: !p.speedAlerts }))}
                          className="accent-brand-gold"
                        />
                        <span>Geofence & Speed Violations</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded uppercase cursor-pointer flex items-center justify-center gap-1"
                  >
                    {isSchedulerSaved ? 'Settings Saved Successfully!' : 'Save Weekly Schedule'}
                  </button>
                </form>
              </div>

              {/* History PDF log */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Generated Historical Logs</h4>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  <div className="p-2.5 bg-brand-navy rounded-lg border border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-300">
                    <div>
                      <div className="text-white">Weekly Dossier - July Week 2</div>
                      <div className="text-slate-500">Delivered: 13 July 2026</div>
                    </div>
                    <button 
                      onClick={() => alert("Downloading July Week 2 Report...")}
                      className="p-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-gold/20 rounded text-brand-gold font-bold cursor-pointer"
                    >
                      Download
                    </button>
                  </div>

                  <div className="p-2.5 bg-brand-navy rounded-lg border border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-300">
                    <div>
                      <div className="text-white">Weekly Dossier - July Week 1</div>
                      <div className="text-slate-500">Delivered: 6 July 2026</div>
                    </div>
                    <button 
                      onClick={() => alert("Downloading July Week 1 Report...")}
                      className="p-1.5 bg-brand-dark hover:bg-slate-800 border border-brand-gold/20 rounded text-brand-gold font-bold cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: RISK ==================== */}
        {activeSubTab === 'risk' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-gold" /> Predictive Safety & Route Risk AI Analyst
              </h3>
              <p className="text-[10px] text-slate-400">ML-driven deviation scorer tracking unexpected route changes, signaling warnings before physical threats occur.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* Risk metrics columns */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Biometric Safety Scores & Behavior Profiles</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-2">
                    <span className="block text-slate-400 uppercase font-mono text-[10px]">Transit Route Stability</span>
                    <strong className="text-2xl text-emerald-400 font-mono">{riskMetrics.routeDeviationScore}% Normal</strong>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '97%' }} />
                    </div>
                    <p className="text-[10px] text-slate-500">0 anomalies detected in standard Sandton - Randburg timeline.</p>
                  </div>

                  <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-2">
                    <span className="block text-slate-400 uppercase font-mono text-[10px]">Curfew Punctuality Scorer</span>
                    <strong className="text-2xl text-emerald-400 font-mono">{riskMetrics.safeZoneCurfewMatch}% Punctual</strong>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '98%' }} />
                    </div>
                    <p className="text-[10px] text-slate-500">Child arrives inside geofence perimeter within 5-min threshold.</p>
                  </div>
                </div>

                <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" /> Artificial Intelligence Safety Audit Note
                  </h5>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {aiAnalysisParagraph}
                  </p>
                </div>
              </div>

              {/* Neighbourhood Incident digest */}
              <div className="p-4 bg-brand-dark/90 rounded-xl border border-brand-gold/15 space-y-3">
                <h4 className="font-bold text-white font-mono text-[11px] uppercase tracking-wider text-brand-gold">Neighborhood Incident Digest</h4>
                <p className="text-[10px] text-slate-400">Real-time localized crowdsourced safety pins and SAPS records reported near child's active path.</p>

                <div className="space-y-2 text-[10px] font-mono">
                  {neighborhoodIncidents.map((incident) => (
                    <div key={incident.id} className="p-2.5 bg-brand-navy rounded-lg border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-white truncate max-w-[140px]">{incident.location}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] ${incident.severity === 'high' ? 'bg-red-950 text-red-300 border border-red-500/20' : incident.severity === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-500/20' : 'bg-slate-800 text-slate-300'}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-brand-gold">{incident.category}</div>
                      <div className="flex justify-between text-slate-500 text-[8px]">
                        <span>Dist: {incident.distance}</span>
                        <span>{incident.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUBTAB: BILLING ==================== */}
        {activeSubTab === 'billing' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-gold" /> Subscription Tiers & Billing Platform
                </h3>
                <p className="text-[10px] text-slate-400">Compare tiers and upgrade your safety shields instantly. Prices listed in South African Rand (ZAR).</p>
              </div>

              {/* Toggle cycle */}
              <div className="flex bg-brand-dark border border-slate-800 p-0.5 rounded-lg text-[10px] font-mono shrink-0">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded transition-colors font-bold cursor-pointer ${billingCycle === 'monthly' ? 'bg-brand-gold text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annually')}
                  className={`px-3 py-1 rounded transition-colors font-bold cursor-pointer ${billingCycle === 'annually' ? 'bg-brand-gold text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                >
                  Annually (-20%)
                </button>
              </div>
            </div>

            {isUpgraded ? (
              <div className="p-5 bg-brand-dark rounded-xl border border-emerald-500/30 text-center space-y-3.5 max-w-md mx-auto">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-bold font-mono text-sm uppercase tracking-wider">Payment Authorized & Upgraded!</h4>
                  <p className="text-xs text-slate-300 mt-1">Thank you for securing your children with ITIS Guardian Pro. All safety pipelines are now live.</p>
                </div>
                <div className="p-3 bg-brand-navy rounded border border-slate-800 font-mono text-[10px] text-slate-300">
                  Transaction: #TXN-7712-GP · Authorized Biometric Checkin successful.
                </div>
                <button
                  onClick={() => setIsUpgraded(false)}
                  className="px-4 py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-mono font-bold rounded text-xs cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
                {/* Basic Shield */}
                <div className="p-4 rounded-xl border border-slate-800 bg-brand-dark/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Basic Tier</span>
                    <strong className="text-white block font-sans text-md">Basic Shield</strong>
                    <div className="font-mono text-2xl text-white">
                      R{billingCycle === 'monthly' ? '149' : '1,430'}
                      <span className="text-xs text-slate-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                      <li>• Live GPS Tracking (10-min interval)</li>
                      <li>• 1 Custom Safe Zone setting</li>
                      <li>• SMS SOS notifications to 1 guardian</li>
                      <li>• Basic school attendance logs</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setBillingPlanSelected('sub-basic');
                      alert("You are currently on the trial or basic tier. Choose Pro or Command to upgrade.");
                    }}
                    className="w-full py-1.5 bg-brand-navy text-slate-300 border border-slate-800 rounded font-mono font-bold uppercase cursor-pointer"
                  >
                    Current Tier
                  </button>
                </div>

                {/* Guardian Pro */}
                <div className="p-4 rounded-xl border-2 border-brand-gold bg-brand-navy/60 flex flex-col justify-between space-y-4 relative">
                  <div className="absolute top-2 right-2 bg-brand-gold text-brand-dark font-bold text-[8px] font-mono px-2 py-0.5 rounded border border-brand-gold/30">
                    MOST POPULAR
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-brand-gold uppercase tracking-wider">Guardian Shield</span>
                    <strong className="text-white block font-sans text-md">Guardian Pro</strong>
                    <div className="font-mono text-2xl text-brand-gold">
                      R{billingCycle === 'monthly' ? '299' : '2,870'}
                      <span className="text-xs text-slate-400 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                      <li>• Real-time GPS tracking (10-second interval)</li>
                      <li>• Unlimited Safe Zones with Curfew Rules</li>
                      <li>• Automated SAPS Joint Taskforce integration</li>
                      <li>• Live audio loop & body vital diagnostics</li>
                      <li>• Full route playback & risk deviations AI</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setBillingPlanSelected('sub-premium');
                      handleCheckoutSimulator();
                    }}
                    disabled={isProcessingBilling}
                    className="w-full py-2 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark rounded font-mono font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isProcessingBilling ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Upgrade R{billingCycle === 'monthly' ? '299' : '2,870'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Joint Command */}
                <div className="p-4 rounded-xl border border-slate-850 bg-brand-dark/40 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Enterprise</span>
                    <strong className="text-white block font-sans text-md">School Safe-Net</strong>
                    <div className="font-mono text-2xl text-white">
                      R{billingCycle === 'monthly' ? '2,450' : '23,500'}
                      <span className="text-xs text-slate-500 font-normal">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <ul className="space-y-1.5 text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                      <li>• Covers up to 500 active wearables</li>
                      <li>• School admin dashboard & class attendance roll</li>
                      <li>• School transport & bus tracking integration</li>
                      <li>• Direct pipeline dispatch to National Desk</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setBillingPlanSelected('sub-school');
                      alert("Please contact our sales desk at sales@itisguardian.co.za to set up custom School Safe-Net billing agreements.");
                    }}
                    className="w-full py-1.5 bg-brand-navy hover:bg-brand-navy-light text-slate-300 border border-slate-800 rounded font-mono font-bold uppercase cursor-pointer"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SUBTAB: AUDIT ==================== */}
        {activeSubTab === 'audit' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-gold" /> System Security & Audit Log Records
                </h3>
                <p className="text-[10px] text-slate-400">POPIA compliant audit logging tracking every login, configuration setting change, and emergency SOS event.</p>
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                  <input 
                    type="text" 
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="bg-brand-dark border border-brand-gold/25 pl-7 pr-2.5 py-1 rounded text-[10px] text-white focus:outline-none focus:border-brand-gold w-36"
                  />
                </div>
                <button
                  onClick={exportAuditCSV}
                  className="px-2.5 py-1 bg-brand-navy hover:bg-slate-800 border border-brand-gold/20 text-brand-gold font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto bg-brand-dark/95 border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-brand-navy border-b border-slate-800 text-brand-gold uppercase tracking-wider text-[8px]">
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Operator</th>
                    <th className="p-2.5">Action Executed</th>
                    <th className="p-2.5">IP Address / Node</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {auditLogs
                    .filter(log => log.action.toLowerCase().includes(auditSearch.toLowerCase()) || log.category.toLowerCase().includes(auditSearch.toLowerCase()))
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-brand-navy-light/25 text-slate-300">
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-2.5 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            log.category === 'SECURITY' ? 'bg-red-950 text-red-300 border border-red-500/20' :
                            log.category === 'AUTH' ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/20' :
                            log.category === 'GEOFENCE' ? 'bg-amber-950 text-amber-300 border border-amber-500/20' :
                            log.category === 'BILLING' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {log.category}
                          </span>
                        </td>
                        <td className="p-2.5 whitespace-nowrap text-white">{log.operator}</td>
                        <td className="p-2.5">{log.action}</td>
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">{log.ipAddress}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
