import { Schema } from "effect";

import { IdPlace } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export type GetPlaceSubscriptionsCommandPayloadFrom = {
  readonly idPlace: string;
};

export const GetPlaceSubscriptionsCommandPayload = Schema.Struct({
  idPlace: IdPlace,
}).pipe(
  _SS.satisfies.encoded.json<GetPlaceSubscriptionsCommandPayloadFrom>(),
  Schema.annotations({ identifier: "GetPlaceSubscriptionsCommandPayload" })
);

export const GetPlaceSubscriptionsCommand = BaseCausedCommandFor(
  GetPlaceSubscriptionsCommandPayload
).pipe(Schema.annotations({ identifier: "GetPlaceSubscriptionsCommand" }));
