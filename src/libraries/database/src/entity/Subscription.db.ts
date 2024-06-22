import { Schema } from "@effect/schema";
import { type Subscription as _Subscription } from "@prisma/client";
import { Effect } from "effect";

import { IdPlace } from "@argazi/domain";
import { IdSubscription } from "@argazi/domain";
import { Subscription } from "@argazi/domain";
import { IdUser } from "@argazi/domain";
import { _SS } from "@argazi/shared";

import { BaseDb, transform } from "../Base.db.js";

// #region SubscriptionDb
export const _SubscriptionDb = Schema.Struct({
  id: IdSubscription,
  idPlace: IdPlace,
  idUser: IdUser,
}).pipe(
  Schema.extend(BaseDb),
  Schema.annotations({ identifier: "SubscriptionDb" }),
  _SS.satisfies.encoded<_Subscription>()
);

export type SubscriptionDbContext = Schema.Schema.Context<
  typeof _SubscriptionDb
>;
export interface SubscriptionDbEncoded
  extends Schema.Schema.Encoded<typeof _SubscriptionDb> {}
export interface SubscriptionDb
  extends Schema.Schema.Type<typeof _SubscriptionDb> {}

export const SubscriptionDb: Schema.Schema<
  SubscriptionDb,
  SubscriptionDbEncoded
> = _SubscriptionDb;
// #endregion SubscriptionDb

export const SubscriptionDbToDomain = transform(
  SubscriptionDb,
  Subscription,
  Effect.succeed,
  Effect.succeed
);
