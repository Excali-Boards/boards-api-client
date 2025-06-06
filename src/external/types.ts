import { $Enums, Prisma, TSPrisma } from '../../prisma/generated/default';
import { PrismaModelsNonRecursive, PrismaEnums } from 'ts-prisma';

export type Models = PrismaModelsNonRecursive<Prisma.ModelName, Prisma.TypeMap, true>;
export type Enums = PrismaEnums<typeof $Enums>;

// Interfaces.
export type User = TSPrisma.TSPrismaModelsFull['User'];
export type Group = TSPrisma.TSPrismaModelsFull['Group'];
export type Category = TSPrisma.TSPrismaModelsFull['Category'];
export type Board = TSPrisma.TSPrismaModelsFull['Board'];
export type File = TSPrisma.TSPrismaModelsFull['File'];
export type BoardPermission = TSPrisma.TSPrismaModelsFull['BoardPermission'];

// Other.
export type SingleOutput = {
	id: string;
	name: string;
	index: number;
}

export type NameInput = {
	name: string;
}