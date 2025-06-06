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
