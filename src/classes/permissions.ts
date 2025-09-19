import { BulkPermissions, GrantedRoles, ResourceType } from '../external/types';
import { BoardRole, CategoryRole, GroupRole } from '../external/vars';
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

	public async bulkViewPermissions({ auth, query }: PermissionsFunctionsInput['bulkViewPermissions']) {
		return await this.web.request<ViewPermissionsOutput>({
			method: 'GET', auth,
			endpoint: this.web.qp('/permissions/view-bulk', query),
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
	'bulkViewPermissions': { auth: string; query: BulkViewPermissionsQuery; };
	'grantPermissions': { auth: string; body: GrantPermissionsInput; };
	'revokePermissions': { auth: string; body: RevokePermissionsInput; };
}

// External.
export type ViewPermissionsQuery = {
	type: ResourceType; // for board you must also provide categoryId and groupId, for category you must provide groupId
	groupId?: string;
	categoryId?: string;
	boardId?: string;
};

export type BulkViewPermissionsQuery = {
	mode: BulkPermissions; // for 'group-categories' you must provide groupId, for 'category-boards' you must provide categoryId and  groupId, for 'all-groups' no additional parameters are required
	groupId?: string;
	categoryId?: string;
};

export type ViewPermissionsOutput = {
	userId: string;
	email: string;
	displayName: string;
	avatarUrl: string | null;
	permissions: GrantedRoles;
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
