import { BoardPermissionType } from '../../prisma/generated/default';
import { WebDataManager } from '../core/manager';

// Data.
export class APIUsers {
	constructor (private web: WebDataManager) { }

	// Methods.
	public async getUsers({ auth }: UsersFunctionsInput['getUsers']) {
		return await this.web.request<GetUsersOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users'),
		});
	}

	public async getCurrentUser({ auth }: UsersFunctionsInput['getCurrentUser']) {
		return await this.web.request<GetUsersOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users/current'),
		});
	}
}

// Types.
export type UsersFunctionsInput = {
	'getUsers': { auth: string; };
	'getCurrentUser': { auth: string; };
}

export type GetUsersOutput = {
	id: string;
	email: string;
	displayName: string | null;

	isDev: boolean;
	isBoardsAdmin: boolean;

	ownedBoards: {
		boardId: string;
		boardName: string;
	}[];
	boardPermissions: {
		boardId: string;
		boardName: BoardPermissionType;
	}[];
}
