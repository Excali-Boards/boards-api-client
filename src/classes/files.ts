import { WebDataManager } from '../core/manager';

// Data.
export class APIFiles {
	constructor (private web: WebDataManager) { }

	public async getFile({ auth, boardId, fileId }: FilesFunctionsInput['getFile']) {
		return await this.web.request<GetFileOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/files/${boardId}/${fileId}`),
			responseType: 'blob',
		});
	}
}

// Types.
export type FilesFunctionsInput = {
	'getFile': { auth: string; boardId: string; fileId: string; };
}

// External.
export type GetFileOutput = ReadableStream | Blob;
