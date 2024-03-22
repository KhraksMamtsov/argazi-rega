import { Schema } from "@effect/schema";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreatePlaceCommandPayloadFrom = {
  readonly idGeoPoint: string;
  readonly name: string;
};

export const CreatePlaceCommandPayloadSchema = Schema.struct({
  idGeoPoint: Schema.UUID,
  name: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.from.json<CreatePlaceCommandPayloadFrom>(),
  Schema.identifier("CreatePlaceCommandPayloadSchema")
);

export const _CreatePlaceCommandSchema = BaseCausedCommandFor(
  CreatePlaceCommandPayloadSchema
).pipe(Schema.identifier("CreatePlaceCommandSchema"));

export interface CreatePlaceCommandFrom
  extends Schema.Schema.Encoded<typeof _CreatePlaceCommandSchema> {}
export interface CreatePlaceCommand
  extends Schema.Schema.Type<typeof _CreatePlaceCommandSchema> {}

export const CreatePlaceCommandSchema: Schema.Schema<
  CreatePlaceCommand,
  CreatePlaceCommandFrom
> = _CreatePlaceCommandSchema;
