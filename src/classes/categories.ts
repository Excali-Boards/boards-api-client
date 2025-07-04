import { NameInput, SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';
import { GetBoardsOutput } from './boards';

// Data.
export class APICategories {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getCategories({ auth, groupId }: CategoriesFunctionsInput['getCategories']) {
		return await this.web.request<GetCategoriesOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories`),
		});
	}

	public async getCategory({ auth, groupId, categoryId }: CategoriesFunctionsInput['getCategory']) {
		return await this.web.request<GetCategoryOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}`),
		});
	}

	public async createBoardInCategory({ auth, groupId, categoryId, body }: CategoriesFunctionsInput['createBoardInCategory']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards`),
		});
	}

	public async updateCategory({ auth, groupId, categoryId, body }: CategoriesFunctionsInput['updateCategory']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}`),
		});
	}

	public async reorderBoardsInCategory({ auth, groupId, categoryId, body }: CategoriesFunctionsInput['reorderBoards']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}/boards`),
		});
	}

	public async deleteCategory({ auth, groupId, categoryId }: CategoriesFunctionsInput['deleteCategory']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories/${categoryId}`),
		});
	}
}

// Types.
export type CategoriesFunctionsInput = {
	'getCategories': { auth: string; groupId: string; };
	'getCategory': { auth: string; groupId: string; categoryId: string; };
	'createBoardInCategory': { auth: string; groupId: string; categoryId: string; body: NameInput; };
	'updateCategory': { auth: string; groupId: string; categoryId: string; body: NameInput; };
	'reorderBoards': { auth: string; groupId: string; categoryId: string; body: string[]; };
	'deleteCategory': { auth: string; groupId: string; categoryId: string; };
}

// Outputs.
export type GetCategoriesOutput = {
	isAdmin: boolean;
	categories: (SingleOutput & {
		boards: number;
		group: SingleOutput;
	})[];
}

export type GetCategoryOutput = {
	isAdmin: boolean;
	group: SingleOutput;
	category: SingleOutput;
	boards: Omit<GetBoardsOutput['boards'][number]['board'], 'files'>[];
}
