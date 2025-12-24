import { describe, expect, test } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createPathSegment } from "../path-segment/index.ts";
import { createIssue } from "./index.ts";

describe("createIssue", () => {
	describe("with message only", () => {
		test("should create issue with string message", () => {
			const result = createIssue("Invalid input");
			expect(result).toEqual({ message: "Invalid input" });
		});

		test("should create issue with empty string message", () => {
			const result = createIssue("");
			expect(result).toEqual({ message: "" });
		});

		test("should create issue with long message", () => {
			const longMessage =
				"This is a very long error message that could potentially be used for validation feedback in forms and other user interfaces where detailed error information is required for proper debugging and user guidance";
			const result = createIssue(longMessage);
			expect(result).toEqual({ message: longMessage });
		});

		test("should create issue with special characters", () => {
			const message = "Error: @#$%^&*()_+-=[]{}|;':\",./<>?";
			const result = createIssue(message);
			expect(result).toEqual({ message });
		});

		test("should throw TypeError for non-string message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(123)).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(123)).toThrow(
				"expected string, received number",
			);
		});

		test("should include invalid message as cause in error", () => {
			const invalidMessage = { invalid: true };
			try {
				// @ts-expect-error Intentionally passing wrong type
				createIssue(invalidMessage);
			} catch (error) {
				expect(error).toBeInstanceOf(TypeError);
				expect((error as TypeError).cause).toBe(invalidMessage);
			}
		});

		test("should throw TypeError for null message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(null)).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(null)).toThrow(
				"expected string, received object",
			);
		});

		test("should throw TypeError for undefined message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(undefined)).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(undefined)).toThrow(
				"expected string, received undefined",
			);
		});

		test("should throw TypeError for boolean message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(true)).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(true)).toThrow(
				"expected string, received boolean",
			);
		});

		test("should throw TypeError for object message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue({})).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue({})).toThrow("expected string, received object");
		});

		test("should throw TypeError for array message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue([])).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue([])).toThrow("expected string, received object");
		});

		test("should throw TypeError for function message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(() => {})).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(() => {})).toThrow(
				"expected string, received function",
			);
		});

		test("should throw TypeError for symbol message", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(Symbol("test"))).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(Symbol("test"))).toThrow(
				"expected string, received symbol",
			);
		});
	});

	describe("with message and path", () => {
		test("should create issue with string path segments", () => {
			const result = createIssue("Invalid input", ["user", "email"]);
			expect(result).toEqual({
				message: "Invalid input",
				path: ["user", "email"],
			});
		});

		test("should create issue with number path segments", () => {
			const result = createIssue("Invalid item", ["items", 0, 1, 2]);
			expect(result).toEqual({
				message: "Invalid item",
				path: ["items", 0, 1, 2],
			});
		});

		test("should create issue with symbol path segments", () => {
			const symbol1 = Symbol("key1");
			const symbol2 = Symbol("key2");
			const result = createIssue("Invalid input", [symbol1, symbol2]);
			expect(result).toEqual({
				message: "Invalid input",
				path: [symbol1, symbol2],
			});
		});

		test("should create issue with mixed path segments", () => {
			const symbol = Symbol("test");
			const result = createIssue("Invalid input", [
				"users",
				0,
				symbol,
				"email",
			]);
			expect(result).toEqual({
				message: "Invalid input",
				path: ["users", 0, symbol, "email"],
			});
		});

		test("should create issue with PathSegment objects", () => {
			const pathSegment1 = createPathSegment("user");
			const pathSegment2 = createPathSegment(42);
			const result = createIssue("Invalid input", [pathSegment1, pathSegment2]);
			expect(result).toEqual({
				message: "Invalid input",
				path: [pathSegment1, pathSegment2],
			});
		});

		test("should create issue with mixed PathSegments and property keys", () => {
			const pathSegment = createPathSegment("nested");
			const result = createIssue("Invalid input", [
				"users",
				0,
				pathSegment,
				"value",
			]);
			expect(result).toEqual({
				message: "Invalid input",
				path: ["users", 0, pathSegment, "value"],
			});
		});

		test("should create issue with empty path array", () => {
			const result = createIssue("Invalid input", []);
			expect(result).toEqual({
				message: "Invalid input",
				path: [],
			});
		});

		test("should create issue with single path segment", () => {
			const result = createIssue("Invalid input", ["user"]);
			expect(result).toEqual({
				message: "Invalid input",
				path: ["user"],
			});
		});

		test("should create issue with special string path segments", () => {
			const result = createIssue("Invalid input", [
				"",
				" ",
				"\n\t",
				"特殊字符",
			]);
			expect(result).toEqual({
				message: "Invalid input",
				path: ["", " ", "\n\t", "特殊字符"],
			});
		});

		test("should create issue with special number path segments", () => {
			const result = createIssue("Invalid input", [0, -1, Infinity, NaN]);
			expect(result).toEqual({
				message: "Invalid input",
				path: [0, -1, Infinity, NaN],
			});
		});

		test("should throw TypeError for non-array path", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", "not-an-array")).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", "not-an-array")).toThrow(
				"expected array, received string",
			);
		});

		test("should not throw for undefined path - treated as missing", () => {
			// @ts-expect-error Testing undefined path behavior
			const result = createIssue("Error", undefined);
			expect(result).toEqual({ message: "Error" });
		});

		test("should throw TypeError for null path", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", null)).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", null)).toThrow(
				"expected array, received object",
			);
		});

		test("should throw TypeError for object path", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", {})).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", {})).toThrow(
				"expected array, received object",
			);
		});

		test("should throw TypeError for function path", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", () => {})).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", () => {})).toThrow(
				"expected array, received function",
			);
		});

		test("should throw TypeError for invalid path segment - object", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", {}])).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", {}])).toThrow(
				"expected number, string, symbol, PathSegment, received object",
			);
		});

		test("should throw TypeError for invalid path segment - array", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", []])).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", []])).toThrow(
				"expected number, string, symbol, PathSegment, received object",
			);
		});

		test("should throw TypeError for invalid path segment - boolean", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", true])).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", true])).toThrow(
				"expected number, string, symbol, PathSegment, received boolean",
			);
		});

		test("should throw TypeError for invalid path segment - null", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", null])).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", null])).toThrow(
				"expected number, string, symbol, PathSegment, received object",
			);
		});

		test("should throw TypeError for invalid path segment - undefined", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", undefined])).toThrow(
				TypeError,
			);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", undefined])).toThrow(
				"expected number, string, symbol, PathSegment, received undefined",
			);
		});

		test("should throw TypeError for invalid path segment - function", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", () => {}])).toThrow(
				TypeError,
			);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", () => {}])).toThrow(
				"expected number, string, symbol, PathSegment, received function",
			);
		});

		test("should include invalid path segment as cause in error", () => {
			const invalidSegment = { invalid: true };
			try {
				// @ts-expect-error Intentionally passing wrong type
				createIssue("Error", ["valid", invalidSegment]);
			} catch (error) {
				expect(error).toBeInstanceOf(TypeError);
				expect((error as TypeError).cause).toBe(invalidSegment);
			}
		});

		test("should throw TypeError for invalid PathSegment object", () => {
			// @ts-expect-error Intentionally passing wrong type
			const invalidPathSegment = {
				notKey: "invalid",
			} as StandardSchemaV1.PathSegment;
			expect(() => createIssue("Error", ["valid", invalidPathSegment])).toThrow(
				TypeError,
			);
		});

		test("should throw TypeError for message and multiple invalid path segments", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue("Error", ["valid", {}, []])).toThrow(TypeError);
		});

		test("should throw TypeError for both invalid message and path - message first", () => {
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(123, "invalid")).toThrow(TypeError);
			// @ts-expect-error Intentionally passing wrong type
			expect(() => createIssue(123, "invalid")).toThrow(
				"expected string, received number",
			);
		});

		test("should handle complex nested paths", () => {
			const symbol = Symbol("deep");
			const pathSegment = createPathSegment("final");
			const result = createIssue("Deep error", [
				"level1",
				0,
				symbol,
				"level2",
				1,
				pathSegment,
			]);
			expect(result).toEqual({
				message: "Deep error",
				path: ["level1", 0, symbol, "level2", 1, pathSegment],
			});
		});
	});

	describe("edge cases and type safety", () => {
		test("should work as expected with very large path arrays", () => {
			const largePath = Array.from({ length: 1000 }, (_, i) => i.toString());
			const result = createIssue("Large path error", largePath);
			expect(result.message).toBe("Large path error");
			if (result.path) {
				expect(result.path).toHaveLength(1000);
				expect(result.path[999]).toBe("999");
			}
		});

		test("should handle Unicode characters in path segments", () => {
			const result = createIssue("Unicode error", [
				"测试",
				"🚀",
				"résumé",
				"ñiño",
			]);
			expect(result).toEqual({
				message: "Unicode error",
				path: ["测试", "🚀", "résumé", "ñiño"],
			});
		});
	});
});
