import { Paginated, WebResponse } from '../types';
import { AxiosResponse } from 'axios';

export function isDateStringRegex(value: unknown): value is string {
	const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
	return typeof value === 'string' && isoPattern.test(value);
}

export function recursiveDateConversion<T>(data: T): T {
	if (data instanceof Date) return new Date(data) as unknown as T;
	if (Array.isArray(data)) return data.map(recursiveDateConversion) as unknown as T;
	if (typeof data === 'object' && data !== null) {
		for (const key in data) {
			data[key] = recursiveDateConversion(data[key]);
		}
	}

	return isDateStringRegex(data) ? new Date(data) as unknown as T : data;
}

export function transformDates<T>(response: AxiosResponse<T>): AxiosResponse<T> {
	if (response.data) response.data = recursiveDateConversion(response.data);
	return response;
}

/**
 * Automatically fetches all pages of a paginated endpoint
 * @param fetcher Function that fetches a single page, receives page and limit as parameters
 * @param options Optional configuration for page size and max items
 * @returns Array of all items from all pages
 */
export async function getAll<T>(
	fetcher: (page: number, limit: number) => Promise<WebResponse<Paginated<T>>>,
	options?: { limit?: number; maxItems?: number }
): Promise<T[]> {
	const limit = options?.limit ?? 50;
	const maxItems = options?.maxItems ?? Infinity;
	const allItems: T[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore && allItems.length < maxItems) {
		const response = await fetcher(page, limit);
		
		if (response.status !== 200) {
			throw new Error(
				typeof response.error === 'string' 
					? response.error 
					: 'Failed to fetch paginated data'
			);
		}

		const items = Array.isArray(response.data.data) 
			? response.data.data as T[] 
			: [response.data.data] as T[];
		
		allItems.push(...items.slice(0, maxItems - allItems.length));
		hasMore = response.data.pagination.hasMore && allItems.length < maxItems;
		page++;
	}

	return allItems;
}
