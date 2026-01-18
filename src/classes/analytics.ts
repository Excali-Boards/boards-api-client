import { BoardsManager } from '../core/manager';

// Data.
export class APIAnalytics {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getUserAnalytics({ auth }: AnalyticsFunctionsInput['getUserAnalytics']) {
		return await this.web.request<UserBoardActivityWithBoard[]>({
			method: 'GET', auth,
			endpoint: this.web.qp('/analytics/user'),
		});
	}

	public async getBoardAnalytics({ auth, boardId, categoryId, groupId }: AnalyticsFunctionsInput['getBoardAnalytics']) {
		return await this.web.request<UserBoardActivityWithUser[]>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/boards/${boardId}/analytics`),
		});
	}

	public async getCategoryAnalytics({ auth, categoryId, groupId }: AnalyticsFunctionsInput['getCategoryAnalytics']) {
		return await this.web.request<UserBoardActivityWithUserAndBoard[]>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/groups/${groupId}/categories/${categoryId}/analytics`),
		});
	}

	public async getGroupAnalytics({ auth, groupId }: AnalyticsFunctionsInput['getGroupAnalytics']) {
		return await this.web.request<UserBoardActivityWithUserAndBoard[]>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/groups/${groupId}/analytics`),
		});
	}
}

// Types.
export type AnalyticsFunctionsInput = {
	'getUserAnalytics': { auth: string; };
	'getBoardAnalytics': { auth: string; boardId: string; categoryId: string; groupId: string; };
	'getCategoryAnalytics': { auth: string; categoryId: string; groupId: string; };
	'getGroupAnalytics': { auth: string; groupId: string; };
};

// External.
export type ActivityAnalytics = {
	totalSessions: number;
	totalActiveSeconds: number;
	lastActivityAt: Date;
};

export type UserBoardActivityWithBoard = ActivityAnalytics & {
	board: {
		name: string;
		boardId: string;
	};
};

export type UserBoardActivityWithUser = ActivityAnalytics & {
	user: {
		userId: string;
		displayName: string;
		avatarUrl: string | null;
	};
};

export type UserBoardActivityWithUserAndBoard = ActivityAnalytics & {
	user: {
		userId: string;
		displayName: string;
		avatarUrl: string | null;
	};
	board: {
		name: string;
		boardId: string;
		categoryId: string;
	};
};
