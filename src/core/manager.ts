import { APIPermissions } from '../classes/permissions.js';
import { APIFlashcards } from '../classes/flashcards.js';
import { APICategories } from '../classes/categories.js';
import { APIAnalytics } from '../classes/analytics.js';
import { APISessions } from '../classes/sessions.js';
import { APICalendar } from '../classes/calendar.js';
import { APIMetrics } from '../classes/metrics.js';
import { APIInvites } from '../classes/invites.js';
import { APIGroups } from '../classes/groups.js';
import { APIBoards } from '../classes/boards.js';
import { APIUtils } from '../classes/utils.js';
import { APIUsers } from '../classes/users.js';
import { APIFiles } from '../classes/files.js';
import { APIAdmin } from '../classes/admin.js';
import { APIAuth } from '../classes/auth.js';
import axios, { AxiosError } from 'axios';
import { RequestMethod, WebResponse } from '../types.js';
import { transformDates } from './utils.js';

export class BoardsManager {
	readonly permissions = new APIPermissions(this);
	readonly categories = new APICategories(this);
	readonly flashcards = new APIFlashcards(this);
	readonly analytics = new APIAnalytics(this);
	readonly calendar = new APICalendar(this);
	readonly sessions = new APISessions(this);
	readonly invites = new APIInvites(this);
	readonly metrics = new APIMetrics(this);
	readonly groups = new APIGroups(this);
	readonly boards = new APIBoards(this);
	readonly admin = new APIAdmin(this);
	readonly users = new APIUsers(this);
	readonly utils = new APIUtils(this);
	readonly files = new APIFiles(this);
	readonly auth = new APIAuth(this);

	constructor (public url: string) { }

	public async request<O, T = unknown>(data: {
		endpoint: string;
		method: RequestMethod;
		body?: T;

		auth?: string;
		headers?: Record<string, string> | null;
	}): Promise<WebResponse<O>> {
		try {
			axios.interceptors.response.use(transformDates);

			let requestData: unknown;
			let contentType: string | undefined;

			if (data.body instanceof FormData) {
				requestData = data.body;
				contentType = 'multipart/form-data';
			} else if (data.body !== undefined) {
				requestData = JSON.stringify(data.body);
				contentType = 'application/json';
			} else {
				requestData = undefined;
				contentType = undefined;
			}

			const res = await axios(this.url + data.endpoint, {
				method: data.method,
				data: requestData,
				headers: {
					...(data.headers === null ? {} : contentType ? { 'Content-Type': contentType } : {}),
					...(data.auth ? { 'Authorization': data.auth } : {}),
					...(data.headers || {}),
				},
			})
				.then((res) => res.data)
				.catch((err: AxiosError) => err.response?.data);

			if (!this.isResponse<O>(res)) {
				throw new Error('Invalid response received.');
			}

			return res as WebResponse<O>;
		} catch {
			return {
				status: 500,
				error: 'An error occurred while processing the request.',
			} as WebResponse<O>;
		}
	}

	public qp<T extends Record<string, unknown>>(url: string, params?: T) {
		if (!params) return url;

		const query = new URLSearchParams();

		for (const [key, value] of Object.entries(params)) {
			if (value === undefined) continue;
			query.append(key, String(value));
		}

		return url + '?' + query.toString();
	}

	private isResponse<T>(obj: unknown): obj is WebResponse<T> {
		return (obj && typeof obj === 'object' && 'status' in obj) as boolean;
	}
}
