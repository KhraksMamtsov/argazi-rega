import { Schema } from "@effect/schema";

export const IdSubscriptionSymbol: unique symbol = Symbol.for(
	"IdSubscriptionSymbol"
);

export const IdSubscriptionSchema = Schema.UUID.pipe(
	Schema.identifier("IdSubscriptionSchema"),
	Schema.brand(IdSubscriptionSymbol)
);

export type IdSubscription = Schema.Schema.To<typeof IdSubscriptionSchema>;
