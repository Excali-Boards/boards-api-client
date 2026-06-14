import { BoardsManager } from '../core/manager';
import { CreateSessionInput } from './sessions';
import { DBUserPartialType } from '../external/vars';
import { WithHeaders } from '../types';

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
