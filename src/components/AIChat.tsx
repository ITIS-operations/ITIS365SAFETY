import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, AlertCircle, RefreshCw, Cpu, BookOpen, ShieldAlert } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Awaiting instruction. I am ITIS AI, connected to the National Command Centre intelligence grid. Ask me about POPIA compliance, safe zone curfews, wearable tracker battery diagnostics, or South African public safety protocols."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setDemoNotice(null);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to communicate with ITIS AI.");
      }

      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (err: any) {
      console.warn("API Error, falling back to simulated local model:", err);
      // Simulate intelligent response when API Key is missing or service is offline
      setIsDemoMode(true);
      let reply = "I am processing your query in secure simulation mode: ";
      
      const promptLower = userMessage.toLowerCase();
      if (promptLower.includes("popia") || promptLower.includes("privacy") || promptLower.includes("compliance")) {
        reply = "🔒 **POPIA (Protection of Personal Information Act) Protocol**:\n\nITIS Guardian processes all live GPS telemetry locally inside the tamper-resistant hardware memory of the tracker. Data streams are fully encrypted using military-grade RSA-2048 keys. In compliance with South African laws:\n\n1. Telemetry is deleted automatically after 7 days unless locked inside an active Investigation Case.\n2. Location tracking is active only when the child is outside declared Safe Zones or if a Panic SOS has been triggered.\n3. Parents maintain full control to delete all personal historical routing statistics instantly.";
      } else if (promptLower.includes("battery") || promptLower.includes("charge") || promptLower.includes("power")) {
        reply = "🔋 **Tracker Battery & Diagnostics Report**:\n\nStandard battery life on ITIS-TRK modules is 48 hours in passive telemetry mode. If battery levels deplete:\n\n- **Below 20%**: An automatic SMS and push alert are dispatched to all assigned guardians.\n- **Below 10%**: The device switches to Low-Power Tracking mode, adjusting GPS pings to a 5-minute interval.\n- **Charging Recommendation**: Use the provided magnetic charger for 45 minutes to reach full capacity. Do not use high-voltage chargers as they may damage the internal temperature sensors.";
      } else if (promptLower.includes("saps") || promptLower.includes("police") || promptLower.includes("emergency") || promptLower.includes("incident")) {
        reply = "🚨 **ITIS Emergency Dispatch Integration**:\n\nUpon a Panic/SOS button hold (3 seconds):\n\n1. **Telemetry Broadcaster**: Active ping rate elevates to 5-second intervals.\n2. **Voice Loop**: The high-gain microphone activates to transmit ambient audio to the ITIS Command Centre.\n3. **SAPS Joint Taskforce**: A priority dispatch request is pushed to the nearest SAPS unit and private security responders.\n4. **Average ETA**: Our current joint response latency in metropolitan zones (Johannesburg, Sandton, Cape Town CBD) is **6.4 minutes**.";
      } else if (promptLower.includes("safe zone") || promptLower.includes("curfew") || promptLower.includes("zone")) {
        reply = "🛡️ **Safe Zone Rules & Curfew Adjustments**:\n\nSafe zones represent virtual geofences. For maximum security, we recommend:\n\n- **School Zone**: Radius of 200m - 300m with arrival/departure SMS active.\n- **Home Zone**: Radius of 150m with curfew notifications active.\n- **Curfew Rules**: Set a strict curfew on the tracker (e.g. 'Must be at home by 17:00'). If the wearable leaves or fails to arrive in the designated boundary on time, the National Command Center automatically initiates a silent ping cascade to verify status.";
      } else {
        reply = `🛡️ **ITIS Guardian Intelligence Response**:\n\nThank you for reaching out. In South Africa public safety grids:\n- **Emergency Dispatch Call**: Average dispatch time is 6.4 minutes. Our systems route instantly to SAPS (10111) and Joint Private Medical Response (10177).\n- **Diagnostic Telemetry**: Safe zone tracking status is currently optimal.\n- **POPIA Assurance**: Data remains secured inside our high-grade cloud containment vaults. Would you like me to initiate a diagnostic signal to your child's tracking wearable?`;
      }

      setMessages(prev => [...prev, { role: 'model', content: reply }]);
      setDemoNotice("Simulation mode active: To connect to live server-side Gemini AI, please register a valid GEMINI_API_KEY in Settings > Secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (presetText: string) => {
    setInput(presetText);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-x-2 sm:left-auto sm:right-6 bottom-20 max-w-md h-[500px] sm:h-[550px] glass-panel-heavy rounded-2xl shadow-2xl z-40 border border-brand-gold/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
      id="itis-ai-assistant-panel"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-brand-navy to-brand-navy-light border-b border-brand-gold/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-dark border border-brand-gold flex items-center justify-center glow-gold">
            <Cpu className="w-4 h-4 text-brand-gold animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              ITIS AI Command Assistant
              <span className="text-[9px] bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/30 font-mono">v2.4</span>
            </h3>
            <p className="text-[10px] text-brand-silver">National Security & Diagnostic Intelligence</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Demo Notice Alert */}
      {demoNotice && (
        <div className="p-2 bg-brand-gold/10 border-b border-brand-gold/20 flex items-start gap-1.5 text-[10px] text-brand-gold">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{demoNotice}</span>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm bg-brand-dark/50" id="chat-messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className="w-7 h-7 rounded-full bg-brand-navy-light border border-brand-gold/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-brand-gold" />
              </div>
            )}
            <div 
              className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-gold text-brand-dark font-medium rounded-tr-none' 
                  : 'bg-brand-navy-light/60 text-slate-100 border border-brand-gold/10 rounded-tl-none font-sans'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('-') || line.startsWith('*') ? 'mt-1' : 'mb-1'}>
                  {line}
                </p>
              ))}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-brand-gold" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-brand-navy-light border border-brand-gold/30 flex items-center justify-center animate-spin">
              <RefreshCw className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="bg-brand-navy-light/60 text-slate-300 border border-brand-gold/10 rounded-xl rounded-tl-none p-3 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-bounce delay-150"></span>
              <span>Interfacing National Database...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-brand-dark/90 border-t border-brand-gold/10 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
        <button 
          onClick={() => loadPreset("How does ITIS comply with POPIA regulations in SA?")}
          className="px-2.5 py-1 bg-brand-navy border border-brand-gold/15 hover:border-brand-gold/40 text-[10px] text-brand-silver rounded-full transition-all font-mono"
        >
          🔒 POPIA Privacy
        </button>
        <button 
          onClick={() => loadPreset("My wearable tracker battery is draining too fast")}
          className="px-2.5 py-1 bg-brand-navy border border-brand-gold/15 hover:border-brand-gold/40 text-[10px] text-brand-silver rounded-full transition-all font-mono"
        >
          🔋 Battery Diagnostics
        </button>
        <button 
          onClick={() => loadPreset("What is the SAPS joint emergency response protocol?")}
          className="px-2.5 py-1 bg-brand-navy border border-brand-gold/15 hover:border-brand-gold/40 text-[10px] text-brand-silver rounded-full transition-all font-mono"
        >
          🚨 SAPS / EMS Response
        </button>
        <button 
          onClick={() => loadPreset("How should I configure Safe Zones and curfew timings?")}
          className="px-2.5 py-1 bg-brand-navy border border-brand-gold/15 hover:border-brand-gold/40 text-[10px] text-brand-silver rounded-full transition-all font-mono"
        >
          🛡️ Safe Zones Curfew
        </button>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-brand-navy border-t border-brand-gold/20 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ITIS intelligence core..."
          className="flex-1 bg-brand-dark border border-brand-gold/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-gold font-sans"
        />
        <button
          type="submit"
          className="bg-brand-gold hover:bg-brand-gold-dark text-brand-dark p-2 rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
