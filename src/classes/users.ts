import { Platforms } from '../../prisma/generated/default';
import { DBUserPartialType } from '../external/vars';
import { BoardsManager } from '../core/manager';

// Data.
export class APIUsers {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUser({ auth, userId }: UsersFunctionsInput['getCurrentUser']) {
		return await this.web.request<GetUsersOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users' + (userId ? `/${userId}` : '')),
		});
	}

	public async updateUser({ auth, userId, body }: UsersFunctionsInput['updateUser']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp('/users' + (userId ? `/${userId}` : '')),
		});
	}

	public async deleteAccount({ auth, userId }: UsersFunctionsInput['deleteAccount']) {
		return await this.web.request<void>({
			method: 'DELETE', auth,
			endpoint: this.web.qp('/users' + (userId ? `/${userId}` : '')),
		});
	}
}

// Types.
export type UsersFunctionsInput = {
	'getCurrentUser': { auth: string; userId?: string; };
	'updateUser': { auth: string; userId?: string; body: UserInput; };
	'deleteAccount': { auth: string; userId?: string; };
	'isCurrentUserDev': { auth: string; };
}

export type GetUsersOutput = DBUserPartialType & {
	isDev: boolean;
}

export type UserInput = {
	mainGroupId?: string | null;
	displayName?: string;
	platform?: Platforms;
}
