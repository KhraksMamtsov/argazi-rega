import { Schema } from "@effect/schema";

import { IdPlaceSchema, IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseCausedCommandFor } from "../../common/Base.command.js";

export const CreateSubscriptionCommandPayloadSchema = Schema.Struct({
  idPlace: IdPlaceSchema,
  idUser: IdUserSchema,
}).pipe(
  _SS.satisfies.from.json(),
  Schema.identifier("CreateSubscriptionCommandPayloadSchema")
);

export const CreateSubscriptionCommandSchema = BaseCausedCommandFor(
  CreateSubscriptionCommandPayloadSchema
).pipe(Schema.identifier("CreateSubscriptionCommandSchema"));
