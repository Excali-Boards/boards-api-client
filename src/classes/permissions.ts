import { BoardRole, CategoryRole, GroupRole } from '../external/vars';
import { GrantedEntry, ResourceType } from '../external/types';
import { BoardsManager } from '../core/manager';

// Data.
export class APIPermissions {
	constructor (private web: BoardsManager) { }

	// Methods.
	public async viewPermissions({ auth, query }: PermissionsFunctionsInput['viewPermissions']) {
		return await this.web.request<ViewPermissionsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/permissions/view', query),
		});
	}

	public async grantPermissions({ auth, body }: PermissionsFunctionsInput['grantPermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/permissions/grant'),
		});
	}

	public async revokePermissions({ auth, body }: PermissionsFunctionsInput['revokePermissions']) {
		return await this.web.request<string>({
			method: 'POST', auth, body,
			endpoint: this.web.qp('/permissions/revoke'),
		});
	}
}

// Types.
export type PermissionsFunctionsInput = {
	'viewPermissions': { auth: string; query: ViewPermissionsQuery; };
	'grantPermissions': { auth: string; body: GrantPermissionsInput; };
	'revokePermissions': { auth: string; body: RevokePermissionsInput; };
}

// External.
export type ViewPermissionsQuery = {
	type: ResourceType;
	id: string;
};

export type ViewPermissionsOutput = {
	userId: string;
	email: string;
	displayName: string;
	avatarUrl: string | null;
	permissions: GrantedEntry[];
}[];

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
