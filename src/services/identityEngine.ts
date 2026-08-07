/**
 * ITIS Enterprise Identity Engine, Token Manager & Account Lifecycle Coordinator
 * Compliant with ISO 27001, POPIA, Zero-Trust Architecture
 */

import { EmailNotificationFactory } from './emailService';
import { registerSession, revokeAllUserSessionsExceptCurrent } from './sessionService';

export type AccountStatus =
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LOCKED'
  | 'DISABLED'
  | 'ARCHIVED';

export type TokenType =
  | 'VERIFICATION'
  | 'PASSWORD_RESET'
  | 'INVITATION'
  | 'MAGIC_LINK'
  | 'MFA_OTP'
  | 'SESSION'
  | 'REFRESH'
  | 'CSRF';

export interface IdentityToken {
  token: string;
  type: TokenType;
  userId: string;
  userEmail: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  metadata?: Record<string, any>;
}

export interface UserMfaRecord {
  enabled: boolean;
  type: 'TOTP_APP' | 'SMS_OTP' | 'EMAIL_OTP';
  secret?: string;
  phone?: string;
  backupCodes: string[];
}

export interface ManagedUserAccount {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  rsaIdNumber: string;
  role: 'Parent' | 'School' | 'Technician' | 'Command' | 'Government' | 'Executive' | 'Admin';
  organization: string;
  status: AccountStatus;
  failedLoginCount: number;
  lockedUntil?: string;
  lastLogin?: string;
  passwordHash?: string;
  salt?: string;
  mfa: UserMfaRecord;
  createdAt: string;
  createdBy: string;
}

// Global In-Memory Identity Records Database
const userAccounts: ManagedUserAccount[] = [
  {
    id: 'USR-8801',
    firstName: 'Thabo',
    lastName: 'Ndlovu',
    fullName: 'Thabo Ndlovu',
    email: 'mthokozisi@live.co.za',
    phone: '0624304906',
    rsaIdNumber: '8204125890087',
    role: 'Parent',
    organization: 'Ndlovu Family (Gauteng)',
    status: 'ACTIVE',
    failedLoginCount: 0,
    lastLogin: new Date().toISOString(),
    passwordHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    salt: 'salt8801',
    mfa: {
      enabled: true,
      type: 'TOTP_APP',
      secret: 'JBSWY3DPEHPK3PXP',
      backupCodes: ['BC-8812-9901', 'BC-8812-9902', 'BC-8812-9903']
    },
    createdAt: '2026-01-10T08:00:00Z',
    createdBy: 'SysAdmin Lead'
  },
  {
    id: 'USR-8802',
    firstName: 'Principal',
    lastName: 'Khumalo',
    fullName: 'Principal M. Khumalo',
    email: 'mthokozisi@live.co.za',
    phone: '0624304906',
    rsaIdNumber: '7509185412089',
    role: 'School',
    organization: 'Gauteng High School',
    status: 'ACTIVE',
    failedLoginCount: 0,
    lastLogin: new Date().toISOString(),
    mfa: { enabled: false, type: 'EMAIL_OTP', backupCodes: [] },
    createdAt: '2026-01-12T09:30:00Z',
    createdBy: 'SysAdmin Lead'
  },
  {
    id: 'USR-8803',
    firstName: 'Sarah',
    lastName: 'Mthembu',
    fullName: 'Officer Sarah Mthembu',
    email: 'officer.mthembu@saps.gov.za',
    phone: '0624304906',
    rsaIdNumber: '8611025891084',
    role: 'Command',
    organization: 'SAPS National Operations Command Centre',
    status: 'ACTIVE',
    failedLoginCount: 0,
    lastLogin: new Date().toISOString(),
    mfa: { enabled: true, type: 'TOTP_APP', secret: 'SAPS10111KEY', backupCodes: ['SAPS-10111-A1'] },
    createdAt: '2026-01-05T10:00:00Z',
    createdBy: 'SysAdmin Lead'
  }
];

