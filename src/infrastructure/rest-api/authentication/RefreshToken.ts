import { Schema } from "@effect/schema";

export const RefreshTokenSymbol: unique symbol =
	Symbol.for("RefreshTokenSymbol");

export const RefreshTokenSchema = Schema.Secret.pipe(
	Schema.identifier("RefreshTokenSchema"),
	Schema.brand(RefreshTokenSymbol)
);

export type RefreshToken = Schema.Schema.Type<typeof RefreshTokenSchema>;
