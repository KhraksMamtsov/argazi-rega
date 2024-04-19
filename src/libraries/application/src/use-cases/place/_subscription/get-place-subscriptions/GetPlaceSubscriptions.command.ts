import { Schema } from "@effect/schema";

import { IdPlaceSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../../common/Base.command.js";

export type GetPlaceSubscriptionsCommandPayloadFrom = {
  readonly idPlace: string;
};

export const GetPlaceSubscriptionsCommandPayloadSchema = Schema.Struct({
  idPlace: IdPlaceSchema,
}).pipe(
  _SS.satisfies.encoded.json<GetPlaceSubscriptionsCommandPayloadFrom>(),
  Schema.identifier("GetPlaceSubscriptionsCommandPayloadSchema")
);

export const GetPlaceSubscriptionsCommandSchema = BaseCausedCommandFor(
  GetPlaceSubscriptionsCommandPayloadSchema
).pipe(Schema.identifier("GetPlaceSubscriptionsCommandSchema"));
