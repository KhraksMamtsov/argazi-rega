import { Schema } from "@effect/schema";

export const UserOnEventIdSymbol: unique symbol = Symbol.for(
  "UserOnEventIdSymbol",
);
export const UserOnEventIdSchema = Schema.UUID.pipe(
  Schema.brand(UserOnEventIdSymbol),
  Schema.identifier("UserOnEventIdSchema"),
);
