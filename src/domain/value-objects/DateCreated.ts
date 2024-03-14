import { Schema } from "@effect/schema";

export const DateCreatedSymbol: unique symbol = Symbol.for("DateCreated");
export const DateCreatedSchema = Schema.ValidDateFromSelf.pipe(
	Schema.identifier("DateCreated"),
	Schema.brand(DateCreatedSymbol)
);

export type DateCreatedFrom = Schema.Schema.Encoded<typeof DateCreatedSchema>;
export type DateCreated = Schema.Schema.Type<typeof DateCreatedSchema>;
