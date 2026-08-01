import { AccessLevel, AllRooms, NameInput, SingleOutput } from '../external/types.js';
import { BoardsManager } from '../core/manager.js';
import { BoardType } from '../external/types.js';
import { WithHeaders } from '../types.js';

export class APIBoards {
	constructor (private web: BoardsManager) { }

	public async getBoards({ auth, categoryId, groupId, ...rest }: BoardsFunctionsInput['getBoards']) {
		return await this.web.request<GetBoardOutput[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}`),
		});
	}

	public async getPersonalBoards({ auth, ...rest }: BoardsFunctionsInput['getPersonalBoards']) {
		return await this.web.request<PersonalBoardsOutput | PersonalBoardsAdminOutput | null>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/personal'),
		});
	}

	public async createPersonalBoard({ auth, body, ...rest }: BoardsFunctionsInput['createPersonalBoard']) {
		return await this.web.request<CreatePersonalBoardOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/personal'),
		});
	}

	public async createPersonalCategory({ auth, body, ...rest }: BoardsFunctionsInput['createPersonalCategory']) {
		return await this.web.request<CreatePersonalCategoryOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/personal/categories'),
		});
	}

	public async getBoard({ auth, categoryId, groupId, boardId, ...rest }: BoardsFunctionsInput['getBoard']) {
		return await this.web.request<GetBoardOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async updateBoard({ auth, categoryId, groupId, boardId, body, ...rest }: BoardsFunctionsInput['updateBoard']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async moveBoard({ auth, categoryId, groupId, boardId, body, ...rest }: BoardsFunctionsInput['moveBoard']) {
		return await this.web.request<MoveBoardOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/move`),
		});
	}

	public async scheduleBoardDeletion({ auth, categoryId, groupId, boardId, ...rest }: BoardsFunctionsInput['scheduleBoardDeletion']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}`),
		});
	}

	public async forceDeleteBoard({ auth, categoryId, groupId, boardId, ...rest }: BoardsFunctionsInput['scheduleBoardDeletion']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}?force=true`),
		});
	}

	public async cancelBoardDeletion({ auth, categoryId, groupId, boardId, ...rest }: BoardsFunctionsInput['cancelBoardDeletion']) {
		return await this.web.request<string>({
			method: 'POST', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/cancel-deletion`),
		});
	}

	public async getBoardRoomData({ auth, categoryId, groupId, boardId, ...rest }: BoardsFunctionsInput['getRoomData']) {
		return await this.web.request<AllRooms>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/room`),
		});
	}

	public async kickUserFromRoom({ auth, categoryId, groupId, boardId, userId, ...rest }: BoardsFunctionsInput['kickUserFromRoom']) {
		return await this.web.request<string>({
			method: 'POST', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/room-kick`, {
				userId,
			}),
		});
	}
}

// Input types.
export type BoardsFunctionsInput = WithHeaders<{
	'getBoards': { auth: string; categoryId: string; groupId: string; };
	'getPersonalBoards': { auth: string; };
	'createPersonalBoard': { auth: string; body: NameInput & { type: BoardType; categoryId?: string }; };
	'createPersonalCategory': { auth: string; body: NameInput; };
	'getBoard': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'updateBoard': { auth: string; categoryId: string; groupId: string; boardId: string; body: NameInput; };
	'moveBoard': { auth: string; categoryId: string; groupId: string; boardId: string; body: MoveBoardInput; };
	'scheduleBoardDeletion': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'cancelBoardDeletion': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'getRoomData': { auth: string; categoryId: string; groupId: string; boardId: string; };
	'kickUserFromRoom': { auth: string; categoryId: string; groupId: string; boardId: string; userId: string; };
}>;

// Output types
export type GetBoardOutput = {
	group: SingleOutput;
	category: SingleOutput;
	board: SingleOutput & {
		type: BoardType;
		dataUrl: string;
		hasFlashcards: boolean;
		totalSizeBytes: number;
		accessLevel: AccessLevel;
		scheduledForDeletion: Date | null;
		files: {
			fileId: string;
			mimeType: string;
			createdAt: Date;
			sizeBytes: number;
			fileUrl: string;
		}[];
	};
};

export type GetFileOutput = ReadableStream | Blob;

export type CreatePersonalBoardOutput = { groupId: string; categoryId: string; boardId: string; };
export type CreatePersonalCategoryOutput = { categoryId: string; name: string; backingCategoryId: string; };

export type PersonalBoardsOutput = {
	id: string;
	owner: PersonalBoardOwnerOutput;
	boards: PersonalBoardOutput[];
	categories: PersonalCategoryOutput[];
};

export type PersonalBoardsAdminOutput = { owners: PersonalBoardsOutput[]; };

export type PersonalBoardOwnerOutput = {
	userId: string;
	displayName: string;
	email: string;
	avatarUrl: string | null;
};

export type PersonalCategoryOutput = {
	id: string;
	name: string;
	boards: PersonalBoardOutput[];
};

export type PersonalBoardOutput = {
	id: string;
	categoryId: string;
	name: string;
	type: BoardType;
	index: number;
	totalSizeBytes: number;
	scheduledForDeletion: Date | null;
};

export type MoveBoardInput = {
	targetCategoryId: string;
	targetIndex?: number;
};

export type MoveBoardOutput = {
	boardId: string;
	categoryId: string;
	groupId: string;
	index: number;
};
