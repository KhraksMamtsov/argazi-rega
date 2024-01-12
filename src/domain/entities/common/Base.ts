import { Schema } from "@effect/schema";
import { MetaSchema } from "./Meta.js";

const _BaseSchema = Schema.struct({
  meta: MetaSchema,
}).pipe(Schema.identifier("BaseSchema"));

export type BaseFrom = Schema.Schema.From<typeof _BaseSchema>;
export type Base = Schema.Schema.To<typeof _BaseSchema>;

export const BaseSchema: Schema.Schema<BaseFrom, Base> = _BaseSchema;
