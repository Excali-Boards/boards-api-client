import { BoardsManager } from '../core/manager';

// Data.
export class APIMetrics {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getMetrics({ auth }: MetricsFunctionsInput['getMetrics']) {
		return await this.web.request<string>({
			method: 'GET', auth,
			endpoint: this.web.qp('/metrics'),
		});
	}

	public async getStatus({ auth }: MetricsFunctionsInput['getStatus']) {
		return await this.web.request<SystemStatus>({
			method: 'GET', auth,
			endpoint: this.web.qp('/metrics/status'),
		});
	}
}

// Types.
export type MetricsFunctionsInput = {
	'getMetrics': { auth: string; };
	'getStatus': { auth: string; };
}

// External.
export type SystemStatus = {
	cpuUsage: number;
	memoryUsage: string;

	activeRooms: number;
	socketConnections: number;
	queuedFiles: number;
	cacheSize: number;

	totalUsers: number;
	totalInvites: number;

	totalBoards: number;
	totalCategories: number;
	totalGroups: number;
};
