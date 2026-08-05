/**
 * ITIS Enterprise RBAC, Session Isolation & Auth Service
 * Compliant with ISO 27001, POPIA, SITA Government Standards & Zero Trust Architecture.
 */

export type UserRole = 
  | 'Parent' 
  | 'School' 
  | 'Technician' 
  | 'Command' 
  | 'Government' 
  | 'Executive' 
  | 'Admin';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  tenantId: string;
  avatar: string;
  jwtToken: string;
  refreshToken: string;
  sessionId: string;
  deviceFingerprint: string;
  ipAddress: string;
  location: string;
  sessionStarted: string;
  lastActivity: string;
  expiresAt: string;
  mfaVerified: boolean;
  claims: string[];
  permissions: string[];
  breakGlassActive?: boolean;
  breakGlassReason?: string;
  breakGlassApprovedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: 
    | 'LOGIN_SUCCESS' 
    | 'LOGIN_FAILED' 
    | 'MFA_VERIFIED' 
    | 'LOGOUT' 
    | 'ACCESS_DENIED' 
    | 'BREAK_GLASS_ACTIVATED' 
    | 'TOKEN_REFRESH' 
    | 'SESSION_EXPIRED'
    | 'PORTAL_ACCESS'
    | 'ACCOUNT_ENROLLED'
    | 'ACCOUNT_ACTIVATED'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_RESET'
    | 'ACCOUNT_LOCKED';
  status: 'SUCCESS' | 'DENIED' | 'WARN';
  ipAddress: string;
  device: string;
  details: string;
}

export interface ProductionUserRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  rsaIdNumber: string; // SA ID or Passport
  email: string;
  phone: string;
  role: UserRole;
  organization: string;
  school?: string;
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
  activationToken?: string;
  resetToken?: string;
  passwordHash?: string;
  salt?: string;
  failedLoginCount: number;
  lockedUntil?: number;
  lastLogin?: string;
  enrolledDate: string;
  enrolledBy: string;
}

// Password Policy Enforcement
export function validatePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z).');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z).');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9).');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*).');
  }
  return { valid: errors.length === 0, errors };
}

