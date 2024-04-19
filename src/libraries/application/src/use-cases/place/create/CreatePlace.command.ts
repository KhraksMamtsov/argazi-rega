import { Schema } from "@effect/schema";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreatePlaceCommandPayloadFrom = {
  readonly idGeoPoint: string;
  readonly name: string;
  readonly description: string;
};

export const CreatePlaceCommandPayloadSchema = Schema.Struct({
  idGeoPoint: Schema.UUID,
  name: Schema.compose(Schema.Trim, Schema.NonEmpty),
  description: Schema.compose(Schema.Trim, Schema.NonEmpty),
}).pipe(
  _SS.satisfies.encoded.json<CreatePlaceCommandPayloadFrom>(),
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
