import type { StandardSchemaV1 } from "@standard-schema/spec";

/**
 * Creates a {@link StandardSchemaV1.PathSegment} for issue path tracking.
 *
 * @param key The property key representing this path segment.
 * Must be of: `number`, `string`, or `symbol`
 *
 * @returns A validated {@link StandardSchemaV1.PathSegment} object containing
 * the provided {@link key}
 *
 * @throws {TypeError} When the {@link key} is not a valid {@link PropertyKey}
 * (number, string, symbol)
 *
 * @example
 * ```typescript
 * // For object property access
 * const userSegment = createPathSegment("user");
 *
 * // For array index access
 * const indexSegment = createPathSegment(0);
 *
 * For symbol properties
 * const symbolSegment = createPathSegment(Symbol("id"));
 * ```
 */
export function createPathSegment(
	key: StandardSchemaV1.PathSegment["key"],
): StandardSchemaV1.PathSegment {
	if (
		typeof key !== "number" &&
		typeof key !== "string" &&
		typeof key !== "symbol"
	) {
		throw new TypeError(
			`expected typeof number, string, symbol; received ${typeof key}`,
		);
	}

	return { key } satisfies StandardSchemaV1.PathSegment;
}
