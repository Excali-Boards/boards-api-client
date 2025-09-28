import { BoardRole, CategoryRole, GroupRole } from '../external/vars';
import { GrantedRoles, ResourceType } from '../external/types';
import { Invite } from '../../prisma/generated';
import { BoardsManager } from '../core/manager';

// Data.
export class APIInvites {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUserInvites({ auth }: InvitesFunctionsInput['getUserInvites']) {
		return await this.web.request<GetUserInvitesOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/invites'),
		});
	}

	public async getResourceInvites({ auth, query }: InvitesFunctionsInput['getResourceInvites']) {
		return await this.web.request<GetResourceInvitesOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/resources/invites', query),
		});
	}

	public async getInviteDetails({ auth, code }: InvitesFunctionsInput['getInviteDetails']) {
		return await this.web.request<InviteDetails>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/invites/${code}`),
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

	public async renewInvite({ auth, code }: InvitesFunctionsInput['renewInvite']) {
		return await this.web.request<RenewInviteOutput>({
			method: 'PATCH', auth,
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
	'getUserInvites': { auth: string; };
	'getResourceInvites': { auth: string; query: ViewInvitesQuery; };
	'getInviteDetails': { auth: string; code: string; };
	'createInvite': { auth: string; body: CreateInviteInput; };
	'useInvite': { auth: string; code: string; };
	'revokeInvite': { auth: string; code: string; };
	'renewInvite': { auth: string; code: string; };
}

// External.
export type ViewInvitesQuery = {
	type: ResourceType;
	groupId?: string;
	categoryId?: string;
	boardId?: string;
};

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

export type RenewInviteOutput = CreateInviteOutput & {
	currentUses: number;
};

export type GetUserInvitesOutput = {
	invites: InviteData[];
	canInvite: boolean;
};

export type GetResourceInvitesOutput = InviteData[];

export type UseInviteOutput = {
	granted: GrantedRoles;
	details: {
		groups: { groupId: string; name: string; }[];
		categories: { categoryId: string; name: string; groupId: string; }[];
		boards: { boardId: string; name: string; categoryId: string; }[];
	};
};

export type InviteDetails = RenewInviteOutput & {
	invitedBy: {
		userId: string;
		displayName: string;
		avatarUrl: string | null;
	};
};

export type InviteData = Pick<Invite, 'code' | 'expiresAt' | 'maxUses' | 'currentUses' | 'boardRole' | 'categoryRole' | 'groupRole'> & {
	groups: { groupId: string; name: string; }[];
	categories: { categoryId: string; name: string; groupId: string; }[];
	boards: { boardId: string; name: string; categoryId: string; }[];
};
