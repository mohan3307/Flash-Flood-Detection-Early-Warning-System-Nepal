import { StreamFrame } from '../types';

export class StreamWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private listeners: ((frame: StreamFrame) => void)[] = [];
  private isIntentionalClose = false;
  private reconnectTimer: any = null;
  private disconnectTimer: any = null;

  constructor() {
    const isLocalDev =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalDev) {
      // Connect directly to backend FastAPI WebSocket server on port 8000
      this.url = `ws://${window.location.hostname}:8000/ws/stream`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      this.url = `${protocol}//${host}/ws/stream`;
    }
  }

  connect() {
    // If a disconnect was queued by React StrictMode quick unmount/remount, cancel it
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
      this.disconnectTimer = null;
    }

    this.isIntentionalClose = false;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[SENSORA-WS] Connected directly to real-time telemetry stream:', this.url);
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
          this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        }
      };

      this.ws.onerror = () => {
        if (!this.isIntentionalClose) {
          console.debug('[SENSORA-WS] Retrying stream connection...');
        }
      };
    } catch (e) {
      this.reconnectTimer = setTimeout(() => this.connect(), 2000);
    }
  }

  disconnect() {
    // Debounce teardown so React StrictMode double-mount cycle does not abort in-flight handshake
    if (this.disconnectTimer) {
      clearTimeout(this.disconnectTimer);
    }

    this.disconnectTimer = setTimeout(() => {
      this.isIntentionalClose = true;
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      if (this.ws) {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.close();
        } else if (this.ws.readyState === WebSocket.CONNECTING) {
          const socketToClose = this.ws;
          socketToClose.onopen = () => {
            try {
              socketToClose.close();
            } catch (_) {}
          };
        }
        this.ws = null;
      }
      this.disconnectTimer = null;
    }, 250);
  }

  subscribe(listener: (frame: StreamFrame) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(frame: StreamFrame) {
    this.listeners.forEach((listener) => {
      try {
        listener(frame);
      } catch (err) {
        console.error('[SENSORA-WS] Listener execution error:', err);
      }
    });
  }
}

export const streamSocket = new StreamWebSocket();
