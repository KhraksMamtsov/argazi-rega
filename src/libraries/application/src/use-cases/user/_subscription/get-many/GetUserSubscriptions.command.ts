import { Schema } from "@effect/schema";

import { IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserSubscriptionsCommandPayload = Schema.Struct({
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "GetUserSubscriptionsCommandPayload" })
);

export type GetUserSubscriptionsCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserSubscriptionsCommandPayload
>;

export const GetUserSubscriptionsCommand = BaseCausedCommandFor(
  GetUserSubscriptionsCommandPayload
).pipe(Schema.annotations({ identifier: "GetUserSubscriptionsCommand" }));
