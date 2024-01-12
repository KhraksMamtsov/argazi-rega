import { Schema } from "@effect/schema";

export const UserIdSymbol: unique symbol = Symbol.for("UserIdSymbol");
export const UserIdSchema = Schema.UUID.pipe(
  Schema.brand(UserIdSymbol),
  Schema.identifier("UserIdSchema"),
);

export type UserId = Schema.Schema.To<typeof UserIdSchema>;
