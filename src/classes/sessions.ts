import { Device, Platforms } from '../../prisma/generated/default.js';
import { BoardsManager } from '../core/manager.js';
import { WithHeaders } from '../types.js';

// Data.
export class APISessions {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async createSession({ auth, body, ...rest }: SessionsFunctionsInput['createSession']) {
		return await this.web.request<CreateSessionOutput>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/sessions') });
	}

	public async getAllSessions({ auth, ...rest }: SessionsFunctionsInput['getAllSessions']) {
		return await this.web.request<SessionsOutput>({ method: 'GET', auth, ...rest, endpoint: this.web.qp('/sessions') });
	}

	public async deleteSession({ auth, dbId, ...rest }: SessionsFunctionsInput['deleteSession']) {
		return await this.web.request<string>({ method: 'DELETE', auth, body: { dbId }, ...rest, endpoint: this.web.qp('/sessions') });
	}

	public async deleteAllSessions({ auth, ...rest }: SessionsFunctionsInput['deleteAllSessions']) {
		return await this.web.request<string>({ method: 'DELETE', auth, ...rest, endpoint: this.web.qp('/sessions/all') });
	}

	public async rotateLinkedSession({ auth, body, ...rest }: SessionsFunctionsInput['rotateLinkedSession']) {
		return await this.web.request<string>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/sessions/rotate') });
	}

	public async createQrLoginChallenge({ auth, body, ...rest }: SessionsFunctionsInput['createQrLoginChallenge']) {
		return await this.web.request<QrLoginChallengeOutput>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/auth/qr/challenges') });
	}

	public async lookupQrLoginChallenge({ auth, body, ...rest }: SessionsFunctionsInput['lookupQrLoginChallenge']) {
		return await this.web.request<QrLoginChallengeLookupOutput>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/auth/qr/challenges/lookup') });
	}

	public async decideQrLogin({ auth, body, ...rest }: SessionsFunctionsInput['decideQrLogin']) {
		return await this.web.request<QrLoginDecisionOutput>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/auth/qr/challenges/decision') });
	}

	public async redeemQrLogin({ auth, body, ...rest }: SessionsFunctionsInput['redeemQrLogin']) {
		return await this.web.request<QrLoginRedeemOutput>({ method: 'POST', auth, body, ...rest, endpoint: this.web.qp('/auth/qr/challenges/redeem') });
	}
}

// Types.
export type SessionsFunctionsInput = WithHeaders<{
	'createSession': { auth: string; body: CreateSessionInput; };
	'getAllSessions': { auth: string; };
	'deleteSession': { auth: string; dbId: string; };
	'deleteAllSessions': { auth: string; };
	'rotateLinkedSession': { auth: string; body: UnlinkLoginMethodInput; };
	'createQrLoginChallenge': { auth: string; body: QrLoginChallengeCreateInput; };
	'lookupQrLoginChallenge': { auth: string; body: QrLoginCodeInput; };
	'decideQrLogin': { auth: string; body: QrLoginDecisionInput; };
	'redeemQrLogin': { auth: string; body: QrLoginRedeemInput; };
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

export type CreateSessionOutput = { token: string; expiresAt: Date; };

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

export type QrLoginChallengeCreateInput = { requestDevice?: string; };
export type QrLoginChallengeOutput = { deviceCode: string; userCode: string; expiresAt: Date; requestDevice: string | null; };
export type QrLoginCodeInput = { userCode: string; };
export type QrLoginStatus = 'pending' | 'approved' | 'denied';
export type QrLoginChallengeLookupOutput = { status: QrLoginStatus; userCode: string; expiresAt: Date; requestDevice: string | null; };
export type QrLoginDecisionInput = QrLoginCodeInput & { decision: 'approve' | 'deny'; expiresInSeconds?: number; };
export type QrLoginDecisionOutput = { status: 'approved'; expiresAt: Date; } | { status: 'denied'; };
export type QrLoginRedeemInput = { deviceCode: string; device?: Device; };
export type QrLoginRedeemOutput = {
	status: 'pending' | 'denied' | 'expired';
	token?: undefined;
	expiresAt?: undefined;
} | {
	status: 'approved';
	token: string;
	expiresAt: Date;
	redirectDelay: boolean;
};
export type UnlinkLoginMethodInput = { platform: Platforms; };
