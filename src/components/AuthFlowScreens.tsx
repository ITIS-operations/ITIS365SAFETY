import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Smartphone, 
  RefreshCw, 
  X 
} from 'lucide-react';
import { 
  evaluatePasswordStrength, 
  acceptInvitationAndSetPassword, 
  verifyEmailWithToken, 
  performPasswordReset, 
  unlockAccount, 
  requestPasswordResetLink 
} from '../services/identityEngine';

interface AuthFlowScreensProps {
  mode: 'ACCEPT_INVITE' | 'VERIFY_EMAIL' | 'RESET_PASSWORD' | 'UNLOCK_ACCOUNT' | 'MFA_CHALLENGE';
  token?: string;
  email?: string;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

export const AuthFlowScreens: React.FC<AuthFlowScreensProps> = ({
  mode,
  token = '',
  email = '',
  onSuccess,
  onCancel
}) => {
  // Password Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(email || '');
  const [otpCode, setOtpCode] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const passStrength = evaluatePasswordStrength(password);

  useEffect(() => {
    // If mode is VERIFY_EMAIL and token is provided, auto-trigger verification
    if (mode === 'VERIFY_EMAIL' && token) {
      handleAutoVerifyEmail();
    }
  }, [mode, token]);

  const handleAutoVerifyEmail = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await verifyEmailWithToken(token);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => onSuccess(res.message), 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!passStrength.valid) {
      setErrorMsg(`Password policy error: ${passStrength.errors.join(' ')}`);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await acceptInvitationAndSetPassword(token, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => onSuccess(res.message), 1800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handlePerformPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!passStrength.valid) {
      setErrorMsg(`Password policy error: ${passStrength.errors.join(' ')}`);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await performPasswordReset(token, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => onSuccess(res.message), 1800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setLoading(true);
    setErrorMsg('');
    const res = await requestPasswordResetLink(resetEmail);
    setLoading(false);

    setSuccessMsg(res.message);
  };

  const handleUnlockAccount = async () => {
    setLoading(true);
    setErrorMsg('');
    const res = await unlockAccount(token || email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => onSuccess(res.message), 1800);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit TOTP verification code.');
      return;
    }
    onSuccess('Multi-Factor Authentication verified successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-brand-dark border border-brand-gold/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Background Subtle Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-blue-500 to-brand-gold" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
          <span className="text-[10px] font-mono uppercase bg-brand-gold/10 text-brand-gold border border-brand-gold/30 px-2 py-0.5 rounded-full">
            Zero-Trust Auth
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-xl text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {successMsg}
          </div>
        )}

        {/* SCREEN 1: ACCEPT INVITATION & SET INITIAL PASSWORD */}
        {mode === 'ACCEPT_INVITE' && (
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="p-3 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">Accept Invitation & Set Password</h3>
              <p className="text-xs text-slate-400 font-sans">
                Welcome to ITIS Enterprise. Please set your secure password to activate your account.
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 12 characters"
                  className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              {password && (
                <div className="p-3 bg-black/40 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-400">Strength:</span>
                    <span className={passStrength.score >= 80 ? 'text-emerald-400' : 'text-brand-gold'}>
                      {passStrength.label} ({passStrength.score}/100)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold transition-all" style={{ width: `${passStrength.score}%` }} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || !passStrength.valid}
              className="w-full py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow transition-colors disabled:opacity-40"
            >
              {loading ? 'Activating Credentials...' : 'Activate Account & Access Dashboard'}
            </button>
          </form>
        )}

        {/* SCREEN 2: EMAIL VERIFICATION */}
        {mode === 'VERIFY_EMAIL' && (
          <div className="text-center space-y-4 py-2">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Verifying Email Address</h3>

            {loading ? (
              <div className="p-4 text-slate-300 font-mono text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                Validating cryptographic token...
              </div>
            ) : successMsg ? (
              <p className="text-xs text-emerald-300 font-mono">
                {successMsg}
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-sans">
                Click below to complete verification if automatic validation is pending.
              </p>
            )}

            {!loading && !successMsg && (
              <button
                onClick={handleAutoVerifyEmail}
                className="w-full py-2.5 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors"
              >
                Complete Email Verification
              </button>
            )}
          </div>
        )}

        {/* SCREEN 3: FORGOT PASSWORD / PASSWORD RESET */}
        {mode === 'RESET_PASSWORD' && (
          <div>
            {token ? (
              <form onSubmit={handlePerformPasswordReset} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="p-3 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">Define New Account Password</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Single-use token validated. Enter your new password below.
                  </p>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 12 characters"
                      className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword || !passStrength.valid}
                  className="w-full py-3 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors disabled:opacity-40"
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRequestResetLink} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="p-3 bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">Forgot Account Password</h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Enter your email address to receive a secure, 15-minute password reset link.
                  </p>
                </div>

                <div className="text-xs font-mono">
                  <label className="block text-slate-300 mb-1">Registered Account Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. mthokozisi@live.co.za"
                    className="w-full bg-brand-navy border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !resetEmail}
                  className="w-full py-3 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors disabled:opacity-40"
                >
                  {loading ? 'Dispatching Email...' : 'Dispatch Password Reset Email'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* SCREEN 4: UNLOCK ACCOUNT */}
        {mode === 'UNLOCK_ACCOUNT' && (
          <div className="text-center space-y-4 py-2">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">Account Lock Clearing</h3>
            <p className="text-xs text-slate-400 font-sans">
              Verify identity to clear the 5-failed-attempts security lockout.
            </p>

            <button
              onClick={handleUnlockAccount}
              disabled={loading}
              className="w-full py-3 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors"
            >
              {loading ? 'Clearing Lock...' : 'Confirm Identity & Unlock Account'}
            </button>
          </div>
        )}

        {/* SCREEN 5: MFA CHALLENGE DURING LOGIN */}
        {mode === 'MFA_CHALLENGE' && (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl w-12 h-12 mx-auto flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">Two-Step MFA Verification</h3>
              <p className="text-xs text-slate-400 font-sans">
                Enter the 6-digit verification code from your Authenticator app.
              </p>
            </div>

            <div className="text-center space-y-2">
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-48 text-center text-2xl font-mono tracking-widest bg-brand-navy border border-brand-gold/40 rounded-xl py-2 text-white focus:outline-none focus:border-brand-gold mx-auto block"
              />
              <span className="text-[10px] text-slate-500 font-mono">Demo TOTP code: Any 6 digits (e.g. 123456)</span>
            </div>

            <button
              type="submit"
              disabled={otpCode.length < 6}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow transition-colors disabled:opacity-40"
            >
              Verify & Complete Sign In
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
