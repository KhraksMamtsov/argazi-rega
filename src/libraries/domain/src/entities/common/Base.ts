import { Schema } from "effect";

import { Meta } from "./Meta.js";

// #region Base
export const _Base = Schema.Struct({
  meta: Meta,
}).pipe(Schema.typeSchema, Schema.annotations({ identifier: "Base" }));

export type BaseContext = Schema.Schema.Context<typeof _Base>;
export interface BaseEncoded extends Schema.Schema.Encoded<typeof _Base> {}
export interface Base extends Schema.Schema.Type<typeof _Base> {}

export const Base: Schema.Schema<Base, BaseEncoded> = _Base;
// #endregion BaseSchema
