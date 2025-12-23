import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Creates a {@link StandardSchemaV1.PathSegment} object for {@link StandardSchemaV1} validation.
 *
 * A path segment represents a key in an object path and must be a valid {@link PropertyKey}
 * (string, number, or symbol). This function validates the input and returns a
 * standardized path segment object.
 *
 * @param value - The value to create a path segment from. Must be a string, number, or symbol.
 * @returns A {@link StandardSchemaV1.PathSegment} object containing the validated key.
 * @throws {TypeError} When the value is not a string, number, or symbol.
 *
 * @example
 * ```typescript
 * // Valid inputs
 * createPathSegment("username") // { key: "username" }
 * createPathSegment(42)         // { key: 42 }
 * createPathSegment(Symbol("id")) // { key: Symbol("id") }
 *
 * // Invalid input throws {@link TypeError}
 * createPathSegment({}) // TypeError: expected number, string, symbol, received object
 * ```
 */
export function createPathSegment(
	value: PropertyKey,
): StandardSchemaV1.PathSegment {
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
