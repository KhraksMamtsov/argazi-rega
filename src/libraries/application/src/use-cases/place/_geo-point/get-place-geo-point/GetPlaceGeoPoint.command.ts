import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceGeoPointCommandPayloadSchema = Schema.struct({
  idPlace: IdPlaceSchema,
}).pipe(
  _SS.satisfies.from.json(),
  Schema.identifier("GetPlaceGeoPointCommandPayloadSchema")
);

export const GetPlaceGeoPointCommandSchema = BaseCausedCommandFor(
  GetPlaceGeoPointCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceGeoPointCommandSchema"));
