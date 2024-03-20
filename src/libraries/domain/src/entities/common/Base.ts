import { Schema } from "@effect/schema";

import { MetaSchema } from "./Meta.js";

// #region Base
export const _BaseSchema = Schema.struct({
	meta: MetaSchema,
}).pipe(Schema.typeSchema, Schema.identifier("BaseSchema"));

export type BaseContext = Schema.Schema.Context<typeof _BaseSchema>;
export interface BaseEncoded
	extends Schema.Schema.Encoded<typeof _BaseSchema> {}
export interface Base extends Schema.Schema.Type<typeof _BaseSchema> {}

export const BaseSchema: Schema.Schema<Base, BaseEncoded> = _BaseSchema;
// #endregion BaseSchema
