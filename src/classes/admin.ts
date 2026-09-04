import { Paginated, WithHeaders } from '../types.js';
import { BoardsManager } from '../core/manager.js';
import { AllRooms, RecentlyActiveRoom } from '../external/types.js';
import { GetUsersOutput } from './users.js';

// Data.
export class APIAdmin {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getS3Boards({ auth, ...rest }: AdminFunctionsInput['getS3Boards']) {
		return await this.web.request<S3BoardOutput[]>({
			method: 'GET', auth, ...rest,
			endpoint: '/admin/boards',
		});
	}

	public async resolveS3Board({ auth, boardId, body, ...rest }: AdminFunctionsInput['resolveS3Board']) {
		return await this.web.request<{ boardId: string; name: string; categoryId: string }>({
			method: 'POST', auth, ...rest, body,
			endpoint: this.web.qp(`/admin/boards/${boardId}/resolve`),
		});
	}

	public async getS3BoardContent({ auth, boardId, ...rest }: AdminFunctionsInput['getS3BoardContent']) {
		return await this.web.request<{ boardId: string; type: 'Excalidraw' | 'Tldraw'; content: unknown }>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/admin/boards/${boardId}/content`),
		});
	}

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
	'getS3Boards': { auth: string };
	'resolveS3Board': { auth: string; boardId: string; body: { name: string; categoryId: string; type: 'Excalidraw' | 'Tldraw' } };
	'getS3BoardContent': { auth: string; boardId: string };
	'getUsers': { auth: string; page?: number; limit?: number; };
	'getActiveRooms': { auth: string; };
}>;

export type S3BoardOutput = {
	boardId: string;
	board: {
		id: string;
		name: string;
		type: 'Excalidraw' | 'Tldraw';
		groupId: string;
		groupName: string;
		categoryId: string;
		categoryName: string;
		isPersonal: boolean;
		userId: string | null;
	} | null;
};
