import { Schema } from "@effect/schema";

export const VisitorOnEventIdSymbol: unique symbol = Symbol.for(
  "VisitorOnEventIdSymbol",
);
export const VisitorOnEventIdSchema = Schema.UUID.pipe(
  Schema.brand(VisitorOnEventIdSymbol),
  Schema.identifier("VisitorOnEventIdSchema"),
);