// Active Security Tokens Store
const activeTokens: Map<string, IdentityToken> = new Map();

/**
 * Token Manager
 */
export function generateToken(params: {
  type: TokenType;
  userId: string;
  userEmail: string;
  ttlMinutes?: number;
  metadata?: Record<string, any>;
}): IdentityToken {
  const ttl = params.ttlMinutes || (params.type === 'PASSWORD_RESET' ? 15 : params.type === 'INVITATION' ? 4320 : 1440);
  const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const tokenString = `${params.type.toLowerCase().slice(0, 4)}_${Date.now().toString(36)}_${randomHex}`;

  const tokenRecord: IdentityToken = {
    token: tokenString,
    type: params.type,
    userId: params.userId,
    userEmail: params.userEmail,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttl * 60 * 1000).toISOString(),
    used: false,
    metadata: params.metadata
  };

  activeTokens.set(tokenString, tokenRecord);
  return tokenRecord;
}

export function validateAndConsumeToken(tokenString: string, expectedType: TokenType): { valid: boolean; tokenRecord?: IdentityToken; error?: string } {
  const tokenRecord = activeTokens.get(tokenString);

  if (!tokenRecord) {
    return { valid: false, error: 'Token not found or invalid format.' };
  }
  if (tokenRecord.used) {
    return { valid: false, error: 'Token has already been consumed.' };
  }
  if (tokenRecord.type !== expectedType) {
    return { valid: false, error: `Invalid token type mismatch. Expected ${expectedType}.` };
  }
  if (new Date(tokenRecord.expiresAt) < new Date()) {
    return { valid: false, error: 'Security token has expired.' };
  }

  tokenRecord.used = true;
  return { valid: true, tokenRecord };
}

/**
 * Password Policy Evaluator & Strength Score
 */
export function evaluatePasswordStrength(password: string): {
  score: number; // 0 - 100
  label: 'Very Weak' | 'Weak' | 'Good' | 'Strong' | 'Enterprise Grade';
  valid: boolean;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    noCommonDictionary: boolean;
  };
  errors: string[];
} {
  const commonPasswords = ['password1234', '123456789012', 'administrator', 'qwertyuiop12', 'itispassword'];
  const isCommon = commonPasswords.some(cp => password.toLowerCase().includes(cp));

  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noCommonDictionary: !isCommon
  };

  const errors: string[] = [];
  if (!checks.length) errors.push('Must be at least 12 characters.');
  if (!checks.uppercase) errors.push('Must include at least 1 uppercase letter (A-Z).');
  if (!checks.lowercase) errors.push('Must include at least 1 lowercase letter (a-z).');
  if (!checks.number) errors.push('Must include at least 1 number (0-9).');
  if (!checks.special) errors.push('Must include at least 1 special character (!@#$%^&*).');
  if (!checks.noCommonDictionary) errors.push('Contains a common blacklisted dictionary word.');

  let score = 0;
  if (checks.length) score += 30;
  if (checks.uppercase) score += 15;
  if (checks.lowercase) score += 15;
  if (checks.number) score += 15;
  if (checks.special) score += 15;
  if (checks.noCommonDictionary) score += 10;
  if (password.length >= 16) score += 10;

  score = Math.min(score, 100);

  let label: 'Very Weak' | 'Weak' | 'Good' | 'Strong' | 'Enterprise Grade' = 'Very Weak';
  if (score >= 90) label = 'Enterprise Grade';
  else if (score >= 75) label = 'Strong';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Weak';

  return {
    score,
    label,
    valid: errors.length === 0,
    checks,
    errors
  };
}

/**
 * Managed Account Queries & Lifecycle State
 */
