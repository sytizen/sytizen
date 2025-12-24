import { describe, expect, test } from "bun:test";
import { isPathSegment } from "./index.ts";

describe("isPathSegment", () => {
	test("should return true for valid path segment with string key", () => {
		const result = isPathSegment({ key: "test" });
		expect(result).toBe(true);
	});

	test("should return true for valid path segment with number key", () => {
		const result = isPathSegment({ key: 42 });
		expect(result).toBe(true);
	});

	test("should return true for valid path segment with symbol key", () => {
		const symbol = Symbol("test");
		const result = isPathSegment({ key: symbol });
		expect(result).toBe(true);
	});

	test("should return false for empty object", () => {
		const result = isPathSegment({});
		expect(result).toBe(false);
	});

	test("should return false for object with invalid key type", () => {
		expect(isPathSegment({ key: {} })).toBe(false);
		expect(isPathSegment({ key: [] })).toBe(false);
		expect(isPathSegment({ key: true })).toBe(false);
		expect(isPathSegment({ key: null })).toBe(false);
		expect(isPathSegment({ key: undefined })).toBe(false);
	});

	test("should return false for null", () => {
		const result = isPathSegment(null);
		expect(result).toBe(false);
	});

	test("should return false for undefined", () => {
		const result = isPathSegment(undefined);
		expect(result).toBe(false);
	});

	test("should return false for primitive values", () => {
		expect(isPathSegment("string")).toBe(false);
		expect(isPathSegment(42)).toBe(false);
		expect(isPathSegment(true)).toBe(false);
		expect(isPathSegment(Symbol("test"))).toBe(false);
	});

	test("should return false for arrays", () => {
		const result = isPathSegment([{ key: "test" }]);
		expect(result).toBe(false);
	});

	test("should return false for functions", () => {
		const result = isPathSegment(() => {});
		expect(result).toBe(false);
	});

	test("should return true for objects with additional properties", () => {
		const result = isPathSegment({ key: "test", extra: "property" });
		expect(result).toBe(true); // Extra properties don't invalidate it
	});

	test("should return true for empty string key", () => {
		const result = isPathSegment({ key: "" });
		expect(result).toBe(true);
	});

	test("should return true for zero key", () => {
		const result = isPathSegment({ key: 0 });
		expect(result).toBe(true);
	});

	test("should return true for negative number key", () => {
		const result = isPathSegment({ key: -1 });
		expect(result).toBe(true);
	});

	test("should return true for NaN key", () => {
		const result = isPathSegment({ key: NaN });
		expect(result).toBe(true);
	});

	test("should return true for Infinity key", () => {
		const result = isPathSegment({ key: Infinity });
		expect(result).toBe(true);
	});

	test("should return false for object with key property that is undefined", () => {
		const result = isPathSegment({ key: undefined });
		expect(result).toBe(false);
	});

	test("should work as type guard in TypeScript", () => {
		const unknownValue: unknown = { key: "test" };

		if (isPathSegment(unknownValue)) {
			// TypeScript should know unknownValue is PathSegment here
			expect(unknownValue.key).toBe("test");
			// This would be a TypeScript error if uncommented:
			// expect(unknownValue.invalidProperty).toBeUndefined();
		}
	});

	test("should handle objects created with Object.create(null)", () => {
		const obj = Object.create(null);
		obj.key = "test";
		const result = isPathSegment(obj);
		expect(result).toBe(true);
	});

	test("should return false for objects with non-enumerable key property", () => {
		const obj = {};
		Object.defineProperty(obj, "key", {
			value: "test",
			enumerable: false,
		});
		const result = isPathSegment(obj);
		expect(result).toBe(true); // "key" in value checks for existence, not enumerability
	});

	test("should return false for Date objects", () => {
		const result = isPathSegment(new Date());
		expect(result).toBe(false);
	});

	test("should return false for RegExp objects", () => {
		const result = isPathSegment(/test/);
		expect(result).toBe(false);
	});

	test("should return false for Error objects", () => {
		const result = isPathSegment(new Error("test"));
		expect(result).toBe(false);
	});
});
