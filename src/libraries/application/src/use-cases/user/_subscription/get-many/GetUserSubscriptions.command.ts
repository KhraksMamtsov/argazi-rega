import { Schema } from "@effect/schema";

import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export const GetUserSubscriptionsCommandPayloadSchema = Schema.Struct({
  idUser: IdUserSchema,
}).pipe(
  _SS.satisfies.encoded.json(),
  Schema.identifier("GetUserSubscriptionsCommandPayloadSchema")
);

export type GetUserSubscriptionsCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetUserSubscriptionsCommandPayloadSchema
>;

export const GetUserSubscriptionsCommandSchema = BaseCausedCommandFor(
  GetUserSubscriptionsCommandPayloadSchema
).pipe(Schema.identifier("GetUserSubscriptionsCommandSchema"));
