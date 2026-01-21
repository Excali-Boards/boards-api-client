import { Paginated, WithHeaders } from '../types';
import { BoardsManager } from '../core/manager';
import { AllRooms } from '../external/types';
import { GetUsersOutput } from './users';

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
		return await this.web.request<AllRooms>({
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
