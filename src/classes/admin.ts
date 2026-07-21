import { Paginated, WithHeaders } from '../types.js';
import { BoardsManager } from '../core/manager.js';
import { AllRooms, RecentlyActiveRoom } from '../external/types.js';
import { GetUsersOutput } from './users.js';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUsers({ auth, page, limit, ...rest }: AdminFunctionsInput['getUsers']) {
		return await this.web.request<Paginated<GetUsersOutput>>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/admin/users', { page, limit }),
		});
	}

	public async getActiveRooms({ auth, ...rest }: AdminFunctionsInput['getActiveRooms']) {
		return await this.web.request<{ rooms: AllRooms; recentlyActiveRooms: RecentlyActiveRoom[] }>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/admin/rooms'),
		});
	}
}

// Types.
export type AdminFunctionsInput = WithHeaders<{
	'getUsers': { auth: string; page?: number; limit?: number; };
	'getActiveRooms': { auth: string; };
}>;
