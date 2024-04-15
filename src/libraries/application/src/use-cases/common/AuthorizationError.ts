import { Schema } from "@effect/schema";

import { IdUserSchema } from "@argazi/domain";
import { _S } from "@argazi/shared";

export const EntityType = Schema.Literal(
  "User",
  "Subscription",
  "Ticket",
  "Visitor"
);

export class ValidationError extends Schema.TaggedError<ValidationError>()(
  "ValidationError",
  {
    entity: Schema.Array(EntityType),
    idInitiator: IdUserSchema,
    payload: _S.Json.JsonRecord,
  }
) {}

export class CreateEntityAuthorizationError extends Schema.TaggedError<CreateEntityAuthorizationError>()(
  "CreateEntityAuthorizationError",
  {
    entity: EntityType,
    idInitiator: IdUserSchema,
    payload: _S.Json.JsonRecord,
  }
) {}

export class GetEntityAuthorizationError extends Schema.TaggedError<GetEntityAuthorizationError>()(
  "GetEntityAuthorizationError",
  {
    entity: Schema.Array(EntityType),
    idInitiator: IdUserSchema,
    payload: _S.Json.JsonRecord,
  }
) {}

export class UpdateEntityAuthorizationError extends Schema.TaggedError<UpdateEntityAuthorizationError>()(
  "UpdateEntityAuthorizationError",
  {
    entity: Schema.Array(EntityType),
    idEntity: Schema.UUID,
    idInitiator: IdUserSchema,
    payload: _S.Json.JsonRecord,
  }
) {}

export class DeleteEntityAuthorizationError extends Schema.TaggedError<DeleteEntityAuthorizationError>()(
  "DeleteEntityAuthorizationError",
  {
    entity: EntityType,
    idEntity: Schema.UUID,
    idInitiator: IdUserSchema,
    payload: _S.Json.JsonRecord,
  }
) {}
