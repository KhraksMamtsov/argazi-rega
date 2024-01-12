import { Schema } from "@effect/schema";

export const EventIdSymbol: unique symbol = Symbol.for("EventId");

export const EventIdSchema = Schema.UUID.pipe(
  Schema.brand(EventIdSymbol),
  Schema.identifier("EventIdSchema"),
);

export type EventId = Schema.Schema.To<typeof EventIdSchema>;
