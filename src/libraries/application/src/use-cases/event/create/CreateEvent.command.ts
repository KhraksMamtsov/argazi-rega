import { Schema } from "effect";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

const _CreateEventCommandPayload = Schema.Struct({
  dateAnnouncement: Schema.compose(
    Schema.DateFromString,
    Schema.ValidDateFromSelf
  ),
  dateDeadline: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateFinish: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  dateStart: Schema.compose(Schema.DateFromString, Schema.ValidDateFromSelf),
  idPlace: Schema.UUID,
  name: Schema.compose(Schema.Trim, Schema.NonEmptyString),
  priceDay: Schema.JsonNumber,
  priceEvent: Schema.JsonNumber,
  description: Schema.String,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "CreateEventCommandPayload" })
);

export interface CreateEventCommandPayloadEncoded
  extends Schema.Schema.Encoded<typeof _CreateEventCommandPayload> {}
export interface CreateEventCommandPayload
  extends Schema.Schema.Type<typeof _CreateEventCommandPayload> {}

export const CreateEventCommandPayload: Schema.Schema<
  CreateEventCommandPayload,
  CreateEventCommandPayloadEncoded
> = _CreateEventCommandPayload;

export const _CreateEventCommand = BaseCausedCommandFor(
  CreateEventCommandPayload
).pipe(Schema.annotations({ identifier: "CreateEventCommand" }));

export interface CreateEventCommandFrom
  extends Schema.Schema.Encoded<typeof _CreateEventCommand> {}
export interface CreateEventCommand
  extends Schema.Schema.Type<typeof _CreateEventCommand> {}

export const CreateEventCommand: Schema.Schema<
  CreateEventCommand,
  CreateEventCommandFrom
> = _CreateEventCommand;
