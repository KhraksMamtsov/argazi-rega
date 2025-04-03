import { Schema } from "effect";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreatePlaceCommandPayloadFrom = {
  readonly idGeoPoint: string;
  readonly name: string;
  readonly description: string;
};

export const CreatePlaceCommandPayload = Schema.Struct({
  idGeoPoint: Schema.UUID,
  name: Schema.compose(Schema.Trim, Schema.NonEmptyString),
  description: Schema.compose(Schema.Trim, Schema.NonEmptyString),
}).pipe(
  _SS.satisfies.encoded.json<CreatePlaceCommandPayloadFrom>(),
  Schema.annotations({ identifier: "CreatePlaceCommandPayload" })
);

export const _CreatePlaceCommand = BaseCausedCommandFor(
  CreatePlaceCommandPayload
).pipe(Schema.annotations({ identifier: "CreatePlaceCommand" }));

export interface CreatePlaceCommandFrom
  extends Schema.Schema.Encoded<typeof _CreatePlaceCommand> {}
export interface CreatePlaceCommand
  extends Schema.Schema.Type<typeof _CreatePlaceCommand> {}

export const CreatePlaceCommand: Schema.Schema<
  CreatePlaceCommand,
  CreatePlaceCommandFrom
> = _CreatePlaceCommand;
