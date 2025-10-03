import { BoardsManager } from '../core/manager';
import { AllRooms } from '../external/types';
import { GetUsersOutput } from './users';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUsers({ auth }: AdminFunctionsInput['getUsers']) {
		return await this.web.request<GetUsersOutput[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/admin/users'),
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
	'getUsers': { auth: string; };
	'getActiveRooms': { auth: string; };
}
