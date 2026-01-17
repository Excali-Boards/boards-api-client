import { BoardsManager } from '../core/manager';
import { AllRooms } from '../external/types';
import { GetUsersOutput } from './users';
import { Paginated } from '../types';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUsers({ auth, page, limit }: AdminFunctionsInput['getUsers']) {
		return await this.web.request<Paginated<GetUsersOutput>>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/users', { page, limit }),
		});
	}

	public async getActiveRooms({ auth }: AdminFunctionsInput['getActiveRooms']) {
		return await this.web.request<AllRooms>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/rooms'),
		});
	}
}

// Types.
export type AdminFunctionsInput = {
	'getUsers': { auth: string; page?: number; limit?: number; };
	'getActiveRooms': { auth: string; };
}
