import { Device, Platforms } from '../../prisma/generated/default.js';
import { BoardsManager } from '../core/manager.js';
import { WithHeaders } from '../types.js';

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

	public async createQrLoginChallenge({ auth, ...rest }: SessionsFunctionsInput['createQrLoginChallenge']) {
		return await this.web.request<QrLoginChallengeOutput>({
			method: 'POST', auth, ...rest,
			endpoint: this.web.qp('/auth/qr/challenges'),
		});
	}

	public async getQrLoginChallengeStatus({ auth, body, ...rest }: SessionsFunctionsInput['getQrLoginChallengeStatus']) {
		return await this.web.request<QrLoginChallengeStatusOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/auth/qr/challenges/status'),
		});
	}

	public async approveQrLogin({ auth, body, ...rest }: SessionsFunctionsInput['approveQrLogin']) {
		return await this.web.request<QrLoginApprovalOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/auth/qr/challenges/approve'),
		});
	}

	public async completeQrLogin({ auth, body, ...rest }: SessionsFunctionsInput['completeQrLogin']) {
		return await this.web.request<QrLoginCompletionOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/auth/qr/challenges/complete'),
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
	'createQrLoginChallenge': { auth: string; };
	'getQrLoginChallengeStatus': { auth: string; body: QrLoginChallengeInput; };
	'approveQrLogin': { auth: string; body: QrLoginApprovalInput; };
	'completeQrLogin': { auth: string; body: QrLoginCompletionInput; };
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
	refreshProfile?: boolean;
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
		isQrLogin: boolean;
	}[];
};

export type QrLoginChallengeInput = {
	challengeId: string;
	secret: string;
};

export type QrLoginChallengeOutput = QrLoginChallengeInput & {
	expiresAt: Date;
};

export type QrLoginChallengeStatusOutput = {
	status: 'pending' | 'approved' | 'consumed' | 'expired';
	expiresAt?: Date;
};

export type QrLoginApprovalInput = QrLoginChallengeInput & {
	expiresInSeconds: number;
};

export type QrLoginApprovalOutput = {
	status: 'approved';
	expiresAt: Date;
};

export type QrLoginCompletionInput = QrLoginChallengeInput & {
	device?: Device;
	ip?: string;
};

export type QrLoginCompletionOutput = {
	token: string;
	expiresAt: Date;
};

export type UnlinkLoginMethodInput = {
	platform: Platforms;
};
