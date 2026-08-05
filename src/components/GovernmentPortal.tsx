import React, { useState } from 'react';
import { 
  Landmark, ShieldCheck, FileCheck, BarChart3, Users, Building2, 
  CheckCircle2, Download, Filter, Search, Award, AlertTriangle, Shield 
} from 'lucide-react';

export function GovernmentPortal() {
  const [selectedProvince, setSelectedProvince] = useState('Gauteng');

  const provinces = [
    { name: 'Gauteng', schools: 420, learners: 185000, safetyScore: 94.8, incidentsToday: 12, compliance: '100% POPIA Compliant' },
    { name: 'Western Cape', schools: 310, learners: 120000, safetyScore: 96.2, incidentsToday: 5, compliance: '100% POPIA Compliant' },
    { name: 'KwaZulu-Natal', schools: 580, learners: 210000, safetyScore: 91.5, incidentsToday: 24, compliance: '100% POPIA Compliant' },
    { name: 'Eastern Cape', schools: 390, learners: 145000, safetyScore: 89.2, incidentsToday: 18, compliance: '100% POPIA Compliant' },
    { name: 'Free State', schools: 210, learners: 85000, safetyScore: 95.1, incidentsToday: 3, compliance: '100% POPIA Compliant' }
  ];

  const auditReports = [
    {
      id: 'AUD-2026-Q2-01',
      title: 'National School Transit & Bus Safety Compliance Audit',
      date: '2026-07-28',
      status: 'Verified',
      author: 'Department of Basic Education Safety Inspectorate'
    },
    {
      id: 'AUD-2026-Q2-02',
      title: 'POPIA Child Data Residency & Cryptographic Audit',
      date: '2026-07-15',
      status: 'Passed (Sovereign SA Datacenters)',
      author: 'Information Regulator South Africa'
    },
    {
      id: 'AUD-2026-Q2-03',
      title: 'SAPS 10111 Integrated Emergency Dispatch Response SLA Audit',
      date: '2026-07-02',
      status: 'Compliant (Avg SLA < 2.4 min)',
      author: 'Civilian Secretariat for Police Service'
    }
  ];

  return (
    <div className="flex-1 bg-brand-dark p-6 space-y-6 overflow-y-auto w-full font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-brand-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950 border border-purple-500/40 rounded-xl text-purple-300">
            <Landmark className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">PROVINCIAL & NATIONAL PUBLIC SAFETY OVERSIGHT</h2>
              <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold">
                Government Inspectorate
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Department of Basic Education & Civilian Secretariat for Police Service Joint Command
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert("📄 Exporting Government Compliance & POPIA Audit Package (PDF/A format)...")}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark font-mono font-bold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-brand-dark" />
          Export Audit Package
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Connected Schools Nationwide</span>
          <span className="text-2xl font-bold text-white block">1,910</span>
          <span className="text-[10px] text-emerald-400">100% SITA Certified</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Active Learner Protections</span>
          <span className="text-2xl font-bold text-brand-gold block">745,000</span>
          <span className="text-[10px] text-emerald-400">Live Wearable Telemetry</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">National SLA Dispatch Time</span>
          <span className="text-2xl font-bold text-emerald-400 block">2.1 Min</span>
          <span className="text-[10px] text-slate-400">Target &lt; 2.4 min</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">POPIA Sovereign Residency</span>
          <span className="text-2xl font-bold text-purple-300 block">100% RSA</span>
          <span className="text-[10px] text-purple-400">Pretoria & Cape Town Nodes</span>
        </div>
      </div>

      {/* Provincial Scorecard Table */}
      <div className="p-6 bg-brand-navy rounded-2xl border border-slate-800 space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-gold" /> Provincial Safety Scorecard & Compliance Rankings
          </h3>
          <span className="text-[10px] text-slate-400">Updated: Real-time Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-dark text-slate-400 text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Province</th>
                <th className="p-3">Connected Schools</th>
                <th className="p-3">Monitored Learners</th>
                <th className="p-3">Safety Score Index</th>
                <th className="p-3">Today's Incidents</th>
                <th className="p-3">POPIA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {provinces.map((prov) => (
                <tr key={prov.name} className="hover:bg-brand-dark/50">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-brand-gold" /> {prov.name}
                  </td>
                  <td className="p-3">{prov.schools} Schools</td>
                  <td className="p-3">{prov.learners.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-bold">{prov.safetyScore} / 100</span>
                  </td>
                  <td className="p-3 font-bold text-amber-300">{prov.incidentsToday}</td>
                  <td className="p-3 text-purple-300 font-bold">{prov.compliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Audit Reports */}
      <div className="p-6 bg-brand-navy rounded-2xl border border-slate-800 space-y-4 font-mono">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-brand-gold" /> Institutional Audit Reports & Certificates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {auditReports.map((audit) => (
            <div key={audit.id} className="p-4 bg-brand-dark rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-brand-gold font-bold">{audit.id}</span>
              <h4 className="text-xs font-bold text-white leading-snug">{audit.title}</h4>
              <p className="text-[10px] text-slate-400">{audit.author}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400 font-bold">{audit.status}</span>
                <button 
                  onClick={() => alert(`Downloading audit certificate ${audit.id}`)}
                  className="text-brand-gold hover:underline"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
