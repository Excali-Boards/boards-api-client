import { NameInput, SingleOutput } from '../external/types';
import { BoardsManager } from '../core/manager';

// Data.
export class APIGroups {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getAllSorted({ auth }: GroupsFunctionsInput['getAllSorted']) {
		return await this.web.request<GetAllSortedOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/data/all'),
		});
	}

	public async getGroups({ auth }: GroupsFunctionsInput['getGroups']) {
		return await this.web.request<GetGroupsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/data/groups'),
		});
	}

	public async getGroup({ auth, groupId }: GroupsFunctionsInput['getGroup']) {
		return await this.web.request<GetGroupOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}`),
		});
	}

	public async createGroup({ auth, body }: GroupsFunctionsInput['createGroup']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/data/groups'),
		});
	}

	public async createCategoryInGroup({ auth, groupId, body }: GroupsFunctionsInput['createCategoryInGroup']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories`),
		});
	}

	public async updateGroup({ auth, groupId, body }: GroupsFunctionsInput['updateGroup']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}`),
		});
	}

	public async reorderGroups({ auth, body }: GroupsFunctionsInput['reorderGroups']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp('/data/groups'),
		});
	}

	public async reorderCategoriesInGroup({ auth, groupId, body }: GroupsFunctionsInput['reorderCategoriesInGroup']) {
		return await this.web.request<string>({
			method: 'PUT', auth, body,
			endpoint: this.web.qp(`/data/groups/${groupId}/categories`),
		});
	}

	public async deleteGroup({ auth, groupId }: GroupsFunctionsInput['deleteGroup']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/groups/${groupId}`),
		});
	}
}

// Types.
export type GroupsFunctionsInput = {
	'getAllSorted': { auth: string; };
	'getGroups': { auth: string; };
	'getGroup': { auth: string; groupId: string; };
	'createGroup': { auth: string; body: NameInput; };
	'createCategoryInGroup': { auth: string; groupId: string; body: NameInput; };
	'updateGroup': { auth: string; groupId: string; body: NameInput; };
	'reorderGroups': { auth: string; body: string[]; };
	'reorderCategoriesInGroup': { auth: string; groupId: string; body: string[]; };
	'deleteGroup': { auth: string; groupId: string; };
}

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
			totalSizeBytes: number;
			scheduledForDeletion: Date | null;
		})[];
	})[];
})[];
