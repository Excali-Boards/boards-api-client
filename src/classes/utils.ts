import { BoardsManager } from '../core/manager';

// Data.
export class APIUtils {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async unfurlUrl({ auth, url }: UtilsFunctionsInput['unfurlUrl']) {
		return await this.web.request<Partial<UnfurlOutput>>({
			method: 'GET', auth,
			endpoint: this.web.qp('/utils/unfurl', {
				url,
			}),
		});
	}
}

// Types.
export type UtilsFunctionsInput = {
	'unfurlUrl': { auth: string; url: string; };
}

export type UnfurlOutput = {
	title: string;
	description: string;
	image: string;
	favicon: string;
}
