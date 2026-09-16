import { StreamFrame } from '../types';

export class StreamWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: ((frame: StreamFrame) => void)[] = [];
  private isIntentionalClose = false;
  private reconnectTimer: any = null;

  constructor() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    // Vite proxy directs /ws to backend ws://127.0.0.1:8000/ws
    this.url = `${protocol}//${host}/ws/stream`;
  }

  connect() {
    this.isIntentionalClose = false;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[SENSORA-WS] Connected to real-time stream');
      };

      this.ws.onmessage = (event) => {
        try {
          const frame: StreamFrame = JSON.parse(event.data);
          this.notify(frame);
        } catch (err) {
          console.error('[SENSORA-WS] Parse error:', err);
        }
      };

      this.ws.onclose = () => {
        if (!this.isIntentionalClose) {
          console.log('[SENSORA-WS] Disconnected. Reconnecting in 2s...');
          this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[SENSORA-WS] Socket error:', err);
      };
    } catch (e) {
      console.error('[SENSORA-WS] Connection error:', e);
      this.reconnectTimer = setTimeout(() => this.connect(), 2000);
    }
  }

  disconnect() {
    this.isIntentionalClose = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(listener: (frame: StreamFrame) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(frame: StreamFrame) {
    for (const listener of this.listeners) {
      listener(frame);
    }
  }
}

export const streamSocket = new StreamWebSocket();
