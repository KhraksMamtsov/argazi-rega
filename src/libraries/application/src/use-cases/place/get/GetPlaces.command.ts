import { Schema } from "@effect/schema";

import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetPlacesCommandPayloadSchema = Schema.Struct({}).pipe(
  _SS.satisfies.from.json(),
  Schema.identifier("GetPlacesCommandPayloadSchema")
);

export const GetPlacesCommandSchema = BaseCausedCommandFor(
  GetPlacesCommandPayloadSchema
).pipe(Schema.identifier("GetPlacesCommandSchema"));
