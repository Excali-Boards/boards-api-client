export type StatusWebCode = 200 | 400 | 401 | 403 | 404 | 413 | 429 | 500 | 503;
export type WebResponse<T, S extends StatusWebCode = StatusWebCode> =
	S extends 200 ? {
		status: S;
		data: T;
	} : {
		status: S;
		error: string | string[];
	};

export type Paginated<T> = {
	data: T extends (infer U)[] ? U[] : T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
};

export type WithHeaders<T> = {
	[P in keyof T]: T[P] & { headers?: Record<string, string>; };
};

export type PaginatedWebResponse<T, S extends StatusWebCode = StatusWebCode> = WebResponse<Paginated<T>, S>;

export type SuccessWithId<T extends string> = {
	[x in T]: string;
} & {
	message: string;
};

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type CancelOutWebResponses<T extends WebResponse<unknown>> = T extends { status: 200, data: infer U } ? U : never;

export type InferPartial<T> = T extends DeepPartial<infer U> ? U : T;

export type Simplify<T> = {
	[P in keyof T]: T[P];
};

export type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;

export type DeepPartial<T, N extends boolean = false> =
	T extends Primitive
	? T | (N extends true ? undefined : never)
	: T extends Array<infer U>
	? Array<DeepPartial<U, N>>
	: {
		[P in keyof T]?: DeepPartial<T[P], N>;
	};

export type DeepRequired<T> =
	T extends Primitive
	? NonNullable<T>
	: T extends Array<infer U>
	? Array<DeepRequired<U>>
	: {
		[P in keyof T]-?: DeepRequired<T[P]>;
	};

export type DeepNullable<T> =
	T extends Primitive
	? T | null
	: T extends Array<infer U>
	? Array<DeepNullable<U>>
	: {
		[P in keyof T]: DeepNullable<T[P]>;
	};

export type AtLeast<T, K extends keyof T> = T & Pick<T, K>;
export type AtLeastPartial<T, K extends keyof T> = DeepPartial<T> & Pick<T, K>;

export type MakeRequired<T, P extends keyof T> =
	T extends Array<infer U>
	? U extends object
	? Array<MakeRequired<U, P & keyof U>>
	: T
	: Omit<T, P> & Required<Pick<T, P>>;

export type WithoutUndefined<T> = T extends undefined ? never : T;
export type DeepNonNullable<T> = { [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>; };
export type DeepNonReadonly<T> = { -readonly [P in keyof T]: DeepNonReadonly<T[P]>; };

export type KeysOf<T> = '*' | KeysOfInner<DeepRequired<T>>;
export type KeysOfInner<T> =
	T extends Record<string, unknown>
	? {
		[K in keyof T]-?: K extends string
		? T[K] extends (infer U)[]
		? `${K}[]` | `${K}[].${KeysOfInner<U>}`
		: `${K}` | (T[K] extends null | undefined ? never : `${K}.${KeysOfInner<NonNullable<T[K]>>}`)
		: never;
	}[keyof T]
	: never;
