import { Schema } from "effect";

export type _BugNumber = typeof _BugNumber;
export const _BugNumber: unique symbol = Symbol.for("game/BugNumber");

export const One = Schema.Literal(1).pipe(Schema.brand(_BugNumber));
export const Two = Schema.Literal(2).pipe(Schema.brand(_BugNumber));
export const OneTwo = Schema.Union(One, Two).annotations({
  identifier: "OneTwo",
});
export const Three = Schema.Literal(3).pipe(Schema.brand(_BugNumber));
export const BugNumber = Schema.Union(One, Two, Three).annotations({
  identifier: "BugName",
});

export type One = typeof One.Type;
export type Two = typeof Two.Type;
export type Three = typeof Three.Type;
export type BugNumber = typeof BugNumber.Type;

// export const _One = [One.make(1)] as const;
// export const _OneTwo = [..._One, Two.make(2)] as const;
// export const _OneTwoThree = [..._OneTwo, Three.make(3)] as const;
