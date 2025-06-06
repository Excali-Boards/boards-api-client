import { WebDataManager } from '../core/manager';

// Data.
export class APIUtils {
	constructor (private web: WebDataManager) { }

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
}

// Types.
export type UtilsFunctionsInput = {
	'resolveBoard': { auth: string; body: ResolveBoardInput; };
	'purgeUnused': { auth: string; boardId?: string; };
}

// External.
export type ResolveBoardInput = {
	groupName: string;
	categoryName: string;
	boardName: string;
};

export type ResolveBoardOutput = {
	boardId: string;
	boardName: string;
};