import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, Users, Award, ShieldAlert, FileText, 
  PieChart, BarChart2, Globe, Sparkles, Download, CheckCircle2 
} from 'lucide-react';

export function ExecutivePortal() {
  const [currency] = useState<'ZAR' | 'USD'>('ZAR');

  const financialMetrics = {
    mrrZar: 'R 24,850,000',
    arrZar: 'R 298,200,000',
    activeSubscribers: 18400,
    schoolLicensingCount: 420,
    grossMarginPercent: 82.4,
    cacZar: 'R 210',
    ltvZar: 'R 4,800',
    slaCompliancePercent: 99.94
  };

  const investorHighlights = [
    {
      title: 'South African DBE National Tender Integration',
      description: 'Exclusive multi-year agreement to provide wearable safety telemetry to 420 public schools across Gauteng and Western Cape.',
      value: 'R 120M Contract Value'
    },
    {
      title: 'SAPS 10111 Dispatch Interoperability SLA',
      description: 'Direct WebSocket pipeline to SAPS Command with sub-second panic signal relay.',
      value: 'Sub-2.4 min Response SLA'
    },
    {
      title: 'Commercial Wearables B2C Expansion',
      description: 'Direct-to-consumer parent subscription tier priced at R149/month per child.',
      value: '18,400 Active Families'
    }
  ];

  return (
    <div className="flex-1 bg-brand-dark p-6 space-y-6 overflow-y-auto w-full font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-brand-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-gold/20 border border-brand-gold/40 rounded-xl text-brand-gold">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">EXECUTIVE & INVESTOR STRATEGY DASHBOARD</h2>
              <span className="text-[10px] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold">
                Consortium Executive Board
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              ITIS Enterprise Platform v1.0.0-GA · Financial Performance & Unit Economics
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert("📊 Generating Board Briefing & Financial Model Deck (PDF)...")}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark font-mono font-bold text-xs uppercase rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-brand-dark" />
          Download Executive Deck
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-brand-navy rounded-xl border border-brand-gold/25 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Monthly Recurring Revenue (MRR)</span>
          <span className="text-2xl font-extrabold text-brand-gold block">{financialMetrics.mrrZar}</span>
          <span className="text-[10px] text-emerald-400 font-bold">↑ +18.4% MoM Growth</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Annual Run Rate (ARR)</span>
          <span className="text-2xl font-extrabold text-white block">{financialMetrics.arrZar}</span>
          <span className="text-[10px] text-emerald-400">Public & B2C Combined</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Active Paid Subscriptions</span>
          <span className="text-2xl font-extrabold text-white block">{financialMetrics.activeSubscribers.toLocaleString()}</span>
          <span className="text-[10px] text-slate-300">R149 / Mo per Child</span>
        </div>

        <div className="p-4 bg-brand-navy rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase">Unit Economics LTV / CAC</span>
          <span className="text-2xl font-extrabold text-emerald-400 block">22.8x Ratio</span>
          <span className="text-[10px] text-slate-400">CAC: R210 · LTV: R4,800</span>
        </div>
      </div>

      {/* Strategic Investor Highlights */}
      <div className="p-6 bg-brand-navy rounded-2xl border border-slate-800 space-y-4 font-mono">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-gold" /> Key Strategic Growth Milestones & Public Sector Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {investorHighlights.map((item, idx) => (
            <div key={idx} className="p-4 bg-brand-dark rounded-xl border border-brand-gold/20 space-y-2">
              <span className="px-2 py-0.5 bg-brand-gold/15 text-brand-gold border border-brand-gold/30 rounded text-[9px] font-bold uppercase">
                {item.value}
              </span>
              <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
              <p className="text-[10px] text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Operational SLA & Board Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        <div className="p-5 bg-brand-navy rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-gold" /> SLA Performance & Dispatch Compliance
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between p-2 bg-brand-dark rounded border border-slate-800">
              <span className="text-slate-400">Emergency Dispatch SLA Target:</span>
              <span className="text-emerald-400 font-bold">99.94% Compliant</span>
            </div>
            <div className="flex justify-between p-2 bg-brand-dark rounded border border-slate-800">
              <span className="text-slate-400">Average Emergency Response Time:</span>
              <span className="text-brand-gold font-bold">2.1 Minutes</span>
            </div>
            <div className="flex justify-between p-2 bg-brand-dark rounded border border-slate-800">
              <span className="text-slate-400">Gross Margin Efficiency:</span>
              <span className="text-white font-bold">82.4%</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-brand-navy rounded-2xl border border-slate-800 space-y-3">
          <h4 className="font-bold text-white uppercase text-xs flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-gold" /> SADC Regional Expansion Pipeline
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Active exploratory talks with Botswana Ministry of Public Safety & Namibia Police Force to deploy the ITIS Child Safety Telemetry Platform under sovereign data residency models.
          </p>
          <div className="p-2.5 bg-brand-dark rounded border border-brand-gold/20 text-[10px] text-brand-gold">
            Next Board Review: Q3 2026 Johannesburg Executive Summit
          </div>
        </div>
      </div>

    </div>
  );
}
