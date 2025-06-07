import { WebDataManager } from '../core/manager';

// Data.
export class APIStats {
	constructor (private web: WebDataManager) { }

	// Methods.
	public async globalStats({ auth }: StatsFunctionsInput['globalStats']) {
		return await this.web.request<GlobalStatsOutput>({
			method: 'POST', auth,
			endpoint: this.web.qp('/stats'),
		});
	}

	public async userStats({ auth, userId }: StatsFunctionsInput['userStats']) {
		return await this.web.request<UserStatsOutput>({
			method: 'POST', auth,
			endpoint: this.web.qp('/stats/user', {
				userId,
			}),
		});
	}
}

// Types.
export type StatsFunctionsInput = {
	'globalStats': { auth: string; };
	'userStats': { auth: string; userId?: string; };
}

// External.
export type GlobalStatsOutput = {
	boardCount: number;
	userCount: number;
	groupCount: number;
	categoryCount: number;
	fileCount: number;
	boardActivity: {
		totalTimeSeconds: number;
		totalSessions: number;
	};
	topBoardActivities: {
		boardId: string;
		totalMinutes: number;
		sessionCount: number;
	}[];
};

export type UserStatsOutput = {
	user: {
		id: string;
		email: string;
		displayName: string;
		isBoardsAdmin: boolean;
	};
	ownedBoardsCount: number;
	boardPermissionsCount: number;
	perBoardActivity: {
		boardId: string;
		boardName: string;
		totalMinutes: number;
		sessionCount: number;
	}[];
	boardActivity: {
		totalTimeSeconds: number;
		totalSessions: number;
	};
};
