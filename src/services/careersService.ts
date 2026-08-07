/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type JobDepartment = 
  | 'Executive Positions'
  | 'Engineering'
  | 'Operations'
  | 'Command Centre'
  | 'Sales'
  | 'Customer Success'
  | 'GIS Specialists'
  | 'Fleet Operations'
  | 'Emergency Coordinators'
  | 'Technical Support'
  | 'Security Operations'
  | 'Marketing'
  | 'Finance'
  | 'Graduate Programme'
  | 'Internship Programme'
  | 'Learnership Programme'
  | 'Volunteer Programme';

export type JobProvince = 
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Mpumalanga'
  | 'Limpopo'
  | 'North West'
  | 'Northern Cape'
  | 'National / Remote';

export type EmploymentType = 
  | 'Full-Time'
  | 'Contract'
  | 'Graduate Programme'
  | 'Internship'
  | 'Learnership'
  | 'Volunteer';

export type ApplicationStatus = 
  | 'New Applications'
  | 'Shortlisted'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export interface Vacancy {
  id: string;
  title: string;
  department: JobDepartment;
  province: JobProvince;
  employmentType: EmploymentType;
  closingDate: string;
  salary: string;
  requiredQualifications: string[];
  responsibilities: string[];
  description: string;
  featured?: boolean;
  status: 'Open' | 'Closed';
}

export interface JobApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  department: JobDepartment;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  rsaIdNumber: string;
  province: JobProvince;
  qualification: string;
  yearsExperience: string;
  cvFileName: string;
  coverLetterText: string;
  appliedDate: string;
  status: ApplicationStatus;
  hrNotes: string[];
  rating: number; // 1 to 5
}

