import { AccessLevel } from '../external/types';
import { BoardsManager } from '../core/manager';

// Data.
export class APICodeSnippets {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getCollection({ auth, groupId, categoryId, boardId }: CodeSnippetsFunctionsInput['getCollection']) {
		return await this.web.request<CodeSnippetCollectionResponse>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets`),
		});
	}

	public async initializeCollection({ auth, groupId, categoryId, boardId }: CodeSnippetsFunctionsInput['initializeCollection']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets/initialize`),
		});
	}

	public async destroyCollection({ auth, groupId, categoryId, boardId }: CodeSnippetsFunctionsInput['destroyCollection']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets/destroy`),
		});
	}

	public async createSnippets({ auth, groupId, categoryId, boardId, body }: CodeSnippetsFunctionsInput['createSnippets']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets`),
		});
	}

	public async updateSnippets({ auth, groupId, categoryId, boardId, body }: CodeSnippetsFunctionsInput['updateSnippets']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets`),
		});
	}

	public async deleteSnippets({ auth, groupId, categoryId, boardId, body }: CodeSnippetsFunctionsInput['deleteSnippets']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets`),
		});
	}

	public async reorderSnippets({ auth, groupId, categoryId, boardId, body }: CodeSnippetsFunctionsInput['reorderSnippets']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/codesnippets/reorder`),
		});
	}
}

// Types.
export type CodeSnippetsFunctionsInput = {
	getCollection: { auth: string; groupId: string; categoryId: string; boardId: string; };
	initializeCollection: { auth: string; groupId: string; categoryId: string; boardId: string; };
	destroyCollection: { auth: string; groupId: string; categoryId: string; boardId: string; };
	createSnippets: { auth: string; groupId: string; categoryId: string; boardId: string; body: CodeSnippetInput[]; };
	updateSnippets: { auth: string; groupId: string; categoryId: string; boardId: string; body: CodeSnippetUpdateInput[]; };
	deleteSnippets: { auth: string; groupId: string; categoryId: string; boardId: string; body: string[]; };
	reorderSnippets: { auth: string; groupId: string; categoryId: string; boardId: string; body: string[]; };
};

export type CodeSnippetInput = {
	title: string;
	description?: string;
	code: string;
	language?: string;
};

export type CodeSnippetUpdateInput = CodeSnippetInput & { id: string; };

export type CodeSnippetCollectionResponse = {
	board: {
		id: string;
		name: string;
		accessLevel: AccessLevel;
	};
	collection: {
		id: string;
		createdAt: Date;
		updatedAt: Date;
	};
	snippets: CodeSnippet[];
};

export type CodeSnippet = {
	id: string;
	title: string;
	description: string;
	code: string;
	language: string;
	index: number;
	createdAt: Date;
	updatedAt: Date;
};
