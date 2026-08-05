import React, { useState } from 'react';
import { 
  Shield, Fingerprint, Lock, Mail, AlertTriangle, Cpu, X, Key, CheckCircle2, Sliders 
} from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import { LandingPage } from './LandingPage';
import { UserRole, DEFAULT_PERSONAS, authService } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole | 'EmergencyBypass') => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Parent');
  const [email, setEmail] = useState(DEFAULT_PERSONAS.Parent.email);
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [isBiometricPending, setIsBiometricPending] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(authService.isDemoMode());

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEFAULT_PERSONAS[role].email);
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = authService.login(
      email,
      password,
      selectedRole,
      DEFAULT_PERSONAS[selectedRole].mfaRequired ? mfaCode : undefined
    );

    if (result.success && result.session) {
      onLoginSuccess(selectedRole);
    } else {
      setError(result.error || 'Authentication failed.');
    }
  };

  const triggerBiometric = () => {
    setIsBiometricPending(true);
    setTimeout(() => {
      setIsBiometricPending(false);
      const res = authService.login('t.ndlovu@itis.gov.za', 'biometric-pass', 'Parent');
      if (res.success) {
        onLoginSuccess('Parent');
      }
    }, 1200);
  };

  const toggleDemoMode = () => {
    const newDemo = !isDemoMode;
    setIsDemoMode(newDemo);
    authService.setDemoMode(newDemo);
  };

  return (
    <div className="relative min-h-screen bg-brand-dark font-sans">
      
      {/* Demo Mode Banner (if explicitly enabled by demonstrator) */}
      {isDemoMode && (
        <div className="bg-amber-500 text-brand-dark px-4 py-1.5 font-mono text-[11px] font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-2 z-50 relative shadow-lg">
          <Sliders className="w-3.5 h-3.5" />
          <span>DEMO MODE ENABLED – SIMULATED PUBLIC SAFETY DATA</span>
          <button onClick={toggleDemoMode} className="ml-4 underline hover:text-black">Disable</button>
        </div>
      )}

      {/* Renders the full executive landing page flow */}
      <LandingPage onOpenLogin={(role) => {
        if (role && (role in DEFAULT_PERSONAS)) {
          handleRoleSelect(role as UserRole);
        }
        setIsModalOpen(true);
      }} />

      {/* Portal Login Executive Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-heavy/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-lg glass-panel-heavy p-6 sm:p-8 rounded-3xl shadow-2xl transition-all duration-300 border-2 border-brand-gold glow-gold overflow-hidden"
            id="login-card-modal"
          >
            {/* Close Modal Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-brand-navy transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-5 text-center">
              <img 
                src={itisLogo} 
                alt="ITIS Badge Logo" 
                className="w-14 h-14 object-cover border-2 border-brand-gold rounded-full shadow-2xl mb-2 glow-gold"
              />
              <h2 className="text-lg font-bold tracking-wider text-white font-mono">
                ITIS CHILD SAFETY PLATFORM
              </h2>
              <p className="text-[10px] text-brand-gold tracking-widest uppercase font-mono">
                Enterprise Zero Trust Authenticated Portal
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-xs text-rose-200 font-mono flex items-start gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Portal Role Identity Selection */}
            <div className="mb-4">
              <label className="block text-[10px] text-brand-gold font-mono uppercase tracking-widest mb-1.5 text-center">
                Select Portal Identity to Authenticate
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                {(['Parent', 'School', 'Command', 'Technician', 'Government', 'Executive', 'Admin'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-2 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                      selectedRole === role 
                        ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-md' 
                        : 'bg-brand-navy/80 text-slate-300 border-slate-800 hover:border-brand-gold/40 hover:text-white'
                    }`}
                  >
                    {role === 'Parent' ? '🛡️ Guardian' : 
                     role === 'School' ? '🏫 School' : 
                     role === 'Command' ? '🛰️ Dispatch' : 
                     role === 'Technician' ? '🔧 Tech' : 
                     role === 'Government' ? '🏛️ Gov' : 
                     role === 'Executive' ? '📊 Exec' : '⚡ Admin'}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Summary Banner */}
            <div className="p-3 bg-brand-navy rounded-xl border border-brand-gold/20 mb-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{DEFAULT_PERSONAS[selectedRole].name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-dark text-brand-gold border border-brand-gold/30">
                  {selectedRole} Identity
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{DEFAULT_PERSONAS[selectedRole].organization}</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-brand-silver mb-1">Email / Government ID</label>
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
                <label className="block text-[10px] uppercase text-brand-silver mb-1">Passcode</label>
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
                    <Key className="w-3 h-3 text-brand-gold" /> MFA Security Code Required
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
                  <span className="text-[9px] text-slate-400 block">Default test code: 123456</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-1 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transform active:scale-95 transition-all cursor-pointer"
              >
                Sign In & Lock Session ({selectedRole})
              </button>
            </form>

            {/* Biometric & Emergency Options */}
            <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-[10px] font-mono">
              <button
                type="button"
                onClick={triggerBiometric}
                className="text-brand-gold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5" /> Biometric Auth
              </button>

              <button
                type="button"
                onClick={toggleDemoMode}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                {isDemoMode ? 'Demo Mode Active' : 'Enable Demo Mode'}
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('EmergencyBypass')}
                className="text-rose-400 hover:underline font-bold cursor-pointer"
              >
                Emergency SOS
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
