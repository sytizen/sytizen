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

/**
 * Type guard that checks if a value is a valid {@link StandardSchemaV1.Issue}.
 *
 * This function performs runtime validation to determine if the given {@link value} conforms to
 * the {@link StandardSchemaV1.Issue} interface structure. It verifies that the {@link value} is an object with a
 * {@link message} property that is a string, and optionally a {@link path} property containing
 * valid path segments.
 *
 * @param value - The value to check. Can be any type.
 * @returns `true` if the {@link value} is a valid Issue, `false` otherwise.
 *
 * @example
 * ```typescript
 * // Valid issues
 * isIssue({ message: "Invalid input" }) // true
 * isIssue({ message: "Invalid input", path: ["user", "email"] }) // true
 * isIssue({ message: "Invalid input", path: [0, "items", Symbol("id")] }) // true
 *
 * // Invalid values
 * isIssue({}) // false (missing {@link message})
 * isIssue({ message: 123 }) // false ({@link message} not string)
 * isIssue({ message: "Error", path: "invalid" }) // false ({@link path} not array)
 * isIssue({ message: "Error", path: ["valid", {}] }) // false (invalid {@link path} segment)
 * isIssue(null) // false (not object)
 * isIssue("string") // false (not object)
 * isIssue([]) // false (not object with {@link message})
 * ```
 */
export function isIssue(value: unknown): value is StandardSchemaV1.Issue {
	return (
		typeof value === "object" &&
		value !== null &&
		"message" in value &&
		typeof value.message === "string" &&
		(!("path" in value) ||
			(Array.isArray(value.path) &&
				value.path.every(
					(segment) =>
						typeof segment === "number" ||
						typeof segment === "string" ||
						typeof segment === "symbol" ||
						isPathSegment(segment),
				)))
	);
}
