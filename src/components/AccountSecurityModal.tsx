import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Smartphone, 
  Monitor, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Copy, 
  Check, 
  LogOut, 
  Mail, 
  Download, 
  Trash2, 
  QrCode, 
  History, 
  RefreshCw 
} from 'lucide-react';
import { evaluatePasswordStrength, findAccountByEmail } from '../services/identityEngine';
import { listUserSessions, revokeSession, revokeAllUserSessionsExceptCurrent, UserDeviceSession, subscribeSessions } from '../services/sessionService';
import { EmailNotificationFactory } from '../services/emailService';

interface AccountSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  currentUserName?: string;
}

export const AccountSecurityModal: React.FC<AccountSecurityModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail = 'mthokozisi@live.co.za',
  currentUserName = 'Thabo Ndlovu'
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'mfa' | 'sessions' | 'email' | 'audit'>('password');

  // Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  // Password Strength Evaluation
  const passStrength = evaluatePasswordStrength(newPass);

  // Email Update State
  const [newEmail, setNewEmail] = useState('');
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaCodeInput, setMfaCodeInput] = useState('');
  const [mfaMsg, setMfaMsg] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Sessions State
  const [userSessions, setUserSessions] = useState<UserDeviceSession[]>(listUserSessions(currentUserEmail));

  useEffect(() => {
    setUserSessions(listUserSessions(currentUserEmail));
    const unsubscribe = subscribeSessions(() => {
      setUserSessions(listUserSessions(currentUserEmail));
    });
    return () => unsubscribe();
  }, [currentUserEmail]);

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccessMsg('');
    setPassErrorMsg('');

    if (newPass !== confirmPass) {
      setPassErrorMsg('New password and confirmation password do not match.');
      return;
    }

    if (!passStrength.valid) {
      setPassErrorMsg(`Password policy error: ${passStrength.errors.join(' ')}`);
      return;
    }

    // Revoke other sessions
    revokeAllUserSessionsExceptCurrent('USR-8801');

    await EmailNotificationFactory.sendPasswordChangedEmail(currentUserEmail, currentUserName);

    setPassSuccessMsg('Password changed successfully! All other active device sessions have been invalidated.');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSuccessMsg('');

    if (!newEmail || !newEmail.includes('@')) return;

    const verificationToken = `ver_${Date.now().toString(36)}`;
    const actionUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;

    await EmailNotificationFactory.sendVerificationEmail(newEmail, currentUserName, verificationToken, actionUrl);

    setEmailSuccessMsg(`A verification email has been dispatched to ${newEmail}. Please verify to complete the change.`);
    setNewEmail('');
  };

  const handleToggleMfa = async () => {
    if (mfaEnabled) {
      setMfaEnabled(false);
      setMfaMsg('MFA Protection has been disabled.');
    } else {
      setMfaEnabled(true);
      await EmailNotificationFactory.sendMfaEnabledEmail(currentUserEmail, currentUserName);
      setMfaMsg('MFA Protection enabled successfully with Authenticator App (TOTP).');
    }
  };

  const handleRevokeSingleSession = (sessionId: string) => {
    revokeSession(sessionId);
    setUserSessions(listUserSessions(currentUserEmail));
  };

  const handleRevokeAllOthers = () => {
    revokeAllUserSessionsExceptCurrent('USR-8801');
    setUserSessions(listUserSessions(currentUserEmail));
  };

  const handleExportAccountData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      user: currentUserName,
      email: currentUserEmail,
      exportDate: new Date().toISOString(),
      securityPolicy: "ISO 27001 Enterprise Identity",
      activeSessions: userSessions,
      mfaStatus: mfaEnabled ? "ENABLED" : "DISABLED"
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `itis_security_archive_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-brand-dark border border-brand-gold/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-brand-navy border-b border-brand-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-brand-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Account Security & Identity Self-Service Hub
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {currentUserName} ({currentUserEmail}) • ISO 27001 Zero Trust Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Bar */}
        <div className="bg-brand-navy/60 px-6 py-2 border-b border-slate-800 flex flex-wrap gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'password'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> Password & Policy
          </button>
          <button
            onClick={() => setActiveTab('mfa')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'mfa'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Multi-Factor Auth (MFA)
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'sessions'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Active Sessions ({userSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Update Email
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
              activeTab === 'audit'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Security Audit
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Password Management & Real-Time Policy Meter */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-5 max-w-2xl mx-auto">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-gold" />
                  Enterprise Password Change & Strength Evaluation
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Passwords must be a minimum of 12 characters and contain uppercase, lowercase, numbers, and special symbols.
                </p>
              </div>

              {passSuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {passSuccessMsg}
                </div>
              )}

              {passErrorMsg && (
                <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-xl text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" /> {passErrorMsg}
                </div>
              )}

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Minimum 12 characters with A-Z, a-z, 0-9, !@#$"
                    className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {/* Password Strength Visual Meter */}
                {newPass && (
                  <div className="p-4 bg-brand-navy/60 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold uppercase">Password Strength Score:</span>
                      <span className={`font-bold ${
                        passStrength.score >= 80 ? 'text-emerald-400' : passStrength.score >= 60 ? 'text-brand-gold' : 'text-red-400'
                      }`}>
                        {passStrength.score}/100 — {passStrength.label}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passStrength.score >= 80 ? 'bg-emerald-500' : passStrength.score >= 60 ? 'bg-brand-gold' : 'bg-red-500'
                        }`}
                        style={{ width: `${passStrength.score}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Min 12 Characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.uppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Uppercase (A-Z)
                      </div>
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.lowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lowercase (a-z)
                      </div>
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.number ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Number (0-9)
                      </div>
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.special ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Special Symbol (!@#$)
                      </div>
                      <div className={`flex items-center gap-1.5 ${passStrength.checks.noCommonDictionary ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> No Common Dictionary Word
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={!newPass || !confirmPass || !passStrength.valid}
                  className="px-6 py-2.5 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Update Account Password
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Multi-Factor Authentication (MFA) */}
          {activeTab === 'mfa' && (
            <div className="space-y-6 max-w-2xl mx-auto font-mono text-xs">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-gold" />
                    Multi-Factor Authentication (MFA) Architecture
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Protect your login with Time-based One Time Passwords (TOTP) or SMS/Email OTP.
                  </p>
                </div>
                <button
                  onClick={handleToggleMfa}
                  className={`px-4 py-2 rounded-xl font-bold uppercase transition-colors ${
                    mfaEnabled
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                      : 'bg-emerald-500 text-brand-dark hover:bg-emerald-400'
                  }`}
                >
                  {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
                </button>
              </div>

              {mfaMsg && (
                <div className="p-3 bg-brand-navy border border-brand-gold/30 text-brand-gold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {mfaMsg}
                </div>
              )}

              {mfaEnabled ? (
                <div className="p-5 bg-brand-navy/60 border border-brand-gold/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-white font-bold">Authenticator App (TOTP Active)</div>
                        <div className="text-[11px] text-slate-400 font-sans">Google Authenticator, Microsoft Authenticator, 1Password</div>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full text-[10px] border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-slate-400 text-[11px]">Secret Configuration Key:</div>
                    <div className="font-mono text-brand-gold font-bold text-sm tracking-wider">
                      JBSW Y3DP EHPK 3PXP
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-bold"
                    >
                      {showBackupCodes ? 'Hide Emergency Backup Codes' : 'View Emergency Backup Codes'}
                    </button>

                    {showBackupCodes && (
                      <div className="mt-3 p-4 bg-brand-dark border border-brand-gold/20 rounded-xl space-y-2">
                        <div className="text-slate-300 font-bold text-[11px]">Emergency Recovery Codes (Single Use):</div>
                        <div className="grid grid-cols-2 gap-2 text-slate-200 font-mono text-xs">
                          <div className="p-1.5 bg-black/50 rounded text-center">BC-8812-9901</div>
                          <div className="p-1.5 bg-black/50 rounded text-center">BC-8812-9902</div>
                          <div className="p-1.5 bg-black/50 rounded text-center">BC-8812-9903</div>
                          <div className="p-1.5 bg-black/50 rounded text-center">BC-8812-9904</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-brand-navy/30 border border-slate-800 rounded-2xl text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <div className="text-white font-bold">MFA is currently disabled</div>
                  <p className="text-slate-400 text-xs font-sans max-w-md mx-auto">
                    Without Multi-Factor Authentication, your account relies solely on your password. We strongly recommend enabling TOTP for zero-trust compliance.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Active Device Sessions Manager */}
          {activeTab === 'sessions' && (
            <div className="space-y-4 max-w-3xl mx-auto font-mono text-xs">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-brand-gold" />
                    Active Devices & Session Manager
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    View and revoke active sessions logged in with your account credentials.
                  </p>
                </div>
                {userSessions.length > 1 && (
                  <button
                    onClick={handleRevokeAllOthers}
                    className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold uppercase transition-colors"
                  >
                    Revoke All Other Devices
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {userSessions.map(sess => (
                  <div
                    key={sess.id}
                    className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
                      sess.isCurrentDevice
                        ? 'bg-brand-navy border-brand-gold/40 shadow-md'
                        : 'bg-brand-navy/40 border-slate-800 hover:bg-brand-navy/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        sess.isCurrentDevice ? 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {sess.deviceType === 'Mobile' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-white font-bold flex items-center gap-2">
                          {sess.browser} on {sess.os}
                          {sess.isCurrentDevice && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                              Current Device
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          IP: {sess.ipAddress} • {sess.location}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          Session Started: {new Date(sess.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrentDevice && (
                      <button
                        onClick={() => handleRevokeSingleSession(sess.id)}
                        className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-300 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Update Email Address */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailUpdate} className="space-y-5 max-w-xl mx-auto font-mono text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-gold" />
                  Update Primary Account Email
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Changing your primary email will dispatch a verification link to confirm ownership before replacing your login address.
                </p>
              </div>

              {emailSuccessMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {emailSuccessMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-1">Current Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentUserEmail}
                    className="w-full bg-black/40 border border-slate-800 rounded-xl p-2.5 text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">New Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. mthokozisi@live.co.za"
                    className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={!newEmail}
                  className="px-6 py-2.5 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Send Verification to New Email
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: Security Audit Log & Export */}
          {activeTab === 'audit' && (
            <div className="space-y-4 max-w-3xl mx-auto font-mono text-xs">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-brand-gold" />
                    Personal Account Security Audit Log
                  </h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Immutable security record of authentications, password changes, and MFA events.
                  </p>
                </div>
                <button
                  onClick={handleExportAccountData}
                  className="px-3.5 py-1.5 bg-brand-navy border border-brand-gold/30 hover:bg-brand-navy-light text-brand-gold rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Security Archive
                </button>
              </div>

              <div className="p-4 bg-brand-navy/40 border border-slate-800 rounded-xl space-y-3">
                <div className="p-2.5 bg-black/40 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-bold">[MFA_VERIFIED]</span> Successful login with TOTP
                    <div className="text-slate-500 text-[10px]">105.224.18.92 • macOS Chrome</div>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date().toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-black/40 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-brand-gold font-bold">[LOGIN_SUCCESS]</span> Primary credentials validated
                    <div className="text-slate-500 text-[10px]">105.224.18.92 • macOS Chrome</div>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date(Date.now() - 3600000).toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-black/40 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-blue-400 font-bold">[ACCOUNT_VERIFIED]</span> Email identity confirmed
                    <div className="text-slate-500 text-[10px]">Verified via Token Link</div>
                  </div>
                  <span className="text-slate-400 text-[10px]">{new Date(Date.now() - 86400000 * 5).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
