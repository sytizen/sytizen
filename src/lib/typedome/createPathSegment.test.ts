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
});
