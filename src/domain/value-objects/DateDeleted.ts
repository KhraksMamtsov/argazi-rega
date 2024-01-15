import { Schema } from "@effect/schema";

export const DateDeletedSymbol: unique symbol = Symbol.for("DateDeleted");
export const DateDeletedSchema = Schema.ValidDateFromSelf.pipe(
	Schema.identifier("DateDeleted"),
	Schema.brand(DateDeletedSymbol)
);

export type DateDeletedFrom = Schema.Schema.From<typeof DateDeletedSchema>;
export type DateDeleted = Schema.Schema.To<typeof DateDeletedSchema>;