// Initial set of vacancies covering all requested departments & programmes
export const initialVacancies: Vacancy[] = [
  {
    id: 'VAC-2026-101',
    title: 'Lead Command Centre Safety Coordinator (24/7 Operations)',
    department: 'Command Centre',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-08-30',
    salary: 'R 48,000 - R 62,000 / month',
    description: 'Lead 24/7 emergency response verification and multi-agency dispatch operations in our central Johannesburg Command Centre. Oversight of panic button alerts, telemetry anomalies, and direct liaison with SAPS and EMS emergency dispatchers.',
    requiredQualifications: [
      'National Diploma / Degree in Public Safety, Disaster Management, or Criminology',
      'Minimum 5 years experience in emergency dispatch or control room coordination',
      'PSIRA Grade A Registration / SACSSP equivalent',
      'Deep knowledge of South African emergency response procedures and POPIA standards'
    ],
    responsibilities: [
      'Monitor real-time child panic triggers, geofence breaches, and route anomalies.',
      'Conduct immediate human verification calls within 15 seconds of critical alerts.',
      'Coordinate tactical dispatch with SAPS 10111, local metro police, and private security partners.',
      'Maintain immutable incident log records for provincial education department reports.'
    ],
    featured: true,
    status: 'Open'
  },
  {
    id: 'VAC-2026-102',
    title: 'Senior GIS & Spatial Telemetry Engineer',
    department: 'GIS Specialists',
    province: 'Western Cape',
    employmentType: 'Full-Time',
    closingDate: '2026-09-15',
    salary: 'R 75,000 - R 95,000 / month',
    description: 'Design and optimize spatial geofencing algorithms, transit corridor mapping, and real-time GPS telemetry pipelines that safeguard over 50,000 daily learner journeys across South Africa.',
    requiredQualifications: [
      'BSc / BEng in Geoinformatics, Geographic Information Systems, or Computer Science',
      'At least 4 years experience with spatial databases (PostGIS, GeoJSON, Leaflet/Mapbox, OpenStreetMap)',
      'Proficiency in TypeScript, Python, and real-time WebSocket telemetry architectures',
      'Experience with offline-first tile caching for low-connectivity rural South African routes'
    ],
    responsibilities: [
      'Architect sub-second spatial geofencing boundary engines for school campuses and transport corridors.',
      'Build predictive transit delay algorithms using live municipal traffic data.',
      'Ensure high accuracy map layers for South African township and rural school boundaries.',
      'Optimize bandwidth usage for IoT wearable devices on 2G/3G Vodacom & MTN private APNs.'
    ],
    featured: true,
    status: 'Open'
  },
  {
    id: 'VAC-2026-103',
    title: 'Executive Director of Government & Education Partnerships',
    department: 'Executive Positions',
    province: 'National / Remote',
    employmentType: 'Full-Time',
    closingDate: '2026-08-28',
    salary: 'Executive Package + Performance Benefits',
    description: 'Strategic leadership role liaising with National & Provincial Departments of Basic Education, Department of Transport, municipal councils, and SAPS leadership to expand ITIS child safety deployment across all 9 provinces.',
    requiredQualifications: [
      'Master Degree in Public Administration, Business Leadership, or Political Science',
      '10+ years senior executive experience in South African public sector or government tech partnerships',
      'Proven track record of managing multi-million Rand government inter-agency MOUs and tenders',
      'Uncompromising ethics and passion for South African youth protection'
    ],
    responsibilities: [
      'Lead strategic engagements with Provincial MECs for Education and Transport.',
      'Oversee compliance with PFMA, MFMA, and POPIA frameworks in public tenders.',
      'Represent ITIS at national public safety summits and parliamentary committee briefs.',
      'Drive institutional adoption across private and public school governing bodies (SGBs).'
    ],
    featured: true,
    status: 'Open'
  },
  {
    id: 'VAC-2026-104',
    title: 'Senior Full-Stack Cloud & Mobile Engineer',
    department: 'Engineering',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-09-10',
    salary: 'R 70,000 - R 90,000 / month',
    description: 'Build robust, highly scalable full-stack React, Node.js, and cloud application modules powering our Parent Guardian App, School Principal Portal, and Emergency Dispatcher Consoles.',
    requiredQualifications: [
      'BSc Computer Science or equivalent practical industry experience',
      '5+ years mastery in React, TypeScript, Node.js, Express, and Vite',
      'Hands-on experience with WebSocket/MQTT protocols, Redis, and Firestore/Cloud SQL',
      'Demonstrated focus on UI responsiveness, accessibility, and zero-flicker performance'
    ],
    responsibilities: [
      'Develop mission-critical web and mobile interfaces for emergency response workflows.',
      'Implement zero-trust role-based access control (RBAC) and session isolation.',
      'Maintain 99.99% uptime for telemetry ingestion services handling thousands of concurrent devices.',
      'Conduct rigorous code reviews, automated unit testing, and security audits.'
    ],
    featured: true,
    status: 'Open'
  },
  {
    id: 'VAC-2026-105',
    title: 'Transport Operator & Fleet Safety Manager',
    department: 'Fleet Operations',
    province: 'KwaZulu-Natal',
    employmentType: 'Full-Time',
    closingDate: '2026-09-05',
    salary: 'R 38,000 - R 52,000 / month',
    description: 'Manage fleet driver onboarding, vehicle telemetry verification, and scholar transport compliance across Durban, Pietermaritzburg, and KZN school districts.',
    requiredQualifications: [
      'Diploma in Logistics, Transport Management, or Fleet Administration',
      '3+ years in fleet operations, scholar transport regulation, or bus operator auditing',
      'Valid Code 08/10 Driver License with PrDP',
      'Bilingual in isiZulu and English'
    ],
    responsibilities: [
      'Verify driver PrDP licenses, PDP clearances, and vehicle roadworthiness certificates.',
      'Audit school bus vehicle tracking hardware and panic button installations.',
      'Conduct safety workshops for scholar transport driver associations and taxi liaisons.',
      'Investigate route deviation alerts and report vehicle maintenance risks.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-106',
    title: 'Cybersecurity & POPIA Data Protection Officer',
    department: 'Security Operations',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-08-31',
    salary: 'R 65,000 - R 85,000 / month',
    description: 'Ensure total POPIA, GDPR, and ISO 27001 data governance compliance across all child records, guardian contact details, and location tracking data stores.',
    requiredQualifications: [
      'Degree in Information Security, Law, or Computer Science',
      'CISM, CISSP, or CIPP/E Certification',
      'In-depth mastery of the South African Protection of Personal Information Act (POPIA)',
      'Experience conducting penetration testing, vulnerability assessments, and privacy audits'
    ],
    responsibilities: [
      'Oversee end-to-end encryption standards for data in transit (TLS 1.3) and at rest (AES-256).',
      'Serve as official Information Officer registered with the Information Regulator of SA.',
      'Manage access audit logs, identity verification policies, and data retention schedules.',
      'Conduct annual security awareness training for all ITIS employees and operators.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-107',
    title: 'Tactical Emergency Response Liaison - SAPS & EMS',
    department: 'Emergency Coordinators',
    province: 'Eastern Cape',
    employmentType: 'Full-Time',
    closingDate: '2026-09-20',
    salary: 'R 35,000 - R 48,000 / month',
    description: 'Direct field and control liaison bridging ITIS Command Centre operations with SAPS Provincial Joint Operational Centres (JOC), EMS ambulance dispatches, and Metro Law Enforcement in Gqeberha and East London.',
    requiredQualifications: [
      'Previous experience in SAPS, Metro Police, Military, or EMS Paramedic services',
      'Proven emergency scene management and inter-agency coordination skills',
      'Clean criminal record and security clearance',
      'Fluent in isiXhosa and English'
    ],
    responsibilities: [
      'Establish direct communication links with local police station commanders and EMS dispatches.',
      'Facilitate immediate dispatch upon confirmed high-priority child distress alerts.',
      'Conduct post-incident debriefs and assist in preparing police evidence dockets.',
      'Train local emergency responders on using the ITIS First Responder mobile portal.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-108',
    title: 'School Onboarding & Customer Success Specialist',
    department: 'Customer Success',
    province: 'Free State',
    employmentType: 'Full-Time',
    closingDate: '2026-09-12',
    salary: 'R 28,000 - R 38,000 / month',
    description: 'Work directly with School Governing Bodies (SGBs), school principals, and administrative staff to onboard schools, import student registries, and train teachers on attendance scanning.',
    requiredQualifications: [
      'Diploma or Degree in Education, Communications, or Business Admin',
      '2+ years in customer success, school administration, or client onboarding',
      'Excellent interpersonal skills and patience with non-technical school staff',
      'Bilingual in Sesotho/Afrikaans and English'
    ],
    responsibilities: [
      'Conduct step-by-step onboarding workshops for school principals and admin clerks.',
      'Assist in uploading secure CSV learner rosters into the School Portal.',
      'Provide daily operational support and resolve ticket queries from school staff.',
      'Track school attendance scan adoption rates and ensure zero missed roll calls.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-109',
    title: 'Municipal & School District Account Executive',
    department: 'Sales',
    province: 'Mpumalanga',
    employmentType: 'Full-Time',
    closingDate: '2026-09-08',
    salary: 'R 35,000 Basic + Uncapped Commission',
    description: 'Drive expansion of the ITIS Child Safety Platform across school districts, private education networks, and municipal transport safety initiatives in Mbombela and surrounding regions.',
    requiredQualifications: [
      'Degree in Business, Marketing, or Public Management',
      '3+ years B2B or B2G sales experience in educational software or public safety tech',
      'Strong presentation skills to SGBs, district directors, and corporate ESG sponsors',
      'Valid driver license and willingness to travel regionally'
    ],
    responsibilities: [
      'Present ITIS child protection demonstrations to school governing bodies and principal associations.',
      'Manage end-to-end sales pipelines from initial meeting to contract signature.',
      'Partner with corporate sponsors seeking high-impact B-BBEE / ESG community safety projects.',
      'Achieve quarterly targets for onboarded schools and active learner subscriptions.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-110',
    title: 'Tier-2 Wearable & IoT Hardware Support Specialist',
    department: 'Technical Support',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-09-18',
    salary: 'R 26,000 - R 34,000 / month',
    description: 'Diagnose and support IoT smart wearable bands, GPS beacons, solar campus gate scanners, and SIM connectivity hardware across school campuses.',
    requiredQualifications: [
      'A+ / N+ Certification or Diploma in IT Electronics / Hardware Engineering',
      '2+ years in IoT device troubleshooting, SIM provisioning, or hardware support',
      'Understanding of cellular networks (APN, GSM, LTE-M) and battery power optimization',
      'Methodical problem-solving and ticketing discipline'
    ],
    responsibilities: [
      'Troubleshoot device offline alerts, battery degradation, and SIM connectivity errors.',
      'Perform OTA (Over-The-Air) firmware updates and hardware diagnostics.',
      'Manage wearable replacement dispatch and RMA inventory for school technicians.',
      'Maintain technical documentation and hardware maintenance logs.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-111',
    title: 'Community Child Protection Communications Lead',
    department: 'Marketing',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-09-02',
    salary: 'R 32,000 - R 45,000 / month',
    description: 'Design educational child safety campaigns, community radio briefs, parent awareness newsletters, and official press releases highlighting South Africa child safety milestones.',
    requiredQualifications: [
      'Degree in Journalism, Public Relations, Corporate Communications, or Marketing',
      '3+ years in public relations, NGO communications, or social impact campaigns',
      'Exceptional storytelling skills across English, isiZulu, and Afrikaans',
      'Experience in crisis communication and sensitive community engagement'
    ],
    responsibilities: [
      'Draft parent educational guides on child journey safety and emergency protocols.',
      'Coordinate community awareness drives in partnership with local CPF (Community Policing Forums).',
      'Manage official ITIS social channels and media relations.',
      'Measure public awareness metrics and guardian app engagement levels.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-112',
    title: 'Senior Grants & Public Sector Financial Analyst',
    department: 'Finance',
    province: 'Gauteng',
    employmentType: 'Full-Time',
    closingDate: '2026-09-14',
    salary: 'R 55,000 - R 72,000 / month',
    description: 'Manage public sector billing, municipal grant allocations, corporate ESG sponsorship budgets, and financial compliance for government child protection subsidies.',
    requiredQualifications: [
      'BCom Accounting or Finance / CIMA / CA(SA) candidate',
      '4+ years in financial management, public sector accounting (PFMA compliance), or grant auditing',
      'Mastery of ERP systems, Excel modeling, and revenue recognition standards',
      'High attention to detail and zero-tolerance for non-compliance'
    ],
    responsibilities: [
      'Oversee school subscription billing, fee subsidies, and donor fund tracking.',
      'Prepare quarterly financial audit reports for government department partners.',
      'Ensure strict PFMA and Treasury compliance for public sector contracts.',
      'Manage vendor payments, payroll reconciliation, and corporate ESG reporting.'
    ],
    status: 'Open'
  },

  // Special Entry & Development Programmes
  {
    id: 'VAC-2026-201',
    title: '2027 Software & Public Safety Graduate Development Programme',
    department: 'Graduate Programme',
    province: 'Gauteng',
    employmentType: 'Graduate Programme',
    closingDate: '2026-10-30',
    salary: 'R 18,000 - R 24,000 / month',
    description: 'An intensive 18-month structured rotation for top South African graduates in Computer Science, Geoinformatics, Data Science, and Public Management. Hands-on mentorship building life-saving child safety infrastructure.',
    requiredQualifications: [
      'Recently completed BSc/BCom/BTech (2024-2026) in Computer Science, GIS, IT, or Public Admin',
      'Minimum 65% academic average',
      'South African Citizen under 29 years of age',
      'Passion for technology innovation and public safety impact'
    ],
    responsibilities: [
      'Rotate across Full-Stack Engineering, GIS Data Analytics, Command Centre Operations, and Product Design.',
      'Complete real-world technical projects mentored by senior staff.',
      'Participate in quarterly executive presentation reviews and hackathons.',
      'Opportunity for full-time permanent placement upon successful completion.'
    ],
    featured: true,
    status: 'Open'
  },
  {
    id: 'VAC-2026-202',
    title: 'GIS & Control Room Operational Internship (12 Months)',
    department: 'Internship Programme',
    province: 'Western Cape',
    employmentType: 'Internship',
    closingDate: '2026-10-15',
    salary: 'R 12,000 - R 15,000 / month stipend',
    description: 'Paid 12-month internship gaining real-world experience in spatial data verification, GIS mapping, and live emergency telemetry analysis in Cape Town.',
    requiredQualifications: [
      'Diploma or Degree in GIS, Geography, Environmental Science, or Information Technology',
      'Proficiency in basic GIS mapping tools (QGIS, ArcGIS, or Leaflet)',
      'South African Citizen',
      'Eager to learn and work in a high-pace mission-driven environment'
    ],
    responsibilities: [
      'Assist GIS analysts in verifying school campus geofence polygons.',
      'Clean and update transit route coordinates across Cape Flats and rural school districts.',
      'Support Command Centre operators during peak morning and afternoon transit hours.',
      'Generate weekly spatial accuracy reports.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-203',
    title: 'SETA Accredited IT Technical Support Learnership',
    department: 'Learnership Programme',
    province: 'Limpopo',
    employmentType: 'Learnership',
    closingDate: '2026-10-20',
    salary: 'R 6,500 / month SETA Stipend',
    description: '12-month accredited NQF Level 4/5 Learnership in End-User Computing & Systems Support, combining formal classroom learning with practical campus scanning equipment maintenance in Polokwane.',
    requiredQualifications: [
      'Matric / Grade 12 Certificate with Pure Maths or Mathematical Literacy',
      'Unemployed South African Youth aged 18-30',
      'Basic computer literacy and enthusiasm for technology',
      'Resident of Limpopo Province'
    ],
    responsibilities: [
      'Attend formal accredited training modules in Technical Support.',
      'Assist local technicians in setting up school attendance barcode and Bluetooth scanners.',
      'Log support tickets and provide frontline helpdesk assistance to rural schools.',
      'Maintain portfolio of evidence (PoE) for qualification assessment.'
    ],
    status: 'Open'
  },
  {
    id: 'VAC-2026-204',
    title: 'Community Child Protection Advocate & School Volunteer',
    department: 'Volunteer Programme',
    province: 'National / Remote',
    employmentType: 'Volunteer',
    closingDate: 'Ongoing Recruitment',
    salary: 'Honorarium & Out-of-pocket Stipend Provided',
    description: 'Join our national network of community safety champions, parent liaisons, and school gate monitors who advocate for learner protection, assist in walking buses, and support safety drills.',
    requiredQualifications: [
      'Passionate community member, parent, or retired educator',
      'Pass SAPS sexual offences and child protection background checks (Form 29 / Criminal Record Screening)',
      'High ethical standing in local community',
      'Minimum 4 hours per week availability during school transport hours'
    ],
    responsibilities: [
      'Assist as a friendly monitor during morning arrival and afternoon departure at designated school gates.',
      'Raise awareness among parents about active wearable tracking and safe transit practices.',
      'Report route safety hazards, broken streetlights, or suspicious activity to local CPF and ITIS Coordinators.',
      'Participate in quarterly community child safety workshops.'
    ],
    status: 'Open'
  }
];

// Initial mock applications for the HR ATS pipeline
export const initialApplications: JobApplication[] = [
  {
    id: 'APP-2026-8801',
    vacancyId: 'VAC-2026-101',
    vacancyTitle: 'Lead Command Centre Safety Coordinator (24/7 Operations)',
    department: 'Command Centre',
    applicantName: 'Thabo Mokoena',
    applicantEmail: 'thabo.mokoena@gmail.com',
    applicantPhone: '+27 82 345 6789',
    rsaIdNumber: '8904125182083',
    province: 'Gauteng',
    qualification: 'Diploma in Criminology & Emergency Dispatch (TUT)',
    yearsExperience: '6 Years',
    cvFileName: 'Thabo_Mokoena_CV_2026.pdf',
    coverLetterText: 'I have served 6 years as a Senior Controller at Netcare 911 dispatch. Protecting children on South African routes is my lifelong calling. I bring extensive experience in multi-agency incident management under pressure.',
    appliedDate: '2026-08-01',
    status: 'Shortlisted',
    hrNotes: [
      '2026-08-02 (HR Lead): Strong background in EMS control room management. PSIRA Grade A verified.',
      '2026-08-03 (Command Director): Excellent interview candidate for morning shift lead.'
    ],
    rating: 5
  },
  {
    id: 'APP-2026-8802',
    vacancyId: 'VAC-2026-102',
    vacancyTitle: 'Senior GIS & Spatial Telemetry Engineer',
    department: 'GIS Specialists',
    applicantName: 'Dr. Sarah van der Merwe',
    applicantEmail: 's.vandermerwe@sun.ac.za',
    applicantPhone: '+27 83 912 3456',
    rsaIdNumber: '9211050089081',
    province: 'Western Cape',
    qualification: 'PhD in Geoinformatics (Stellenbosch University)',
    yearsExperience: '5 Years',
    cvFileName: 'Sarah_van_der_Merwe_Resume.pdf',
    coverLetterText: 'My research focuses on real-time spatial geofencing algorithms in constrained connectivity environments. I built custom PostGIS boundary engines for municipal logistics and wish to dedicate my technical skills to child protection.',
    appliedDate: '2026-08-03',
    status: 'Interview',
    hrNotes: [
      '2026-08-04 (HR Lead): World-class GIS engineering candidate. Published paper on low-latency spatial indexing.'
    ],
    rating: 5
  },
  {
    id: 'APP-2026-8803',
    vacancyId: 'VAC-2026-104',
    vacancyTitle: 'Senior Full-Stack Cloud & Mobile Engineer',
    applicantName: 'Kagiso Ndlovu',
    department: 'Engineering',
    applicantEmail: 'k.ndlovu@devstudio.co.za',
    applicantPhone: '+27 71 888 4321',
    rsaIdNumber: '9408225543088',
    province: 'Gauteng',
    qualification: 'BSc Computer Science (Wits University)',
    yearsExperience: '4 Years',
    cvFileName: 'Kagiso_Ndlovu_Fullstack_Dev.pdf',
    coverLetterText: 'Full-stack React & Node.js specialist with 4 years experience building high-throughput financial and logistics web applications. Experienced in WebSocket state sync and zero-flicker UI design.',
    appliedDate: '2026-08-04',
    status: 'New Applications',
    hrNotes: [
      '2026-08-05 (HR Coordinator): New applicant. Code portfolio attached.'
    ],
    rating: 4
  },
  {
    id: 'APP-2026-8804',
    vacancyId: 'VAC-2026-201',
    vacancyTitle: '2027 Software & Public Safety Graduate Development Programme',
    department: 'Graduate Programme',
    applicantName: 'Zinhle Cele',
    applicantEmail: 'zinhle.cele@student.uj.ac.za',
    applicantPhone: '+27 60 432 1098',
    rsaIdNumber: '0302150492084',
    province: 'Gauteng',
    qualification: 'BSc IT Software Development (University of Johannesburg, 2025)',
    yearsExperience: 'Graduate',
    cvFileName: 'Zinhle_Cele_Graduate_Application.pdf',
    coverLetterText: 'Graduating cum laude from UJ in 2025. My final year capstone project created a school transport tracking web prototype. I am passionate about leveraging my coding skills for child safety.',
    appliedDate: '2026-08-05',
    status: 'Shortlisted',
    hrNotes: [
      '2026-08-05 (Talent Acquisition): Cum laude graduate with direct domain capstone project. High potential.'
    ],
    rating: 5
  },
  {
    id: 'APP-2026-8805',
    vacancyId: 'VAC-2026-106',
    vacancyTitle: 'Cybersecurity & POPIA Data Protection Officer',
    department: 'Security Operations',
    applicantName: 'Sipho Bhengu',
    applicantEmail: 'sipho.bhengu@secgov.co.za',
    applicantPhone: '+27 84 555 1234',
    rsaIdNumber: '8709195234081',
    province: 'Gauteng',
    qualification: 'BCom Informatics / CISM Certified',
    yearsExperience: '8 Years',
    cvFileName: 'Sipho_Bhengu_CISSP.pdf',
    coverLetterText: '8 years as Information Security Officer in banking and healthcare. Specialized in POPIA audit frameworks, ISO 27001 ISMS implementation, and data leak prevention.',
    appliedDate: '2026-07-28',
    status: 'Offer',
    hrNotes: [
      '2026-08-01 (HR Lead): Final interview completed. Offer letter dispatched for review.'
    ],
    rating: 5
  },
  {
    id: 'APP-2026-8806',
    vacancyId: 'VAC-2026-105',
    vacancyTitle: 'Transport Operator & Fleet Safety Manager',
    department: 'Fleet Operations',
    applicantName: 'Jacobus Pretorius',
    applicantEmail: 'j.pretorius@kznfleet.co.za',
    applicantPhone: '+27 82 777 9012',
    rsaIdNumber: '8312015098082',
    province: 'KwaZulu-Natal',
    qualification: 'Diploma in Logistics Management (DUT)',
    yearsExperience: '7 Years',
    cvFileName: 'Jacobus_Pretorius_CV.pdf',
    coverLetterText: '7 years managing scholar transport buses and fleet safety compliance in KZN. Strong relationship with taxi associations and municipal transport registrars.',
    appliedDate: '2026-07-25',
    status: 'Hired',
    hrNotes: [
      '2026-08-01 (HR Lead): Contract signed! Start date confirmed for 1 September 2026.'
    ],
    rating: 5
  }
];

// Service class / helper to manage Careers & Applications in memory / localStorage
class CareersService {
  private vacancies: Vacancy[] = [];
  private applications: JobApplication[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    try {
      const savedVacancies = localStorage.getItem('itis_vacancies');
      if (savedVacancies) {
        this.vacancies = JSON.parse(savedVacancies);
      } else {
        this.vacancies = [...initialVacancies];
        this.saveVacancies();
      }

      const savedApps = localStorage.getItem('itis_applications');
      if (savedApps) {
        this.applications = JSON.parse(savedApps);
      } else {
        this.applications = [...initialApplications];
        this.saveApplications();
      }
    } catch {
      this.vacancies = [...initialVacancies];
      this.applications = [...initialApplications];
    }
  }

  private saveVacancies() {
    try {
      localStorage.setItem('itis_vacancies', JSON.stringify(this.vacancies));
    } catch (e) {
      console.error("Failed to save vacancies to storage", e);
    }
  }

  private saveApplications() {
    try {
      localStorage.setItem('itis_applications', JSON.stringify(this.applications));
    } catch (e) {
      console.error("Failed to save applications to storage", e);
    }
  }

  public getVacancies(filters?: { keyword?: string; department?: string; province?: string; type?: string }): Vacancy[] {
    let list = this.vacancies.filter(v => v.status === 'Open');

    if (filters?.keyword) {
      const kw = filters.keyword.toLowerCase();
      list = list.filter(v => 
        v.title.toLowerCase().includes(kw) || 
        v.description.toLowerCase().includes(kw) ||
        v.department.toLowerCase().includes(kw) ||
        v.requiredQualifications.some(q => q.toLowerCase().includes(kw))
      );
    }

    if (filters?.department && filters.department !== 'All') {
      list = list.filter(v => v.department === filters.department);
    }

    if (filters?.province && filters.province !== 'All') {
      list = list.filter(v => v.province === filters.province || v.province === 'National / Remote');
    }

    if (filters?.type && filters.type !== 'All') {
      list = list.filter(v => v.employmentType === filters.type);
    }

    return list;
  }

  public getAllVacanciesForAdmin(): Vacancy[] {
    return [...this.vacancies];
  }

  public getVacancyById(id: string): Vacancy | undefined {
    return this.vacancies.find(v => v.id === id);
  }

  public submitApplication(appData: Omit<JobApplication, 'id' | 'appliedDate' | 'status' | 'hrNotes' | 'rating'>): { success: boolean; applicationId: string; message: string } {
    const newId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: JobApplication = {
      ...appData,
      id: newId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'New Applications',
      hrNotes: [
        `${new Date().toISOString().split('T')[0]} (System): Application received via ITIS Careers Portal. Confirmation email sent to ${appData.applicantEmail}.`
      ],
      rating: 3
    };

    this.applications.unshift(newApp);
    this.saveApplications();

    return {
      success: true,
      applicationId: newId,
      message: `Your application for "${appData.vacancyTitle}" has been successfully submitted! Your reference code is ${newId}. A confirmation email has been dispatched via the ITIS Central Identity & Email Service.`
    };
  }

  public getApplications(): JobApplication[] {
    return [...this.applications];
  }

  public updateApplicationStatus(id: string, newStatus: ApplicationStatus, note?: string): boolean {
    const app = this.applications.find(a => a.id === id);
    if (!app) return false;

    app.status = newStatus;
    const dateStr = new Date().toISOString().split('T')[0];
    app.hrNotes.unshift(`${dateStr} (HR ATS): Status updated to [${newStatus}]${note ? ` - ${note}` : ''}`);

    this.saveApplications();
    return true;
  }

  public addHrNote(id: string, noteText: string, rating?: number): boolean {
    const app = this.applications.find(a => a.id === id);
    if (!app) return false;

    const dateStr = new Date().toISOString().split('T')[0];
    app.hrNotes.unshift(`${dateStr} (HR Staff): ${noteText}`);
    if (rating !== undefined) {
      app.rating = rating;
    }

    this.saveApplications();
    return true;
  }

  public createVacancy(vacancyData: Omit<Vacancy, 'id'>): Vacancy {
    const newId = `VAC-2026-${Math.floor(300 + Math.random() * 700)}`;
    const newVac: Vacancy = {
      ...vacancyData,
      id: newId
    };

    this.vacancies.unshift(newVac);
    this.saveVacancies();
    return newVac;
  }
}

export const careersService = new CareersService();
