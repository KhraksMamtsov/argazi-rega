import { Schema } from "@effect/schema";

import { IdSubscriptionSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const GetSubscriptionByIdCommandPayloadSchema = Schema.Struct({
  idSubscription: IdSubscriptionSchema,
}).pipe(
  _SS.satisfies.from.json(),
  Schema.identifier("GetSubscriptionByIdCommandPayloadSchema")
);

export type GetSubscriptionByIdCommandPayloadFrom = Schema.Schema.Encoded<
  typeof GetSubscriptionByIdCommandPayloadSchema
>;

export const GetSubscriptionByIdCommandSchema = BaseCausedCommandFor(
  GetSubscriptionByIdCommandPayloadSchema
).pipe(Schema.identifier("GetSubscriptionByIdCommandSchema"));
