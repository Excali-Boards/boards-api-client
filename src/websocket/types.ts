export type WebSocketMessage<T = unknown> = {
	op: number;
	data: T;
}

export enum SpecialOPCodes {
	Ping = -1,
	Pong = -2,
}

export enum WSConnectionState {
	Disconnected = 0,
	Connecting = 1,
	Connected = 2,
	Reconnecting = 3,
	Error = 4,
}

export type WSOptions = {
	baseUrl?: string;
	onConnect?: () => void;
	onDisconnect?: (code?: number, reason?: string) => void;
	onError?: (error: string) => void;
}

export type ExtractOpCode<T> = T extends { op: infer U } ? U : never;
export type ExtractDataForOp<TMessage, TOp> = TMessage extends { op: TOp; data: infer U } ? U : never;
