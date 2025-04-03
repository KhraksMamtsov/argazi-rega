import { Schema } from "effect";

export const AccessTokenSymbol: unique symbol = Symbol.for("AccessTokenSymbol");
export class AccessToken extends Schema.Redacted(
  Schema.String.pipe(
    Schema.annotations({ identifier: "AccessToken" }),
    Schema.brand(AccessTokenSymbol)
  )
) {
  static make = Schema.decodeSync(this);
}
