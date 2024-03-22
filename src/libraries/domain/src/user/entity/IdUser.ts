import { Schema } from "@effect/schema";

export const IdUserSymbol: unique symbol = Symbol.for("IdUserSymbol");
export const IdUserSchema = Schema.UUID.pipe(
  Schema.identifier("IdUserSchema"),
  Schema.brand(IdUserSymbol)
);

export type IdUser = Schema.Schema.Type<typeof IdUserSchema>;
