import { Schema } from "@effect/schema";

import { MoneySchema } from "./Money.js";

export const PriceSymbol: unique symbol = Symbol.for("Price");
export const PriceSchema = MoneySchema.pipe(
	Schema.nonNegativeBigDecimal(),
	Schema.identifier("Price"),
	Schema.brand(PriceSymbol)
);

export type PriceFrom = Schema.Schema.From<typeof PriceSchema>;
export type Price = Schema.Schema.To<typeof PriceSchema>;
