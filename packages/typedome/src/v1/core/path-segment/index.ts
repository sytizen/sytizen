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
): StandardSchemaV1.PathSegment;

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

/**
 * Type guard that checks if a value is a valid {@link StandardSchemaV1.PathSegment}.
 *
 * This function performs runtime validation to determine if the given value conforms to
 * the PathSegment interface structure. It verifies that the value is an object with a
 * `key` property that is a valid {@link PropertyKey} (string, number, or symbol).
 *
 * @param value - The value to check. Can be any type.
 * @returns `true` if the value is a valid PathSegment, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Valid path segments
 * isPathSegment({ key: "username" }) // true
 * isPathSegment({ key: 42 })         // true
 * isPathSegment({ key: Symbol("id") }) // true
 *
 * // Invalid values
 * isPathSegment({}) // false (missing key)
 * isPathSegment({ key: {} }) // false (key is not PropertyKey)
 * isPathSegment(null) // false (not an object)
 * isPathSegment("string") // false (not an object)
 * isPathSegment(42) // false (not an object)
 * isPathSegment([{ key: "test" }]) // false (array, not plain object)
 * ```
 */
export function isPathSegment(
	value: unknown,
): value is StandardSchemaV1.PathSegment {
	return (
		typeof value === "object" &&
		value !== null &&
		"key" in value &&
		(typeof value.key === "number" ||
			typeof value.key === "string" ||
			typeof value.key === "symbol")
	);
}
