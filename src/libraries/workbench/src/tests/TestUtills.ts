import type { Predicate } from "effect";

import { test, describe, expect, assert } from "@effect/vitest";

export function trimNewline(args: TemplateStringsArray) {
  return args.join("").replace(/^[\r\n]+|[\r\n]+$/g, "");
}

export function assertRefinement<A, B extends A>(
  refinement: Predicate.Refinement<A, B>,
  value: A,
  message?: string
): asserts value is B {
  assert(refinement(value), message);
}
