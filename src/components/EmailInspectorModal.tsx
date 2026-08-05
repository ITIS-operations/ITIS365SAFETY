import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Send, CheckCircle2, AlertTriangle, X, Eye, Settings, ShieldCheck, Terminal, Copy, Check, Play } from 'lucide-react';
import { 
  getOutboundQueue, 
  clearEmailQueue, 
  subscribeEmailQueue, 
  getProviderConfig, 
  updateProviderConfig, 
  EmailMessage, 
  EmailProviderType 
} from '../services/emailService';

interface EmailInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateActionToken?: (url: string, token: string, category: string) => void;
}

export const EmailInspectorModal: React.FC<EmailInspectorModalProps> = ({
  isOpen,
  onClose,
  onSimulateActionToken
}) => {
  const [emails, setEmails] = useState<EmailMessage[]>(getOutboundQueue());
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'preview' | 'provider'>('queue');
  const [copiedToken, setCopiedToken] = useState(false);

  // Provider configuration state
  const [providerConfig, setProviderConfigState] = useState(getProviderConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setEmails(getOutboundQueue());
    if (getOutboundQueue().length > 0 && !selectedEmail) {
      setSelectedEmail(getOutboundQueue()[0]);
    }
    const unsubscribe = subscribeEmailQueue(() => {
      const queue = getOutboundQueue();
      setEmails(queue);
      if (queue.length > 0 && (!selectedEmail || !queue.find(m => m.id === selectedEmail.id))) {
        setSelectedEmail(queue[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSaveProviderConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateProviderConfig(providerConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-brand-dark border border-brand-gold/30 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-brand-navy border-b border-brand-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-brand-gold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Enterprise Email Delivery Service Inspector
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  Zero Trust Active
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                18 Categories • HTML Template Engine • Outbound Delivery Queue & Provider Router
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearEmailQueue();
                setSelectedEmail(null);
              }}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-lg text-xs font-mono transition-colors"
            >
              Clear Queue
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-brand-navy/60 px-6 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'queue'
                  ? 'bg-brand-gold text-brand-dark shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Outbound Queue ({emails.length})
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              disabled={!selectedEmail}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'preview'
                  ? 'bg-brand-gold text-brand-dark shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-40'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> HTML Email Inspector
            </button>
            <button
              onClick={() => setActiveTab('provider')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'provider'
                  ? 'bg-brand-gold text-brand-dark shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Provider Abstraction Config
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:block">
            Provider: <strong className="text-brand-gold">{providerConfig.provider}</strong> ({providerConfig.fromAddress})
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'queue' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Email List */}
              <div className="lg:col-span-5 flex flex-col border border-slate-800 bg-brand-navy/40 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
                <div className="p-3 bg-brand-navy border-b border-slate-800 text-xs font-mono text-slate-400 flex justify-between items-center">
                  <span>OUTBOUND DISPATCH LOG</span>
                  <span>{emails.length} Messages</span>
                </div>
                {emails.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">
                    No emails currently in queue.<br />Trigger an identity event (e.g. Forgot Password or Invite User) to inspect outbound delivery.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {emails.map(msg => (
                      <div
                        key={msg.id}
                        onClick={() => setSelectedEmail(msg)}
                        className={`p-3 cursor-pointer transition-colors ${
                          selectedEmail?.id === msg.id
                            ? 'bg-brand-gold/15 border-l-4 border-brand-gold'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-brand-gold/20 text-brand-gold rounded font-bold uppercase">
                            {msg.category}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {msg.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{msg.subject}</div>
                        <div className="text-[11px] text-slate-400 truncate">To: {msg.recipientName} ({msg.recipientEmail})</div>
                        <div className="text-[9px] text-slate-500 font-mono mt-1">Queued: {new Date(msg.queuedAt).toLocaleTimeString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Summary & Interactive Simulation Panel */}
              <div className="lg:col-span-7 flex flex-col border border-slate-800 bg-brand-navy/60 rounded-xl p-5 overflow-y-auto max-h-[60vh]">
                {selectedEmail ? (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="p-3 bg-brand-dark rounded-xl border border-brand-gold/20 flex items-start justify-between">
                      <div>
                        <div className="text-[10px] text-brand-gold uppercase font-bold">Selected Dispatch Record</div>
                        <div className="text-sm font-bold text-white">{selectedEmail.subject}</div>
                        <div className="text-xs text-slate-300 mt-1">Recipient: <strong>{selectedEmail.recipientName}</strong> ({selectedEmail.recipientEmail})</div>
                      </div>
                      <button
                        onClick={() => setActiveTab('preview')}
                        className="px-3 py-1.5 bg-brand-gold text-brand-dark rounded-lg font-bold text-xs flex items-center gap-1 shadow hover:bg-brand-gold-dark transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full HTML Preview
                      </button>
                    </div>

                    {selectedEmail.token && (
                      <div className="p-3 bg-brand-navy border border-brand-gold/30 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-brand-gold font-bold uppercase">Security Token</span>
                          <button
                            onClick={() => handleCopyToken(selectedEmail.token!)}
                            className="text-[10px] text-slate-300 hover:text-white flex items-center gap-1"
                          >
                            {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedToken ? 'Copied' : 'Copy Token'}
                          </button>
                        </div>
                        <div className="font-mono text-sm text-white bg-black/50 p-2 rounded border border-slate-700 truncate">
                          {selectedEmail.token}
                        </div>
                      </div>
                    )}

                    {selectedEmail.actionUrl && (
                      <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2">
                        <div className="text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                          <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Interactive Simulation Trigger
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">
                          Click below to simulate the user receiving this email and clicking the embedded link in their browser!
                        </p>
                        <button
                          onClick={() => {
                            if (onSimulateActionToken) {
                              onSimulateActionToken(selectedEmail.actionUrl!, selectedEmail.token || '', selectedEmail.category);
                            } else {
                              window.open(selectedEmail.actionUrl, '_blank');
                            }
                            onClose();
                          }}
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-brand-dark font-extrabold rounded-lg text-xs font-mono uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2"
                        >
                          Simulate Clicking Action Link ({selectedEmail.category})
                        </button>
                      </div>
                    )}

                    <div className="p-3 bg-brand-dark rounded-xl border border-slate-800 text-[11px] space-y-1">
                      <div className="text-slate-400">Message ID: <span className="text-white">{selectedEmail.id}</span></div>
                      <div className="text-slate-400">Category: <span className="text-brand-gold">{selectedEmail.category}</span></div>
                      <div className="text-slate-400">Dispatch Provider: <span className="text-white">{providerConfig.provider}</span></div>
                      <div className="text-slate-400">Status: <span className="text-emerald-400 font-bold">{selectedEmail.status}</span></div>
                      <div className="text-slate-400">Sent At: <span className="text-white">{selectedEmail.sentAt || 'Queued'}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                    Select an email message from the list to inspect details and simulate action tokens.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'preview' && selectedEmail && (
            <div className="h-full flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-white max-h-[62vh]">
              <div className="bg-slate-900 px-4 py-2 text-xs font-mono text-slate-300 border-b border-slate-800 flex justify-between items-center">
                <span>SUBJECT: {selectedEmail.subject}</span>
                <span className="text-emerald-400">TO: {selectedEmail.recipientEmail}</span>
              </div>
              <iframe
                title="Email HTML Preview"
                srcDoc={selectedEmail.htmlBody}
                className="w-full h-full min-h-[450px] border-none"
              />
            </div>
          )}

          {activeTab === 'provider' && (
            <form onSubmit={handleSaveProviderConfig} className="max-w-3xl mx-auto bg-brand-navy/60 border border-slate-800 rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Settings className="w-4 h-4 text-brand-gold" />
                  Enterprise Email Provider Abstraction Setup
                </h4>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Configure seamless integration with enterprise email infrastructure without hardcoding credentials.
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Email provider configuration updated successfully!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1">Email Provider Service</label>
                  <select
                    value={providerConfig.provider}
                    onChange={(e) => setProviderConfigState({ ...providerConfig, provider: e.target.value as EmailProviderType })}
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="SIMULATED">Simulated Local Delivery Queue (Default)</option>
                    <option value="SMTP">Custom Enterprise SMTP Relay</option>
                    <option value="MICROSOFT_365">Microsoft 365 / Entra Mail API</option>
                    <option value="GOOGLE_WORKSPACE">Google Workspace SMTP</option>
                    <option value="AMAZON_SES">Amazon SES (Simple Email Service)</option>
                    <option value="SENDGRID">SendGrid Transactional API</option>
                    <option value="RESEND">Resend Email API</option>
                    <option value="MAILGUN">Mailgun API</option>
                    <option value="POSTMARK">Postmark Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">From Display Name</label>
                  <input
                    type="text"
                    value={providerConfig.fromName}
                    onChange={(e) => setProviderConfigState({ ...providerConfig, fromName: e.target.value })}
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">From Sender Address</label>
                  <input
                    type="email"
                    value={providerConfig.fromAddress}
                    onChange={(e) => setProviderConfigState({ ...providerConfig, fromAddress: e.target.value })}
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Reply-To Address</label>
                  <input
                    type="email"
                    value={providerConfig.replyTo}
                    onChange={(e) => setProviderConfigState({ ...providerConfig, replyTo: e.target.value })}
                    className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {providerConfig.provider === 'SMTP' && (
                  <>
                    <div>
                      <label className="block text-slate-300 mb-1">SMTP Relay Host</label>
                      <input
                        type="text"
                        value={providerConfig.host || ''}
                        onChange={(e) => setProviderConfigState({ ...providerConfig, host: e.target.value })}
                        placeholder="smtp.itis.gov.za"
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={providerConfig.port || 587}
                        onChange={(e) => setProviderConfigState({ ...providerConfig, port: Number(e.target.value) })}
                        className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </>
                )}

                {providerConfig.provider !== 'SIMULATED' && providerConfig.provider !== 'SMTP' && (
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 mb-1">{providerConfig.provider} API Secret Key</label>
                    <input
                      type="password"
                      value={providerConfig.apiKey || ''}
                      onChange={(e) => setProviderConfigState({ ...providerConfig, apiKey: e.target.value })}
                      placeholder="re_123456789_enterprise_key"
                      className="w-full bg-brand-dark border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-gold text-brand-dark font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider shadow hover:bg-brand-gold-dark transition-colors"
                >
                  Save Email Service Settings
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
