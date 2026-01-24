import { Device, Platforms } from '../../prisma/generated/default';
import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APISessions {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async createSession({ auth, body, ...rest }: SessionsFunctionsInput['createSession']) {
		return await this.web.request<CreateSessionOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async getAllSessions({ auth, ...rest }: SessionsFunctionsInput['getAllSessions']) {
		return await this.web.request<SessionsOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async deleteSession({ auth, dbId, ...rest }: SessionsFunctionsInput['deleteSession']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, body: { dbId }, ...rest,
			endpoint: this.web.qp('/sessions'),
		});
	}

	public async deleteAllSessions({ auth, ...rest }: SessionsFunctionsInput['deleteAllSessions']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: this.web.qp('/sessions/all'),
		});
	}

	public async rotateLinkedSession({ auth, body, ...rest }: SessionsFunctionsInput['rotateLinkedSession']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/sessions/rotate'),
		});
	}
}

// Types.
export type SessionsFunctionsInput = WithHeaders<{
	'createSession': { auth: string; body: CreateSessionInput; };
	'getAllSessions': { auth: string; };
	'deleteSession': { auth: string; dbId: string; };
	'deleteAllSessions': { auth: string; };
	'rotateLinkedSession': { auth: string; body: UnlinkLoginMethodInput; };
}>;

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

export type UnlinkLoginMethodInput = {
	platform: Platforms;
};
