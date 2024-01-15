import { Schema } from "@effect/schema";

import { MetaSchema } from "./Meta.js";

const _BaseSchema = Schema.struct({
	meta: MetaSchema,
}).pipe(Schema.to, Schema.identifier("BaseSchema"));

export type Base = Schema.Schema.To<typeof _BaseSchema>;

export const BaseSchema: Schema.Schema<Base> = _BaseSchema;
