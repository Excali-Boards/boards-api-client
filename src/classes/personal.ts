import { BoardInput, BoardType, NameInput, SingleOutput } from '../external/types.js';
import { BoardsManager } from '../core/manager.js';
import type { GetBoardOutput } from './boards.js';
import { WithHeaders } from '../types.js';

export class APIPersonal {
	constructor (private web: BoardsManager) { }

	public async getPersonalBoards({ auth, ...rest }: PersonalFunctionsInput['getPersonalBoards']) {
		return await this.web.request<PersonalBoardsOutput | PersonalBoardsAdminOutput | null>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/personal'),
		});
	}

	public async getAllPersonalBoards({ auth, ...rest }: PersonalFunctionsInput['getAllPersonalBoards']) {
		return await this.web.request<PersonalWorkspaceOutput[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/all/personal'),
		});
	}

	public async getPersonalWorkspace({ auth, userId, ...rest }: PersonalFunctionsInput['getPersonalWorkspace']) {
		return await this.web.request<PersonalWorkspaceOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/personal/${userId}`),
		});
	}

	public async getPersonalCategoryBoards({ auth, userId, categoryId, ...rest }: PersonalFunctionsInput['getPersonalCategoryBoards']) {
		return await this.web.request<PersonalBoardOutput[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/personal/${userId}/categories/${categoryId}/boards`),
		});
	}

	public async createPersonalBoard({ auth, body, ...rest }: PersonalFunctionsInput['createPersonalBoard']) {
		return await this.web.request<CreatePersonalBoardOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/personal'),
		});
	}

	public async createPersonalBoardInCategory({ auth, userId, categoryId, body, ...rest }: PersonalFunctionsInput['createPersonalBoardInCategory']) {
		return await this.web.request<CreatePersonalBoardOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp(`/personal/${userId}/categories/${categoryId}/boards`),
		});
	}

	public async createPersonalCategory({ auth, body, ...rest }: PersonalFunctionsInput['createPersonalCategory']) {
		return await this.web.request<CreatePersonalCategoryOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/personal/categories'),
		});
	}

	public async getPersonalBoard({ auth, userId, categoryId, boardId, ...rest }: PersonalFunctionsInput['getPersonalBoard']) {
		return await this.web.request<GetBoardOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/personal/${userId}/categories/${categoryId}/boards/${boardId}`),
		});
	}
}

// Input types.
export type PersonalFunctionsInput = WithHeaders<{
	'getPersonalBoards': { auth: string };
	'getAllPersonalBoards': { auth: string };
	'getPersonalWorkspace': { auth: string; userId: string };
	'getPersonalCategoryBoards': { auth: string; userId: string; categoryId: string };
	'createPersonalBoard': { auth: string; body: BoardInput & { categoryId?: string } };
	'createPersonalBoardInCategory': { auth: string; userId: string; categoryId: string; body: BoardInput };
	'createPersonalCategory': { auth: string; body: NameInput };
	'getPersonalBoard': { auth: string; userId: string; categoryId: string; boardId: string };
}>;

// Output types.
export type CreatePersonalBoardOutput = {
	groupId: string;
	categoryId: string;
	boardId: string;
};

export type CreatePersonalCategoryOutput = {
	categoryId: string;
	name: string;
	backingCategoryId: string;
};

export type PersonalBoardsOutput = {
	id: string;
	owner: PersonalBoardOwnerOutput;
	boards: PersonalBoardOutput[];
	categories: PersonalCategoryOutput[];
};

export type PersonalWorkspaceOutput = {
	id: string;
	owner: PersonalBoardOwnerOutput;
	categories: PersonalCategoryOutput[];
};

export type PersonalBoardsAdminOutput = {
	owners: PersonalBoardsOutput[];
};

export type PersonalBoardOwnerOutput = {
	email: string;
	userId: string;
	displayName: string;
	avatarUrl: string | null;
};

export type PersonalCategoryOutput = Pick<SingleOutput, 'id' | 'name'> & {
	boards: PersonalBoardOutput[];
};

export type PersonalBoardOutput = Pick<SingleOutput, 'id' | 'name' | 'index'> & {
	categoryId: string;
	type: BoardType;
	totalSizeBytes: number;
	scheduledForDeletion: Date | null;
};
