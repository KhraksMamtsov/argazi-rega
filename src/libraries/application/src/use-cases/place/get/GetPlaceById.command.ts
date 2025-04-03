import { Schema } from "effect";

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
  Schema.annotations({ identifier: "GetPlaceByIdCommandPayload" })
);

export const GetPlaceByIdCommand = BaseCausedCommandFor(
  GetPlaceByIdCommandPayload
).pipe(Schema.annotations({ identifier: "GetPlaceByIdCommand" }));
