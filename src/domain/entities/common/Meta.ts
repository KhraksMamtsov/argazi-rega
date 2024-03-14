import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../user/entity/IdUser.js";
import { DateCreatedSchema } from "../../value-objects/DateCreated.js";
import { DateDeletedSchema } from "../../value-objects/DateDeleted.js";
import { DateUpdatedSchema } from "../../value-objects/DateUpdated.js";

const _MetaSchema = Schema.struct({
	dateCreated: DateCreatedSchema,
	dateDeleted: Schema.optionFromSelf(DateDeletedSchema),
	dateUpdated: DateUpdatedSchema,
	//
	idUserCreator: IdUserSchema,
	idUserDeleter: Schema.optionFromSelf(IdUserSchema),
	idUserUpdater: IdUserSchema,
}).pipe(Schema.typeSchema, Schema.identifier("MetaSchema"));

export type Meta = Schema.Schema.Type<typeof _MetaSchema>;

export const MetaSchema: Schema.Schema<Meta> = _MetaSchema;
