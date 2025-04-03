import { Schema } from "effect";

export const DateCreatedSymbol: unique symbol = Symbol.for("DateCreated");
export const DateCreated = Schema.ValidDateFromSelf.pipe(
  Schema.annotations({ identifier: "DateCreated" }),
  Schema.brand(DateCreatedSymbol)
);

export type DateCreatedFrom = Schema.Schema.Encoded<typeof DateCreated>;
export type DateCreated = Schema.Schema.Type<typeof DateCreated>;
