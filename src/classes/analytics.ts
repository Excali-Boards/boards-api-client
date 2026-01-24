import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APIAnalytics {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getGlobalAnalytics({ auth, ...rest }: AnalyticsFunctionsInput['getGlobalAnalytics']) {
		return await this.web.request<UserBoardActivityWithUser[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/analytics'),
		});
	}

	public async getUserAnalytics({ auth, ...rest }: AnalyticsFunctionsInput['getUserAnalytics']) {
		return await this.web.request<UserBoardActivityWithBoard[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/analytics/user'),
		});
	}

	public async getBoardAnalytics({ auth, boardId, categoryId, groupId, ...rest }: AnalyticsFunctionsInput['getBoardAnalytics']) {
		return await this.web.request<UserBoardActivityWithUser[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/analytics`),
		});
	}

	public async getCategoryAnalytics({ auth, categoryId, groupId, ...rest }: AnalyticsFunctionsInput['getCategoryAnalytics']) {
		return await this.web.request<UserBoardActivityWithUser[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/analytics`),
		});
	}

	public async getGroupAnalytics({ auth, groupId, ...rest }: AnalyticsFunctionsInput['getGroupAnalytics']) {
		return await this.web.request<UserBoardActivityWithUser[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp(`/groups/${groupId}/analytics`),
		});
	}
}

// Types.
export type AnalyticsFunctionsInput = WithHeaders<{
	'getGlobalAnalytics': { auth: string; };
	'getUserAnalytics': { auth: string; };
	'getBoardAnalytics': { auth: string; boardId: string; categoryId: string; groupId: string; };
	'getCategoryAnalytics': { auth: string; categoryId: string; groupId: string; };
	'getGroupAnalytics': { auth: string; groupId: string; };
}>;

// External.
export type ActivityAnalytics = {
	totalSessions: number;
	totalActiveSeconds: number;
	lastActivityAt: Date;
};

export type BoardData = {
	name: string;
	boardId: string;

	category: {
		categoryId: string;
		name: string;

		group: {
			groupId: string;
			name: string;
		};
	};
};

export type UserBoardActivityWithBoard = ActivityAnalytics & {
	board: BoardData;
};

export type UserBoardActivityWithUser = ActivityAnalytics & {
	board: BoardData
	user: {
		userId: string;
		displayName: string;
		avatarUrl: string | null;
	};
};
