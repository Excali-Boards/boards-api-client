import { BoardsManager } from '../core/manager.js';
import { CreateSessionInput } from './sessions.js';
import { DBUserPartialType } from '../external/vars.js';
import { WithHeaders } from '../types.js';

export class APIAuth {
	constructor (private web: BoardsManager) { }

	public async authenticate({ auth, body, ...rest }: AuthFunctionsInput['authenticate']) {
		return await this.web.request<DBUserPartialType>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/auth/authenticate'),
		});
	}
}

export type AuthFunctionsInput = WithHeaders<{
	'authenticate': { auth: string; body: CreateSessionInput & { refreshProfile?: boolean } };
}>;

export type AuthOutput = DBUserPartialType & {
	sessions: { dbId: string; lastUsed: Date; }[];
};
