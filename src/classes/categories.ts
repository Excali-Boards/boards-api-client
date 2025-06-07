import { NameInput, SingleOutput } from '../external/types';
import { WebDataManager } from '../core/manager';

// Data.
export class APICategories {
	constructor (private web: WebDataManager) { }

	// Methods.
	public async getCategories({ auth }: CategoriesFunctionsInput['getCategories']) {
		return await this.web.request<GetCategoriesOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/data/categories'),
		});
	}

	public async getCategory({ auth, categoryId }: CategoriesFunctionsInput['getCategory']) {
		return await this.web.request<GetCategoryOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/categories/${categoryId}`),
		});
	}

	public async createBoardInCategory({ auth, categoryId, body }: CategoriesFunctionsInput['createBoardInCategory']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/data/categories/${categoryId}`),
		});
	}

	public async updateCategory({ auth, categoryId, body }: CategoriesFunctionsInput['updateCategory']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/data/categories/${categoryId}`),
		});
	}

	public async reorderBoardsInCategory({ auth, categoryId, body }: CategoriesFunctionsInput['reorderBoards']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp(`/data/categories/${categoryId}`),
		});
	}

	public async deleteCategory({ auth, categoryId }: CategoriesFunctionsInput['deleteCategory']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/categories/${categoryId}`),
		});
	}
}

// Types.
export type CategoriesFunctionsInput = {
	'getCategories': { auth: string; };
	'getCategory': { auth: string; categoryId: string; };
	'createBoardInCategory': { auth: string; categoryId: string; body: NameInput; };
	'updateCategory': { auth: string; categoryId: string; body: NameInput; };
	'reorderBoards': { auth: string; categoryId: string; body: string[]; };
	'deleteCategory': { auth: string; categoryId: string; };
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
	boards: (SingleOutput & {
		boardId: string;
	})[];
}
