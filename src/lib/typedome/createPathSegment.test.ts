import { describe, expect, expectTypeOf, test } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createPathSegment } from ".";

describe(createPathSegment, () => {
	describe("happy path", () => {
		test.each([
			{ description: "string", key: "user" },
			{ description: "number", key: 0 },
		])("should create path segment with $description key", ({ key }) => {
			expect(createPathSegment(key)).toEqual({ key });
			expectTypeOf(
				createPathSegment(key),
			).toEqualTypeOf<StandardSchemaV1.PathSegment>();
		});

		test("should create path segment with symbol key", () => {
			const key = Symbol.for("test");

			expect(createPathSegment(key)).toEqual({ key });
			expectTypeOf(
				createPathSegment(key),
			).toEqualTypeOf<StandardSchemaV1.PathSegment>();
		});
	});

	describe("error edge cases", () => {
		test.each([
			{ description: null, invalidKey: null },
			{ description: undefined, invalidKey: undefined },
			{ description: true, invalidKey: true },
			{ description: new Object(), invalidKey: {} },
			{ description: [], invalidKey: [] },
			{ description: "function", invalidKey: () => {} },
		])("throws TypeError for invalid key $description", ({ invalidKey }) => {
			// @ts-expect-error: intentional errorous type for testing
			expect(() => createPathSegment(invalidKey)).toThrow(TypeError);
		});
	});
});
