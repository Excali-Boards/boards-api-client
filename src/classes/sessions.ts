import { Device, Platforms } from '../../prisma/generated/default';
import { BoardsManager } from '../core/manager';

// Data.
export class APISessions {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async createSession({ auth, body }: SessionsFunctionsInput['createSession']) {
		return await this.web.request<CreateSessionOutput>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async getAllSessions({ auth }: SessionsFunctionsInput['getAllSessions']) {
		return await this.web.request<SessionsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async deleteSession({ auth, dbId }: SessionsFunctionsInput['deleteSession']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, body: { dbId },
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async deleteAllSessions({ auth }: SessionsFunctionsInput['deleteAllSessions']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp('/sessions/all'),
		});
	}
}

// Types.
export type SessionsFunctionsInput = {
	'createSession': { auth: string; body: CreateSessionInput; };
	'getAllSessions': { auth: string; };
	'deleteSession': { auth: string; dbId: string; };
	'deleteAllSessions': { auth: string; };
}

// External.
export type CreateSessionInput = {
	ip?: string;
	email: string;
	device?: Device;
	platform: Platforms;
	displayName: string;
	avatarUrl?: string | null;
	currentUserId?: string;
};

export type CreateSessionOutput = {
	token: string;
	expiresAt: Date;
};

export type SessionsOutput = {
	activeDbId: string;
	sessions: {
		location: string | null;
		device: Device | null;

		tokenPreview: string;
		dbId: string;

		expiresAt: Date;
		createdAt: Date;
		lastUsed: Date;
	}[];
};
