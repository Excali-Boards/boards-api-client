import { BoardInput, NameInput, SingleOutput } from '../external/types.js';
import { BoardsManager } from '../core/manager.js';
import { GetBoardOutput } from './boards.js';
import { WithHeaders } from '../types.js';

// Data.
export class APICategories {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getCategories({ auth, groupId, ...rest }: CategoriesFunctionsInput['getCategories']) {
		return await this.web.request<GetCategoriesOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}`),
		});
	}

	public async getCategory({ auth, groupId, categoryId, ...rest }: CategoriesFunctionsInput['getCategory']) {
		return await this.web.request<GetCategoryOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}`),
		});
	}

	public async createBoardInCategory({ auth, groupId, categoryId, body, ...rest }: CategoriesFunctionsInput['createBoardInCategory']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards`),
		});
	}

	public async updateCategory({ auth, groupId, categoryId, body, ...rest }: CategoriesFunctionsInput['updateCategory']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}`),
		});
	}

	public async moveCategory({ auth, groupId, categoryId, body, ...rest }: CategoriesFunctionsInput['moveCategory']) {
		return await this.web.request<MoveCategoryOutput>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/move`),
		});
	}

	public async reorderBoardsInCategory({ auth, groupId, categoryId, body, ...rest }: CategoriesFunctionsInput['reorderBoards']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards`),
		});
	}

	public async deleteCategory({ auth, groupId, categoryId, ...rest }: CategoriesFunctionsInput['deleteCategory']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}`),
		});
	}
}

// Types.
export type CategoriesFunctionsInput = WithHeaders<{
	'getCategories': { auth: string; groupId: string };
	'getCategory': { auth: string; groupId: string; categoryId: string };
	'createBoardInCategory': { auth: string; groupId: string; categoryId: string; body: BoardInput & { copyPermissionsFromBoardId?: string } };
	'updateCategory': { auth: string; groupId: string; categoryId: string; body: NameInput };
	'moveCategory': { auth: string; groupId: string; categoryId: string; body: MoveCategoryInput };
	'reorderBoards': { auth: string; groupId: string; categoryId: string; body: string[] };
	'deleteCategory': { auth: string; groupId: string; categoryId: string };
}>

// Outputs.
export type GetCategoriesOutput = (SingleOutput & {
	boards: number;
	group: SingleOutput;
})[];

export type GetCategoryOutput = {
	group: SingleOutput;
	category: SingleOutput;
	boards: Omit<GetBoardOutput['board'], 'files'>[];
}

export type MoveCategoryInput = {
	targetGroupId: string;
	targetIndex?: number;
};

export type MoveCategoryOutput = {
	categoryId: string;
	groupId: string;
	index: number;
};
