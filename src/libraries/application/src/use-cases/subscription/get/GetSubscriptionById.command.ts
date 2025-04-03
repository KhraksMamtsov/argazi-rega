import { Schema } from "effect";

import { IdSubscription } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetSubscriptionByIdCommandPayload = Schema.Struct({
  idSubscription: IdSubscription,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetSubscriptionByIdCommandPayload" })
);

export type GetSubscriptionByIdCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetSubscriptionByIdCommandPayload
>;

export const GetSubscriptionByIdCommand = BaseCausedCommandFor(
  GetSubscriptionByIdCommandPayload
).pipe(Schema.annotations({ identifier: "GetSubscriptionByIdCommand" }));
