import React, { useState } from 'react';
import { 
  Wrench, Cpu, BatteryCharging, Radio, CheckCircle2, AlertTriangle, 
  Search, RefreshCw, Smartphone, HardDrive, Filter, Activity, Server, Send 
} from 'lucide-react';
import { Learner } from '../types';

interface TechnicianPortalProps {
  learners: Learner[];
}

export function TechnicianPortal({ learners }: TechnicianPortalProps) {
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(learners[0] || null);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'diagnostics'>('orders');

  const handleTestPing = (serial: string) => {
    setPingStatus(`Pinging tracker ${serial}...`);
    setTimeout(() => {
      setPingStatus(`✅ ACK RECEIVED: Latency 14ms | Signal -72dBm (Strong) | Battery 82% | Firmware v4.2.1-ZA`);
    }, 1200);
  };

  const workOrders = [
    {
      id: 'WO-2026-8812',
      school: 'Gauteng High School',
      deviceSerial: 'ITIS-TRK-99081',
      learnerName: 'Sipho Ndlovu',
      issue: 'Battery Health Inspection & Strap Replacement',
      priority: 'High',
      status: 'In Progress',
      assignedTech: 'Bhengu Sithole'
    },
    {
      id: 'WO-2026-8819',
      school: 'Parktown Girls Primary',
      deviceSerial: 'ITIS-TRK-44122',
      learnerName: 'Zama Dlamini',
      issue: 'Firmware Over-The-Air (FOTA) Patch v4.2',
      priority: 'Medium',
      status: 'Pending',
      assignedTech: 'Bhengu Sithole'
    },
    {
      id: 'WO-2026-8825',
      school: 'Pretoria West High',
      deviceSerial: 'ITIS-TRK-10923',
      learnerName: 'Lerato Molefe',
      issue: 'SIM Calibration & APN Re-route to Vodacom Private Safety APN',
      priority: 'Critical',
      status: 'Pending',
      assignedTech: 'Unassigned'
    }
  ];

  return (
    <div className="flex-1 bg-brand-dark p-6 space-y-6 overflow-y-auto w-full font-sans">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border-2 border-brand-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 border border-amber-500/40 rounded-xl text-amber-400">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">FIELD TECHNICIAN WORKSPACE</h2>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold">
                Hardware & IoT Operations
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Assigned Region: Gauteng Province North · Hardware Maintenance & MIL-STD-810G Wearables Calibration
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-brand-navy p-1 rounded-xl border border-brand-gold/20 font-mono text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Work Orders (3)
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            Wearables Inventory
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'diagnostics' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            IoT Diagnostics
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-gold" />
              Active Hardware Maintenance Work Orders
            </h3>

            <div className="space-y-3">
              {workOrders.map((wo) => (
                <div key={wo.id} className="p-4 bg-brand-navy rounded-xl border border-slate-800 hover:border-brand-gold/30 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs font-bold text-brand-gold">{wo.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        wo.priority === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                        wo.priority === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                        'bg-sky-950 text-sky-300 border border-sky-500/40'
                      }`}>
                        {wo.priority} Priority
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                      {wo.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{wo.issue}</h4>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      Learner: <span className="text-white font-bold">{wo.learnerName}</span> · {wo.school}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Wearable Serial: <span className="text-brand-gold">{wo.deviceSerial}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Assigned Tech: {wo.assignedTech}</span>
                    <button 
                      onClick={() => handleTestPing(wo.deviceSerial)}
                      className="px-3 py-1 bg-brand-dark hover:bg-brand-gold hover:text-brand-dark text-brand-gold border border-brand-gold/30 rounded font-bold transition-all cursor-pointer"
                    >
                      Ping Wearable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hardware Diagnostic Card */}
          <div className="p-5 bg-brand-navy rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-gold" /> Direct Device Test Console
            </h3>

            {pingStatus && (
              <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/30 text-xs font-mono text-brand-gold leading-relaxed animate-pulse">
                {pingStatus}
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Select Learner Device</label>
                <select 
                  onChange={(e) => {
                    const l = learners.find(item => item.id === e.target.value);
                    if (l) setSelectedLearner(l);
                  }}
                  className="w-full bg-brand-dark border border-slate-800 rounded px-3 py-2 text-white"
                >
                  {learners.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.trackerSerial})</option>
                  ))}
                </select>
              </div>

              {selectedLearner && (
                <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Serial:</span>
                    <span className="text-white font-bold">{selectedLearner.trackerSerial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IMEI:</span>
                    <span className="text-white">{selectedLearner.trackerImei}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Battery Level:</span>
                    <span className="text-emerald-400 font-bold">{selectedLearner.deviceBattery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SIM Card:</span>
                    <span className="text-white">{selectedLearner.simNumber}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => selectedLearner && handleTestPing(selectedLearner.trackerSerial)}
                className="w-full py-2.5 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-dark font-bold uppercase rounded-lg shadow-md cursor-pointer"
              >
                Send Acoustic & Relay Test
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="p-6 bg-brand-navy rounded-2xl border border-slate-800 space-y-4 font-mono">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Wearables Regional Stock & Diagnostics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-dark text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Serial / IMEI</th>
                  <th className="p-3">Assigned Learner</th>
                  <th className="p-3">School</th>
                  <th className="p-3">Battery</th>
                  <th className="p-3">Signal</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {learners.map((l) => (
                  <tr key={l.id} className="hover:bg-brand-dark/50">
                    <td className="p-3 font-bold text-brand-gold">{l.trackerSerial}</td>
                    <td className="p-3 text-white font-bold">{l.name}</td>
                    <td className="p-3">{l.school}</td>
                    <td className="p-3 text-emerald-400 font-bold">{l.deviceBattery}%</td>
                    <td className="p-3">{l.deviceSignal}</td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleTestPing(l.trackerSerial)}
                        className="px-2 py-1 bg-brand-dark border border-brand-gold/30 text-brand-gold text-[10px] rounded hover:border-brand-gold"
                      >
                        Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'diagnostics' && (
        <div className="p-6 bg-brand-navy rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            IoT Base Station & Private Safety APN Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-dark rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">APN Gateway</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">vodacom.itis.sa</span>
              <span className="text-slate-500 text-[10px]">99.98% SLA Availability</span>
            </div>
            <div className="p-4 bg-brand-dark rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Active Wearables Registered</span>
              <span className="text-white font-bold text-sm block mt-1">12,480 Active</span>
              <span className="text-slate-500 text-[10px]">RSA Sovereign Mesh</span>
            </div>
            <div className="p-4 bg-brand-dark rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Average Sensor Sync Latency</span>
              <span className="text-brand-gold font-bold text-sm block mt-1">18ms</span>
              <span className="text-slate-500 text-[10px]">Sub-second dispatch ready</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
