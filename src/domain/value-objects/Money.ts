import { Schema } from "@effect/schema";

export const MoneySymbol: unique symbol = Symbol.for("Money");

export const MoneySchema = Schema.BigDecimalFromSelf.pipe(
	Schema.identifier("Money"),
	Schema.brand(MoneySymbol)
);

export type MoneyFrom = Schema.Schema.From<typeof MoneySchema>;
export type Money = Schema.Schema.To<typeof MoneySchema>;
