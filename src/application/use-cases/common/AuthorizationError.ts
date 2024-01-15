import { Schema } from "@effect/schema";

import { IdUserSchema } from "../../../domain/user/entity/IdUser.js";
import { Json } from "../../../libs/Schema.js";

export const EntityType = Schema.literal("User", "Subscription", "Ticket");

export class ValidationError extends Schema.TaggedError<ValidationError>()(
	"ValidationError",
	{
		entity: Schema.array(EntityType),
		idInitiator: IdUserSchema,
		payload: Json.JsonRecord,
	}
) {}

export class CreateEntityAuthorizationError extends Schema.TaggedError<CreateEntityAuthorizationError>()(
	"CreateEntityAuthorizationError",
	{
		entity: Schema.array(EntityType),
		idInitiator: IdUserSchema,
		payload: Json.JsonRecord,
	}
) {}

export class GetEntityAuthorizationError extends Schema.TaggedError<CreateEntityAuthorizationError>()(
	"GetEntityAuthorizationError",
	{
		entity: Schema.array(EntityType),
		idInitiator: IdUserSchema,
		payload: Json.JsonRecord,
	}
) {}

export class UpdateEntityAuthorizationError extends Schema.TaggedError<UpdateEntityAuthorizationError>()(
	"UpdateEntityAuthorizationError",
	{
		entity: Schema.array(EntityType),
		idEntity: Schema.UUID,
		idInitiator: IdUserSchema,
		payload: Json.JsonRecord,
	}
) {}

export class DeleteEntityAuthorizationError extends Schema.TaggedError<DeleteEntityAuthorizationError>()(
	"DeleteEntityAuthorizationError",
	{
		entity: Schema.array(EntityType),
		idEntity: Schema.UUID,
		idInitiator: IdUserSchema,
		payload: Json.JsonRecord,
	}
) {}
