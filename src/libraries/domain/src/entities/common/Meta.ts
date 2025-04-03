import { Schema } from "effect";

import { IdUser } from "../../user/entity/IdUser.js";
import { DateCreated } from "../../value-objects/DateCreated.js";
import { DateDeleted } from "../../value-objects/DateDeleted.js";
import { DateUpdated } from "../../value-objects/DateUpdated.js";

// #region Meta
const _Meta = Schema.Struct({
  dateCreated: DateCreated,
  dateDeleted: Schema.OptionFromSelf(DateDeleted),
  dateUpdated: DateUpdated,
  //
  idUserCreator: IdUser,
  idUserDeleter: Schema.OptionFromSelf(IdUser),
  idUserUpdater: IdUser,
}).pipe(Schema.typeSchema, Schema.annotations({ identifier: "Meta" }));

export type MetaContext = Schema.Schema.Context<typeof _Meta>;
export interface MetaEncoded extends Schema.Schema.Encoded<typeof _Meta> {}
export interface Meta extends Schema.Schema.Type<typeof _Meta> {}

export const Meta: Schema.Schema<Meta> = _Meta;
// #endregion MetaSchema