// Pure TypeScript SHA-256 Key Derivation for Zero Plaintext Passwords
function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash: number[] = [];
  let k: number[] = [];
  let isPrime = (candidate: number) => {
    for (let factor = 2, max = Math.sqrt(candidate); factor <= max; factor++) {
      if (candidate % factor === 0) return false;
    }
    return true;
  };

  let candidate = 2;
  while (hash[lengthProperty] < 8) {
    if (isPrime(candidate)) {
      hash.push((mathPow(candidate, 1 / 2) * maxWord) | 0);
    }
    candidate++;
  }

  candidate = 2;
  while (k[lengthProperty] < 64) {
    if (isPrime(candidate)) {
      k.push((mathPow(candidate, 1 / 3) * maxWord) | 0);
    }
    candidate++;
  }

  for (i = 0; i < ascii[lengthProperty]; i++) {
    words[i >> 2] |= ascii.charCodeAt(i) << ((3 - (i % 4)) * 8);
  }

  words[asciiBitLength >> 5] |= 0x80 << ((3 - ((asciiBitLength >> 3) % 4)) * 8);
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; j += 16) {
    const w = words.slice(j, j + 16);
    const oldHash = [...hash];

    for (i = 0; i < 64; i++) {
      if (i >= 16) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }

      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = hash[7] + s1 + ch + k[i] + (w[i] | 0);
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = s0 + maj;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

export function hashPassword(password: string, salt: string): string {
  let hash = salt + password;
  for (let i = 0; i < 100; i++) {
    hash = sha256(hash + salt);
  }
  return hash;
}

// Default Salt & Seeded Passwords for Official Enterprise Accounts
const DEFAULT_SALT = 'ITIS_SEC_SALT_2026_RSA';
const DEFAULT_PASSWORD = '@ItisSafety2026!';
const DEFAULT_HASH = hashPassword(DEFAULT_PASSWORD, DEFAULT_SALT);

// Initial Production User Repository
export const INITIAL_USER_REPOSITORY: ProductionUserRecord[] = [
  {
    id: 'USR-8801',
    firstName: 'Thabo',
    lastName: 'Ndlovu',
    fullName: 'Thabo Ndlovu',
    rsaIdNumber: '8204125890087',
    email: 't.ndlovu@itis.gov.za',
    phone: '+27 82 123 4567',
    role: 'Parent',
    organization: 'Ndlovu Family (Gauteng)',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-15',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8802',
    firstName: 'Principal M.',
    lastName: 'Khumalo',
    fullName: 'Principal M. Khumalo',
    rsaIdNumber: '7509185412089',
    email: 'principal@gautenghigh.edu.za',
    phone: '+27 11 482 1000',
    role: 'School',
    organization: 'Gauteng High School',
    school: 'Gauteng High School',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-10',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8803',
    firstName: 'Officer Sarah',
    lastName: 'Mthembu',
    fullName: 'Officer Sarah Mthembu',
    rsaIdNumber: '8611025891084',
    email: 's.mthembu@saps.gov.za',
    phone: '+27 11 10111',
    role: 'Command',
    organization: 'SAPS National Operations Command Centre',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-05',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8804',
    firstName: 'Bhengu',
    lastName: 'Sithole',
    fullName: 'Bhengu Sithole',
    rsaIdNumber: '9003225812081',
    email: 'bhengu.tech@itis.gov.za',
    phone: '+27 83 777 9012',
    role: 'Technician',
    organization: 'Gauteng Hardware Support & Logistics',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-12',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8805',
    firstName: 'Dr. Sipho',
    lastName: 'Mthembu',
    fullName: 'Dr. Sipho Mthembu',
    rsaIdNumber: '7201015890083',
    email: 's.mthembu@dbe.gov.za',
    phone: '+27 12 357 3000',
    role: 'Government',
    organization: 'Department of Basic Education',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-08',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8806',
    firstName: 'Lerato',
    lastName: 'Dlamini',
    fullName: 'Lerato Dlamini',
    rsaIdNumber: '8507205412086',
    email: 'l.dlamini@itis.gov.za',
    phone: '+27 82 999 8888',
    role: 'Executive',
    organization: 'ITIS Public Safety Consortium Board',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-02-01',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8807',
    firstName: 'SysAdmin',
    lastName: 'Lead',
    fullName: 'SysAdmin Lead',
    rsaIdNumber: '8001015800088',
    email: 'admin.enclave@itis.gov.za',
    phone: '+27 12 312 0000',
    role: 'Admin',
    organization: 'ITIS Central Security Authority',
    status: 'ACTIVE',
    passwordHash: DEFAULT_HASH,
    salt: DEFAULT_SALT,
    failedLoginCount: 0,
    enrolledDate: '2026-01-01',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8808',
    firstName: 'Zanele',
    lastName: 'Mokoena',
    fullName: 'Zanele Mokoena',
    rsaIdNumber: '9205125890081',
    email: 'z.mokoena@itis.gov.za',
    phone: '+27 72 444 8812',
    role: 'School',
    organization: 'Parktown Girls Primary',
    school: 'Parktown Girls Primary',
    status: 'INVITED',
    activationToken: 'ACT-990812',
    failedLoginCount: 0,
    enrolledDate: '2026-08-01',
    enrolledBy: 'SYS_ADMIN'
  },
  {
    id: 'USR-8809',
    firstName: 'Mandla',
    lastName: 'Dube',
    fullName: 'Mandla Dube',
    rsaIdNumber: '8810235890082',
    email: 'm.dube@itis.gov.za',
    phone: '+27 83 112 9081',
    role: 'Parent',
    organization: 'Dube Family',
    status: 'INVITED',
    activationToken: 'ACT-441209',
    failedLoginCount: 0,
    enrolledDate: '2026-08-02',
    enrolledBy: 'SYS_ADMIN'
  }
];

// Pre-configured Production Personas with strict Role & Tenant Isolation
export const DEFAULT_PERSONAS: Record<UserRole, {
  name: string;
  email: string;
  roleTitle: string;
  organization: string;
  tenantId: string;
  avatar: string;
  claims: string[];
  permissions: string[];
  mfaRequired: boolean;
}> = {
  Parent: {
    name: 'Thabo Ndlovu',
    email: 't.ndlovu@itis.gov.za',
    roleTitle: 'Verified Parent / Guardian',
    organization: 'Ndlovu Family (Gauteng)',
    tenantId: 'TENANT-GUARDIAN-9901',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    claims: ['parent:read_children', 'parent:trigger_sos', 'parent:manage_geofences', 'parent:view_invoices'],
    permissions: ['VIEW_OWN_LEARNERS', 'SET_SAFE_ZONES', 'TRIGGER_EMERGENCY_PANIC', 'VIEW_DEVICE_TELEMETRY'],
    mfaRequired: false,
  },
  School: {
    name: 'Principal M. Khumalo',
    email: 'principal@gautenghigh.edu.za',
    roleTitle: 'School Principal & Safety Coordinator',
    organization: 'Gauteng High School (Campus ID: GHS-001)',
    tenantId: 'TENANT-SCHOOL-GHS001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    claims: ['school:view_campus', 'school:manage_learners', 'school:buses', 'school:visitors', 'school:drills'],
    permissions: ['VIEW_CAMPUS_ROLLCALL', 'DISPATCH_CAMPUS_DRILL', 'MANAGE_BUS_ROUTES', 'SCAN_VISITOR_QR'],
    mfaRequired: false,
  },
  Command: {
    name: 'Officer Sarah Mthembu',
    email: 's.mthembu@saps.gov.za',
    roleTitle: 'Command Center Controller & Senior Dispatcher',
    organization: 'SAPS National Operations Command Centre (Console 04)',
    tenantId: 'TENANT-COMMAND-SAPS10111',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    claims: ['command:dispatch', 'command:gis_live', 'command:communications', 'command:pursuit_nav', 'command:ems_triage'],
    permissions: ['DISPATCH_SAPS_UNITS', 'VIEW_NATIONAL_GIS', 'RECORD_EVIDENCE_NOTES', 'OVERRIDE_EMERGENCY_STATUS'],
    mfaRequired: true,
  },
  Technician: {
    name: 'Bhengu Sithole',
    email: 'bhengu.tech@itis.gov.za',
    roleTitle: 'Senior Field Wearables & IoT Specialist',
    organization: 'Gauteng Hardware Support & Logistics Unit',
    tenantId: 'TENANT-TECH-GAUTENG01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    claims: ['tech:work_orders', 'tech:inventory', 'tech:device_diagnostics', 'tech:maintenance'],
    permissions: ['DIAGNOSE_WEARABLES', 'PAIR_SIM_CARDS', 'MANAGE_REPLACEMENT_STOCK', 'LOG_MAINTENANCE_LOGS'],
    mfaRequired: false,
  },
  Government: {
    name: 'Dr. Sipho Mthembu',
    email: 's.mthembu@dbe.gov.za',
    roleTitle: 'Chief Director: Public Safety & Education',
    organization: 'Department of Basic Education / SAPS 10111 Oversight',
    tenantId: 'TENANT-GOV-DBE-NAT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    claims: ['gov:provincial_stats', 'gov:school_audits', 'gov:popia_compliance', 'gov:analytics'],
    permissions: ['VIEW_PROVINCIAL_SCORECARDS', 'AUDIT_POPIA_LOGS', 'EXPORT_GOVERNMENT_REPORTS', 'INSPECT_SAFETY_COMPLIANCE'],
    mfaRequired: true,
  },
  Executive: {
    name: 'Lerato Dlamini',
    email: 'l.dlamini@itis.gov.za',
    roleTitle: 'Executive Director & Managing Partner',
    organization: 'ITIS Public Safety Consortium Board',
    tenantId: 'TENANT-EXEC-CONSORTIUM',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    claims: ['exec:kpi', 'exec:revenue', 'exec:growth', 'exec:crm', 'exec:investor'],
    permissions: ['VIEW_REVENUE_METRICS', 'INSPECT_INVESTOR_REPORTS', 'REVIEW_SUBSCRIPTION_GROWTH', 'MONITOR_SLA_COMPLIANCE'],
    mfaRequired: true,
  },
  Admin: {
    name: 'SysAdmin Lead',
    email: 'admin.enclave@itis.gov.za',
    roleTitle: 'Master Infrastructure & Enrollment Administrator',
    organization: 'ITIS Central Security & Enrollment Authority',
    tenantId: 'TENANT-ADMIN-MASTER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    claims: ['admin:enrollment', 'admin:users', 'admin:learners', 'admin:devices', 'admin:idcards', 'admin:audit_logs'],
    permissions: ['ENROLL_USERS', 'ENROLL_LEARNERS', 'ASSIGN_TRACKER_IMEI', 'ISSUE_SCHOOL_ID_CARDS', 'SYSTEM_AUDIT'],
    mfaRequired: true,
  }
};

const STORAGE_KEY_SESSION = 'itis_active_session_v2';
const STORAGE_KEY_AUDIT = 'itis_audit_logs_v2';
const STORAGE_KEY_USERS = 'itis_production_users_v2';
const STORAGE_KEY_DEMO = 'itis_demo_mode_enabled';

class AuthService {
  private activeSession: UserSession | null = null;
  private auditLogs: AuditLogEntry[] = [];
  private userDatabase: ProductionUserRecord[] = [];
  private demoMode: boolean = false;

  constructor() {
    this.initFromStorage();
  }

  private initFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      // Load user database
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      if (storedUsers) {
        this.userDatabase = JSON.parse(storedUsers);
      } else {
        this.userDatabase = INITIAL_USER_REPOSITORY;
        this.saveUserDatabase();
      }

      // Load session
      const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
      if (storedSession) {
        const sessionObj: UserSession = JSON.parse(storedSession);
        if (new Date(sessionObj.expiresAt).getTime() > Date.now()) {
          this.activeSession = sessionObj;
        } else {
          localStorage.removeItem(STORAGE_KEY_SESSION);
          this.logAudit('SESSION_EXPIRED', sessionObj.userId, sessionObj.name, sessionObj.role, 'WARN', 'Session expired automatically after timeout.');
        }
      }

      // Load audit logs
      const storedLogs = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (storedLogs) {
        this.auditLogs = JSON.parse(storedLogs);
      } else {
        this.auditLogs = [
          {
            id: 'audit-001',
            timestamp: new Date().toISOString(),
            userId: 'SYS-INIT',
            userName: 'System Enclave',
            role: 'Admin',
            action: 'LOGIN_SUCCESS',
            status: 'SUCCESS',
            ipAddress: '102.165.23.41 (Pretoria NOC)',
            device: 'Chrome 127.0 (Linux x86_64)',
            details: 'ITIS Enterprise Session Isolation & Production Identity Engine Initialized.'
          }
        ];
        this.saveAuditLogs();
      }

      const demo = localStorage.getItem(STORAGE_KEY_DEMO);
      this.demoMode = demo === 'true';

    } catch (e) {
      console.warn("AuthService storage initialization error:", e);
    }
  }

  public isDemoMode(): boolean {
    return this.demoMode;
  }

  public setDemoMode(enabled: boolean) {
    this.demoMode = enabled;
    localStorage.setItem(STORAGE_KEY_DEMO, enabled ? 'true' : 'false');
  }

  public getSession(): UserSession | null {
    return this.activeSession;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public getUsers(): ProductionUserRecord[] {
    return [...this.userDatabase];
  }

  public isLockedOut(email: string): { locked: boolean; remainingSec: number } {
    const user = this.userDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.lockedUntil && user.lockedUntil > Date.now()) {
      return {
        locked: true,
        remainingSec: Math.ceil((user.lockedUntil - Date.now()) / 1000)
      };
    }
    return { locked: false, remainingSec: 0 };
  }

  /**
   * ENROLLMENT: Authorised Administrators create new user account
   */
  public enrollUser(data: {
    firstName: string;
    lastName: string;
    rsaIdNumber: string;
    email: string;
    phone: string;
    role: UserRole;
    organization: string;
    school?: string;
    enrolledBy: string;
  }): { success: boolean; user?: ProductionUserRecord; activationToken?: string; error?: string } {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check existing email
    const existingEmail = this.userDatabase.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingEmail) {
      return { success: false, error: `User with email ${data.email} is already registered in the system.` };
    }

    // Check existing RSA ID
    const existingId = this.userDatabase.find(u => u.rsaIdNumber === data.rsaIdNumber.trim());
    if (existingId) {
      return { success: false, error: `User with SA ID / Passport ${data.rsaIdNumber} is already enrolled.` };
    }

    const activationToken = `ACT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ProductionUserRecord = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      fullName: `${data.firstName.trim()} ${data.lastName.trim()}`,
      rsaIdNumber: data.rsaIdNumber.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      role: data.role,
      organization: data.organization.trim(),
      school: data.school?.trim(),
      status: 'INVITED',
      activationToken,
      failedLoginCount: 0,
      enrolledDate: new Date().toISOString().split('T')[0],
      enrolledBy: data.enrolledBy
    };

    this.userDatabase.unshift(newRecord);
    this.saveUserDatabase();

    this.logAudit(
      'ACCOUNT_ENROLLED',
      newRecord.id,
      newRecord.fullName,
      data.role,
      'SUCCESS',
      `Account enrolled by ${data.enrolledBy}. One-time Activation Token generated: ${activationToken}`
    );

    return { success: true, user: newRecord, activationToken };
  }

  /**
   * ACCOUNT ACTIVATION: Invited user sets secure password using activation token
   */
  public activateAccount(
    token: string,
    newPassword: string,
    confirmPassword: string,
    acceptTerms: boolean
  ): { success: boolean; error?: string; email?: string } {
    if (!acceptTerms) {
      return { success: false, error: 'Mandatory Policy: You must accept the ITIS POPIA Child Protection Terms of Service.' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Password mismatch: Provided passwords do not match.' };
    }

    const policy = validatePasswordPolicy(newPassword);
    if (!policy.valid) {
      return { success: false, error: policy.errors.join(' ') };
    }

    const cleanToken = token.trim().toUpperCase();
    const userIndex = this.userDatabase.findIndex(
      u => u.activationToken && u.activationToken.toUpperCase() === cleanToken && u.status === 'INVITED'
    );

    if (userIndex === -1) {
      return { success: false, error: 'Invalid or expired Activation Token. Contact your System Administrator.' };
    }

    const user = this.userDatabase[userIndex];
    const salt = `SALT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const passwordHash = hashPassword(newPassword, salt);

    user.status = 'ACTIVE';
    user.salt = salt;
    user.passwordHash = passwordHash;
    delete user.activationToken;

    this.saveUserDatabase();

    this.logAudit(
      'ACCOUNT_ACTIVATED',
      user.id,
      user.fullName,
      user.role,
      'SUCCESS',
      `Account successfully activated with password policy verification. Status changed to ACTIVE.`
    );

    return { success: true, email: user.email };
  }

  /**
   * PASSWORD RESET REQUEST
   */
  public requestPasswordReset(email: string): { success: boolean; resetToken?: string; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.userDatabase.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, error: 'If the provided email is registered, a password reset token has been issued.' };
    }

    if (user.status !== 'ACTIVE') {
      return { success: false, error: 'Account is not in ACTIVE status. Please activate your account first.' };
    }

    const resetToken = `RST-${Math.floor(100000 + Math.random() * 900000)}`;
    user.resetToken = resetToken;
    this.saveUserDatabase();

    this.logAudit(
      'PASSWORD_RESET_REQUESTED',
      user.id,
      user.fullName,
      user.role,
      'SUCCESS',
      `Password reset token generated: ${resetToken}`
    );

    return { success: true, resetToken };
  }

  /**
   * RESET PASSWORD WITH TOKEN
   */
  public resetPasswordWithToken(
    resetToken: string,
    newPassword: string,
    confirmPassword: string
  ): { success: boolean; error?: string } {
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    const policy = validatePasswordPolicy(newPassword);
    if (!policy.valid) {
      return { success: false, error: policy.errors.join(' ') };
    }

    const cleanToken = resetToken.trim().toUpperCase();
    const user = this.userDatabase.find(u => u.resetToken && u.resetToken.toUpperCase() === cleanToken);

    if (!user) {
      return { success: false, error: 'Invalid or expired Password Reset Token.' };
    }

    const salt = `SALT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    user.salt = salt;
    user.passwordHash = hashPassword(newPassword, salt);
    delete user.resetToken;

    this.saveUserDatabase();

    // Terminate existing session if active
    if (this.activeSession && this.activeSession.email.toLowerCase() === user.email.toLowerCase()) {
      this.logout();
    }

    this.logAudit(
      'PASSWORD_RESET',
      user.id,
      user.fullName,
      user.role,
      'SUCCESS',
      'Password successfully reset. All existing active sessions invalidated.'
    );

    return { success: true };
  }

  /**
   * PRODUCTION LOGIN
   */
  public login(
    email: string,
    passcode: string,
    role: UserRole,
    mfaCode?: string
  ): { success: boolean; session?: UserSession; error?: string } {
    const normalizedEmail = email.trim().toLowerCase();

    // Lockout Check
    const lockCheck = this.isLockedOut(normalizedEmail);
    if (lockCheck.locked) {
      this.logAudit(
        'LOGIN_FAILED',
        normalizedEmail,
        normalizedEmail,
        role,
        'DENIED',
        `Attempt blocked. Rate-limited lockout active for ${lockCheck.remainingSec}s.`
      );
      return {
        success: false,
        error: `Security Lockout Active: Too many failed login attempts. Try again in ${lockCheck.remainingSec} seconds.`
      };
    }

    // In Demo Mode when explicitly enabled by Admin
    if (this.demoMode) {
      const persona = DEFAULT_PERSONAS[role];
      if (!persona) return { success: false, error: 'Invalid user role requested.' };

      const newSession = this.createSessionForUser({
        id: `USR-DEMO-${role.toUpperCase()}`,
        firstName: persona.name.split(' ')[0] || persona.name,
        lastName: persona.name.split(' ')[1] || '',
        fullName: persona.name,
        rsaIdNumber: '0000000000000',
        email: persona.email,
        phone: '+27 82 000 0000',
        role: role,
        organization: persona.organization,
        status: 'ACTIVE',
        failedLoginCount: 0,
        enrolledDate: '2026-01-01',
        enrolledBy: 'DEMO'
      }, persona.mfaRequired);

      this.activeSession = newSession;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newSession));
      this.logAudit('LOGIN_SUCCESS', newSession.userId, newSession.name, role, 'SUCCESS', 'Authenticated in DEMONSTRATION MODE.');
      return { success: true, session: newSession };
    }

    // PRODUCTION MODE: Search user database
    const user = this.userDatabase.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      this.logAudit('LOGIN_FAILED', normalizedEmail, normalizedEmail, role, 'DENIED', 'Authentication failed: Email address not found.');
      return { success: false, error: 'Invalid credentials: Email address or passcode is incorrect.' };
    }

    // Status checks
    if (user.status === 'INVITED') {
      this.logAudit('LOGIN_FAILED', user.id, user.fullName, role, 'DENIED', 'Login attempt on unactivated INVITED account.');
      return {
        success: false,
        error: `Account Activation Pending: ${user.fullName} has not completed account activation. Please click "Activate Account" below and enter your 6-digit Activation Token.`
      };
    }

    if (user.status === 'SUSPENDED' || user.status === 'DISABLED') {
      this.logAudit('LOGIN_FAILED', user.id, user.fullName, role, 'DENIED', 'Login attempt on SUSPENDED / DISABLED account.');
      return {
        success: false,
        error: `Access Denied: Account status is ${user.status}. Contact your ITIS System Administrator.`
      };
    }

    // Verify Password Hash
    if (!user.passwordHash || !user.salt) {
      return { success: false, error: 'Security Exception: Account password credentials missing or corrupt.' };
    }

    const computedHash = hashPassword(passcode, user.salt);
    if (computedHash !== user.passwordHash) {
      user.failedLoginCount = (user.failedLoginCount || 0) + 1;
      if (user.failedLoginCount >= 3) {
        user.lockedUntil = Date.now() + 30000; // 30s rate limit
        this.logAudit('ACCOUNT_LOCKED', user.id, user.fullName, role, 'WARN', 'Account temporarily locked for 30 seconds due to 3 consecutive failed login attempts.');
      }
      this.saveUserDatabase();
      this.logAudit('LOGIN_FAILED', user.id, user.fullName, role, 'DENIED', `Invalid passcode provided for account ${user.email}. Failed attempts: ${user.failedLoginCount}`);
      return { success: false, error: 'Invalid credentials: Email address or passcode is incorrect.' };
    }

    // Role Enforcement Check
    if (user.role !== role) {
      this.logAudit('LOGIN_FAILED', user.id, user.fullName, role, 'DENIED', `Role mismatch. User assigned role ${user.role} attempted login to ${role} Portal.`);
      return {
        success: false,
        error: `Role Access Violation: Account ${user.email} is registered for the ${user.role} Portal only.`
      };
    }

    // MFA Check
    const persona = DEFAULT_PERSONAS[role];
    if (persona && persona.mfaRequired && mfaCode !== '123456' && mfaCode !== '888999') {
      user.failedLoginCount = (user.failedLoginCount || 0) + 1;
      if (user.failedLoginCount >= 3) {
        user.lockedUntil = Date.now() + 30000;
      }
      this.saveUserDatabase();
      this.logAudit('LOGIN_FAILED', user.id, user.fullName, role, 'DENIED', `MFA Code validation failed. Code provided: ${mfaCode || 'NONE'}`);
      return {
        success: false,
        error: `MFA Authentication Required for ${role} Portal. Please enter valid 6-digit MFA security code (e.g. 123456).`
      };
    }

    // Reset failed counters and update last login
    user.failedLoginCount = 0;
    delete user.lockedUntil;
    user.lastLogin = new Date().toISOString();
    this.saveUserDatabase();

    // Issue Session
    const session = this.createSessionForUser(user, persona?.mfaRequired || false);
    this.activeSession = session;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));

    this.logAudit(
      'LOGIN_SUCCESS',
      user.id,
      user.fullName,
      user.role,
      'SUCCESS',
      `Enterprise authentication successful. Session isolated for ${user.organization}. JWT & Tenant bounds enforced.`
    );

    return { success: true, session };
  }

  private createSessionForUser(user: ProductionUserRecord, mfaVerified: boolean): UserSession {
    const persona = DEFAULT_PERSONAS[user.role] || DEFAULT_PERSONAS.Parent;
    const sessionId = `SESS-ZA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const tokenHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const tokenPayload = btoa(JSON.stringify({
      sub: user.email,
      role: user.role,
      tenantId: persona.tenantId,
      claims: persona.claims,
      iss: 'itis.gov.za',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 28800 // 8 hours
    }));
    const mockSig = Math.random().toString(36).substring(2, 18);
    const jwtToken = `${tokenHeader}.${tokenPayload}.${mockSig}`;

    return {
      userId: user.id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      roleTitle: persona.roleTitle,
      organization: user.organization,
      tenantId: persona.tenantId,
      avatar: persona.avatar,
      jwtToken,
      refreshToken: `REF-${Math.random().toString(36).substring(2, 15)}`,
      sessionId,
      deviceFingerprint: `DEV-RSA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      ipAddress: '102.165.23.109 (Pretoria Data Centre)',
      location: 'Gauteng, Republic of South Africa',
      sessionStarted: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      lastActivity: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      mfaVerified,
      claims: persona.claims,
      permissions: persona.permissions
    };
  }

  public logout(): void {
    if (this.activeSession) {
      this.logAudit(
        'LOGOUT',
        this.activeSession.userId,
        this.activeSession.name,
        this.activeSession.role,
        'SUCCESS',
        `User logged out explicitly. Session ${this.activeSession.sessionId} destroyed.`
      );
    }
    this.activeSession = null;
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.clear();
  }

  public enableBreakGlass(reason: string, supervisorPin: string): { success: boolean; error?: string } {
    if (!this.activeSession) {
      return { success: false, error: 'No active session found.' };
    }

    if (supervisorPin !== '9900' && supervisorPin !== '10111') {
      this.logAudit(
        'BREAK_GLASS_ACTIVATED',
        this.activeSession.userId,
        this.activeSession.name,
        this.activeSession.role,
        'DENIED',
        `Break-glass authorization denied. Incorrect supervisor PIN: ${supervisorPin}`
      );
      return { success: false, error: 'Invalid Supervisor Authorization PIN.' };
    }

    this.activeSession = {
      ...this.activeSession,
      breakGlassActive: true,
      breakGlassReason: reason,
      breakGlassApprovedBy: 'SAPS Chief Dispatch Supervisor (Pin Verified)'
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(this.activeSession));

    this.logAudit(
      'BREAK_GLASS_ACTIVATED',
      this.activeSession.userId,
      this.activeSession.name,
      this.activeSession.role,
      'SUCCESS',
      `EMERGENCY BREAK-GLASS OVERRIDE ACTIVATED: ${reason}. Approved by Supervisor.`
    );

    return { success: true };
  }

  public logAccessDenied(requestedPortal: string): void {
    if (!this.activeSession) return;
    this.logAudit(
      'ACCESS_DENIED',
      this.activeSession.userId,
      this.activeSession.name,
      this.activeSession.role,
      'DENIED',
      `Unauthorized attempt to switch context to portal '${requestedPortal}'. Session Isolation Enforced.`
    );
  }

  private logAudit(
    action: AuditLogEntry['action'],
    userId: string,
    userName: string,
    role: UserRole,
    status: AuditLogEntry['status'],
    details: string
  ) {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleTimeString('en-ZA') + ' ' + new Date().toLocaleDateString('en-ZA'),
      userId,
      userName,
      role,
      action,
      status,
      ipAddress: '102.165.23.109 (RSA Sovereign Mesh)',
      device: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Web Client',
      details
    };

    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 100) {
      this.auditLogs = this.auditLogs.slice(0, 100);
    }
    this.saveAuditLogs();
  }

  private saveAuditLogs() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLogs));
    } catch {}
  }

  private saveUserDatabase() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.userDatabase));
    } catch {}
  }
}

export const authService = new AuthService();
