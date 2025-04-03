import { Schema } from "effect";

export const RefreshTokenSymbol: unique symbol =
  Symbol.for("RefreshTokenSymbol");

export class RefreshToken extends Schema.Redacted(
  Schema.String.pipe(
    Schema.annotations({ identifier: "RefreshToken" }),
    Schema.brand(RefreshTokenSymbol)
  )
) {
  static make = Schema.decodeSync(this);
}
