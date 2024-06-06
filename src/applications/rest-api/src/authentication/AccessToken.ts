import { Schema } from "@effect/schema";

export const AccessTokenSymbol: unique symbol = Symbol.for("AccessTokenSymbol");
export const AccessToken = Schema.Redacted(Schema.String).pipe(
  Schema.identifier("AccessToken"),
  Schema.brand(AccessTokenSymbol)
);

export type AccessToken = Schema.Schema.Type<typeof AccessToken>;
