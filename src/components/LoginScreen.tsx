import React, { useState } from 'react';
import { 
  Shield, Fingerprint, Lock, Mail, AlertTriangle, Cpu, X, Key, CheckCircle2, Sliders,
  UserCheck, ArrowRight, ShieldCheck, Check, FileText, HelpCircle, RefreshCw, Send, Settings,
  Briefcase, GraduationCap, Users, Building2
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import { LandingPage } from './LandingPage';
import { UserRole, DEFAULT_PERSONAS, authService, validatePasswordPolicy } from '../services/authService';
import { AccountSecurityModal } from './AccountSecurityModal';
import { AuthFlowScreens } from './AuthFlowScreens';
import { registerFailedLoginAttempt, evaluatePasswordStrength } from '../services/identityEngine';
import { CareersCentre } from './CareersCentre';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole | 'EmergencyBypass') => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'activate' | 'reset'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Parent');
  
  // Careers & Recruitment Modal State in Login Gateway
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [careersTab, setCareersTab] = useState<'explore' | 'why-itis' | 'programmes' | 'ats'>('explore');
  
  // Login form states
  const [email, setEmail] = useState(DEFAULT_PERSONAS.Parent.email);
  const [password, setPassword] = useState('@ItisSafety2026!');
  const [mfaCode, setMfaCode] = useState('123456');
  
  // Activation form states
  const [actToken, setActToken] = useState('ACT-990812');
  const [actPassword, setActPassword] = useState('');
  const [actConfirmPassword, setActConfirmPassword] = useState('');
  const [actTermsAccepted, setActTermsAccepted] = useState(false);
  
  // Reset password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  
  // Modals & Identity Auth Flow States
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [authFlowMode, setAuthFlowMode] = useState<'ACCEPT_INVITE' | 'VERIFY_EMAIL' | 'RESET_PASSWORD' | 'UNLOCK_ACCOUNT' | 'MFA_CHALLENGE' | null>(null);
  const [activeToken, setActiveToken] = useState('');

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBiometricPending, setIsBiometricPending] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(authService.isDemoMode());

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEFAULT_PERSONAS[role].email);
    if (role === 'SuperAdmin') {
      setPassword('@ItisFounder2026!');
      setMfaCode('123456');
    } else {
      setPassword('@ItisSafety2026!');
      setMfaCode('123456');
    }
    setError(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const result = authService.login(
      email,
      password,
      selectedRole,
      DEFAULT_PERSONAS[selectedRole].mfaRequired ? mfaCode : undefined
    );

    if (result.success && result.session) {
      onLoginSuccess(selectedRole);
    } else {
      // Track failed attempt & check for lockout threshold
      const failedRes = await registerFailedLoginAttempt(email);
      if (failedRes.accountLocked) {
        setError(failedRes.message);
      } else {
        setError(`${result.error || 'Authentication failed.'} (${failedRes.attemptsRemaining} attempts remaining before account security lockout)`);
      }
    }
  };

  const handleSimulateActionToken = (url: string, token: string, category: string) => {
    setActiveToken(token);
    if (category === 'INVITATION' || category === 'GUARDIAN_INVITATION' || category === 'TECHNICIAN_INVITATION' || category === 'SCHOOL_ADMIN_INVITATION') {
      setAuthFlowMode('ACCEPT_INVITE');
    } else if (category === 'VERIFICATION') {
      setAuthFlowMode('VERIFY_EMAIL');
    } else if (category === 'PASSWORD_RESET') {
      setAuthFlowMode('RESET_PASSWORD');
    } else if (category === 'ACCOUNT_LOCKED') {
      setAuthFlowMode('UNLOCK_ACCOUNT');
    } else {
      setAuthFlowMode('VERIFY_EMAIL');
    }
  };

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const res = authService.activateAccount(
      actToken,
      actPassword,
      actConfirmPassword,
      actTermsAccepted
    );

    if (res.success) {
      setSuccessMessage(`Account Activated Successfully! You may now log in with ${res.email}.`);
      if (res.email) setEmail(res.email);
      setAuthMode('login');
      setPassword(actPassword);
      setActPassword('');
      setActConfirmPassword('');
    } else {
      setError(res.error || 'Account activation failed.');
    }
  };

  const handleRequestResetToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const res = authService.requestPasswordReset(resetEmail);
    if (res.success) {
      setResetStep(2);
      if (res.resetToken) setResetToken(res.resetToken);
      setSuccessMessage(`Password Reset Token issued for ${resetEmail}. Check token input below.`);
    } else {
      setError(res.error || 'Password reset request failed.');
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const res = authService.resetPasswordWithToken(
      resetToken,
      resetNewPassword,
      resetConfirmPassword
    );

    if (res.success) {
      setSuccessMessage('Password reset successfully! Log in with your new password.');
      setAuthMode('login');
      setPassword(resetNewPassword);
      setResetNewPassword('');
      setResetConfirmPassword('');
      setResetStep(1);
    } else {
      setError(res.error || 'Password reset failed.');
    }
  };

  const triggerBiometric = () => {
    setIsBiometricPending(true);
    setError(null);
    setTimeout(() => {
      setIsBiometricPending(false);
      const res = authService.login(email, password, selectedRole, '123456');
      if (res.success) {
        onLoginSuccess(selectedRole);
      } else {
        setError("Biometric match confirmed, but password verification failed for this account.");
      }
    }, 1000);
  };

  const toggleDemoMode = () => {
    const newDemo = !isDemoMode;
    setIsDemoMode(newDemo);
    authService.setDemoMode(newDemo);
  };

  // Password Policy Checks for Activation
  const actPolicy = validatePasswordPolicy(actPassword);

  return (
    <div className="relative min-h-screen bg-brand-dark font-sans">
      
      {/* Demo Mode Banner (if explicitly enabled by demonstrator) */}
      {isDemoMode && (
        <div className="bg-amber-500 text-brand-dark px-4 py-1.5 font-mono text-[11px] font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-2 z-50 relative shadow-lg">
          <Sliders className="w-3.5 h-3.5" />
          <span>DEMO MODE ENABLED – SIMULATED PUBLIC SAFETY DATA</span>
          <button onClick={toggleDemoMode} className="ml-4 underline hover:text-black cursor-pointer">Disable</button>
        </div>
      )}

      {/* Renders the full executive landing page flow */}
      <LandingPage onOpenLogin={(role) => {
        if (role && (role in DEFAULT_PERSONAS)) {
          handleRoleSelect(role as UserRole);
        }
        setAuthMode('login');
        setIsModalOpen(true);
      }} />

      {/* Portal Login Executive Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-heavy/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-lg glass-panel-heavy p-6 sm:p-8 rounded-3xl shadow-2xl transition-all duration-300 border-2 border-brand-gold glow-gold overflow-hidden max-h-[90vh] overflow-y-auto"
            id="login-card-modal"
          >
            {/* Close Modal Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-brand-navy transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title */}
            <div className="flex flex-col items-center mb-4 text-center">
              <img 
                src={itisLogo} 
                alt="ITIS Badge Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 border-brand-gold rounded-full shadow-2xl mb-2 glow-gold"
              />
              <h2 className="text-lg font-bold tracking-wider text-white font-mono">
                ITIS GUARDIAN NETWORK
              </h2>
              <p className="text-[10px] text-brand-gold tracking-widest uppercase font-mono">
                Integrated Technology Intelligence & Safety · Protecting Every Learner. Every Journey. Every Second.
              </p>
            </div>

            {/* Mode Selector Tabs (Sign In / Activate Account / Reset Password) */}
            <div className="flex items-center justify-center gap-1 bg-brand-navy p-1 rounded-xl border border-brand-gold/20 mb-4 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMessage(null); }}
                aria-label="Switch to Sign In mode"
                className={`flex-1 min-h-[44px] py-2 rounded-lg font-bold transition-all cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-brand-navy ${
                  authMode === 'login' 
                    ? 'bg-brand-gold text-brand-dark shadow' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('activate'); setError(null); setSuccessMessage(null); }}
                aria-label="Switch to Activate Account mode"
                className={`flex-1 min-h-[44px] py-2 rounded-lg font-bold transition-all cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-brand-navy ${
                  authMode === 'activate' 
                    ? 'bg-brand-gold text-brand-dark shadow' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Activate Account
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('reset'); setError(null); setSuccessMessage(null); }}
                aria-label="Switch to Reset Password mode"
                className={`flex-1 min-h-[44px] py-2 rounded-lg font-bold transition-all cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-brand-navy ${
                  authMode === 'reset' 
                    ? 'bg-brand-gold text-brand-dark shadow' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Reset Password
              </button>
            </div>

            {/* Status Messages */}
            {error && (
              <div role="alert" aria-live="assertive" className="mb-4 p-3 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 font-mono flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div role="status" aria-live="polite" className="mb-4 p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 font-mono flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* MODE 1: SIGN IN */}
            {authMode === 'login' && (
              <>
                {/* Portal Role Identity Selection */}
                <div className="mb-3">
                  <label className="block text-[10px] text-brand-gold font-mono uppercase tracking-widest mb-1.5 text-center">
                    Select Target Portal Identity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                    {(['Parent', 'School', 'Command', 'Technician', 'Government', 'Executive', 'Admin', 'SuperAdmin'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleSelect(role)}
                        aria-label={`Select ${role} identity portal`}
                        className={`min-h-[44px] p-2 rounded-lg border font-bold text-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-brand-dark ${
                          selectedRole === role 
                            ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-md' 
                            : 'bg-brand-navy/80 text-slate-300 border-slate-800 hover:border-brand-gold/40 hover:text-white'
                        }`}
                      >
                        {role === 'Parent' ? '🛡️ Guardian' : 
                         role === 'School' ? '🏫 School' : 
                         role === 'Command' ? '🛰️ Command' : 
                         role === 'Technician' ? '🔧 Tech' : 
                         role === 'Government' ? '🏛️ Gov' : 
                         role === 'Executive' ? '📊 Exec' : 
                         role === 'SuperAdmin' ? '👑 Founder' : '⚙️ Admin'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role Summary Banner */}
                <div className="p-2.5 bg-brand-navy rounded-xl border border-brand-gold/20 mb-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{DEFAULT_PERSONAS[selectedRole].name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-brand-dark text-brand-gold border border-brand-gold/30">
                      {selectedRole} Account
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{DEFAULT_PERSONAS[selectedRole].organization}</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3 font-mono text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-brand-silver mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-gold/60" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase text-brand-silver">Enterprise Passcode</label>
                      <span className="text-[9px] text-brand-gold/80">
                        Default: <code className="text-white font-bold">@ItisSafety2026!</code>
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-gold/60" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  {/* MFA Code if required */}
                  {DEFAULT_PERSONAS[selectedRole].mfaRequired && (
                    <div className="p-2.5 bg-brand-dark rounded-xl border border-brand-gold/30 space-y-1">
                      <label className="block text-[10px] uppercase text-brand-gold font-bold flex items-center gap-1">
                        <Key className="w-3 h-3 text-brand-gold" /> MFA 6-Digit Security Token
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-brand-navy border border-brand-gold/40 rounded px-3 py-1.5 text-xs text-white tracking-widest font-bold"
                      />
                      <span className="text-[9px] text-slate-400 block">Default test MFA code: 123456</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    aria-label={`Authenticate and lock session for ${selectedRole}`}
                    className="w-full min-h-[44px] py-3 mt-1 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-brand-dark"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-dark" />
                    <span>Authenticate & Lock Session ({selectedRole})</span>
                  </button>
                </form>
              </>
            )}

            {/* MODE 2: ACCOUNT ACTIVATION */}
            {authMode === 'activate' && (
              <form onSubmit={handleActivateSubmit} className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/30 text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-brand-gold flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-brand-gold" /> First-Time Account Activation
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Enter the 6-digit Activation Token issued by your System Administrator to create your password and activate your account.
                  </p>
                  <p className="text-[9px] text-brand-gold/90 font-bold mt-1">
                    Demo activation token available: <code className="bg-brand-dark px-1 py-0.5 rounded text-white">ACT-990812</code>
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-brand-silver mb-1">Activation Token</label>
                  <input
                    type="text"
                    required
                    value={actToken}
                    onChange={(e) => setActToken(e.target.value)}
                    placeholder="e.g. ACT-990812"
                    className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white uppercase font-bold tracking-widest focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-brand-silver mb-1">Create Password</label>
                  <input
                    type="password"
                    required
                    value={actPassword}
                    onChange={(e) => setActPassword(e.target.value)}
                    placeholder="Min 12 chars, UPPER, lower, number, special char"
                    className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {/* Password Policy Indicator */}
                {actPassword && (
                  <div className="p-2.5 bg-brand-dark/90 rounded-lg border border-slate-800 text-[10px] space-y-1">
                    <span className="text-slate-400 font-bold block text-[9px]">Password Complexity Requirement:</span>
                    <div className="grid grid-cols-2 gap-1">
                      <span className={actPassword.length >= 12 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {actPassword.length >= 12 ? '✓' : '○'} Min 12 Characters
                      </span>
                      <span className={/[A-Z]/.test(actPassword) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {/[A-Z]/.test(actPassword) ? '✓' : '○'} Uppercase Letter
                      </span>
                      <span className={/[a-z]/.test(actPassword) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {/[a-z]/.test(actPassword) ? '✓' : '○'} Lowercase Letter
                      </span>
                      <span className={/[0-9]/.test(actPassword) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {/[0-9]/.test(actPassword) ? '✓' : '○'} Number (0-9)
                      </span>
                      <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(actPassword) ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(actPassword) ? '✓' : '○'} Special Character
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase text-brand-silver mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={actConfirmPassword}
                    onChange={(e) => setActConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <label className="flex items-start gap-2 p-2 bg-brand-dark/80 rounded-lg border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actTermsAccepted}
                    onChange={(e) => setActTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-[10px] text-slate-300 leading-tight">
                    I accept the ITIS POPIA Enterprise Terms of Service, Child Protection Safety Charter, and Zero Trust Audit Logging Policy.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!actTermsAccepted}
                  className="w-full py-3 mt-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Activate Account & Hash Passcode</span>
                </button>
              </form>
            )}

            {/* MODE 3: RESET PASSWORD */}
            {authMode === 'reset' && (
              <div className="space-y-3 font-mono text-xs">
                {resetStep === 1 ? (
                  <form onSubmit={handleRequestResetToken} className="space-y-3">
                    <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/30 text-[11px] text-slate-300 space-y-1">
                      <p className="font-bold text-brand-gold flex items-center gap-1">
                        <Key className="w-4 h-4 text-brand-gold" /> Step 1: Request Password Reset Token
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Enter your registered enterprise email address to issue a one-time secure password reset token.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-brand-silver mb-1">Registered Email Address</label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="e.g. mthokozisi@live.co.za"
                        className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Issue Password Reset Token</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-3">
                    <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/30 text-[11px] text-slate-300 space-y-1">
                      <p className="font-bold text-brand-gold flex items-center gap-1">
                        <RefreshCw className="w-4 h-4 text-brand-gold" /> Step 2: Set New Account Password
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Token issued for <span className="text-white font-bold">{resetEmail}</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-brand-silver mb-1">Reset Token</label>
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="RST-XXXXXX"
                        className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white font-bold tracking-widest uppercase focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-brand-silver mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="Min 12 chars, UPPER, lower, number, special char"
                        className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-brand-silver mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-brand-dark border border-brand-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Reset Password & Update Credentials</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Footer Quick Options */}
            <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-[10px] font-mono flex-wrap gap-2">
              <button
                type="button"
                onClick={triggerBiometric}
                disabled={isBiometricPending}
                className="text-brand-gold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Fingerprint className="w-3.5 h-3.5" /> 
                <span>{isBiometricPending ? 'Verifying...' : 'Biometric Auth'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(true)}
                className="text-brand-gold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Account Security</span>
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('EmergencyBypass')}
                className="text-rose-400 hover:underline font-bold cursor-pointer"
              >
                Emergency SOS
              </button>
            </div>

            {/* Dedicated Human Resources & Careers Section in Portal Gateway */}
            <div className="mt-4 pt-3.5 border-t border-brand-gold/20 bg-brand-dark/70 p-3.5 rounded-2xl border border-brand-gold/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <Briefcase className="w-4 h-4 text-brand-gold" /> Careers & Recruitment Portal
                </span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/30">
                  14 Active Positions
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Join South Africa's next-generation child safety platform. Public access — applicants do not require a Parent or Government account to view opportunities or apply.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => { setCareersTab('explore'); setIsCareersOpen(true); }}
                  className="px-2.5 py-1.5 bg-brand-navy hover:bg-brand-gold hover:text-brand-dark text-brand-gold rounded-lg border border-brand-gold/30 transition-all cursor-pointer font-bold flex items-center justify-between"
                >
                  <span>Open Vacancies</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => { setCareersTab('programmes'); setIsCareersOpen(true); }}
                  className="px-2.5 py-1.5 bg-brand-navy hover:bg-emerald-500 hover:text-white text-emerald-400 rounded-lg border border-emerald-500/30 transition-all cursor-pointer font-bold flex items-center justify-between"
                >
                  <span>Graduate & Intern</span>
                  <GraduationCap className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                <button
                  type="button"
                  onClick={() => { setCareersTab('why-itis'); setIsCareersOpen(true); }}
                  className="hover:text-brand-gold transition-colors underline cursor-pointer"
                >
                  Life at ITIS & Operations
                </button>
                <button
                  type="button"
                  onClick={() => { setCareersTab('explore'); setIsCareersOpen(true); }}
                  className="text-brand-gold font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Join Talent Network</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Public Unauthenticated Careers & Recruitment Centre */}
      <CareersCentre
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
        initialTab={careersTab}
      />

      {/* Guardian & Enterprise User Self-Service Security Hub */}
      <AccountSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUserEmail={email}
        currentUserName={DEFAULT_PERSONAS[selectedRole]?.name || 'ITIS Enterprise User'}
      />

      {/* Dynamic Identity Auth Flow Screen */}
      {authFlowMode && (
        <AuthFlowScreens
          mode={authFlowMode}
          token={activeToken}
          email={email}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            setAuthFlowMode(null);
            setIsModalOpen(true);
          }}
          onCancel={() => setAuthFlowMode(null)}
        />
      )}
    </div>
  );
}
