import type { StandardSchemaV1 } from "@standard-schema/spec";
import { isPathSegment } from "../path-segment/index.ts";

/**
 * Creates a {@link StandardSchemaV1.Issue} object with just a {@link message}.
 *
 * This overload creates a simple issue without path information, suitable for
 * top-level validation errors where the error location is not relevant.
 *
 * @param message - The error message describing what went wrong.
 * @returns A {@link StandardSchemaV1.Issue} object with the specified {@link message}.
 * @throws {TypeError} When {@link message} is not a string.
 *
 * @example
 * ```typescript
 * createIssue("Invalid email format") // { message: "Invalid email format" }
 *
 * // Throws TypeError
 * createIssue(123) // TypeError: expected string, received number
 * ```
 */
export function createIssue(message: string): StandardSchemaV1.Issue;

/**
 * Creates a {@link StandardSchemaV1.Issue} object with a {@link message} and {@link path}.
 *
 * This overload creates an issue that includes path information, indicating
 * where in the data structure the validation error occurred. The {@link path} can be
 * composed of property keys (strings, numbers, symbols) or PathSegment objects.
 *
 * @param message - The error message describing what went wrong.
 * @param path - An array of path segments indicating where the error occurred.
 *               Each segment can be a {@link PropertyKey} or {@link StandardSchemaV1.PathSegment}.
 * @returns A {@link StandardSchemaV1.Issue} object with the specified {@link message} and {@link path}.
 * @throws {TypeError} When {@link message} is not a string.
 * @throws {TypeError} When {@link path} is not an array.
 * @throws {TypeError} When any {@link path} segment is not a valid PropertyKey or PathSegment.
 *
 * @example
 * ```typescript
 * // Using property keys
 * createIssue("Invalid email format", ["user", "email"])
 * // { message: "Invalid email format", path: [{ key: "user" }, { key: "email" }] }
 *
 * // Using PathSegment objects
 * import { createPathSegment } from "../path-segment";
 * createIssue("Invalid item", ["items", 0, "name"])
 * // { message: "Invalid item", path: [{ key: "items" }, { key: 0 }, { key: "name" }] }
 *
 * // Throws TypeError
 * createIssue("Error", "not-an-array") // TypeError: expected array, received string
 * createIssue("Error", ["valid", {}]) // TypeError: expected number, string, symbol, PathSegment, received object
 * ```
 */
export function createIssue(
	message: string,
	path: (PropertyKey | StandardSchemaV1.PathSegment)[],
): StandardSchemaV1.Issue;

export function createIssue(message: unknown, path?: unknown) {
	if (typeof message !== "string") {
		throw new TypeError(`expected string, received ${typeof message}`, {
			cause: message,
		});
	}

	if (typeof path === "undefined") {
		return { message };
	}

	if (!Array.isArray(path)) {
		throw new TypeError(`expected array, received ${typeof path}`);
	}

	for (const segment of path) {
		if (
			typeof segment !== "number" &&
			typeof segment !== "string" &&
			typeof segment !== "symbol" &&
			!isPathSegment(segment)
		) {
			throw new TypeError(
				`expected number, string, symbol, PathSegment, received ${typeof segment}`,
				{ cause: segment },
			);
		}
	}

	return { message, path };
}
