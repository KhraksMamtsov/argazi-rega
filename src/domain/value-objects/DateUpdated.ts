import { Schema } from "@effect/schema";

export const DateUpdatedSymbol: unique symbol = Symbol.for("DateUpdated");
export const DateUpdatedSchema = Schema.DateFromSelf.pipe(
  Schema.brand(DateUpdatedSymbol),
  Schema.identifier("DateUpdated"),
);

export type DateUpdatedFrom = Schema.Schema.From<typeof DateUpdatedSchema>;
export type DateUpdated = Schema.Schema.To<typeof DateUpdatedSchema>;
