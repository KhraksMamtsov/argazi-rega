import { Schema } from "@effect/schema";

import { MetaSchema } from "./Meta.js";

const _BaseSchema = Schema.struct({
	meta: MetaSchema,
}).pipe(Schema.typeSchema, Schema.identifier("BaseSchema"));

export type Base = Schema.Schema.Type<typeof _BaseSchema>;

export const BaseSchema: Schema.Schema<Base> = _BaseSchema;
