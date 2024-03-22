import { Schema } from "@effect/schema";
import { type Subscription as _Subscription } from "@prisma/client";
import { Effect } from "effect";

import { IdPlaceSchema } from "@argazi/domain";
import { IdSubscriptionSchema } from "@argazi/domain";
import { SubscriptionSchema } from "@argazi/domain";
import { IdUserSchema } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDbSchema, transform } from "../Base.db.js";

// #region SubscriptionDb
export const _SubscriptionDbSchema = Schema.struct({
  id: IdSubscriptionSchema,
  idPlace: IdPlaceSchema,
  idUser: IdUserSchema,
}).pipe(
  Schema.extend(BaseDbSchema),
  Schema.identifier("SubscriptionDbSchema"),
  _SS.satisfies.from<_Subscription>()
);

export type SubscriptionDbContext = Schema.Schema.Context<
  typeof _SubscriptionDbSchema
>;
export interface SubscriptionDbEncoded
  extends Schema.Schema.Encoded<typeof _SubscriptionDbSchema> {}
export interface SubscriptionDb
  extends Schema.Schema.Type<typeof _SubscriptionDbSchema> {}

export const SubscriptionDbSchema: Schema.Schema<
  SubscriptionDb,
  SubscriptionDbEncoded
> = _SubscriptionDbSchema;
// #endregion SubscriptionDbSchema

export const SubscriptionDbToDomainSchema = transform(
  SubscriptionDbSchema,
  SubscriptionSchema,
  Effect.succeed,
  Effect.succeed
);
