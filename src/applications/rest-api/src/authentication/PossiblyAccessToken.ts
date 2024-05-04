import { Schema } from "@effect/schema";

export const PossiblyAccessTokenSymbol: unique symbol = Symbol.for(
  "PossiblyAccessTokenSymbol"
);
export const PossiblyAccessToken = Schema.String.pipe(
  Schema.identifier("PossiblyAccessToken"),
  Schema.brand(PossiblyAccessTokenSymbol)
);

export type PossiblyAccessToken = Schema.Schema.Type<
  typeof PossiblyAccessToken
>;
