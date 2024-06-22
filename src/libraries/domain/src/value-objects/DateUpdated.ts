import { Schema } from "@effect/schema";

export const DateUpdatedSymbol: unique symbol = Symbol.for("DateUpdated");
export const DateUpdated = Schema.ValidDateFromSelf.pipe(
  Schema.annotations({ identifier: "DateUpdated" }),
  Schema.brand(DateUpdatedSymbol)
);

export type DateUpdatedFrom = Schema.Schema.Encoded<typeof DateUpdated>;
export type DateUpdated = Schema.Schema.Type<typeof DateUpdated>;