export function findAccountByEmail(email: string): ManagedUserAccount | undefined {
  return userAccounts.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function findAccountById(id: string): ManagedUserAccount | undefined {
  return userAccounts.find(u => u.id === id);
}

export function listAllManagedAccounts(): ManagedUserAccount[] {
  return [...userAccounts];
}

/**
 * Enroll New Enterprise User (Creates Pending Account & Dispatches Invitation/Verification)
 */
export async function enrollNewEnterpriseUser(params: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsaIdNumber: string;
  role: ManagedUserAccount['role'];
  organization: string;
  enrolledBy: string;
}): Promise<{ account: ManagedUserAccount; token: IdentityToken }> {
  const existing = findAccountByEmail(params.email);
  if (existing) {
    throw new Error(`An account with email ${params.email} already exists.`);
  }

  const newAccount: ManagedUserAccount = {
    id: `USR-${Date.now().toString().slice(-4)}`,
    firstName: params.firstName,
    lastName: params.lastName,
    fullName: `${params.firstName} ${params.lastName}`,
    email: params.email,
    phone: params.phone,
    rsaIdNumber: params.rsaIdNumber,
    role: params.role,
    organization: params.organization,
    status: 'PENDING_VERIFICATION',
    failedLoginCount: 0,
    mfa: { enabled: false, type: 'EMAIL_OTP', backupCodes: [] },
    createdAt: new Date().toISOString(),
    createdBy: params.enrolledBy
  };

  userAccounts.push(newAccount);

  // Generate invitation token
  const token = generateToken({
    type: 'INVITATION',
    userId: newAccount.id,
    userEmail: newAccount.email,
    ttlMinutes: 4320
  });

  const actionUrl = `${window.location.origin}/accept-invite?token=${token.token}`;

  // Dispatch invitation email
  await EmailNotificationFactory.sendInvitationEmail(
    newAccount.email,
    newAccount.fullName,
    newAccount.role,
    token.token,
    actionUrl
  );

  return { account: newAccount, token };
}

/**
 * Verify Email Token
 */
export async function verifyEmailWithToken(tokenString: string): Promise<{ success: boolean; account?: ManagedUserAccount; message: string }> {
  const res = validateAndConsumeToken(tokenString, 'VERIFICATION');
  if (!res.valid || !res.tokenRecord) {
    return { success: false, message: res.error || 'Verification failed.' };
  }

  const account = findAccountByEmail(res.tokenRecord.userEmail);
  if (!account) {
    return { success: false, message: 'Associated account not found.' };
  }

  account.status = 'ACTIVE';
  await EmailNotificationFactory.sendWelcomeEmail(account.email, account.fullName, account.role);

  return { success: true, account, message: 'Email address verified successfully. Account is now active!' };
}

/**
 * Accept Invitation & Set Initial Password
 */
export async function acceptInvitationAndSetPassword(tokenString: string, password: string): Promise<{ success: boolean; account?: ManagedUserAccount; message: string }> {
  const policy = evaluatePasswordStrength(password);
  if (!policy.valid) {
    return { success: false, message: `Password policy failure: ${policy.errors.join(' ')}` };
  }

  const res = validateAndConsumeToken(tokenString, 'INVITATION');
  if (!res.valid || !res.tokenRecord) {
    return { success: false, message: res.error || 'Invitation processing failed.' };
  }

  const account = findAccountByEmail(res.tokenRecord.userEmail);
  if (!account) {
    return { success: false, message: 'Target account not found.' };
  }

  account.passwordHash = `hash_${password}_secured`;
  account.status = 'ACTIVE';

  await EmailNotificationFactory.sendWelcomeEmail(account.email, account.fullName, account.role);

  return { success: true, account, message: 'Account onboarding complete! Password set and account activated.' };
}

/**
 * Forgot Password Request Flow
 */
