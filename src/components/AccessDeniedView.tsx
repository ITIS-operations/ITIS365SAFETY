import React from 'react';
import { ShieldAlert, Lock, LogOut, ArrowLeft, AlertOctagon, User, ShieldCheck } from 'lucide-react';
import { UserSession } from '../services/authService';

interface AccessDeniedViewProps {
  session: UserSession;
  attemptedPortal: string;
  onReturnToAllowed: () => void;
  onLogoutAndSwitch: () => void;
}

export function AccessDeniedView({
  session,
  attemptedPortal,
  onReturnToAllowed,
  onLogoutAndSwitch
}: AccessDeniedViewProps) {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6 bg-brand-dark animate-fade-in">
      <div className="max-w-2xl w-full glass-panel-heavy p-8 sm:p-10 rounded-3xl border-2 border-rose-500/40 shadow-2xl space-y-6 text-center">
        
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 bg-rose-950/80 border-2 border-rose-500/50 rounded-full flex items-center justify-center mx-auto shadow-2xl glow-red">
          <AlertOctagon className="w-10 h-10 text-rose-400 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
            HTTP 403 Forbidden · Zero Trust Violation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Access Denied: Session Isolation Policy Enforced
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Every authenticated session in the ITIS Guardian Network belongs to a single, locked identity. Identity switching within an active session is strictly prohibited.
          </p>
        </div>

        {/* Session Isolation Breakdown */}
        <div className="p-4 bg-brand-navy rounded-2xl border border-rose-900/40 text-left font-mono space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="text-slate-400">Authenticated Identity:</span>
            <span className="text-white font-bold">{session.name} ({session.role})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 bg-brand-dark/80 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Organization / Tenant</span>
              <span className="font-bold text-brand-gold">{session.organization}</span>
            </div>
            <div className="p-2.5 bg-brand-dark/80 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Target Restricted Portal</span>
              <span className="font-bold text-rose-400">{attemptedPortal} Portal</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            To view the <span className="text-white font-bold">{attemptedPortal} Portal</span>, you must terminate your current <span className="text-brand-gold font-bold">{session.role}</span> session and authenticate with credentials granted for {attemptedPortal}.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onReturnToAllowed}
            className="w-full sm:w-auto px-6 py-3 bg-brand-navy hover:bg-brand-navy-light text-white font-mono text-xs font-bold rounded-xl border border-brand-gold/30 hover:border-brand-gold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            Return to {session.role} Workspace
          </button>

          <button
            onClick={onLogoutAndSwitch}
            className="w-full sm:w-auto px-6 py-3 bg-rose-950 hover:bg-rose-900 text-rose-200 font-mono text-xs font-bold rounded-xl border border-rose-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            Logout & Switch Credentials
          </button>
        </div>

      </div>
    </div>
  );
}
