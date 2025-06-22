import { PrismaModelsNonRecursive, PrismaEnums } from 'ts-prisma';
import { $Enums, Prisma } from '../../prisma/generated/default';

export type Models = PrismaModelsNonRecursive<Prisma.ModelName, Prisma.TypeMap, true>;
export type Enums = PrismaEnums<typeof $Enums>;

// Other.
export type SingleOutput = {
	id: string;
	name: string;
	index: number;
}

export type NameInput = {
	name: string;
}
