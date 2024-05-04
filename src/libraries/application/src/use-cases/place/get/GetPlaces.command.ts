import { Schema } from "@effect/schema";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetPlacesCommandPayload = Schema.Struct({}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("GetPlacesCommandPayload")
);

export const GetPlacesCommand = BaseCausedCommandFor(
  GetPlacesCommandPayload
).pipe(Schema.identifier("GetPlacesCommand"));
