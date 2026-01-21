import { BoardRole, CategoryRole, GroupRole } from '../external/vars';
import { PermUser, ResourceType } from '../external/types';
import { BoardsManager } from '../core/manager';
import { WithHeaders } from '../types';

// Data.
export class APIPermissions {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async viewPermissions({ auth, query, ...rest }: PermissionsFunctionsInput['viewPermissions']) {
		return await this.web.request<PermUser[]>({
			method: 'GET', auth, ...rest,
			endpoint: this.web.qp('/permissions/view', query),
		});
	}

	public async viewAllPermissions({ auth, userIds, ...rest }: PermissionsFunctionsInput['viewAllPermissions']) {
		return await this.web.request<Record<string, PermUser>>({
			method: 'POST', auth, body: { userIds }, ...rest,
			endpoint: this.web.qp('/permissions/view-all'),
		});
	}

	public async grantPermissions({ auth, body, ...rest }: PermissionsFunctionsInput['grantPermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/permissions/grant'),
		});
	}

	public async revokePermissions({ auth, body, ...rest }: PermissionsFunctionsInput['revokePermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body, ...rest,
			endpoint: this.web.qp('/permissions/revoke'),
		});
	}
}

// Types.
export type PermissionsFunctionsInput = WithHeaders<{
	'viewPermissions': { auth: string; query: ViewPermissionsQuery };
	'viewAllPermissions': { auth: string; userIds: string[] };
	'grantPermissions': { auth: string; body: GrantPermissionsInput };
	'revokePermissions': { auth: string; body: RevokePermissionsInput };
}>

// External.
export type ViewPermissionsQuery = {
	type: ResourceType;
	id: string;
};

export type GrantPermissionsInput = {
	userId: string;

	groupIds?: string[];
	groupRole?: GroupRole;

	categoryIds?: string[];
	categoryRole?: CategoryRole;

	boardIds?: string[];
	boardRole?: BoardRole;
};

export type RevokePermissionsInput = {
	userId: string;
	resourceType: ResourceType;
	resourceId: string;
};
