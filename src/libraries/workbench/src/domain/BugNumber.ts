import { Schema } from "effect";

export type _BugNumber = typeof _BugNumber;
export const _BugNumber: unique symbol = Symbol.for("game/BugNumber");

export const OneSchema = Schema.Literal(1).pipe(Schema.brand(_BugNumber));
export const TwoSchema = Schema.Literal(2).pipe(Schema.brand(_BugNumber));
export const ThreeSchema = Schema.Literal(3).pipe(Schema.brand(_BugNumber));
export const BugNumberSchema = Schema.Union(OneSchema, TwoSchema, ThreeSchema);

export type One = typeof OneSchema.Type;
export type Two = typeof TwoSchema.Type;
export type Three = typeof ThreeSchema.Type;
export type BugNumber = typeof BugNumberSchema.Type;

export const One = OneSchema.make;
export const Two = TwoSchema.make;
export const Three = ThreeSchema.make;

export const _One = [One(1)] as const;
export const _OneTwo = [..._One, Two(2)] as const;
export const _OneTwoThree = [..._OneTwo, Three(3)] as const;
