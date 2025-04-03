import { Schema } from "effect";

import { IdEvent } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export type GetEventByIdCommandPayloadFrom = {
  readonly id: string;
};

export const GetEventByIdCommandPayload = Schema.Struct({
  id: IdEvent,
}).pipe(
  _SS.satisfies.encoded.json<GetEventByIdCommandPayloadFrom>(),
  Schema.annotations({ identifier: "GetEventByIdCommandPayload" })
);

export const GetEventByIdCommand = BaseCausedCommandFor(
  GetEventByIdCommandPayload
).pipe(Schema.annotations({ identifier: "GetEventByIdCommand" }));
