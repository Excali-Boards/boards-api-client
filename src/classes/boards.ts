import { BoardPermissionType } from '../../prisma/generated/default';
import { NameInput, SingleOutput } from '../external/types';
import { WebDataManager } from '../core/manager';
import { GetRoomsOutput } from './admin';

export class APIBoards {
	constructor (private web: WebDataManager) { }

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

	public async deleteBoard({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['deleteBoard']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async getBoardFile({ auth, categoryId, groupId, boardId, fileId }: BoardsFunctionsInput['getBoardFile']) {
		return await this.web.request<GetFileOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}/files/${fileId}`),
			responseType: 'blob',
		});
	}

	public async getBoardRoomData<T>({ auth, categoryId, groupId, boardId }: BoardsFunctionsInput['getRoomData']) {
		return await this.web.request<GetRoomsOutput<T>>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards/${boardId}/room`),
		});
	}
}

// Input types
export type BoardsFunctionsInput = {
	'getBoards': { auth: string; categoryId: string; groupId: string; };
	'getBoard': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'updateBoard': { auth: string; categoryId: string; groupId: string; boardId: string; body: NameInput; };
	'deleteBoard': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'getBoardFile': { auth: string; categoryId: string; groupId: string; boardId: string; fileId: string; };
	'getRoomData': { auth: string; categoryId: string; groupId: string; boardId: string; };
};

// Output types
export type GetBoardsOutput = {
	isAdmin: boolean;
	boards: {
		group: SingleOutput;
		category: SingleOutput;
		board: SingleOutput & {
			accessLevel: BoardPermissionType;
			files: {
				fileId: string;
				mimeType: string;
				createdAt: Date;
				fileUrl: string;
			}[];
		};
	}[];
};

export type GetBoardOutput = {
	isAdmin: boolean;
	group: SingleOutput;
	category: SingleOutput;
	board: SingleOutput & {
		elements: Buffer;
		accessLevel: BoardPermissionType;
		files: {
			fileId: string;
			mimeType: string;
			createdAt: Date;
			fileUrl: string;
		}[];
	};
};

export type GetFileOutput = ReadableStream | Blob;
