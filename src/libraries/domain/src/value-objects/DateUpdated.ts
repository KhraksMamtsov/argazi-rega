import { Schema } from "@effect/schema";

export const DateUpdatedSymbol: unique symbol = Symbol.for("DateUpdated");
export const DateUpdatedSchema = Schema.ValidDateFromSelf.pipe(
  Schema.identifier("DateUpdated"),
  Schema.brand(DateUpdatedSymbol)
);

export type DateUpdatedFrom = Schema.Schema.Encoded<typeof DateUpdatedSchema>;
export type DateUpdated = Schema.Schema.Type<typeof DateUpdatedSchema>;
