import { Schema } from "@effect/schema";

import { IdSubscription, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const DeleteUserSubscriptionCommandPayload = Schema.Struct({
  idSubscription: IdSubscription,
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "DeleteUserSubscriptionCommandPayload" })
);

export type DeleteUserSubscriptionCommandPayloadFrom = Schema.Schema.Encoded<
  typeof DeleteUserSubscriptionCommandPayload
>;

export const DeleteUserSubscriptionCommand = BaseCausedCommandFor(
  DeleteUserSubscriptionCommandPayload
).pipe(Schema.annotations({ identifier: "DeleteUserSubscriptionCommand" }));
