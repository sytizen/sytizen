import type { StandardSchemaV1 } from "@standard-schema/spec";

export function createPathSegment(
	value: PropertyKey,
): StandardSchemaV1.PathSegment;
export function createPathSegment(value: Exclude<unknown, PropertyKey>): never;
export function createPathSegment(value: unknown) {
	if (
		typeof value !== "number" &&
		typeof value !== "string" &&
		typeof value !== "symbol"
	) {
		throw new TypeError(
			`expected number, string, symbol, received ${typeof value}`,
			{
				cause: value,
			},
		);
	}

	return { key: value };
}