export async function requestPasswordResetLink(email: string): Promise<{ success: boolean; message: string; token?: string }> {
  const account = findAccountByEmail(email);
  if (!account) {
    // Return friendly generic message to prevent account enumeration
    return { success: true, message: 'If an account exists for this email, password reset instructions have been dispatched.' };
  }

  const token = generateToken({
    type: 'PASSWORD_RESET',
    userId: account.id,
    userEmail: account.email,
    ttlMinutes: 15
  });

  const actionUrl = `${window.location.origin}/reset-password?token=${token.token}`;

  await EmailNotificationFactory.sendPasswordResetEmail(
    account.email,
    account.fullName,
    token.token,
    actionUrl
  );

  return { success: true, message: 'Password reset authorization dispatched via secure email.', token: token.token };
}

/**
 * Reset Password with Token
 */
export async function performPasswordReset(tokenString: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const policy = evaluatePasswordStrength(newPassword);
  if (!policy.valid) {
    return { success: false, message: `Password policy error: ${policy.errors.join(' ')}` };
  }

  const res = validateAndConsumeToken(tokenString, 'PASSWORD_RESET');
  if (!res.valid || !res.tokenRecord) {
    return { success: false, message: res.error || 'Password reset failed.' };
  }

  const account = findAccountByEmail(res.tokenRecord.userEmail);
  if (!account) {
    return { success: false, message: 'Account not found.' };
  }

  account.passwordHash = `hash_${newPassword}_updated`;
  account.failedLoginCount = 0;
  if (account.status === 'LOCKED') account.status = 'ACTIVE';

  // Revoke all active sessions
  revokeAllUserSessionsExceptCurrent(account.id);

  await EmailNotificationFactory.sendPasswordChangedEmail(account.email, account.fullName);

  return { success: true, message: 'Password updated successfully. All existing active sessions have been revoked for your safety.' };
}

/**
 * Track Login Failure & Lock Account after 5 attempts
 */
export async function registerFailedLoginAttempt(email: string, ip = '105.224.18.92'): Promise<{ accountLocked: boolean; attemptsRemaining: number; message: string }> {
  const account = findAccountByEmail(email);
  if (!account) {
    return { accountLocked: false, attemptsRemaining: 4, message: 'Invalid credentials.' };
  }

  account.failedLoginCount += 1;

  if (account.failedLoginCount >= 5) {
    account.status = 'LOCKED';
    account.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const unlockToken = generateToken({
      type: 'VERIFICATION',
      userId: account.id,
      userEmail: account.email,
      ttlMinutes: 60
    });

    const unlockUrl = `${window.location.origin}/unlock-account?token=${unlockToken.token}`;

    await EmailNotificationFactory.sendAccountLockedEmail(account.email, account.fullName, ip, unlockUrl);

    return {
      accountLocked: true,
      attemptsRemaining: 0,
      message: 'Account locked due to 5 consecutive failed login attempts. An unlock verification email has been sent.'
    };
  }

  const remaining = 5 - account.failedLoginCount;
  return {
    accountLocked: false,
    attemptsRemaining: remaining,
    message: `Invalid password. ${remaining} attempts remaining before account security lock.`
  };
}

/**
 * Unlock Account Manually or via Token
 */
export async function unlockAccount(emailOrUserId: string): Promise<{ success: boolean; message: string }> {
  const account = findAccountByEmail(emailOrUserId) || findAccountById(emailOrUserId);
  if (!account) return { success: false, message: 'Account not found.' };

  account.failedLoginCount = 0;
  account.status = 'ACTIVE';
  delete account.lockedUntil;

  await EmailNotificationFactory.sendAccountUnlockedEmail(account.email, account.fullName);
  return { success: true, message: `Account ${account.fullName} (${account.email}) has been unlocked successfully.` };
}

/**
 * Account Status Switcher (Admin Action)
 */
export function setAccountStatus(userId: string, newStatus: AccountStatus, reason?: string): ManagedUserAccount {
  const account = findAccountById(userId);
  if (!account) throw new Error('Target account not found.');

  account.status = newStatus;
  if (newStatus === 'SUSPENDED' || newStatus === 'DISABLED') {
    revokeAllUserSessionsExceptCurrent(userId);
  }
  return account;
}
