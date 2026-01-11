import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

export type UseExecutorOptions = {
	autoConnect?: boolean;
	baseUrl?: string;
	onOutput?: (output: string, type: 'stdout' | 'stderr') => void;
	onSessionComplete?: (exitCode: number) => void;
	onError?: (error: string) => void;
};

export function useExecutor(options: UseExecutorOptions = {}) {
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [outputs, setOutputs] = useState<{ output: string; type: 'stdout' | 'stderr'; timestamp: number }[]>([]);

	const {
		connectionState,
		error,
		isConnected,
		connect,
		disconnect,
		send,
		on,
	} = useWebSocket<ExecutorWSMessageUnion>('/executor', {
		autoConnect: options.autoConnect,
		baseUrl: options.baseUrl,
		onError: options.onError,
	});

	useEffect(() => {
		if (!isConnected) return;

		on(ExecutorWSOpCodes.CodeSessionCreated, (data) => {
			setSessionId(data.sessionId);
		});

		on(ExecutorWSOpCodes.CodeOutput, (data) => {
			const outputEntry = {
				output: data.output,
				type: data.type,
				timestamp: Date.now(),
			};
			setOutputs((prev) => [...prev, outputEntry]);
			options.onOutput?.(data.output, data.type);
		});

		on(ExecutorWSOpCodes.CodeSessionCompleted, (data) => {
			setSessionId(null);
			options.onSessionComplete?.(data.exitCode);
		});

		on(ExecutorWSOpCodes.CodeSessionError, (data) => {
			options.onError?.(data.error);
		});
	}, [isConnected, on, options]);

	const startSession = useCallback(async (code: string, language: string) => {
		if (!isConnected) await connect();

		setOutputs([]);
		return send(ExecutorWSOpCodes.StartCodeSession, { code, language });
	}, [isConnected, connect, send]);

	const sendInput = useCallback((input: string) => {
		if (!sessionId) return false;
		return send(ExecutorWSOpCodes.SendCodeInput, { sessionId, input });
	}, [sessionId, send]);

	const stopSession = useCallback(() => {
		if (!sessionId) return false;
		return send(ExecutorWSOpCodes.StopCodeSession, { sessionId });
	}, [sessionId, send]);

	return {
		connectionState,
		error,
		isConnected,
		connect,
		disconnect,
		startSession,
		sendInput,
		stopSession,
		sessionId,
		outputs,
		isSessionActive: sessionId !== null,
	};
}

// Executor WebSocket message types and opcodes
export enum ExecutorWSOpCodes {
	StartCodeSession = 1,
	CodeSessionCreated = 2,
	CodeOutput = 3,
	CodeSessionError = 5,
	CodeSessionCompleted = 6,
	SendCodeInput = 7,
	StopCodeSession = 8,
}

export type ExecutorWSMessage<T extends ExecutorWSOpCodes> = {
	op: T;
	data: T extends ExecutorWSOpCodes.StartCodeSession ? {
		code: string;
		language: string;
	} : T extends ExecutorWSOpCodes.CodeSessionCreated ? {
		sessionId: string;
	} : T extends ExecutorWSOpCodes.CodeOutput ? {
		sessionId: string;
		output: string;
		type: 'stdout' | 'stderr';
	} : T extends ExecutorWSOpCodes.CodeSessionError ? {
		sessionId: string | null;
		error: string;
	} : T extends ExecutorWSOpCodes.CodeSessionCompleted ? {
		sessionId: string;
		exitCode: number;
	} : T extends ExecutorWSOpCodes.SendCodeInput ? {
		sessionId: string;
		input: string;
	} : T extends ExecutorWSOpCodes.StopCodeSession ? {
		sessionId: string;
	} : never;
};

export type ExecutorWSMessageUnion =
	| ExecutorWSMessage<ExecutorWSOpCodes.StartCodeSession>
	| ExecutorWSMessage<ExecutorWSOpCodes.CodeSessionCreated>
	| ExecutorWSMessage<ExecutorWSOpCodes.CodeOutput>
	| ExecutorWSMessage<ExecutorWSOpCodes.CodeSessionError>
	| ExecutorWSMessage<ExecutorWSOpCodes.CodeSessionCompleted>
	| ExecutorWSMessage<ExecutorWSOpCodes.SendCodeInput>
	| ExecutorWSMessage<ExecutorWSOpCodes.StopCodeSession>;
