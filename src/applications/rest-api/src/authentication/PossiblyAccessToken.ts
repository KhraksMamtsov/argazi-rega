import { Schema } from "@effect/schema";

export const PossiblyAccessTokenSymbol: unique symbol = Symbol.for(
  "PossiblyAccessTokenSymbol"
);
export const PossiblyAccessTokenSchema = Schema.String.pipe(
  Schema.identifier("PossiblyAccessTokenSchema"),
  Schema.brand(PossiblyAccessTokenSymbol)
);

export type PossiblyAccessToken = Schema.Schema.Type<
  typeof PossiblyAccessTokenSchema
>;
