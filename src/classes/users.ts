import { BoardPermissionType, Platforms } from '../../prisma/generated/default';
import { BoardsManager } from '../core/manager';

// Data.
export class APIUsers {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUsers({ auth }: UsersFunctionsInput['getUsers']) {
		return await this.web.request<GetUsersOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users'),
		});
	}

	public async getCurrentUser<T extends boolean = never>({ auth, full }: UsersFunctionsInput<T>['getCurrentUser']) {
		return await this.web.request<GetUsersOutput<T>>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users/current', {
				full,
			}),
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
export type UsersFunctionsInput<T extends boolean = never> = {
	'getUsers': { auth: string; };
	'getCurrentUser': { auth: string; full?: T; };
	'changeMainPlatform': { auth: string; newMainPlatform: Platforms; };
	'changeMainGroup': { auth: string; newMainGroupId: string | null; };
}

export type GetUsersOutput<T extends boolean = never> = {
	id: string;
	email: string;
	avatarUrl: string | null;
	displayName: string;
	mainLoginType: Platforms;
	mainGroupId: string | null;

	isDev: boolean;
	isBoardsAdmin: boolean;

	loginMethods: T extends true ? {
		email: string;
		platform: Platforms;
	}[] : never;

	ownedBoards: {
		boardId: string;
		boardName: string;
	}[];
	boardPermissions: {
		boardId: string;
		permissionType: BoardPermissionType;
	}[];
}
