import { Schema } from "effect";

export const IdSubscriptionSymbol: unique symbol = Symbol.for(
  "IdSubscriptionSymbol"
);

export const IdSubscription = Schema.UUID.pipe(
  Schema.annotations({ identifier: "IdSubscription" }),
  Schema.brand(IdSubscriptionSymbol)
);

export type IdSubscription = Schema.Schema.Type<typeof IdSubscription>;
