import { Schema } from "@effect/schema";

export const IdUserSymbol: unique symbol = Symbol.for("IdUserSymbol");
export const IdUser = Schema.UUID.pipe(
  Schema.identifier("IdUser"),
  Schema.brand(IdUserSymbol)
);

export type IdUser = Schema.Schema.Type<typeof IdUser>;
