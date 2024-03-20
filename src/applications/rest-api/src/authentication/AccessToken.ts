import { Schema } from "@effect/schema";

export const AccessTokenSymbol: unique symbol = Symbol.for("AccessTokenSymbol");
export const AccessTokenSchema = Schema.Secret.pipe(
	Schema.identifier("AccessTokenSchema"),
	Schema.brand(AccessTokenSymbol)
);

export type AccessToken = Schema.Schema.Type<typeof AccessTokenSchema>;
