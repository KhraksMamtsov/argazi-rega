import { Schema } from "@effect/schema";

export const RefreshTokenSymbol: unique symbol =
  Symbol.for("RefreshTokenSymbol");

export const RefreshToken = Schema.Secret.pipe(
  Schema.identifier("RefreshToken"),
  Schema.brand(RefreshTokenSymbol)
);

export type RefreshToken = Schema.Schema.Type<typeof RefreshToken>;
