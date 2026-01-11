import { WebSocketMessage, WSConnectionState, SpecialOPCodes, ExtractOpCode, ExtractDataForOp } from './types.js';

export type HandlerFunction = (data: unknown) => void;

export class WSClient<TMessage extends WebSocketMessage = WebSocketMessage> {
	private state: WSConnectionState = WSConnectionState.Disconnected;
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;

	private reconnectTimer: NodeJS.Timeout | null = null;
	private heartbeatTimer: NodeJS.Timeout | null = null;
	private handlers = new Map<number, HandlerFunction>();
	private messageQueue: WebSocketMessage[] = [];
	private url: string;

	private onConnect?: () => void;
	private onDisconnect?: (code?: number, reason?: string) => void;
	private onError?: (error: string) => void;

	constructor (url: string, options: {
		onConnect?: () => void;
		onDisconnect?: (code?: number, reason?: string) => void;
		onError?: (error: string) => void
	} = {}) {
		this.url = url;
		this.onConnect = options.onConnect;
		this.onDisconnect = options.onDisconnect;
		this.onError = options.onError;
	}

	public async connect(): Promise<void> {
		if (this.state === WSConnectionState.Connecting || this.state === WSConnectionState.Connected) {
			return;
		}

		this.state = WSConnectionState.Connecting;

		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.url);

				this.ws.onopen = () => {
					this.state = WSConnectionState.Connected;
					this.reconnectAttempts = 0;
					this.startHeartbeat();
					this.flushMessageQueue();
					this.onConnect?.();
					resolve();
				};

				this.ws.onmessage = (event) => {
					try {
						const message: WebSocketMessage = JSON.parse(event.data);
						this.handleMessage(message);
					} catch (error) {
						console.error('Failed to parse WebSocket message:', error);
					}
				};

				this.ws.onclose = (event) => {
					this.state = WSConnectionState.Disconnected;
					this.stopHeartbeat();
					this.onDisconnect?.(event.code, event.reason);

					if (this.shouldReconnect(event.code)) {
						this.scheduleReconnect();
					}
				};

				this.ws.onerror = () => {
					this.state = WSConnectionState.Error;
					this.onError?.('WebSocket connection error');
					reject(new Error('WebSocket connection failed'));
				};
			} catch (error) {
				this.state = WSConnectionState.Error;
				reject(error);
			}
		});
	}

	public disconnect(): void {
		this.state = WSConnectionState.Disconnected;

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		this.stopHeartbeat();

		if (this.ws) {
			this.ws.close(1000, 'Client disconnect');
			this.ws = null;
		}

		this.messageQueue = [];
		this.handlers.clear();
	}

	public send<TOp extends ExtractOpCode<TMessage>>(
		op: TOp,
		data: ExtractDataForOp<TMessage, TOp>,
	): boolean {
		return this.sendInternal(op as number, data);
	}

	private sendInternal(op: number, data?: unknown): boolean {
		const message = { op, data };

		if (this.state !== WSConnectionState.Connected || !this.ws) {
			if (this.state === WSConnectionState.Connecting) {
				this.messageQueue.push(message);
				return true;
			}

			return false;
		}

		try {
			this.ws.send(JSON.stringify(message));
			return true;
		} catch (error) {
			console.error('Failed to send WebSocket message:', error);
			return false;
		}
	}

	public on<TOp extends ExtractOpCode<TMessage>>(
		op: TOp,
		handler: (data: ExtractDataForOp<TMessage, TOp>) => void,
	): void {
		this.handlers.set(op as number, handler as (data: unknown) => void);
	}

	public off(op: number): void {
		this.handlers.delete(op);
	}

	public getState(): WSConnectionState {
		return this.state;
	}

	private handleMessage(message: WebSocketMessage): void {
		if (message.op === SpecialOPCodes.Ping) {
			this.sendInternal(SpecialOPCodes.Pong);
			return;
		}

		if (message.op === SpecialOPCodes.Pong) {
			return;
		}

		const handler = this.handlers.get(message.op);
		if (handler) {
			try {
				handler(message.data);
			} catch (error) {
				console.error('Error in message handler:', error);
			}
		}
	}

	private startHeartbeat(): void {
		this.heartbeatTimer = setInterval(() => {
			if (this.state === WSConnectionState.Connected) {
				this.sendInternal(SpecialOPCodes.Ping);
			}
		}, 30000);
	}

	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = null;
		}
	}

	private shouldReconnect(code: number): boolean {
		if (code === 1000 || this.reconnectAttempts >= 5) return false;
		return true;
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer) return;

		this.state = WSConnectionState.Reconnecting;
		this.reconnectAttempts++;

		const delay = 1000 * Math.pow(2, Math.min(this.reconnectAttempts - 1, 4));

		this.reconnectTimer = setTimeout(async () => {
			this.reconnectTimer = null;

			try {
				await this.connect();
			} catch (error) {
				console.error('Reconnection failed:', error);
			}
		}, delay);
	}

	private flushMessageQueue(): void {
		while (this.messageQueue.length > 0 && this.state === WSConnectionState.Connected) {
			const message = this.messageQueue.shift()!;
			this.sendInternal(message.op, message.data);
		}
	}
}
