import { Schema } from "@effect/schema";

import { IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type CreateGeoPointCommandPayloadFrom = {
  readonly idUser: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly name: string | null;
};

export const CreateGeoPointCommandPayload = Schema.Struct({
  idUser: IdUser,
  latitude: Schema.Number,
  longitude: Schema.Number,
  name: Schema.OptionFromNullOr(Schema.Redacted(Schema.String)),
}).pipe(
  _SS.satisfies.encoded.json<CreateGeoPointCommandPayloadFrom>(),
  Schema.identifier("CreateGeoPointCommandPayload")
);

export const _CreateGeoPointCommand = BaseCausedCommandFor(
  CreateGeoPointCommandPayload
).pipe(Schema.identifier("CreateGeoPointCommand"));

export interface CreateGeoPointCommandFrom
  extends Schema.Schema.Encoded<typeof _CreateGeoPointCommand> {}
export interface CreateGeoPointCommand
  extends Schema.Schema.Type<typeof _CreateGeoPointCommand> {}

export const CreateGeoPointCommand: Schema.Schema<
  CreateGeoPointCommand,
  CreateGeoPointCommandFrom
> = _CreateGeoPointCommand;
