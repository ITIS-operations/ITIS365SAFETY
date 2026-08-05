/**
 * ITIS Enterprise Session Management & Device Security Service
 * ISO 27001 / Zero Trust Compliance
 */

export interface UserDeviceSession {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  deviceFingerprint: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
  mfaVerified: boolean;
}

// In-Memory Global Active Sessions Store
let activeSessions: UserDeviceSession[] = [
  {
    id: 'SES-001-CURRENT',
    userId: 'USR-8801',
    userEmail: 'mthokozisi@live.co.za',
    userName: 'Thabo Ndlovu',
    role: 'Parent',
    ipAddress: '105.224.18.92 (Johannesburg, RSA)',
    location: 'Johannesburg, Gauteng, ZA',
    browser: 'Chrome 122.0',
    os: 'macOS Sonoma',
    deviceType: 'Desktop',
    deviceFingerprint: 'FP-MAC-CHROME-8812',
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    isCurrentDevice: true,
    mfaVerified: true
  },
  {
    id: 'SES-002-MOBILE',
    userId: 'USR-8801',
    userEmail: 'mthokozisi@live.co.za',
    userName: 'Thabo Ndlovu',
    role: 'Parent',
    ipAddress: '102.132.22.11 (Sandton, RSA)',
    location: 'Sandton, ZA',
    browser: 'Safari Mobile',
    os: 'iOS 17.4',
    deviceType: 'Mobile',
    deviceFingerprint: 'FP-IPHONE-SAFARI-9910',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    isCurrentDevice: false,
    mfaVerified: true
  }
];

const sessionListeners: Set<() => void> = new Set();

export function subscribeSessions(callback: () => void): () => void {
  sessionListeners.add(callback);
  return () => sessionListeners.delete(callback);
}

function notifySessionListeners() {
  sessionListeners.forEach(fn => fn());
}

export function getCurrentDeviceDetails(): { ip: string; browser: string; os: string; location: string; fingerprint: string } {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js Server Environment';
  
  let browser = 'Chrome/Edge';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';

  let os = 'Windows/Linux';
  if (userAgent.includes('Macintosh') || userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Android')) os = 'Android';

  return {
    ip: '105.224.18.92',
    browser,
    os,
    location: 'Gauteng, South Africa',
    fingerprint: `FP-${os.toUpperCase()}-${browser.toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`
  };
}

export function registerSession(userId: string, email: string, name: string, role: string, mfaVerified: boolean): UserDeviceSession {
  const currentDetails = getCurrentDeviceDetails();
  const sessionId = `SES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Mark all existing as not current
  activeSessions = activeSessions.map(s => s.userId === userId ? { ...s, isCurrentDevice: false } : s);

  const newSession: UserDeviceSession = {
    id: sessionId,
    userId,
    userEmail: email,
    userName: name,
    role,
    ipAddress: currentDetails.ip,
    location: currentDetails.location,
    browser: currentDetails.browser,
    os: currentDetails.os,
    deviceType: currentDetails.os === 'iOS' || currentDetails.os === 'Android' ? 'Mobile' : 'Desktop',
    deviceFingerprint: currentDetails.fingerprint,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    isCurrentDevice: true,
    mfaVerified
  };

  activeSessions.unshift(newSession);
  notifySessionListeners();
  return newSession;
}

export function listUserSessions(emailOrUserId: string): UserDeviceSession[] {
  return activeSessions.filter(s => s.userEmail.toLowerCase() === emailOrUserId.toLowerCase() || s.userId === emailOrUserId);
}

export function listAllGlobalSessions(): UserDeviceSession[] {
  return [...activeSessions];
}

export function revokeSession(sessionId: string): boolean {
  const initialCount = activeSessions.length;
  activeSessions = activeSessions.filter(s => s.id !== sessionId);
  notifySessionListeners();
  return activeSessions.length < initialCount;
}

export function revokeAllUserSessionsExceptCurrent(userId: string, currentSessionId?: string): number {
  const beforeCount = activeSessions.length;
  activeSessions = activeSessions.filter(s => s.userId !== userId || s.isCurrentDevice || s.id === currentSessionId);
  const revokedCount = beforeCount - activeSessions.length;
  notifySessionListeners();
  return revokedCount;
}

export function updateSessionActivity(sessionId: string): void {
  activeSessions = activeSessions.map(s => s.id === sessionId ? { ...s, lastActiveAt: new Date().toISOString() } : s);
  notifySessionListeners();
}
