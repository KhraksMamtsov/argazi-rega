import { Schema } from "@effect/schema";

export const IdSubscriptionSymbol: unique symbol = Symbol.for(
  "IdSubscriptionSymbol"
);

export const IdSubscription = Schema.UUID.pipe(
  Schema.identifier("IdSubscription"),
  Schema.brand(IdSubscriptionSymbol)
);

export type IdSubscription = Schema.Schema.Type<typeof IdSubscription>;
