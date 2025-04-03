import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetPlaceActualEventsCommandPayload = Schema.Struct({
  idPlace: IdPlace,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetPlaceActualEventsCommandPayload" })
);

export const GetPlaceActualEventsCommand = BaseCausedCommandFor(
  GetPlaceActualEventsCommandPayload
).pipe(Schema.annotations({ identifier: "GetPlaceActualEventsCommand" }));
