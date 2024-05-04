import { Schema } from "@effect/schema";

import { IdPlace } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetPlaceByIdCommandPayloadFrom = {
  readonly id: string;
};

export const GetPlaceByIdCommandPayload = Schema.Struct({
  id: IdPlace,
}).pipe(
  _SS.satisfies.encoded.json<GetPlaceByIdCommandPayloadFrom>(),
  Schema.identifier("GetPlaceByIdCommandPayload")
);

export const GetPlaceByIdCommand = BaseCausedCommandFor(
  GetPlaceByIdCommandPayload
).pipe(Schema.identifier("GetPlaceByIdCommand"));
