import { BoardPermissionType } from '../../prisma/generated/default';
import { WebDataManager } from '../core/manager';

// Data.
export class APIAdmin {
	constructor (private web: WebDataManager) { }

	// Methods.
	public async getRooms({ auth }: AdminFunctionsInput['getRooms']) {
		return await this.web.request<GetRoomsOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/rooms'),
		});
	}

	public async getUsers({ auth }: AdminFunctionsInput['getUsers']) {
		return await this.web.request<GetUsersOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/users'),
		});
	}

	public async updateUserPermissions({ auth, body }: AdminFunctionsInput['updateUserPermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/admin/users/permissions'),
		});
	}
}

// Types.
export type AdminFunctionsInput = {
	'getRooms': { auth: string; };
	'getUsers': { auth: string; };
	'updateUserPermissions': { auth: string; body: UpdateUserPermissionsInput; };
}

export type GetRoomsOutput = {
	boardId: string;
	elements: number;
	collaborators: {
		id: string;
		username: string;
		avatarUrl: string | null;
	}[];
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

export type UpdateUserPermissionsInput = {
	userId: string;
	isBoardsAdmin?: boolean;
	permissions?: {
		boardId: string;
		permissionType: BoardPermissionType;
	}[];
};
