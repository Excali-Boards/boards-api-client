import { BoardsManager } from '../core/manager';

// Data.
export class APIUtils {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async resolveBoard({ auth, body }: UtilsFunctionsInput['resolveBoard']) {
		return await this.web.request<ResolveBoardOutput>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/utils/resolve-board'),
		});
	}

	public async purgeUnused({ auth, boardId }: UtilsFunctionsInput['purgeUnused']) {
		return await this.web.request<string>({
			method: 'POST', auth,
			endpoint: this.web.qp('/utils/purge-unused', {
				boardId,
			}),
		});
	}

	public async unfurlLink({ url }: UtilsFunctionsInput['unfurlLink']) {
		return await this.web.request<UnfurlLink>({
			method: 'POST',
			endpoint: this.web.qp('/utils/unfurl'),
			body: { url },
		});
	}
}

// Types.
export type UtilsFunctionsInput = {
	'resolveBoard': { auth: string; body: ResolveBoardInput; };
	'purgeUnused': { auth: string; boardId?: string; };
	'unfurlLink': { url: string; };
}

// External.
export type ResolveBoardInput = {
	groupName: string;
	categoryName: string;
	boardName: string;
};

export type ResolveBoardOutput = {
	boardId: string;
	groupId: string;
	categoryId: string;
};

export type UnfurlLink = Partial<{
	title: string;
	description: string;
	favicon: string;
	image: string;
}>;
