import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceGeoPointCommandPayload = Schema.Struct({
  idPlace: IdPlace,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetPlaceGeoPointCommandPayload" })
);

export const GetPlaceGeoPointCommand = BaseCausedCommandFor(
  GetPlaceGeoPointCommandPayload
).pipe(Schema.annotations({ identifier: "GetPlaceGeoPointCommand" }));
