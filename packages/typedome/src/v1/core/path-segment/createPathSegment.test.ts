import { describe, expect, test } from "bun:test";
import { createPathSegment } from "./index.ts";

describe("createPathSegment", () => {
	test("should create path segment with string value", () => {
		const result = createPathSegment("test");
		expect(result).toEqual({ key: "test" });
	});

	test("should create path segment with number value", () => {
		const result = createPathSegment(42);
		expect(result).toEqual({ key: 42 });
	});

	test("should create path segment with symbol value", () => {
		const symbol = Symbol("test");
		const result = createPathSegment(symbol);
		expect(result).toEqual({ key: symbol });
	});

	test("should throw TypeError for object value", () => {
		expect(() => createPathSegment({})).toThrow(TypeError);
		expect(() => createPathSegment({})).toThrow(
			"expected number, string, symbol, received object",
		);
	});

	test("should throw TypeError for boolean value", () => {
		expect(() => createPathSegment(true)).toThrow(TypeError);
		expect(() => createPathSegment(true)).toThrow(
			"expected number, string, symbol, received boolean",
		);
	});

	test("should throw TypeError for null value", () => {
		expect(() => createPathSegment(null)).toThrow(TypeError);
		expect(() => createPathSegment(null)).toThrow(
			"expected number, string, symbol, received object",
		);
	});

	test("should throw TypeError for undefined value", () => {
		expect(() => createPathSegment(undefined)).toThrow(TypeError);
		expect(() => createPathSegment(undefined)).toThrow(
			"expected number, string, symbol, received undefined",
		);
	});

	test("should throw TypeError for function value", () => {
		expect(() => createPathSegment(() => {})).toThrow(TypeError);
		expect(() => createPathSegment(() => {})).toThrow(
			"expected number, string, symbol, received function",
		);
	});

	test("should include the invalid value as cause in error", () => {
		const invalidValue = { invalid: true };
		try {
			createPathSegment(invalidValue);
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
			expect((error as TypeError).cause).toBe(invalidValue);
		}
	});

	test("should handle empty string", () => {
		const result = createPathSegment("");
		expect(result).toEqual({ key: "" });
	});

	test("should handle zero", () => {
		const result = createPathSegment(0);
		expect(result).toEqual({ key: 0 });
	});

	test("should handle negative numbers", () => {
		const result = createPathSegment(-1);
		expect(result).toEqual({ key: -1 });
	});
});
