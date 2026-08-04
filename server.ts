import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { initialLearners, initialSafeZones, initialAlerts, initialIncidents } from "./src/types";

// Server-authoritative in-memory state
let serverLearners = [...initialLearners];
const serverSafeZones = [...initialSafeZones];
let serverAlerts = [...initialAlerts];
let serverIncidents = [...initialIncidents];

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API endpoint for ITIS AI Assistant
app.post("/api/assistant", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const client = getGeminiClient();
    
    const systemInstruction = `You are ITIS AI, the integrated safety artificial intelligence assistant for the ITIS Guardian Platform (Integrated Technology Intelligence & Safety) in South Africa.
Your target users are parents, school administrators, teachers, emergency responders (SAPS, ambulances, firefighters), and public safety officials.
You are professional, authoritative, reassuring, and highly knowledgeable about public safety, South African public safety context (SAPS, POPIA compliance, safe/high-risk areas in Johannesburg, Cape Town, Durban, etc.), wearable GPS safety tracker diagnostics, emergency protocols, and school attendance metrics.

When asked:
- Provide actionable safety advice and emergency guidance (e.g., "In South Africa, SAPS emergency number is 10111", "National medical emergency response is 10177").
- Describe the ITIS National Command Centre response timeline (average response: 6.4 minutes).
- Troubleshoot wearable tracking devices (e.g. low battery, weak cellular signal, SOS button activation, tamper/removal alerts).
- Explain POPIA (Protection of Personal Information Act) compliance in South Africa: ITIS processes coordinates locally, fully encrypted, and only transmits during emergency trigger intervals.
- Always be structured, authoritative, and extremely reassuring. Format your responses with clear spacing and bullet points. Do not refer to file structures or technical code files. Keep responses focused on South Africa safety parameters. Use local terminology ("learner", "robot", "SAPS", "R" or "ZAR" currency, "taxi rank", "GP/WC/KZN provinces").`;

    // Map messages to Gemini API format
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    if (!process.env.GEMINI_API_KEY || error.message?.includes("GEMINI_API_KEY") || error.message?.includes("apiKey")) {
      return res.status(503).json({ 
        error: "ITIS AI is currently in Consultation Simulation mode because the GEMINI_API_KEY is not configured in Settings > Secrets. To connect live, please save your API key in secrets.",
        isDemoMode: true
      });
    }
    res.status(500).json({ error: error.message || "An unexpected error occurred in ITIS intelligence core." });
  }
});

// REST sync API for real-time state fallback
app.get("/api/state", (req, res) => {
  res.json({
    learners: serverLearners,
    safeZones: serverSafeZones,
    alerts: serverAlerts,
    incidents: serverIncidents,
  });
});

