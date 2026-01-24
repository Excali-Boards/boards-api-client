import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APIMetrics {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async getMetrics({ auth, ...rest }: MetricsFunctionsInput['getMetrics']) {
		return await this.web.request<string>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/metrics'),
		});
	}

	public async getStatus({ auth, ...rest }: MetricsFunctionsInput['getStatus']) {
		return await this.web.request<SystemStatus>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/status'),
		});
	}
}

// Types.
export type MetricsFunctionsInput = WithHeaders<{
	'getMetrics': { auth: string };
	'getStatus': { auth: string };
}>

// External.
export type SystemStatus = {
	cpuUsage: number;
	memoryUsageMb: number;
	uptimeSeconds: number;

	activeRooms: number;
	socketConnections: number;
	queuedFiles: number;

	totalUsers: number;
	totalInvites: number;

	totalBoards: number;
	totalCategories: number;
	totalGroups: number;

	totalFiles: number;
	storageSizeMb: number;
};
