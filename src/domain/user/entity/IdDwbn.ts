import { Schema } from "@effect/schema";

export const IdDwbnSymbol: unique symbol = Symbol.for("IdDwbnSymbol");
export const IdDwbnSchema = Schema.string.pipe(
	Schema.identifier("IdDwbnSchema"),
	Schema.brand(IdDwbnSymbol)
);

export type IdDwbn = Schema.Schema.To<typeof IdDwbnSchema>;
