import React, { useState } from 'react';
import { Shield, Fingerprint, Lock, Mail, AlertTriangle, Cpu, X } from 'lucide-react';
import itisLogo from '../assets/images/itis_logo_1783562386226.jpg';
import { LandingPage } from './LandingPage';

interface LoginScreenProps {
  onLoginSuccess: (role: string) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('parent@itisguardian.co.za');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [isBiometricPending, setIsBiometricPending] = useState(false);

  const handleLogin = (role: string) => {
    onLoginSuccess(role);
  };

  const triggerBiometric = () => {
    setIsBiometricPending(true);
    setTimeout(() => {
      setIsBiometricPending(false);
      handleLogin('Parent');
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-brand-dark">
      {/* Renders the full executive landing page flow */}
      <LandingPage onOpenLogin={(role) => setIsModalOpen(true)} />

      {/* Portal Login Executive Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-heavy/85 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-md glass-panel-heavy p-8 rounded-2xl shadow-2xl transition-all duration-300 border-2 border-brand-gold glow-gold"
            id="login-card-modal"
          >
            {/* Close Modal Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-brand-navy transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center mb-6 text-center">
              <img 
                src={itisLogo} 
                alt="ITIS Badge Logo" 
                className="w-16 h-16 object-cover border-2 border-brand-gold rounded-full shadow-2xl mb-3 glow-gold"
              />
              <h2 className="text-xl font-bold tracking-wider text-white">
                ITIS GUARDIAN PORTAL
              </h2>
              <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-0.5 font-mono">
                Integrated Technology Intelligence & Safety
              </p>
              <div className="mt-2 text-[10px] bg-brand-navy px-2.5 py-1 rounded-full border border-brand-gold/20 text-brand-silver flex items-center gap-1.5 font-mono">
                <Cpu className="w-3 h-3 text-brand-gold" /> NATIONAL SECURE ACCESS · ZA
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-xs text-red-200 flex items-start gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleLogin('Parent'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-brand-silver uppercase tracking-wider mb-1">
                  Authorized Identity / Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-brand-gold/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-mono transition-all"
                    placeholder="name@agency.gov.za"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-brand-silver uppercase tracking-wider mb-1">
                  Security Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-brand-gold/60" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-gold/25 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold font-mono transition-all"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button 
                  type="button" 
                  onClick={() => setError("Password recovery dispatch is controlled by National Command. Contact support@itis.gov.za")}
                  className="text-brand-gold hover:text-brand-gold-dark text-[11px] font-mono transition-colors cursor-pointer"
                >
                  Forgot Passcode?
                </button>
                <span className="text-slate-500 font-mono text-[10px]">POPIA Enforced</span>
              </div>

              {/* Portal Selector buttons */}
              <div className="pt-2">
                <label className="block text-[10px] text-brand-gold/90 font-mono uppercase tracking-widest text-center mb-2">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLogin('Parent')}
                    className="px-2 py-2 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 hover:border-brand-gold rounded text-center text-xs text-white font-mono font-bold transition-all cursor-pointer"
                  >
                    Guardian
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogin('School')}
                    className="px-2 py-2 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 hover:border-brand-gold rounded text-center text-xs text-white font-mono font-bold transition-all cursor-pointer"
                  >
                    School
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLogin('Command')}
                    className="px-2 py-2 bg-brand-navy hover:bg-brand-navy-light border border-brand-gold/30 hover:border-brand-gold rounded text-center text-xs text-white font-mono font-bold transition-all cursor-pointer"
                  >
                    Command
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-dark text-brand-dark font-bold rounded-lg text-xs font-mono uppercase tracking-wider shadow-lg transform active:scale-95 transition-all cursor-pointer"
              >
                Sign In to Selected Portal
              </button>
            </form>

            {/* Biometric Trigger */}
            <div className="mt-5 pt-4 border-t border-brand-gold/15 flex flex-col items-center">
              <button
                type="button"
                onClick={triggerBiometric}
                disabled={isBiometricPending}
                className={`w-12 h-12 rounded-full bg-brand-navy border border-brand-gold/40 flex items-center justify-center cursor-pointer transition-all ${isBiometricPending ? 'scale-90 bg-brand-gold/20 border-brand-gold animate-pulse' : 'hover:bg-brand-navy-light hover:border-brand-gold'}`}
                title="Touch ID / Fingerprint Login"
              >
                <Fingerprint className={`w-7 h-7 ${isBiometricPending ? 'text-brand-gold' : 'text-brand-silver'}`} />
              </button>
              <span className="text-[10px] text-brand-silver mt-1.5 font-mono">
                {isBiometricPending ? 'Authenticating Biometrics...' : 'Touch to authenticate with Biometrics'}
              </span>
            </div>

            {/* Emergency Bypass */}
            <div className="mt-4 pt-3 border-t border-brand-gold/15">
              <button
                type="button"
                onClick={() => handleLogin('EmergencyBypass')}
                className="w-full py-2 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40 text-xs font-mono font-bold rounded flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                IMMEDIATE EMERGENCY SOS BYPASS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
