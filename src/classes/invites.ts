import { BoardRole, CategoryRole, GroupRole } from '../../prisma/generated/default';
import { ResourceType } from '../external/types';
import { BoardsManager } from '../core/manager';

// Data.
export class APIInvites {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getInvites({ auth }: InvitesFunctionsInput['getInvites']) {
		return await this.web.request<GetInvitesOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/invites'),
		});
	}

	public async createInvite({ auth, body }: InvitesFunctionsInput['createInvite']) {
		return await this.web.request<CreateInviteOutput>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/invites'),
		});
	}

	public async useInvite({ auth, code }: InvitesFunctionsInput['useInvite']) {
		return await this.web.request<UseInviteOutput>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/invites/${code}`),
		});
	}

	public async revokeInvite({ auth, code }: InvitesFunctionsInput['revokeInvite']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/invites/${code}`),
		});
	}
}

// Types.
export type InvitesFunctionsInput = {
	'getInvites': { auth: string; };
	'createInvite': { auth: string; body: CreateInviteInput; };
	'useInvite': { auth: string; code: string; };
	'revokeInvite': { auth: string; code: string; };
}

// External.
export type CreateInviteInput = {
	groupIds?: string[];
	categoryIds?: string[];
	boardIds?: string[];
	groupRole?: GroupRole;
	categoryRole?: CategoryRole;
	boardRole?: BoardRole;
	expiresIn?: number; // days, 1-30, default 7
	maxUses?: number; // min 1
};

export type CreateInviteOutput = {
	code: string;
	expiresAt: string;
	maxUses: number;
};

export type GetInvitesOutput = {
	dbId: string;
	code: string;
	createdBy: string;
	expiresAt: string | null;
	maxUses: number | null;
	currentUses: number;
	groupIds: string[];
	categoryIds: string[];
	boardIds: string[];
	groupRole: GroupRole | null;
	categoryRole: CategoryRole | null;
	boardRole: BoardRole | null;
	createdAt: string;
}[];

export type GrantedRole = {
	type: ResourceType;
	resourceId: string;
	role: BoardRole | CategoryRole | GroupRole;
};

export type UseInviteOutput = {
	granted: GrantedRole[];
	details: {
		groups: { groupId: string; name: string; }[];
		categories: { categoryId: string; name: string; groupId: string; }[];
		boards: { boardId: string; name: string; categoryId: string; }[];
	};
};
