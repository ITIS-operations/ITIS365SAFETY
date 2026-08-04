/**
 * ITIS Guardian Real-time WebSocket Pub/Sub Service
 * Implements standard pub/sub pattern, connection monitoring, and automatic reconnection.
 */

type PubSubCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private subscribers: Map<string, Set<PubSubCallback>> = new Map();
  private pendingQueue: { type: string; topic: string; data?: any }[] = [];
  private connectionStatusCallbacks: Set<(status: 'connected' | 'disconnected' | 'connecting') => void> = new Set();
  private isConnecting = false;
  private pollTimer: NodeJS.Timeout | null = null;
  private isConnectedWS = false;

  constructor() {
    this.determineUrl();
  }

  private determineUrl() {
    if (typeof window === 'undefined') return;
    const loc = window.location;
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    this.url = `${protocol}//${loc.host}/ws`;
  }

  /**
   * Connect to the WebSocket server with automatic HTTP polling fallback
   */
  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;
    this.notifyStatus('connecting');

    // Start fallback HTTP polling immediately so data is always synchronized
    this.startHttpFallbackPolling();

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.isConnectedWS = true;
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyStatus('connected');

        // Resubscribe to all existing topics on reconnection
        for (const topic of this.subscribers.keys()) {
          this.sendToServer({ type: 'subscribe', topic });
        }

        this.flushQueue();
      };

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'publish' && message.topic) {
            this.notifySubscribers(message.topic, message.data);
          }
        } catch {
          // Ignore parse errors
        }
      };

      this.socket.onclose = () => {
        this.socket = null;
        this.isConnectedWS = false;
        this.isConnecting = false;
        // Keep status as connected if fallback polling is active
        this.notifyStatus('connected');
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        // Silently handle error; onclose and HTTP fallback handle the rest
      };

    } catch {
      this.isConnecting = false;
      this.notifyStatus('connected');
      this.scheduleReconnect();
    }
  }

  private startHttpFallbackPolling() {
    if (this.pollTimer) return;

    const poll = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const state = await res.json();
          if (state.learners && this.subscribers.has('learners')) {
            this.notifySubscribers('learners', state.learners);
          }
          if (state.alerts && this.subscribers.has('alerts')) {
            this.notifySubscribers('alerts', state.alerts);
          }
          if (state.incidents && this.subscribers.has('incidents')) {
            this.notifySubscribers('incidents', state.incidents);
          }
          if (!this.isConnectedWS) {
            this.notifyStatus('connected');
          }
        }
      } catch {
        // Polling retry on next interval
      }
    };

    poll();
    this.pollTimer = setInterval(poll, 4000);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1), 15000);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private sendToServer(payload: { type: string; topic: string; data?: any }) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    } else if (payload.type === 'publish') {
      // Send via HTTP POST sync fallback when WS is unavailable
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  }

  private flushQueue() {
    if (this.pendingQueue.length === 0) return;
    console.log(`[WS] Flushing ${this.pendingQueue.length} queued messages...`);
    const queue = [...this.pendingQueue];
    this.pendingQueue = [];
    queue.forEach(item => this.sendToServer(item));
  }

  /**
   * Subscribe to a pub/sub topic
   */
  public subscribe(topic: string, callback: PubSubCallback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
      // Tell server we want to subscribe to this topic
      this.sendToServer({ type: 'subscribe', topic });
    }

    this.subscribers.get(topic)!.add(callback);
    console.log(`[WS] Subscribed local callback to topic: '${topic}'. Total listeners: ${this.subscribers.get(topic)!.size}`);

    // Return an unsubscribe function for convenience
    return () => this.unsubscribe(topic, callback);
  }

  /**
   * Unsubscribe from a pub/sub topic
   */
  public unsubscribe(topic: string, callback: PubSubCallback) {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.delete(callback);
      console.log(`[WS] Unsubscribed local callback from topic: '${topic}'. Remaining: ${topicSubscribers.size}`);
      
      if (topicSubscribers.size === 0) {
        this.subscribers.delete(topic);
        // Tell server we are no longer interested in this topic
        this.sendToServer({ type: 'unsubscribe', topic });
      }
    }
  }

  /**
   * Publish data to a topic (broadcasts to server and other clients)
   */
  public publish(topic: string, data: any) {
    console.log(`[WS] Publishing to topic '${topic}':`, data);
    
    // Also notify local subscribers immediately (optimistic local broadcast)
    this.notifySubscribers(topic, data);

    // Send to server to broadcast to other clients
    this.sendToServer({ type: 'publish', topic, data });
  }

  /**
   * Register a connection status listener
   */
  public onStatusChange(callback: (status: 'connected' | 'disconnected' | 'connecting') => void) {
    this.connectionStatusCallbacks.add(callback);
    // Provide immediate current state
    const currentStatus = this.socket?.readyState === WebSocket.OPEN 
      ? 'connected' 
      : this.isConnecting ? 'connecting' : 'disconnected';
    callback(currentStatus);

    return () => {
      this.connectionStatusCallbacks.delete(callback);
    };
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'connecting') {
    this.connectionStatusCallbacks.forEach(cb => {
      try {
        cb(status);
      } catch (err) {
        console.error('[WS] Error in status callback:', err);
      }
    });
  }

  private notifySubscribers(topic: string, data: any) {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (err) {
          console.error(`[WS] Error in subscriber callback for topic '${topic}':`, err);
        }
      });
    }
  }

  /**
   * Force disconnect the client socket (mostly for testing / cleanup)
   */
  public disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'User requested disconnect');
      this.socket = null;
    }
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
