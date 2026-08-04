export interface Learner {
  id: string;
  name: string;
  photoUrl: string;
  school: string;
  grade: string;
  medicalConditions: string;
  bloodGroup: string;
  emergencyContacts: string[];
  trackerSerial: string;
  trackerImei: string;
  deviceBattery: number; // percentage
  deviceSignal: 'Strong' | 'Medium' | 'Weak' | 'None';
  simNumber: string;
  assignedGuardian: string;
  attendanceRate: number; // percentage
  safetyScore: number; // 0-100
  heartRate?: number;
  temperature?: number;
  lastConnection: string;
  status: 'In School' | 'En Route' | 'At Home' | 'Emergency';
  latitude: number;
  longitude: number;
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'home' | 'school' | 'grandparents' | 'sports_field' | 'church' | 'library' | 'mall';
  latitude: number;
  longitude: number;
  radius: number; // in meters
  notifyOnArrival: boolean;
  notifyOnDeparture: boolean;
  curfewRule?: string; // e.g. "Must be home by 17:00"
}

export interface SafetyAlert {
  id: string;
  learnerId?: string;
  learnerName?: string;
  type: 
    | 'School Arrival' 
    | 'School Departure' 
    | 'Low Battery' 
    | 'SOS Activated' 
    | 'Leaving Safe Zone' 
    | 'Speeding' 
    | 'Device Removed' 
    | 'No Movement' 
    | 'High Risk Area' 
    | 'Police Alert' 
    | 'Weather Alert' 
    | 'Road Accident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  time: string;
  resolved: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface IncidentTicket {
  id: string; // e.g. "INC-2026-9081"
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  learnerName: string;
  schoolName: string;
  guardianName: string;
  assignedOfficer: string;
  status: 'Reported' | 'Dispatched' | 'On Scene' | 'Resolved';
  evidenceNotes: string[];
  timeline: { time: string; description: string }[];
  category: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceZar: number;
  period: 'monthly' | 'annually';
  features: string[];
  isPopular?: boolean;
}

export interface BusTransport {
  id: string;
  routeNumber: string;
  driverName: string;
  vehicleReg: string;
  currentPosition: { lat: number; lng: number };
  learnersOnboard: number;
  eta: string;
  status: 'On Schedule' | 'Delayed' | 'SOS';
}

export interface SchoolStats {
  todayAttendance: number; // percentage
  totalLearners: number;
  missingLearners: number;
  lateArrivals: number;
  emergencyIncidents: number;
  schoolNotices: string[];
}

export interface NationalStats {
  totalLearnersConnected: number;
  onlineDevicesCount: number;
  schoolsConnectedCount: number;
  incidentsTodayCount: number;
  avgResponseTimeMin: number;
  recoveryRatePercent: number;
  provinceRankings: { province: string; activeDevices: number; rating: number }[];
}

// Initial Mock Data representing children (learners) in South Africa (Johannesburg area)
export const initialLearners: Learner[] = [
  {
    id: 'l1',
    name: 'Sipho Ndlovu',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=face',
    school: 'Gauteng High School',
    grade: 'Grade 9-A',
    medicalConditions: 'Asthma (Inhaler in backpack)',
    bloodGroup: 'O-Positive',
    emergencyContacts: ['+27 82 123 4567 (Mother)', '+27 83 765 4321 (Father)'],
    trackerSerial: 'ITIS-TRK-99081',
    trackerImei: '861023948571239',
    deviceBattery: 82,
    deviceSignal: 'Strong',
    simNumber: '+27 71 445 9012',
    assignedGuardian: 'Thabo Ndlovu',
    attendanceRate: 96.5,
    safetyScore: 94,
    heartRate: 74,
    temperature: 36.6,
    lastConnection: 'Just now',
    status: 'In School',
    latitude: -26.1952,
    longitude: 28.0340
  },
  {
    id: 'l2',
    name: 'Zama Dlamini',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    school: 'Parktown Girls Primary',
    grade: 'Grade 5-B',
    medicalConditions: 'Penicillin Allergy',
    bloodGroup: 'A-Negative',
    emergencyContacts: ['+27 82 999 8888 (Mother)', '+27 73 111 2222 (Aunt)'],
    trackerSerial: 'ITIS-TRK-44122',
    trackerImei: '861044558273941',
    deviceBattery: 45,
    deviceSignal: 'Medium',
    simNumber: '+27 81 223 3445',
    assignedGuardian: 'Lerato Dlamini',
    attendanceRate: 98.2,
    safetyScore: 89,
    heartRate: 81,
    temperature: 36.8,
    lastConnection: '2 mins ago',
    status: 'En Route',
    latitude: -26.1824,
    longitude: 28.0210
  }
];

export const initialSafeZones: SafeZone[] = [
  {
    id: 'sz1',
    name: 'Home (Randburg)',
    type: 'home',
    latitude: -26.1154,
    longitude: 27.9712,
    radius: 150,
    notifyOnArrival: true,
    notifyOnDeparture: true,
    curfewRule: 'Should be home by 17:00'
  },
  {
    id: 'sz2',
    name: 'Gauteng High School',
    type: 'school',
    latitude: -26.1952,
    longitude: 28.0340,
    radius: 300,
    notifyOnArrival: true,
    notifyOnDeparture: true,
    curfewRule: 'In school by 07:45 - 14:30'
  },
  {
    id: 'sz3',
    name: 'Aunt Lerato\'s House',
    type: 'grandparents',
    latitude: -26.1415,
    longitude: 28.0482,
    radius: 100,
    notifyOnArrival: true,
    notifyOnDeparture: false
  }
];

export const initialAlerts: SafetyAlert[] = [
  {
    id: 'al1',
    learnerId: 'l1',
    learnerName: 'Sipho Ndlovu',
    type: 'School Arrival',
    severity: 'low',
    message: 'Sipho Ndlovu safely arrived at Gauteng High School at 07:38.',
    time: '2026-07-08T07:38:00',
    resolved: true
  },
  {
    id: 'al2',
    learnerId: 'l2',
    learnerName: 'Zama Dlamini',
    type: 'Leaving Safe Zone',
    severity: 'medium',
    message: 'Zama Dlamini departed Aunt Lerato\'s House zone.',
    time: '2026-07-08T15:12:00',
    resolved: true
  },
  {
    id: 'al3',
    learnerId: 'l1',
    learnerName: 'Sipho Ndlovu',
    type: 'Low Battery',
    severity: 'medium',
    message: 'GPS tracker serial ITIS-TRK-99081 battery is below 20%. Please plug in.',
    time: '2026-07-08T17:45:00',
    resolved: false
  },
  {
    id: 'al4',
    type: 'Police Alert',
    severity: 'high',
    message: 'SAPS operation active near Hillbrow. Advise choosing detour paths.',
    time: '2026-07-08T18:15:00',
    resolved: false
  }
];

export const initialIncidents: IncidentTicket[] = [
  {
    id: 'INC-2026-4401',
    date: '2026-07-08',
    time: '14:45',
    location: 'Smit St & De Beer St, Braamfontein',
    latitude: -26.1934,
    longitude: 28.0355,
    learnerName: 'Zama Dlamini',
    schoolName: 'Parktown Girls Primary',
    guardianName: 'Lerato Dlamini',
    assignedOfficer: 'Officer J. Molefe (SAPS)',
    status: 'Resolved',
    category: 'Leaving Safe Zone Alert Override',
    evidenceNotes: [
      'Panic SOS triggered due to delay on road.',
      'ITIS Dispatch called Guardian Lerato Dlamini immediately at 14:46.',
      'Dispatched responding unit 4B (SAPS tactical backup) to GPS coordinates.',
      'SAPS contacted target child and guardian - resolved as school bus flat tyre delay, no immediate danger.'
    ],
    timeline: [
      { time: '14:45', description: 'Panic Button Triggered from ITIS-TRK-44122' },
      { time: '14:46', description: 'ITIS Command Operator initiated voice loop' },
      { time: '14:48', description: 'Emergency responder dispatch confirmed' },
      { time: '14:55', description: 'Officer Molefe arrived at coordinates' },
      { time: '15:10', description: 'Case marked as Resolved. Bus tire replaced.' }
    ]
  },
  {
    id: 'INC-2026-8812',
    date: '2026-07-08',
    time: '18:10',
    location: 'Jan Smuts Ave & Empire Rd, Parktown',
    latitude: -26.1865,
    longitude: 28.0289,
    learnerName: 'Sipho Ndlovu',
    schoolName: 'Gauteng High School',
    guardianName: 'Thabo Ndlovu',
    assignedOfficer: 'Officer S. Naidoo (ITIS Response Team)',
    status: 'Dispatched',
    category: 'SOS Triggered',
    evidenceNotes: [
      'Panic Button held down for 3 seconds.',
      'Automated location transmission broadcasting live.',
      'SAPS & ITIS Joint Response team dispatched.'
    ],
    timeline: [
      { time: '18:10', description: 'SOS Device Panic alert received' },
      { time: '18:11', description: 'Device audio stream activated' },
      { time: '18:12', description: 'Responder Unit 12 dispatched from Milpark Station' },
      { time: '18:15', description: 'ETA to coordinates: 4 minutes' }
    ]
  }
];

export const mockBuses: BusTransport[] = [
  {
    id: 'b1',
    routeNumber: 'Route 10A (Soweto - Braamfontein)',
    driverName: 'Enoch Khumalo',
    vehicleReg: 'DZ 44 SM GP',
    currentPosition: { lat: -26.2201, lng: 27.9850 },
    learnersOnboard: 18,
    eta: '07:35 AM',
    status: 'On Schedule'
  },
  {
    id: 'b2',
    routeNumber: 'Route 12C (Sandton - Parktown Girls)',
    driverName: 'Peter Naidoo',
    vehicleReg: 'KX 99 YY GP',
    currentPosition: { lat: -26.1450, lng: 28.0410 },
    learnersOnboard: 12,
    eta: '07:42 AM',
    status: 'Delayed'
  }
];

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'sub-basic',
    name: 'Basic Shield',
    priceZar: 149,
    period: 'monthly',
    features: [
      'Live GPS Tracking (10-min interval)',
      '1 Custom Safe Zone setting',
      'SMS SOS notifications to 1 guardian',
      'Basic school attendance notifications',
      'POPIA Compliant client portal access'
    ]
  },
  {
    id: 'sub-premium',
    name: 'Premium Guardian',
    priceZar: 299,
    period: 'monthly',
    isPopular: true,
    features: [
      'Real-time GPS tracking (10-second interval)',
      'Unlimited Safe Zones with Curfew Rules',
      'Automated SAPS & ITIS Dispatch responder routing',
      'Live audio recording stream activation on panic',
      'Wearable heart-rate and diagnostic sensors monitoring',
      '5 Registered Guardian profiles per child',
      'ITIS AI Safety Analytics & PDF export reports'
    ]
  },
  {
    id: 'sub-school',
    name: 'ITIS School Safe-Net',
    priceZar: 2450,
    period: 'monthly',
    features: [
      'Covers up to 500 active tracking devices',
      'School Administrative dashboard & roll call terminal',
      'Dedicated teacher application client profiles',
      'School transport & school bus tracking overlay',
      'Real-time missing learner alerts and automated notices',
      'Direct pipeline link to ITIS National Command Center'
    ]
  }
];

export const mockNationalStats: NationalStats = {
  totalLearnersConnected: 142050,
  onlineDevicesCount: 138920,
  schoolsConnectedCount: 412,
  incidentsTodayCount: 14,
  avgResponseTimeMin: 6.4,
  recoveryRatePercent: 100.0,
  provinceRankings: [
    { province: 'Gauteng', activeDevices: 62450, rating: 98.4 },
    { province: 'Western Cape', activeDevices: 31200, rating: 99.1 },
    { province: 'KwaZulu-Natal', activeDevices: 28900, rating: 97.2 },
    { province: 'Eastern Cape', activeDevices: 10500, rating: 95.8 },
    { province: 'Free State', activeDevices: 9000, rating: 96.5 }
  ]
};
