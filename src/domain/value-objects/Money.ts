import { Schema } from "@effect/schema";

export const MoneySymbol: unique symbol = Symbol.for("Money");

export const _MoneySchema = Schema.BigDecimalFromSelf.pipe(
	Schema.identifier("Money"),
	Schema.brand(MoneySymbol)
);

export interface MoneyFrom extends Schema.Schema.From<typeof _MoneySchema> {}
export interface Money extends Schema.Schema.To<typeof _MoneySchema> {}

export const MoneySchema: Schema.BrandSchema<Money, MoneyFrom, never> =
	_MoneySchema;
