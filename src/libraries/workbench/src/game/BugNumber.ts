import { Brand, Array } from "effect";

export type _BugNumber = typeof _BugNumber;
export const _BugNumber: unique symbol = Symbol.for("game/BugNumber");

export type One = Brand.Branded<1, _BugNumber>;
export type Two = Brand.Branded<2, _BugNumber>;
export type Three = Brand.Branded<3, _BugNumber>;
export type BugNumber = One | Two | Three;

export const One = Brand.nominal<One>();
export const Two = Brand.nominal<Two>();
export const Three = Brand.nominal<Three>();

export const _One = [One(1)] as const;
export const _OneTwo = [..._One, Two(2)] as const;
export const _OneTwoThree = [..._OneTwo, Three(3)] as const;
