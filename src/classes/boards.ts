import { BoardPermissionType } from '../../prisma/generated/default';
import { NameInput, SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';
import { GetRoomsOutput } from './admin';

export class APIBoards {
	constructor (private web: BoardsManager) { }

	public async getBoards({ auth, categoryId, groupId }: BoardsFunctionsInput['getBoards']) {
		return await this.web.request<GetBoardsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards`),
		});
	}

	public async getBoard({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['getBoard']) {
		return await this.web.request<GetBoardOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async updateBoard({ auth, categoryId, groupId, boardId, body }: BoardsFunctionsInput['updateBoard']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async scheduleBoardDeletion({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['scheduleBoardDeletion']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async cancelBoardDeletion({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['cancelBoardDeletion']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}/cancel-deletion`),
		});
	}

	public async getBoardRoomData<T>({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['getRoomData']) {
		return await this.web.request<GetRoomsOutput<T>>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}/room`),
		});
	}

	public async kickUserFromRoom({ auth, categoryId, groupId, boardId, userId }: BoardsFunctionsInput['kickUserFromRoom']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}/room`, {
				userId,
			}),
		});
	}
}

// Input types
export type BoardsFunctionsInput = {
	'getBoards': { auth: string; categoryId: string; groupId: string; };
	'getBoard': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'updateBoard': { auth: string; categoryId: string; groupId: string; boardId: string; body: NameInput; };
	'scheduleBoardDeletion': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'cancelBoardDeletion': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'getRoomData': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'kickUserFromRoom': { auth: string; categoryId: string; groupId: string; boardId: string; userId: string; };
};

// Output types
export type GetBoardsOutput = {
	isAdmin: boolean;
	boards: {
		group: SingleOutput;
		category: SingleOutput;
		board: SingleOutput & {
			dataUrl: string;
			sizeBytes: number;
			accessLevel: BoardPermissionType;
			scheduledForDeletion: Date | null;
			files: {
				fileId: string;
				mimeType: string;
				createdAt: Date;
				fileUrl: string;
			}[];
		};
	}[];
};

export type GetBoardOutput = GetBoardsOutput['boards'][number] & {
	isAdmin: boolean;
};

export type GetFileOutput = ReadableStream | Blob;
