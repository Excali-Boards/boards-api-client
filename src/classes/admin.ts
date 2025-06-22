import { BoardPermissionType } from '../../prisma/generated/default';
import { BoardsManager } from '../core/manager';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getActiveRooms({ auth }: AdminFunctionsInput['getActiveRooms']) {
		return await this.web.request<GetRoomsOutput<number>[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/rooms'),
		});
	}

	public async updateUserPermissions({ auth, body }: AdminFunctionsInput['updateUserPermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/admin/permissions'),
		});
	}
}

// Types.
export type AdminFunctionsInput = {
	'getActiveRooms': { auth: string; };
	'updateUserPermissions': { auth: string; body: UpdateUserPermissionsInput; };
}

export type GetRoomsOutput<T> = {
	boardId: string;
	elements: T;
	collaborators: {
		id: string;
		socketId: string;
		username: string;
		avatarUrl: string | null;
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
