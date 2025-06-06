import { PaginatedWebResponse, RequestMethod, WebResponse } from '../types';
import axios, { AxiosError, AxiosResponse, ResponseType } from 'axios';
import { APICategories } from '../classes/categories';
import { APIGroups } from '../classes/groups';
import { APIBoards } from '../classes/boards';
import { APIUtils } from '../classes/utils';
import { APIStats } from '../classes/stats';
import { APIFiles } from '../classes/files';
import { APIAdmin } from '../classes/admin';
import { transformDates } from './utils';

export class WebDataManager {
	readonly categories = new APICategories(this);
	readonly groups = new APIGroups(this);
	readonly boards = new APIBoards(this);
	readonly files = new APIFiles(this);
	readonly stats = new APIStats(this);
	readonly admin = new APIAdmin(this);
	readonly utils = new APIUtils(this);

	constructor (public url: string) { }

	public async request<O, T = unknown, R extends boolean = false, P extends boolean = false>(data: {
		endpoint: string;
		method: RequestMethod;
		body?: T;

		auth?: string;
		headers?: Record<string, string> | null;
		responseType?: ResponseType;
	}): Promise<R extends false ? P extends true ? PaginatedWebResponse<O> : WebResponse<O> : AxiosResponse<O>> {
		try {
			axios.interceptors.response.use(transformDates);

			const res = await axios(this.url + data.endpoint, {
				method: data.method,
				data: data.body ? JSON.stringify(data.body) : undefined,
				responseType: data.responseType,
				headers: {
					...(data.headers === null ? {} : { 'Content-Type': 'application/json' }),
					...(data.auth ? { 'Authorization': data.auth } : {}),
					...(data.headers || {}),
				},
			})
				.then((res) => res.data)
				.catch((err: AxiosError) => err.response?.data);

			if (!this.isResponse<O>(res)) {
				throw new Error('Invalid response received.');
			}

			return res as R extends false ? P extends true ? PaginatedWebResponse<O> : WebResponse<O> : AxiosResponse<O>;
		} catch {
			return {
				status: 500,
				error: 'An error occurred while processing the request.',
			} as R extends false ? P extends true ? PaginatedWebResponse<O> : WebResponse<O> : AxiosResponse<O>;
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
