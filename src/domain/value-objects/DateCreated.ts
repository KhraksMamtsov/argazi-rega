import { Schema } from "@effect/schema";

export const DateCreatedSymbol: unique symbol = Symbol.for("DateCreated");
export const DateCreatedSchema = Schema.DateFromSelf.pipe(
  Schema.brand(DateCreatedSymbol),
  Schema.identifier("DateCreated"),
);

export type DateCreatedFrom = Schema.Schema.From<typeof DateCreatedSchema>;
export type DateCreated = Schema.Schema.To<typeof DateCreatedSchema>;