app.post("/api/state", (req, res) => {
  try {
    const { topic, data } = req.body;
    if (topic === "learners") {
      if (Array.isArray(data)) {
        serverLearners = data;
      } else {
        serverLearners = serverLearners.map(l => l.id === data.id ? { ...l, ...data } : l);
      }
    } else if (topic === "alerts") {
      if (Array.isArray(data)) {
        serverAlerts = data;
      } else {
        if (!serverAlerts.some(a => a.id === data.id)) {
          serverAlerts = [data, ...serverAlerts];
        }
      }
    } else if (topic === "incidents") {
      if (Array.isArray(data)) {
        serverIncidents = data;
      } else {
        if (serverIncidents.some(i => i.id === data.id)) {
          serverIncidents = serverIncidents.map(i => i.id === data.id ? { ...i, ...data } : i);
        } else {
          serverIncidents = [data, ...serverIncidents];
        }
      }
    }

    // Broadcast update to active WebSocket clients if available
    connectedClients.forEach((subs, client) => {
      if (client.readyState === WebSocket.OPEN && subs.has(topic)) {
        client.send(JSON.stringify({ type: "publish", topic, data }));
      }
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create HTTP Server
const server = http.createServer(app);

// Create WebSocket Server on noServer mode with explicit upgrade matching
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const url = request.url || "";
  if (url.includes("/ws")) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  }
});

// Track connected WebSocket clients and their subscribed topics
const connectedClients = new Map<WebSocket, Set<string>>();

wss.on("connection", (ws) => {
  console.log("[WS Server] Client connected");
  connectedClients.set(ws, new Set());

  ws.on("message", (messageStr) => {
    try {
      const message = JSON.parse(messageStr.toString());
      const { type, topic, data } = message;

      if (!topic) return;

      const subscriptions = connectedClients.get(ws);
      if (!subscriptions) return;

      if (type === "subscribe") {
        subscriptions.add(topic);
        console.log(`[WS Server] Client subscribed to '${topic}'`);

        // Send initial state upon subscription (Source of Truth sync)
        if (topic === "learners") {
          ws.send(JSON.stringify({ type: "publish", topic: "learners", data: serverLearners }));
        } else if (topic === "alerts") {
          ws.send(JSON.stringify({ type: "publish", topic: "alerts", data: serverAlerts }));
        } else if (topic === "incidents") {
          ws.send(JSON.stringify({ type: "publish", topic: "incidents", data: serverIncidents }));
        }
      } 
      else if (type === "unsubscribe") {
        subscriptions.delete(topic);
        console.log(`[WS Server] Client unsubscribed from '${topic}'`);
      } 
      else if (type === "publish") {
        console.log(`[WS Server] Published update on '${topic}'`);

        // Update server authoritative state
        if (topic === "learners") {
          if (Array.isArray(data)) {
            serverLearners = data;
          } else {
            serverLearners = serverLearners.map(l => l.id === data.id ? { ...l, ...data } : l);
          }
        } else if (topic === "alerts") {
          if (Array.isArray(data)) {
            serverAlerts = data;
          } else {
            if (!serverAlerts.some(a => a.id === data.id)) {
              serverAlerts = [data, ...serverAlerts];
            }
          }
        } else if (topic === "incidents") {
          if (Array.isArray(data)) {
            serverIncidents = data;
          } else {
            if (serverIncidents.some(i => i.id === data.id)) {
              serverIncidents = serverIncidents.map(i => i.id === data.id ? { ...i, ...data } : i);
            } else {
              serverIncidents = [data, ...serverIncidents];
            }
          }
        }

        // Broadcast to all other clients subscribed to this topic
        connectedClients.forEach((subs, client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN && subs.has(topic)) {
            client.send(JSON.stringify({ type: "publish", topic, data }));
          }
        });
      }
    } catch (err) {
      console.error("[WS Server] Error processing message:", err);
    }
  });

  ws.on("close", () => {
    console.log("[WS Server] Client disconnected");
    connectedClients.delete(ws);
  });

  ws.on("error", (err) => {
    console.error("[WS Server] Client connection error:", err);
    connectedClients.delete(ws);
  });
});

// Periodic Simulation Tick: Updates learner parameters and coordinates periodically
// to provide live telemetry updates to active UI dashboards over WebSockets.
setInterval(() => {
  if (connectedClients.size === 0) return; // No active clients, save resources

  let changed = false;
  serverLearners = serverLearners.map(l => {
    changed = true;
    let lat = l.latitude;
    let lng = l.longitude;
    let battery = l.deviceBattery;

    // Simulate small random coordinates movement for en route learners
    if (l.status === 'En Route') {
      lat += (Math.random() - 0.49) * 0.0004; 
      lng += (Math.random() - 0.5) * 0.0006;
    } else if (l.status === 'Emergency') {
      // Emergency: larger movement representing active response pursuit or escape vector
      lat += (Math.random() - 0.5) * 0.0009;
      lng += (Math.random() - 0.5) * 0.0012;
    }

    // Fluctuate health and diagnostic sensors
    const hr = l.heartRate ? Math.max(65, Math.min(140, l.heartRate + Math.floor(Math.random() * 5) - 2)) : 74;
    const temp = l.temperature ? Math.max(36.1, Math.min(38.8, l.temperature + (Math.random() * 0.2 - 0.1))) : 36.6;
    
    // Slow battery drain
    if (Math.random() < 0.05) {
      battery = Math.max(5, battery - 1);
    }

    return {
      ...l,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      heartRate: hr,
      temperature: Number(temp.toFixed(1)),
      deviceBattery: battery,
      lastConnection: 'Just now'
    };
  });

  if (changed) {
    // Broadcast latest learner positions to all clients subscribed to learners
    connectedClients.forEach((subs, client) => {
      if (client.readyState === WebSocket.OPEN && subs.has("learners")) {
        client.send(JSON.stringify({ type: "publish", topic: "learners", data: serverLearners }));
      }
    });
  }
}, 5000);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`ITIS Server successfully initialized at port ${PORT}`);
  });
}

startServer();
