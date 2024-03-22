import { Schema } from "@effect/schema";

export const VisaIdSymbol: unique symbol = Symbol.for("VisaIdSymbol");
export const VisaIdSchema = Schema.UUID.pipe(
  Schema.brand(VisaIdSymbol),
  Schema.identifier("VisaIdSchema")
);
