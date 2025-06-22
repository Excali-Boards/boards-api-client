import { Platforms } from '../../prisma/generated/default';
import { BoardsManager } from '../core/manager';

// Data.
export class APIAuth {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async authenticate({ auth, body }: AuthFunctionsInput['authenticate']) {
		return await this.web.request<AuthenticateOutput>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/auth'),
		});
	}
}

// Types.
export type AuthFunctionsInput = {
	'authenticate': { auth: string; body: AuthenticateInput; };
}

// External.
export type AuthenticateInput = {
	platform: Platforms
	email: string;
	displayName: string;
	avatarUrl?: string | null;
	currentUserId?: string;
};

export type AuthenticateOutput = {
	email: string;
	displayName: string | null;
	avatarUrl: string | null;
	platform: Platforms;
};
