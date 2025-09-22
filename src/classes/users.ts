import { Platforms } from '../../prisma/generated/default';
import { DBUserPartialType } from '../external/vars';
import { BoardsManager } from '../core/manager';

// Data.
export class APIUsers {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getCurrentUser({ auth }: UsersFunctionsInput['getCurrentUser']) {
		return await this.web.request<GetUsersOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users'),
		});
	}

	public async updateUser({ auth, body }: UsersFunctionsInput['updateUser']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp('/users'),
		});
	}

	public async deleteAccount({ auth }: UsersFunctionsInput['deleteAccount']) {
		return await this.web.request<void>({
			method: 'DELETE', auth,
			endpoint: this.web.qp('/users'),
		});
	}
}

// Types.
export type UsersFunctionsInput = {
	'getCurrentUser': { auth: string; };
	'updateUser': { auth: string; body: UserInput; };
	'deleteAccount': { auth: string; };
	'isCurrentUserDev': { auth: string; };
}

export type GetUsersOutput = DBUserPartialType & {
	isDev: boolean;
}

export type UserInput = {
	mainGroupId?: string | null;
	platform?: Platforms;
}
