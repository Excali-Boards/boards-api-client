import { NameInput, SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APIGroups {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getAllSorted({ auth, ...rest }: GroupsFunctionsInput['getAllSorted']) {
		return await this.web.request<GetAllSortedOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/all'),
		});
	}

	public async getGroups({ auth, ...rest }: GroupsFunctionsInput['getGroups']) {
		return await this.web.request<GetGroupsOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/groups'),
		});
	}

	public async getGroup({ auth, groupId, ...rest }: GroupsFunctionsInput['getGroup']) {
		return await this.web.request<GetGroupOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}`),
		});
	}

	public async createGroup({ auth, body, ...rest }: GroupsFunctionsInput['createGroup']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/groups'),
		});
	}

	public async createCategoryInGroup({ auth, groupId, body, ...rest }: GroupsFunctionsInput['createCategoryInGroup']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories`),
		});
	}

	public async updateGroup({ auth, groupId, body, ...rest }: GroupsFunctionsInput['updateGroup']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}`),
		});
	}

	public async reorderGroups({ auth, body, ...rest }: GroupsFunctionsInput['reorderGroups']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body, ...rest,
			endpoint: this.web.qp('/groups'),
		});
	}

	public async reorderCategoriesInGroup({ auth, groupId, body, ...rest }: GroupsFunctionsInput['reorderCategoriesInGroup']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories`),
		});
	}

	public async deleteGroup({ auth, groupId, ...rest }: GroupsFunctionsInput['deleteGroup']) {
		return await this.web.request<string>({
			method: 'DELETE', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}`),
		});
	}
}

// Types.
export type GroupsFunctionsInput = WithHeaders<{
	'getAllSorted': { auth: string };
	'getGroups': { auth: string };
	'getGroup': { auth: string; groupId: string };
	'createGroup': { auth: string; body: NameInput };
	'createCategoryInGroup': { auth: string; groupId: string; body: NameInput };
	'updateGroup': { auth: string; groupId: string; body: NameInput };
	'reorderGroups': { auth: string; body: string[] };
	'reorderCategoriesInGroup': { auth: string; groupId: string; body: string[] };
	'deleteGroup': { auth: string; groupId: string };
}>

// Outputs.
export type GetGroupsOutput = (SingleOutput & {
	categories: number;
	isDefault: boolean;
	sizeBytes: number;
})[];

export type GetGroupOutput = {
	group: SingleOutput;
	categories: (SingleOutput & {
		boards: number;
		totalSizeBytes: number;
	})[];
}

export type GetAllSortedOutput = (SingleOutput & {
	categories: (SingleOutput & {
		boards: (SingleOutput & {
			hasFlashcards: boolean;
			totalSizeBytes: number;
			scheduledForDeletion: Date | null;
		})[];
	})[];
})[];
