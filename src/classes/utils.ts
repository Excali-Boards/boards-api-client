import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APIUtils {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async unfurlUrl({ auth, url, ...rest }: UtilsFunctionsInput['unfurlUrl']) {
		return await this.web.request<Partial<UnfurlOutput>>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/utils/unfurl', {
				url,
			}),
		});
	}
}

// Types.
export type UtilsFunctionsInput = WithHeaders<{
	'unfurlUrl': { auth: string; url: string };
}>

export type UnfurlOutput = {
	title: string;
	description: string;
	image: string;
	favicon: string;
}
