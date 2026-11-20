import type { AccessLevel, BoardType } from '../external/types.js';
import { BoardsManager } from '../core/manager.js';
import { WithHeaders } from '../types.js';

export class APISearch {
	constructor (private web: BoardsManager) { }

	public async search({ auth, query, limit, cursor, ...rest }: SearchFunctionsInput['search']) {
		return await this.web.request<SearchOutput>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/search', { q: query, limit, cursor }),
		});
	}
}

export type SearchFunctionsInput = WithHeaders<{
	'search': { auth: string; query: string; limit?: number; cursor?: string };
}>;

export type SearchOutput = {
	query: string;
	results: SearchResult[];
	nextCursor: string | null;
};

export type SearchResult = {
	board: {
		id: string;
		name: string;
		type: BoardType;
		accessLevel: AccessLevel | null;
	};
	group: {
		id: string;
		name: string;
		kind: 'Shared' | 'Personal';
		ownerId: string | null;
	};
	category: {
		id: string;
		name: string;
	};
	matches: SearchMatch[];
	indexedAt: Date;
};

export type SearchMatch = {
	elementId: string;
	text: string;
	x?: number;
	y?: number;
	pageId?: string;
};
