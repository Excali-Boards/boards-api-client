import { Prisma } from '../../prisma/generated/default';
import { GlobalRole, UserRole } from './types';

export const DBUserSelectArgs = {
	select: {
		userId: true,
		email: true,
		avatarUrl: true,
		displayName: true,
		mainLoginType: true,
		mainGroupId: true,
		groupPermissions: { select: { groupId: true, role: true } },
		categoryPermissions: { select: { categoryId: true, role: true } },
		boardPermissions: { select: { boardId: true, role: true } },
		loginMethods: { select: { platform: true, platformEmail: true } },
	},
} satisfies Prisma.UserDefaultArgs;

export const DBUserPartial = Prisma.validator<Prisma.UserDefaultArgs>()(DBUserSelectArgs);
export type DBUserPartialType = Prisma.UserGetPayload<typeof DBUserPartial>;

export enum Platforms {
	Google = 'Google',
	GitHub = 'GitHub',
	Discord = 'Discord',
	Microsoft = 'Microsoft',
}

export enum BoardRole {
	BoardViewer = 'BoardViewer',
	BoardCollaborator = 'BoardCollaborator',
}

export enum CategoryRole {
	CategoryViewer = 'CategoryViewer',
	CategoryCollaborator = 'CategoryCollaborator',
	CategoryManager = 'CategoryManager',
	CategoryAdmin = 'CategoryAdmin',
}

export enum GroupRole {
	GroupViewer = 'GroupViewer',
	GroupCollaborator = 'GroupCollaborator',
	GroupManager = 'GroupManager',
	GroupAdmin = 'GroupAdmin',
}

// Variables.
export const SimplePermissionHierarchy: Record<string, number> = {
	Viewer: 1,
	Collaborator: 2,
	Manager: 3,
	Admin: 4,
};

export const PermissionHierarchy: Record<UserRole, number> = {
	[BoardRole.BoardViewer]: 1,
	[BoardRole.BoardCollaborator]: 2,
	[CategoryRole.CategoryViewer]: 3,
	[CategoryRole.CategoryCollaborator]: 4,
	[CategoryRole.CategoryManager]: 5,
	[CategoryRole.CategoryAdmin]: 6,
	[GroupRole.GroupViewer]: 7,
	[GroupRole.GroupCollaborator]: 8,
	[GroupRole.GroupManager]: 9,
	[GroupRole.GroupAdmin]: 10,
	[GlobalRole.Developer]: 11,
};
