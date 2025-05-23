import { Schema } from "effect";

export const MoneySymbol: unique symbol = Symbol.for("Money");

export const _Money = Schema.BigDecimalFromSelf.pipe(
  Schema.annotations({ identifier: "Money" }),
  Schema.brand(MoneySymbol)
);

export interface MoneyFrom extends Schema.Schema.Encoded<typeof _Money> {}
export interface Money extends Schema.Schema.Type<typeof _Money> {}

export const Money = _Money;
