import { Prisma } from '../../prisma/generated/default';

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
