import React, { useState } from 'react';
import { 
  Shield, LogOut, Lock, Key, User, Activity, AlertTriangle, Eye, CheckCircle2, 
  FileText, Cpu, Clock, Terminal, ShieldAlert, Sparkles, X, ChevronRight 
} from 'lucide-react';
import { UserSession, authService } from '../services/authService';

interface UserSessionPanelProps {
  session: UserSession;
  onLogout: () => void;
}

export function UserSessionPanel({ session, onLogout }: UserSessionPanelProps) {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isBreakGlassModalOpen, setIsBreakGlassModalOpen] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState('');
  const [supervisorPin, setSupervisorPin] = useState('');
  const [breakGlassError, setBreakGlassError] = useState<string | null>(null);

  const auditLogs = authService.getAuditLogs();

  const handleTriggerBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    setBreakGlassError(null);
    const res = authService.enableBreakGlass(breakGlassReason, supervisorPin);
    if (res.success) {
      setIsBreakGlassModalOpen(false);
      setBreakGlassReason('');
      setSupervisorPin('');
      alert("⚠️ BREAK GLASS ACTIVATED: Immediate Supervisor Override Enabled. Emergency audit log recorded.");
    } else {
      setBreakGlassError(res.error || 'Failed to activate break glass.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Parent': return 'bg-emerald-950 text-emerald-400 border-emerald-500/40';
      case 'School': return 'bg-sky-950 text-sky-400 border-sky-500/40';
      case 'Command': return 'bg-red-950 text-red-400 border-red-500/40';
      case 'Technician': return 'bg-amber-950 text-amber-400 border-amber-500/40';
      case 'Government': return 'bg-purple-950 text-purple-400 border-purple-500/40';
      case 'Executive': return 'bg-brand-gold/20 text-brand-gold border-brand-gold/40';
      case 'Admin': return 'bg-rose-950 text-rose-300 border-rose-500/50';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Compact User Identity Pill */}
      <div 
        onClick={() => setIsAuditModalOpen(true)}
        className="flex items-center gap-2.5 px-3 py-1.5 bg-brand-navy/90 hover:bg-brand-navy rounded-xl border border-brand-gold/25 cursor-pointer transition-all hover:border-brand-gold shadow-md group"
        title="Click to view Active Session, JWT Claims & Audit Trail"
      >
        <div className="relative">
          <img 
            src={session.avatar} 
            alt={session.name} 
            className="w-8 h-8 rounded-full object-cover border border-brand-gold group-hover:scale-105 transition-transform" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-brand-dark animate-pulse" />
        </div>

        <div className="hidden sm:block text-left font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white leading-tight">{session.name}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold uppercase ${getRoleBadgeColor(session.role)}`}>
              {session.role}
            </span>
          </div>
          <p className="text-[9px] text-brand-silver/80 truncate max-w-[170px]">
            {session.organization}
          </p>
        </div>

        {/* Audit Log Icon button */}
        <div className="p-1.5 bg-brand-dark/80 rounded-lg text-brand-gold border border-brand-gold/20 group-hover:border-brand-gold">
          <Shield className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Break Glass Button for Command/Government/Exec */}
      {(session.role === 'Command' || session.role === 'Government' || session.role === 'Executive') && (
        <button
          onClick={() => setIsBreakGlassModalOpen(true)}
          className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
            session.breakGlassActive 
              ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse' 
              : 'bg-brand-navy/80 hover:bg-brand-navy text-brand-gold border-brand-gold/30 hover:border-brand-gold'
          }`}
          title="Break Glass Emergency Supervisor Override"
        >
          <AlertTriangle className="w-3 h-3 text-brand-gold" />
          <span className="hidden md:inline">{session.breakGlassActive ? 'BREAK GLASS ACTIVE' : 'BREAK GLASS'}</span>
        </button>
      )}

      {/* Explicit Logout Button */}
      <button
        onClick={onLogout}
        className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 hover:border-rose-400 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
        title="Terminate Session & Log Out"
      >
        <LogOut className="w-3.5 h-3.5 text-rose-400" />
        <span className="hidden sm:inline">Logout</span>
      </button>

      {/* Session Security & Audit Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl glass-panel-heavy rounded-2xl border-2 border-brand-gold/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-4 bg-brand-navy-heavy border-b border-brand-gold/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-brand-gold" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Enterprise RBAC Session Telemetry & Audit Trail
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Zero Trust Session Fingerprint · ISO 27001 & POPIA Security Standard
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1.5 bg-brand-dark border border-brand-gold/20 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              
              {/* Active Identity Summary */}
              <div className="p-4 bg-brand-dark/80 rounded-xl border border-brand-gold/25 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={session.avatar} alt={session.name} className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{session.name}</h4>
                      <p className="text-[11px] text-brand-gold">{session.roleTitle}</p>
                      <p className="text-[10px] text-slate-400">{session.organization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase inline-block ${getRoleBadgeColor(session.role)}`}>
                      {session.role} Portal Locked
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Tenant ID: {session.tenantId}</p>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 bg-brand-navy/60 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Session ID</span>
                    <span className="font-bold text-brand-gold">{session.sessionId}</span>
                  </div>
                  <div className="p-2 bg-brand-navy/60 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">MFA Status</span>
                    <span className={`font-bold ${session.mfaVerified ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {session.mfaVerified ? '✅ VERIFIED' : 'OPTIONAL (PILOT)'}
                    </span>
                  </div>
                  <div className="p-2 bg-brand-navy/60 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Device ID</span>
                    <span className="font-bold text-white">{session.deviceFingerprint}</span>
                  </div>
                  <div className="p-2 bg-brand-navy/60 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">IP Location</span>
                    <span className="font-bold text-white">Pretoria NOC</span>
                  </div>
                </div>

                {/* JWT Token */}
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px]">
                  <span className="text-slate-400 block mb-1">Active Cryptographic JWT Bearer Claims:</span>
                  <p className="text-brand-gold/80 break-all select-all font-mono">
                    {session.jwtToken}
                  </p>
                </div>
              </div>

              {/* Claims & Permissions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Enforced RBAC Permissions & Scope Claims
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {session.permissions.map((perm, idx) => (
                    <span key={idx} className="px-2 py-1 bg-brand-navy border border-brand-gold/20 text-slate-200 rounded text-[10px]">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Audit Log Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Immutable Security Audit Logs (Last 50 Events)
                </h4>
                <div className="bg-brand-dark rounded-xl border border-slate-800 overflow-hidden">
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 text-[10px] space-y-1 hover:bg-brand-navy/40">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">{log.timestamp}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                            log.status === 'DENIED' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                            'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}>
                            {log.action}
                          </span>
                        </div>
                        <p className="text-white font-mono">{log.details}</p>
                        <div className="flex items-center justify-between text-[9px] text-slate-500">
                          <span>User: {log.userName} ({log.role})</span>
                          <span>{log.ipAddress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-brand-navy-heavy border-t border-brand-gold/20 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">
                Session Isolation Enforcement Active · Role Mutation Restricted
              </span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-500/40 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Terminate Active Session & Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Break Glass Modal */}
      {isBreakGlassModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md glass-panel-heavy p-6 rounded-2xl border-2 border-amber-500/50 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-sm font-bold font-mono uppercase">Controlled Break Glass Access</h3>
              </div>
              <button 
                onClick={() => setIsBreakGlassModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Break Glass overrides normal RBAC limits for life-safety emergency dispatch. All actions during this override will trigger immediate high-priority audit alerts sent to National Security Directorate.
            </p>

            {breakGlassError && (
              <div className="p-2.5 bg-rose-950/80 border border-rose-500/50 rounded text-xs text-rose-200 font-mono">
                {breakGlassError}
              </div>
            )}

            <form onSubmit={handleTriggerBreakGlass} className="space-y-3 font-mono">
              <div>
                <label className="block text-[10px] uppercase text-slate-300 mb-1">Emergency Justification / Case ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Critical Multi-Agency Response Case #INC-9908"
                  value={breakGlassReason}
                  onChange={(e) => setBreakGlassReason(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-gold/30 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-300 mb-1">Supervisor Verification PIN</label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter Supervisor PIN (e.g. 9900)"
                  value={supervisorPin}
                  onChange={(e) => setSupervisorPin(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-gold/30 rounded px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-brand-dark font-bold text-xs uppercase rounded transition-all cursor-pointer"
              >
                Authorize Emergency Override
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
