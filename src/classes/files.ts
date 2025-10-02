import { BoardsManager } from '../core/manager';

export class APIFiles {
	constructor (private web: BoardsManager) { }

	public async uploadBase64Files({ auth, boardId, files }: FilesFunctionsInput['uploadBase64Files']) {
		return await this.web.request<FileUploadResponse>({
			method: 'POST', auth,
			endpoint: `/files/${boardId}/base64`,
			body: files,
		});
	}

	public async uploadRawFiles({ auth, boardId, files }: FilesFunctionsInput['uploadRawFiles']) {
		const formData = new FormData();

		for (const file of files) {
			formData.append('files', file);
		}

		return await this.web.request<FileUploadResponse>({
			method: 'POST', auth,
			endpoint: `/files/${boardId}/raw`,
			body: formData,
			headers: null,
		});
	}

	public async deleteFiles({ auth, boardId, fileIds }: FilesFunctionsInput['deleteFiles']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: `/files/${boardId}/delete`,
			body: fileIds,
		});
	}
}

// Input types
export type FilesFunctionsInput = {
	'uploadBase64Files': { auth: string; boardId: string; files: Base64FileInput; };
	'uploadRawFiles': { auth: string; boardId: string; files: File[]; };
	'deleteFiles': { auth: string; boardId: string; fileIds: string[]; };
};

export type Base64FileInput = {
	id: string;
	data: string;
	mimeType: string;
}[];

export type RawFileUploadInput = {
	boardId: string;
};

export type FileUploadResponse = {
	success: number;
	failed: number;
};
