import { Schema } from "@effect/schema";

import { IdPlace, IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateSubscriptionCommandPayload = Schema.Struct({
  idPlace: IdPlace,
  idUser: IdUser,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.annotations({ identifier: "CreateSubscriptionCommandPayload" })
);

export const CreateSubscriptionCommand = BaseCausedCommandFor(
  CreateSubscriptionCommandPayload
).pipe(Schema.annotations({ identifier: "CreateSubscriptionCommand" }));
