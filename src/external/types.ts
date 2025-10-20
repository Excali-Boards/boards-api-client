import { TSPrisma, BoardType } from '../../prisma/generated/default';
import { BoardRole, CategoryRole, GroupRole } from './vars';

// Structures.
export type User = TSPrisma.TSPrismaModelsFull['User'];
export type Group = TSPrisma.TSPrismaModelsFull['Group'];
export type Category = TSPrisma.TSPrismaModelsFull['Category'];
export type Board = TSPrisma.TSPrismaModelsFull['Board'];
export type File = TSPrisma.TSPrismaModelsFull['File'];
export type LoginMethod = TSPrisma.TSPrismaModelsFull['LoginMethod'];

// Permission models
export type GroupPermission = TSPrisma.TSPrismaModelsFull['GroupPermission'];
export type CategoryPermission = TSPrisma.TSPrismaModelsFull['CategoryPermission'];
export type BoardPermission = TSPrisma.TSPrismaModelsFull['BoardPermission'];
export type Invite = TSPrisma.TSPrismaModelsFull['Invite'];

// Permission roles.
export type UserRole = BoardRole | CategoryRole | GroupRole | GlobalRole;

export enum GlobalRole {
	Developer = 'Developer',
}

// Resource types.
export type AccessLevel = 'read' | 'write' | 'manage' | 'admin';

export type ResourceType = 'group' | 'category' | 'board';
export type GlobalResourceType = ResourceType | 'global';

export type ResourceId<A extends GlobalResourceType> =
	A extends 'board' ? { boardId: string; categoryId: string; groupId: string; } :
	A extends 'category' ? { categoryId: string; groupId: string; } :
	A extends 'group' ? { groupId: string; } :
	A extends 'global' ? null :
	never;

export type ResourceReturnEnum<A extends GlobalResourceType> =
	A extends 'board' ? BoardRole :
	A extends 'category' ? CategoryRole :
	A extends 'group' ? GroupRole :
	A extends 'global' ? GlobalRole :
	never;

export type PermissionGrantResult = {
	newPermissions: GrantedRoles;
	updatedPermissions: (GrantedRole & { dbId: string })[];
};

export type PermissionCheckData<T extends ResourceType> = {
	type: T; data: ResourceId<T>;
};

export type PermUser = {
	email: string;
	userId: string;
	displayName: string;
	avatarUrl: string | null;
	permissions: GrantedEntry[];
};

export type GrantedRoles = GrantedRole[];
export type GrantedRole = {
	type: ResourceType;
	resourceId: string;
	role: UserRole;
};

// Other.
export type SingleOutput = {
	id: string;
	name: string;
	index: number;
	accessLevel: AccessLevel;
};

export type NameInput = {
	name: string;
};

export type BoardInput = NameInput & {
	type: BoardType;
}

export type GrantedEntry = {
	role: UserRole;
	grantType: 'explicit' | 'implicit';

	type: ResourceType;
	resourceId: string;

	basedOnType: ResourceType;
	basedOnResourceId: string;
	basedOnResourceName: string;
};

export type AllRooms = {
	boardId: string;
	elements: number;
	type: BoardType;
	collaborators: CollabUser[];
}[];

export type CollabUser = {
	id: string;
	socketId: string;
	username: string;
	avatarUrl: string | null;
};
