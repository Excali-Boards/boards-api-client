import { BoardsManager } from '../core/manager';
import { GetUsersOutput } from './users';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUsers({ auth }: AdminFunctionsInput['getUsers']) {
		return await this.web.request<GetUsersOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/users'),
		});
	}

	public async getActiveRooms({ auth }: AdminFunctionsInput['getActiveRooms']) {
		return await this.web.request<GetRoomsOutput<number>[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/rooms'),
		});
	}
}

// Types.
export type AdminFunctionsInput = {
	'getUsers': { auth: string; };
	'getActiveRooms': { auth: string; };
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
