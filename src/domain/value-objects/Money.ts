import { Schema } from "@effect/schema";

export const MoneySymbol: unique symbol = Symbol.for("Money");
export const MoneySchema = Schema.number.pipe(
  Schema.brand(MoneySymbol),
  Schema.identifier("Money"),
);

export type MoneyFrom = Schema.Schema.From<typeof MoneySchema>;
export type Money = Schema.Schema.To<typeof MoneySchema>;
