import { Schema } from "@effect/schema";

import type { Branded } from "effect/Brand";

export const Entity = <R, I extends string, A extends Branded<string, symbol>>(
  idSchema: Schema.Schema<A, I, R>
) =>
  Schema.Struct({
    id: idSchema,
  }).pipe(Schema.typeSchema, Schema.annotations({ identifier: "Entity" }));

export type Entity = Schema.Schema.Type<ReturnType<typeof Entity>>;
