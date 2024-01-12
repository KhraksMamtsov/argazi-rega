import { Schema } from "@effect/schema";
import { DateCreatedSchema } from "../../value-objects/DateCreated.js";
import { DateUpdatedSchema } from "../../value-objects/DateUpdated.js";
import { UserIdSchema } from "../user/UserId.js";

const _MetaSchema = Schema.struct({
  dateCreated: DateCreatedSchema,
  idUserCreator: UserIdSchema,
  dateUpdated: DateUpdatedSchema,
  idUserUpdater: UserIdSchema,
}).pipe(Schema.identifier("MetaSchema"));

export type MetaFrom = Schema.Schema.From<typeof _MetaSchema>;
export type Meta = Schema.Schema.To<typeof _MetaSchema>;

export const MetaSchema: Schema.Schema<MetaFrom, Meta> = _MetaSchema;
