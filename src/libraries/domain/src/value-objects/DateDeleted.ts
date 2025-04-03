import { Schema } from "effect";

export const DateDeletedSymbol: unique symbol = Symbol.for("DateDeleted");
export const DateDeleted = Schema.ValidDateFromSelf.pipe(
  Schema.annotations({ identifier: "DateDeleted" }),
  Schema.brand(DateDeletedSymbol)
);

export type DateDeletedFrom = Schema.Schema.Encoded<typeof DateDeleted>;
export type DateDeleted = Schema.Schema.Type<typeof DateDeleted>;
