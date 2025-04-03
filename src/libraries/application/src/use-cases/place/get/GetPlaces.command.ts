import { Schema } from "effect";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetPlacesCommandPayload = Schema.Struct({}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetPlacesCommandPayload" })
);

export const GetPlacesCommand = BaseCausedCommandFor(
  GetPlacesCommandPayload
).pipe(Schema.annotations({ identifier: "GetPlacesCommand" }));
