import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../user/entity/IdUser.js";
import { DateCreatedSchema } from "../../value-objects/DateCreated.js";
import { DateDeletedSchema } from "../../value-objects/DateDeleted.js";
import { DateUpdatedSchema } from "../../value-objects/DateUpdated.js";

// #region Meta
const _MetaSchema = Schema.Struct({
  dateCreated: DateCreatedSchema,
  dateDeleted: Schema.OptionFromSelf(DateDeletedSchema),
  dateUpdated: DateUpdatedSchema,
  //
  idUserCreator: IdUserSchema,
  idUserDeleter: Schema.OptionFromSelf(IdUserSchema),
  idUserUpdater: IdUserSchema,
}).pipe(Schema.typeSchema, Schema.identifier("MetaSchema"));

export type MetaContext = Schema.Schema.Context<typeof _MetaSchema>;
export interface MetaEncoded
  extends Schema.Schema.Encoded<typeof _MetaSchema> {}
export interface Meta extends Schema.Schema.Type<typeof _MetaSchema> {}

export const MetaSchema: Schema.Schema<Meta> = _MetaSchema;
// #endregion MetaSchema
