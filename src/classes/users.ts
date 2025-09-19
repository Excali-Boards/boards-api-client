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
			endpoint: this.web.qp('/users/current'),
		});
	}

	public async changeMainPlatform({ auth, newMainPlatform }: UsersFunctionsInput['changeMainPlatform']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp('/users/change-main-platform'),
			body: { name: newMainPlatform },
		});
	}

	public async changeMainGroup({ auth, newMainGroupId }: UsersFunctionsInput['changeMainGroup']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp('/users/change-main-group'),
			body: { groupId: newMainGroupId },
		});
	}
}

// Types.
export type UsersFunctionsInput = {
	'getCurrentUser': { auth: string; };
	'changeMainPlatform': { auth: string; newMainPlatform: Platforms; };
	'changeMainGroup': { auth: string; newMainGroupId: string | null; };
}

export type GetUsersOutput = DBUserPartialType & {
	isDev: boolean;
}
