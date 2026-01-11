import { WSConnectionState, WSOptions, WebSocketMessage, ExtractOpCode, ExtractDataForOp } from '../types.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createConnection } from '../manager.js';
import type { WSClient } from '../client.js';

export function useWebSocket<TMessage extends WebSocketMessage = WebSocketMessage>(path: string, options: WSOptions & { autoConnect?: boolean } = {}) {
	const { autoConnect = true, ...wsOptions } = options;

	const [connectionState, setConnectionState] = useState<WSConnectionState>(WSConnectionState.Disconnected);
	const [error, setError] = useState<string | null>(null);
	const clientRef = useRef<WSClient<TMessage> | null>(null);

	const connect = useCallback(async () => {
		if (clientRef.current?.getState() === WSConnectionState.Connected) return clientRef.current;

		try {
			setConnectionState(WSConnectionState.Connecting);

			const client = createConnection<TMessage>(path, {
				...wsOptions,
				onConnect: () => {
					setConnectionState(WSConnectionState.Connected);
					setError(null);
					wsOptions.onConnect?.();
				},
				onDisconnect: (code?: number, reason?: string) => {
					setConnectionState(WSConnectionState.Disconnected);
					clientRef.current = null;
					wsOptions.onDisconnect?.(code, reason);
				},
				onError: (err: string) => {
					setConnectionState(WSConnectionState.Error);
					setError(err);
					wsOptions.onError?.(err);
				},
			});

			clientRef.current = client;
			await client.connect();
			return client;
		} catch (err) {
			setConnectionState(WSConnectionState.Error);
			setError(err instanceof Error ? err.message : 'Connection failed');
			throw err;
		}
	}, [path, wsOptions]);

	const disconnect = useCallback(() => {
		clientRef.current?.disconnect();
		clientRef.current = null;
		setConnectionState(WSConnectionState.Disconnected);
	}, []);

	const send = useCallback(<TOp extends ExtractOpCode<TMessage>>(
		op: TOp,
		data: ExtractDataForOp<TMessage, TOp>,
	): boolean => {
		return clientRef.current?.send(op, data) ?? false;
	}, []);

	const on = useCallback(<TOp extends ExtractOpCode<TMessage>>(
		op: TOp,
		handler: (data: ExtractDataForOp<TMessage, TOp>) => void,
	): void => {
		clientRef.current?.on(op, handler);
	}, []);

	useEffect(() => {
		if (autoConnect) connect().catch(console.error);
		return disconnect;
	}, [autoConnect, connect, disconnect]);

	return {
		error,
		connectionState,
		client: clientRef.current,
		isConnected: connectionState === WSConnectionState.Connected,
		isConnecting: connectionState === WSConnectionState.Connecting,
		connect,
		disconnect,
		send,
		on,
	};
}
