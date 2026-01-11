import { WSConnectionState, WSOptions, WebSocketMessage } from './types.js';
import { WSClient } from './client.js';

const connections = new Map<string, WSClient<WebSocketMessage>>();

function createWebSocketUrl(path: string, baseUrl?: string): string {
	const base = baseUrl || (typeof window !== 'undefined' ? window.location.host : 'localhost:3000');
	const protocol = base.startsWith('https') || base.includes('443') ? 'wss' : 'ws';

	return `${protocol}://${base.replace(/^https?:\/\//g, '')}${path}`;
}

export function createConnection<TMessage extends WebSocketMessage = WebSocketMessage>(path: string, options: WSOptions = {}): WSClient<TMessage> {
	const url = createWebSocketUrl(path, options.baseUrl);

	const existing = connections.get(path);
	if (existing && existing.getState() === WSConnectionState.Connected) return existing as WSClient<TMessage>;

	const client = new WSClient<TMessage>(url, {
		onError: options.onError,
		onConnect: options.onConnect,
		onDisconnect: (code, reason) => {
			connections.delete(path);
			options.onDisconnect?.(code, reason);
		},
	});

	connections.set(path, client);
	return client;
}

// Exports.
export * from './hooks/useExecutor.js';
export * from './hooks/useWebSocket.js';
