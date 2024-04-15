import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceActualEventsCommandPayloadSchema = Schema.Struct({
  idPlace: IdPlaceSchema,
}).pipe(
  _SS.satisfies.from.json(),
  Schema.identifier("GetPlaceActualEventsCommandPayloadSchema")
);

export const GetPlaceActualEventsCommandSchema = BaseCausedCommandFor(
  GetPlaceActualEventsCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceActualEventsCommandSchema"));
