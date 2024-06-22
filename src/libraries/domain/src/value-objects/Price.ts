import { Schema } from "@effect/schema";

import { Money } from "./Money.js";

export const PriceSymbol: unique symbol = Symbol.for("Price");
export const Price = Money.pipe(
  Schema.nonNegativeBigDecimal(),
  Schema.annotations({ identifier: "Price" }),
  Schema.brand(PriceSymbol)
);

export type PriceFrom = Schema.Schema.Encoded<typeof Price>;
export type Price = Schema.Schema.Type<typeof Price>;
