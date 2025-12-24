import { describe, expect, test } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createPathSegment } from "../path-segment/index.ts";
import { isIssue } from "./index.ts";

describe("isIssue", () => {
	describe("valid Issue objects", () => {
		test("should return true for Issue with only message", () => {
			expect(isIssue({ message: "Invalid input" })).toBe(true);
		});

		test("should return true for Issue with empty string message", () => {
			expect(isIssue({ message: "" })).toBe(true);
		});

		test("should return true for Issue with string path segments", () => {
			expect(
				isIssue({ message: "Invalid input", path: ["user", "email"] }),
			).toBe(true);
		});

		test("should return true for Issue with number path segments", () => {
			expect(
				isIssue({ message: "Invalid input", path: ["items", 0, 1, 2] }),
			).toBe(true);
		});

		test("should return true for Issue with symbol path segments", () => {
			const symbol1 = Symbol("key1");
			const symbol2 = Symbol("key2");
			expect(
				isIssue({ message: "Invalid input", path: [symbol1, symbol2] }),
			).toBe(true);
		});

		test("should return true for Issue with mixed path segments", () => {
			const symbol = Symbol("test");
			expect(
				isIssue({
					message: "Invalid input",
					path: ["users", 0, symbol, "email"],
				}),
			).toBe(true);
		});

		test("should return true for Issue with PathSegment objects", () => {
			const pathSegment1 = createPathSegment("user");
			const pathSegment2 = createPathSegment(42);
			expect(
				isIssue({
					message: "Invalid input",
					path: [pathSegment1, pathSegment2],
				}),
			).toBe(true);
		});

		test("should return true for Issue with mixed PathSegments and property keys", () => {
			const pathSegment = createPathSegment("nested");
			expect(
				isIssue({
					message: "Invalid input",
					path: ["users", 0, pathSegment, "value"],
				}),
			).toBe(true);
		});

		test("should return true for Issue with empty path array", () => {
			expect(isIssue({ message: "Invalid input", path: [] })).toBe(true);
		});

		test("should return true for Issue with special string path segments", () => {
			expect(
				isIssue({
					message: "Invalid input",
					path: ["", " ", "\n\t", "特殊字符"],
				}),
			).toBe(true);
		});

		test("should return true for Issue with special number path segments", () => {
			expect(
				isIssue({ message: "Invalid input", path: [0, -1, Infinity, NaN] }),
			).toBe(true);
		});

		test("should return true for Issue with long message", () => {
			const longMessage =
				"This is a very long error message that could potentially be used for validation feedback in forms and other user interfaces where detailed error information is required for proper debugging and user guidance";
			expect(isIssue({ message: longMessage })).toBe(true);
		});

		test("should return true for Issue with special characters in message", () => {
			const message = "Error: @#$%^&*()_+-=[]{}|;':\",./<>?";
			expect(isIssue({ message })).toBe(true);
		});
	});

	describe("invalid Issue objects", () => {
		test("should return false for empty object", () => {
			expect(isIssue({})).toBe(false);
		});

		test("should return false for object without message property", () => {
			expect(isIssue({ path: ["test"] })).toBe(false);
		});

		test("should return false for object with non-string message", () => {
			expect(isIssue({ message: 123 })).toBe(false);
		});

		test("should return false for object with null message", () => {
			expect(isIssue({ message: null })).toBe(false);
		});

		test("should return false for object with undefined message", () => {
			expect(isIssue({ message: undefined })).toBe(false);
		});

		test("should return false for object with boolean message", () => {
			expect(isIssue({ message: true })).toBe(false);
		});

		test("should return false for object with object message", () => {
			expect(isIssue({ message: {} })).toBe(false);
		});

		test("should return false for object with array message", () => {
			expect(isIssue({ message: [] })).toBe(false);
		});

		test("should return false for object with function message", () => {
			expect(isIssue({ message: () => {} })).toBe(false);
		});

		test("should return false for object with symbol message", () => {
			expect(isIssue({ message: Symbol("test") })).toBe(false);
		});

		test("should return false for object with string path (not array)", () => {
			expect(isIssue({ message: "Error", path: "invalid" })).toBe(false);
		});

		test("should return false for object with null path", () => {
			expect(isIssue({ message: "Error", path: null })).toBe(false);
		});

		test("should return false for object with undefined path", () => {
			expect(isIssue({ message: "Error", path: undefined })).toBe(false);
		});

		test("should return false for object with object path", () => {
			expect(isIssue({ message: "Error", path: {} })).toBe(false);
		});

		test("should return false for object with function path", () => {
			expect(isIssue({ message: "Error", path: () => {} })).toBe(false);
		});

		test("should return false for object with invalid path segment - object", () => {
			expect(isIssue({ message: "Error", path: ["valid", {}] })).toBe(false);
		});

		test("should return false for object with invalid path segment - array", () => {
			expect(isIssue({ message: "Error", path: ["valid", []] })).toBe(false);
		});

		test("should return false for object with invalid path segment - boolean", () => {
			expect(isIssue({ message: "Error", path: ["valid", true] })).toBe(false);
		});

		test("should return false for object with invalid path segment - null", () => {
			expect(isIssue({ message: "Error", path: ["valid", null] })).toBe(false);
		});

		test("should return false for object with invalid path segment - undefined", () => {
			expect(isIssue({ message: "Error", path: ["valid", undefined] })).toBe(
				false,
			);
		});

		test("should return false for object with invalid path segment - function", () => {
			expect(isIssue({ message: "Error", path: ["valid", () => {}] })).toBe(
				false,
			);
		});

		test("should return false for object with multiple invalid path segments", () => {
			expect(isIssue({ message: "Error", path: ["valid", {}, []] })).toBe(
				false,
			);
		});

		test("should return false for invalid PathSegment object", () => {
			const invalidPathSegment = {
				notKey: "invalid",
			} as unknown as StandardSchemaV1.PathSegment;
			expect(
				isIssue({ message: "Error", path: ["valid", invalidPathSegment] }),
			).toBe(false);
		});
	});

	describe("non-object values", () => {
		test("should return false for null", () => {
			expect(isIssue(null)).toBe(false);
		});

		test("should return false for undefined", () => {
			expect(isIssue(undefined)).toBe(false);
		});

		test("should return false for string", () => {
			expect(isIssue("string")).toBe(false);
		});

		test("should return false for number", () => {
			expect(isIssue(42)).toBe(false);
		});

		test("should return false for boolean", () => {
			expect(isIssue(true)).toBe(false);
		});

		test("should return false for symbol", () => {
			expect(isIssue(Symbol("test"))).toBe(false);
		});

		test("should return false for array", () => {
			expect(isIssue([])).toBe(false);
		});

		test("should return false for function", () => {
			expect(isIssue(() => {})).toBe(false);
		});

		test("should return false for Date", () => {
			expect(isIssue(new Date())).toBe(false);
		});

		test("should return false for RegExp", () => {
			expect(isIssue(/test/)).toBe(false);
		});

		test("should return true for Error object (has message property)", () => {
			expect(isIssue(new Error("test"))).toBe(true);
		});
	});

	describe("edge cases and type safety", () => {
		test("should work as type guard in TypeScript", () => {
			const unknownValue: unknown = { message: "test", path: ["user"] };

			if (isIssue(unknownValue)) {
				// TypeScript should know unknownValue is Issue here
				expect(unknownValue.message).toBe("test");
				expect(Array.isArray(unknownValue.path)).toBe(true);
				// This would be a TypeScript error if uncommented:
				// expect(unknownValue.invalidProperty).toBeUndefined();
			}
		});

		test("should handle objects with additional properties", () => {
			expect(isIssue({ message: "Error", path: [], extra: "property" })).toBe(
				true,
			);
		});

		test("should handle objects created with Object.create(null)", () => {
			const obj = Object.create(null);
			obj.message = "test";
			expect(isIssue(obj)).toBe(true);
		});

		test("should handle objects with non-enumerable message property", () => {
			const obj = {};
			Object.defineProperty(obj, "message", {
				value: "test",
				enumerable: false,
			});
			expect(isIssue(obj)).toBe(true); // "in" operator checks for existence, not enumerability
		});

		test("should handle very large path arrays", () => {
			const largePath = Array.from({ length: 1000 }, (_, i) => i.toString());
			expect(isIssue({ message: "Large path error", path: largePath })).toBe(
				true,
			);
		});

		test("should handle Unicode characters in message and path", () => {
			expect(
				isIssue({
					message: "Unicode 错误",
					path: ["测试", "🚀", "résumé", "ñiño"],
				}),
			).toBe(true);
		});

		test("should work with complex nested paths", () => {
			const symbol = Symbol("deep");
			const pathSegment = createPathSegment("final");
			expect(
				isIssue({
					message: "Deep error",
					path: ["level1", 0, symbol, "level2", 1, pathSegment],
				}),
			).toBe(true);
		});

		test("should return false for mixed valid and invalid path segments", () => {
			expect(
				isIssue({
					message: "Error",
					path: ["valid", "also valid", {}],
				}),
			).toBe(false);
		});

		test("should return true for object with path containing only PathSegment objects", () => {
			const pathSegment1 = createPathSegment("first");
			const pathSegment2 = createPathSegment(42);
			const pathSegment3 = createPathSegment(Symbol("third"));
			expect(
				isIssue({
					message: "All PathSegments",
					path: [pathSegment1, pathSegment2, pathSegment3],
				}),
			).toBe(true);
		});
	});
});
