import { BoardPermissionType } from '../../prisma/generated/default';
import { NameInput, SingleOutput } from '../external/types';
import { WebDataManager } from '../core/manager';

export class APIBoards {
	constructor (private web: WebDataManager) { }

	async getBoards({ auth, categoryId, groupId }: DataBoardsFunctionsInput['getBoards']) {
		return await this.web.request<GetBoardsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/data/boards', {
				categoryId,
				groupId,
			}),
		});
	}

	async getBoard({ auth, boardId }: DataBoardsFunctionsInput['getBoard']) {
		return await this.web.request<GetBoardOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp(`/data/boards/${boardId}`),
		});
	}

	async updateBoard({ auth, boardId, body }: DataBoardsFunctionsInput['updateBoard']) {
		return await this.web.request<string>({
			method: 'PATCH', auth, body,
			endpoint: this.web.qp(`/data/boards/${boardId}`),
		});
	}

	async deleteBoard({ auth, boardId }: DataBoardsFunctionsInput['deleteBoard']) {
		return await this.web.request<string>({
			method: 'DELETE', auth,
			endpoint: this.web.qp(`/data/boards/${boardId}`),
		});
	}
}

// Input types
export type DataBoardsFunctionsInput = {
	'getBoards': { auth: string; categoryId?: string; groupId?: string; };
	'getBoard': { auth: string; boardId: string; };
	'updateBoard': { auth: string; boardId: string; body: NameInput; };
	'deleteBoard': { auth: string; boardId: string; };
};

// Output types
export type GetBoardsOutput = {
	isAdmin: boolean;
	boards: {
		group: SingleOutput;
		category: SingleOutput;
		board: SingleOutput & {
			accessLevel: BoardPermissionType;
			files: {
				fileId: string;
				mimeType: string;
				createdAt: Date;
				fileUrl: string;
			}[];
		};
	}[];
};

export type GetBoardOutput = {
	isAdmin: boolean;
	group: SingleOutput;
	category: SingleOutput;
	board: SingleOutput & {
		elements: Buffer;
		accessLevel: BoardPermissionType;
		files: {
			fileId: string;
			mimeType: string;
			createdAt: Date;
			fileUrl: string;
		}[];
	};
};
